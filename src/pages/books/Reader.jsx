import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ePub from "epubjs";
import * as R from "../../styles/books/ReaderStyle";
import SideComment from "../../components/SideComment";
import BookRatingModal from "../../components/BookRatingModal";
import { connectSocket, disconnectSocket, sendHighlight } from "../../api/socket";
import { getEpubData, getReadingEntry, saveProgress, saveHighlight } from "../../api/reading";

function Reader() {
    const { teamId, bookId } = useParams();

    const viewerRef = useRef(null);
    const bookFrameRef = useRef(null);

    const bookRef = useRef(null);
    const renditionRef = useRef(null);

    // cfiRange -> { className, text }
    const highlightsRef = useRef(new Map());

    // ✅ 좌/우 코멘트 상태를 분리
    const [leftOpen, setLeftOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);
    const [leftQuote, setLeftQuote] = useState("");
    const [rightQuote, setRightQuote] = useState("");

    // ✅ 평점 모달
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const locationRef = useRef(null);

    // 페이지 넘김 튐 방지
    const navLockRef = useRef(false);
    const lockNav = (ms = 250) => {
        navLockRef.current = true;
        window.setTimeout(() => (navLockRef.current = false), ms);
    };

    // 하이라이트 클릭 직후 페이지 넘김 방지
    const justClickedHighlightRef = useRef(false);
    const markHighlightClick = () => {
        justClickedHighlightRef.current = true;
        window.setTimeout(() => (justClickedHighlightRef.current = false), 80);
    };

    // 드래그 중 selected 이벤트 중복 발생 방지 (selectionchange 기반)
    const selectionTimerRef = useRef(null);

    const toSafeClassName = (cfi) =>
        "hl_" + String(cfi).replace(/[^a-zA-Z0-9_-]/g, "_");

    useEffect(() => {
        if (!viewerRef.current || !teamId || !bookId) return;

        let cancelled = false;
        const cleanupActions = { fn: null };

        const init = async () => {
            let epubData;
            let entry = null;
            try {
                epubData = await getEpubData(teamId, bookId);
            } catch {
                return;
            }
            try {
                entry = await getReadingEntry(teamId, bookId);
            } catch { /* ignore - 첫 진입 시 entry 없을 수 있음 */ }
            if (cancelled) return;

            const book = ePub(epubData);
            bookRef.current = book;

            const rendition = book.renderTo(viewerRef.current, {
                width: "100%",
                height: "100%",
                spread: "always",
                flow: "paginated",
                minSpreadWidth: 700,
                allowScriptedContent: true,
            });
            renditionRef.current = rendition;

            const hasSelectionInThisContents = (contents) => {
                try {
                    const sel = contents?.window?.getSelection?.();
                    return !!sel && sel.toString().trim().length > 0;
                } catch {
                    return false;
                }
            };

            const clearSelectionInThisContents = (contents) => {
                try {
                    contents?.window?.getSelection?.()?.removeAllRanges();
                } catch { /* ignore */ }
            };

            const getSortedIframes = () => {
                const container = viewerRef.current;
                if (!container) return [];
                return Array.from(container.querySelectorAll("iframe"))
                    .filter(Boolean)
                    .sort(
                        (a, b) =>
                            a.getBoundingClientRect().left -
                            b.getBoundingClientRect().left
                    );
            };

            const getGlobalClientX = (e, contentsFallback) => {
                if (!e) return null;
                const eventDoc =
                    e?.target?.ownerDocument || e?.currentTarget?.ownerDocument;
                const iframeEl =
                    eventDoc?.defaultView?.frameElement ||
                    contentsFallback?.document?.defaultView?.frameElement;
                const isTopWindowEvent = e.view === window || eventDoc === document;
                if (isTopWindowEvent) return e.clientX;
                if (iframeEl) {
                    const iframeRect = iframeEl.getBoundingClientRect();
                    return iframeRect.left + e.clientX;
                }
                return e.clientX;
            };

            const getSideByBoundary = (e, contentsFallback) => {
                const globalX = getGlobalClientX(e, contentsFallback);
                if (globalX == null) return "left";
                const iframes = getSortedIframes();
                if (iframes.length >= 2) {
                    const leftRect = iframes[0].getBoundingClientRect();
                    const rightRect = iframes[1].getBoundingClientRect();
                    const boundaryX = (leftRect.right + rightRect.left) / 2;
                    return globalX < boundaryX ? "left" : "right";
                }
                const frame = bookFrameRef.current;
                if (!frame) return "left";
                const frameRect = frame.getBoundingClientRect();
                const boundaryX = frameRect.left + frameRect.width / 2;
                return globalX < boundaryX ? "left" : "right";
            };

            const onRendered = (_section, contents) => {
                try {
                    contents.addStylesheetRules({
                        "g.highlight, g.highlight rect, .highlight, .highlight *": {
                            "pointer-events": "all",
                            cursor: "pointer",
                        },
                        ".epubjs-hl, .epubjs-hl *": {
                            "pointer-events": "all",
                            cursor: "pointer",
                        },
                    });
                } catch { /* ignore */ }
            };

            const onSelected = (cfiRange, contents) => {
                window.clearTimeout(selectionTimerRef.current);
                selectionTimerRef.current = window.setTimeout(() => {
                    processSelection(cfiRange, contents);
                }, 60);
            };

            const processSelection = (cfiRange, contents) => {
                const highlights = highlightsRef.current;
                const selectedText = (() => {
                    try {
                        return (
                            contents?.window
                                ?.getSelection?.()
                                ?.toString()
                                ?.trim() || ""
                        );
                    } catch {
                        return "";
                    }
                })();

                try {
                    if (highlights.has(cfiRange)) {
                        rendition.annotations.remove(cfiRange, "highlight");
                        highlights.delete(cfiRange);
                        clearSelectionInThisContents(contents);
                        return;
                    }

                    const className = toSafeClassName(cfiRange);
                    const onHighlightClick = (e) => {
                        markHighlightClick();
                        e?.preventDefault?.();
                        e?.stopPropagation?.();
                        const side = getSideByBoundary(e, contents);
                        if (side === "left") {
                            setLeftOpen((prev) => !prev);
                            setLeftQuote(selectedText || "");
                        } else {
                            setRightOpen((prev) => !prev);
                            setRightQuote(selectedText || "");
                        }
                    };

                    rendition.annotations.highlight(
                        cfiRange,
                        {},
                        onHighlightClick,
                        className,
                        {
                            fill: "rgba(255, 216, 237, 0.55)",
                            "fill-opacity": "0.55",
                            "mix-blend-mode": "multiply",
                            "pointer-events": "all",
                        }
                    );

                    highlights.set(cfiRange, { className, text: selectedText });
                    sendHighlight(teamId, bookId, { cfiRange, text: selectedText });
                    saveHighlight(teamId, {
                        bookId: Number(bookId),
                        cfi: cfiRange,
                        text: selectedText,
                        color: "YELLOW",
                        spineIndex: locationRef.current?.start?.index ?? 0,
                    }).catch(() => {});
                } catch (e) {
                    console.error(e);
                }

                clearSelectionInThisContents(contents);
            };

            const onRenditionClick = (e, contents) => {
                if (isRatingOpen) return;
                if (navLockRef.current) return;
                if (justClickedHighlightRef.current) return;
                if (hasSelectionInThisContents(contents)) {
                    clearSelectionInThisContents(contents);
                    return;
                }
                const frame = bookFrameRef.current;
                const iframeEl = contents?.document?.defaultView?.frameElement;
                if (!frame || !iframeEl) return;
                const frameRect = frame.getBoundingClientRect();
                const iframeRect = iframeEl.getBoundingClientRect();
                const globalX = iframeRect.left + e.clientX;
                const xInFrame = globalX - frameRect.left;
                const leftZone = frameRect.width * 0.1;
                const rightZone = frameRect.width * 0.9;
                if (xInFrame <= leftZone) {
                    lockNav();
                    rendition.prev();
                    return;
                }
                if (xInFrame >= rightZone) {
                    const atEnd = !!locationRef.current?.atEnd;
                    if (atEnd) {
                        setIsRatingOpen(true);
                        return;
                    }
                    lockNav();
                    rendition.next();
                }
            };

            const onRelocated = (location) => {
                locationRef.current = location;
                setLeftOpen(false);
                setRightOpen(false);
                setLeftQuote("");
                setRightQuote("");
                saveProgress(bookId, {
                    spineIndex: location.start.index,
                    cfi: location.start.cfi,
                    percent: location.start.percentage ?? 0,
                }).catch(() => {});
            };

            rendition.on("rendered", onRendered);
            rendition.on("selected", onSelected);
            rendition.on("click", onRenditionClick);
            rendition.on("relocated", onRelocated);

            const startCfi = entry?.progress?.cfi;
            rendition.display(startCfi || undefined).then(() => {
                rendition.spread("always");
                const highlights = highlightsRef.current;
                for (const hl of entry?.highlights ?? []) {
                    if (highlights.has(hl.cfi)) continue;
                    const className = toSafeClassName(hl.cfi);
                    try {
                        rendition.annotations.highlight(
                            hl.cfi,
                            {},
                            () => {},
                            className,
                            {
                                fill: "rgba(255, 216, 237, 0.55)",
                                "fill-opacity": "0.55",
                                "mix-blend-mode": "multiply",
                                "pointer-events": "all",
                            }
                        );
                        highlights.set(hl.cfi, { className, text: hl.text });
                    } catch { /* ignore */ }
                }
            });

            const handleResize = () => {
                rendition.resize("100%", "100%");
                rendition.spread("always");
            };
            window.addEventListener("resize", handleResize);

            cleanupActions.fn = () => {
                window.clearTimeout(selectionTimerRef.current);
                window.removeEventListener("resize", handleResize);
                try {
                    rendition.off("rendered", onRendered);
                    rendition.off("selected", onSelected);
                    rendition.off("click", onRenditionClick);
                    rendition.off("relocated", onRelocated);
                    rendition.destroy();
                    book.destroy();
                } catch { /* ignore */ }
            };
        };

        init();

        return () => {
            cancelled = true;
            cleanupActions.fn?.();
        };
    }, [isRatingOpen, teamId, bookId]);

    useEffect(() => {
        if (!teamId || !bookId) return;

        connectSocket({
            teamId,
            bookId,
            onHighlight: ({ cfiRange, text }) => {
                const rendition = renditionRef.current;
                const highlights = highlightsRef.current;
                if (!rendition || highlights.has(cfiRange)) return;

                const className = toSafeClassName(cfiRange);
                rendition.annotations.highlight(
                    cfiRange,
                    {},
                    () => {},
                    className,
                    {
                        fill: "rgba(255, 216, 237, 0.55)",
                        "fill-opacity": "0.55",
                        "mix-blend-mode": "multiply",
                        "pointer-events": "all",
                    }
                );
                highlights.set(cfiRange, { className, text });
            },
        });

        return () => disconnectSocket();
    }, [teamId, bookId]);

    return (
        <R.Reader>
            {isRatingOpen && (
                <BookRatingModal onClose={() => setIsRatingOpen(false)} />
            )}

            <R.SideSection>
                {leftOpen && <SideComment quote={leftQuote} />}
            </R.SideSection>

            <R.CenterSection>
                <R.BookFrame ref={bookFrameRef}>
                    <div
                        ref={viewerRef}
                        style={{ width: "100%", height: "100%" }}
                    />
                </R.BookFrame>
            </R.CenterSection>

            <R.SideSection>
                {rightOpen && <SideComment quote={rightQuote} />}
            </R.SideSection>
        </R.Reader>
    );
}

export default Reader;

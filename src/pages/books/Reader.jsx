import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ePub from "epubjs";
import * as R from "../../styles/books/ReaderStyle";
import SideComment from "../../components/SideComment";
import BookRatingModal from "../../components/BookRatingModal";
import { connectSocket, disconnectSocket, sendHighlight } from "../../api/socket";

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

    const toSafeClassName = (cfi) =>
        "hl_" + String(cfi).replace(/[^a-zA-Z0-9_-]/g, "_");

    useEffect(() => {
        if (!viewerRef.current) return;

        const book = ePub("/sample.epub");
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
            } catch {}
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

        // ✅ 하이라이트 클릭이 어느 페이지(좌/우)인지 판별
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
            } catch {}
        };

        const onSelected = (cfiRange, contents) => {
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
                        // ✅ 왼쪽만 토글, 오른쪽은 그대로 유지
                        setLeftOpen((prev) => !prev);
                        setLeftQuote(selectedText || "");
                    } else {
                        // ✅ 오른쪽만 토글, 왼쪽은 그대로 유지
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

            // ✅ 페이지 이동 시: 원하면 코멘트 닫기
            // 동시에 유지하고 싶으면 아래 2줄 주석처리
            setLeftOpen(false);
            setRightOpen(false);
            setLeftQuote("");
            setRightQuote("");
        };

        rendition.on("rendered", onRendered);
        rendition.on("selected", onSelected);
        rendition.on("click", onRenditionClick);
        rendition.on("relocated", onRelocated);

        rendition.display().then(() => {
            rendition.spread("always");
        });

        const handleResize = () => {
            rendition.resize("100%", "100%");
            rendition.spread("always");
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            try {
                rendition.off("rendered", onRendered);
                rendition.off("selected", onSelected);
                rendition.off("click", onRenditionClick);
                rendition.off("relocated", onRelocated);

                rendition.destroy();
                book.destroy();
            } catch {}
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

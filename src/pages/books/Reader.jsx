import React, { useEffect, useRef, useState } from "react";
import ePub from "epubjs";
import * as R from "../../styles/books/ReaderStyle";
import SideComment from "../../components/SideComment";

function Reader() {
    const viewerRef = useRef(null);
    const bookFrameRef = useRef(null);

    const bookRef = useRef(null);
    const renditionRef = useRef(null);

    // cfiRange -> { className, text }
    const highlightsRef = useRef(new Map());

    const [activeSide, setActiveSide] = useState(null); // "left" | "right" | null
    const [activeQuote, setActiveQuote] = useState("");

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

        // ✅ 현재 화면에 떠있는 iframe들을 left 기준으로 정렬해서 얻기
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

        // ✅ 이벤트 좌표가 iframe 기준인지, 이미 전역(부모) 기준인지 자동 보정해서 "전역 clientX" 만들기
        const getGlobalClientX = (e, contentsFallback) => {
            if (!e) return null;

            // 이벤트가 어느 document에서 왔는지
            const eventDoc =
                e?.target?.ownerDocument || e?.currentTarget?.ownerDocument;

            // iframe 찾기 (eventDoc가 iframe 문서일 때만 frameElement가 있음)
            const iframeEl =
                eventDoc?.defaultView?.frameElement ||
                contentsFallback?.document?.defaultView?.frameElement;

            // e.view가 최상위 window면 이미 전역 좌표일 가능성이 큼
            const isTopWindowEvent = e.view === window || eventDoc === document;

            if (isTopWindowEvent) {
                return e.clientX; // ✅ 이미 전역
            }

            if (iframeEl) {
                const iframeRect = iframeEl.getBoundingClientRect();
                return iframeRect.left + e.clientX; // ✅ iframe 좌표 -> 전역 변환
            }

            return e.clientX; // fallback
        };

        // ✅ "진짜 경계선" 기준으로 left/right 판별
        // - iframe 2개면: (왼쪽 iframe 오른쪽 끝 + 오른쪽 iframe 왼쪽 시작) / 2 를 경계로
        // - iframe 1개면: BookFrame 중앙으로
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

            // fallback: book frame 중앙
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
                // ✅ 있으면 삭제(취소)
                if (highlights.has(cfiRange)) {
                    rendition.annotations.remove(cfiRange, "highlight");
                    highlights.delete(cfiRange);

                    setActiveSide(null);
                    setActiveQuote("");
                    clearSelectionInThisContents(contents);
                    return;
                }

                const className = toSafeClassName(cfiRange);

                const onHighlightClick = (e) => {
                    markHighlightClick();
                    e?.preventDefault?.();
                    e?.stopPropagation?.();

                    // ✅ "클릭 순간" 경계선 기준으로 좌/우 결정 (가장 안정)
                    const sideNow = getSideByBoundary(e, contents);

                    setActiveSide((prev) =>
                        prev === sideNow ? null : sideNow
                    );

                    // ✅ 텍스트는 이 하이라이트 텍스트로
                    setActiveQuote(selectedText || "");
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
            } catch (e) {
                console.error(e);
            }

            clearSelectionInThisContents(contents);
        };

        const onRenditionClick = (e, contents) => {
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

            // 여기서는 "iframe 기준 좌표"가 확실하니까 기존 방식 유지
            const globalX = iframeRect.left + e.clientX;
            const xInFrame = globalX - frameRect.left;

            const leftZone = frameRect.width * 0.1;
            const rightZone = frameRect.width * 0.9;

            if (xInFrame <= leftZone) {
                lockNav();
                rendition.prev();
            } else if (xInFrame >= rightZone) {
                lockNav();
                rendition.next();
            }
        };

        const onRelocated = () => {
            setActiveSide(null);
            setActiveQuote("");
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
    }, []);

    return (
        <R.Reader>
            <R.SideSection>
                {activeSide === "left" && <SideComment quote={activeQuote} />}
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
                {activeSide === "right" && <SideComment quote={activeQuote} />}
            </R.SideSection>
        </R.Reader>
    );
}

export default Reader;

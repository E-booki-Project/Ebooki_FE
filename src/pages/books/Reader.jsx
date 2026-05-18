import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ePub, { EpubCFI } from "epubjs";
import * as R from "../../styles/books/ReaderStyle";
import SideComment from "../../components/SideComment";
import BookRatingModal from "../../components/BookRatingModal";
import { connectSocket, disconnectSocket, sendHighlight } from "../../api/socket";
import { getEpubData, getReadingEntry, saveProgress, saveHighlight, getHighlights, getHighlightComments, deleteHighlight } from "../../api/reading";
import { getTeamDetail } from "../../api/team";
import { getUserInfo } from "../../utils/authStorage";

const HIGHLIGHT_FILL_MAP = {
    BLUE: "rgba(137, 209, 217, 0.55)",
    GREEN: "rgba(205, 242, 167, 0.55)",
    PINK: "rgba(242, 148, 156, 0.55)",
    YELLOW: "rgba(242, 207, 102, 0.55)",
};

function Reader() {
    const { teamId, bookId } = useParams();
    const navigate = useNavigate();

    const viewerRef = useRef(null);
    const bookFrameRef = useRef(null);
    const bookRef = useRef(null);
    const renditionRef = useRef(null);

    // cfiRange -> { className, text }
    const highlightsRef = useRef(new Map());

    const [leftHighlights, setLeftHighlights] = useState([]);
    const [rightHighlights, setRightHighlights] = useState([]);

    const userColorRef = useRef("BLUE");

    const isRatingOpenRef = useRef(false);
    const [isRatingOpen, setIsRatingOpen] = useState(false);

    const [readPercent, setReadPercent] = useState(0);
    const locationRef = useRef(null);
    const totalSpineRef = useRef(1);

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

    // 드래그 중 selected 이벤트 중복 발생 방지
    const selectionTimerRef = useRef(null);
    const pendingSelectionRef = useRef(null);
    const selectionReadyRef = useRef(false);
    const mouseUpFiredRef = useRef(false);
    const justCreatedRef = useRef(new Set());
    const justSelectedRef = useRef(false);

    const handlePrev = useCallback(() => {
        if (navLockRef.current || isRatingOpenRef.current) return;
        lockNav();
        renditionRef.current?.prev();
    }, []);

    const saveProgressNow = useCallback((percent) => {
        const loc = locationRef.current;
        if (!loc || !bookId) return;
        saveProgress(bookId, {
            spineIndex: loc.start.index,
            cfi: loc.start.cfi,
            percent,
        }).catch(() => {});
    }, [bookId]);

    const handleNext = useCallback(() => {
        if (navLockRef.current || isRatingOpenRef.current) return;
        if (locationRef.current?.atEnd) {
            saveProgressNow(100);
            isRatingOpenRef.current = true;
            setIsRatingOpen(true);
            return;
        }
        lockNav();
        renditionRef.current?.next();
    }, [saveProgressNow]);

    const toSafeClassName = (cfi) =>
        "hl_" + String(cfi).replace(/[^a-zA-Z0-9_-]/g, "_");

    useEffect(() => {
        if (!viewerRef.current || !teamId || !bookId) return;

        let cancelled = false;
        const cleanupActions = { fn: null };

        const init = async () => {
            // 완독+평점 완료한 책은 즉시 차단 (epub 로딩 없이)
            const userId = getUserInfo()?.id ?? "guest";
            const completed = JSON.parse(localStorage.getItem(`ebookiCompleted_${userId}`) || "{}");
            if (completed[String(bookId)]) {
                alert("이미 완독한 책입니다.");
                navigate(`/books/detail/${bookId}`, { state: { teamId } });
                return;
            }

            let epubData;
            let entry = null;
            const [entryResult, detailResult] = await Promise.allSettled([
                getReadingEntry(teamId, bookId),
                getTeamDetail(teamId),
            ]);

            if (entryResult.status === "fulfilled") {
                entry = entryResult.value;
            }
            if (detailResult.status === "fulfilled") {
                const myUserId = getUserInfo()?.id;
                const teamUserData = detailResult.value?.teamData?.teamUserData ?? [];
                const myTeamUser = teamUserData.find(
                    (u) => Number(u.userId) === Number(myUserId)
                );
                if (myTeamUser?.userColor) {
                    userColorRef.current = myTeamUser.userColor;
                }
            }

            try {
                epubData = await getEpubData(teamId, bookId);
            } catch {
                return;
            }
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

            const epubCfi = new EpubCFI();

            const removeHighlightFromState = (cfi) => {
                setLeftHighlights((prev) => prev.filter((h) => h.cfi !== cfi));
                setRightHighlights((prev) => prev.filter((h) => h.cfi !== cfi));
            };

            const makeHighlightClickHandler = (cfi) => (e) => {
                if (justCreatedRef.current.has(cfi)) return;
                if (justSelectedRef.current) return;
                markHighlightClick();
                e?.preventDefault?.();
                e?.stopPropagation?.();
                if (!window.confirm("하이라이트를 삭제할까요?")) return;
                const hlData = highlightsRef.current.get(cfi);
                rendition.annotations.remove(cfi, "highlight");
                highlightsRef.current.delete(cfi);
                removeHighlightFromState(cfi);
                if (hlData?.id) {
                    deleteHighlight(teamId, hlData.id).catch(() => {});
                }
            };

            const loadPageHighlights = async (startCfi, endCfi) => {
                try {
                    const data = await getHighlights(Number(bookId), Number(teamId));
                    const all = data?.highlights ?? [];
                    const pageHls = all.filter((h) => {
                        if (!h.cfi || !startCfi || !endCfi) return false;
                        try {
                            return epubCfi.compare(h.cfi, startCfi) >= 0 && epubCfi.compare(h.cfi, endCfi) <= 0;
                        } catch {
                            return false;
                        }
                    });
                    // highlightsRef에 id/color 업데이트 (클릭 핸들러가 id를 참조할 수 있도록)
                    pageHls.forEach((h) => {
                        const existing = highlightsRef.current.get(h.cfi);
                        if (existing) {
                            highlightsRef.current.set(h.cfi, { ...existing, id: h.id, color: h.color });
                        }
                    });
                    const withComments = await Promise.all(
                        pageHls.map(async (h) => {
                            try {
                                const comments = await getHighlightComments(h.id);
                                return { ...h, comments: Array.isArray(comments) ? comments : [] };
                            } catch {
                                return { ...h, comments: [] };
                            }
                        })
                    );
                    setLeftHighlights(withComments.filter((_, i) => i % 2 === 0));
                    setRightHighlights(withComments.filter((_, i) => i % 2 === 1));
                } catch {
                    setLeftHighlights([]);
                    setRightHighlights([]);
                }
            };

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





            // 선택 범위의 중심 X 좌표로 좌/우 판별
            const getSelectionSide = (contents) => {
                try {
                    const sel = contents?.window?.getSelection?.();
                    if (!sel || sel.rangeCount === 0) return "left";
                    const rect = sel.getRangeAt(0).getBoundingClientRect();
                    const iframeEl = contents?.document?.defaultView?.frameElement;
                    if (!iframeEl) return "left";
                    const iframeRect = iframeEl.getBoundingClientRect();
                    const globalX = iframeRect.left + (rect.left + rect.right) / 2;
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
                    return globalX < frameRect.left + frameRect.width / 2 ? "left" : "right";
                } catch {
                    return "left";
                }
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
                pendingSelectionRef.current = { cfiRange, contents };
                selectionReadyRef.current = true;
                if (mouseUpFiredRef.current) {
                    const p = pendingSelectionRef.current;
                    selectionReadyRef.current = false;
                    mouseUpFiredRef.current = false;
                    pendingSelectionRef.current = null;
                    if (p) processSelection(p.cfiRange, p.contents);
                }
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

                justSelectedRef.current = true;
                window.setTimeout(() => { justSelectedRef.current = false; }, 300);

                // selection 해제 전에 좌/우 판별
                const selSide = getSelectionSide(contents);

                try {
                    if (highlights.has(cfiRange)) {
                        rendition.annotations.remove(cfiRange, "highlight");
                        highlights.delete(cfiRange);
                        clearSelectionInThisContents(contents);
                        return;
                    }

                    const className = toSafeClassName(cfiRange);
                    const color = userColorRef.current;

                    rendition.annotations.highlight(
                        cfiRange,
                        {},
                        makeHighlightClickHandler(cfiRange),
                        className,
                        {
                            fill: HIGHLIGHT_FILL_MAP[color] ?? HIGHLIGHT_FILL_MAP.BLUE,
                            "fill-opacity": "0.55",
                            "mix-blend-mode": "multiply",
                            "pointer-events": "all",
                        }
                    );

                    highlights.set(cfiRange, { className, text: selectedText, id: null, color });
                    justCreatedRef.current.add(cfiRange);
                    window.setTimeout(() => justCreatedRef.current.delete(cfiRange), 2000);
                    sendHighlight(teamId, bookId, { cfiRange, text: selectedText });
                    saveHighlight(teamId, {
                        bookId: Number(bookId),
                        cfi: cfiRange,
                        text: selectedText,
                        spineIndex: locationRef.current?.start?.index ?? 0,
                    }).then((saved) => {
                        const savedId = saved?.id ?? saved?.data?.id;
                        const existing = highlights.get(cfiRange);
                        if (existing) highlights.set(cfiRange, { ...existing, id: savedId });
                        setLeftHighlights((prev) => prev.map((h) => h.cfi === cfiRange ? { ...h, id: savedId, isLocal: false } : h));
                        setRightHighlights((prev) => prev.map((h) => h.cfi === cfiRange ? { ...h, id: savedId, isLocal: false } : h));
                    }).catch(() => {});

                    // API 저장 전까지 로컬 하이라이트로 즉시 표시
                    const newHl = {
                        id: null,
                        cfi: cfiRange,
                        text: selectedText,
                        color: userColorRef.current,
                        comments: [],
                        isLocal: true,
                    };
                    if (selSide === "left") {
                        setLeftHighlights((prev) => [...prev, newHl]);
                    } else {
                        setRightHighlights((prev) => [...prev, newHl]);
                    }
                } catch (e) {
                    console.error(e);
                }

                clearSelectionInThisContents(contents);
            };

            const onRenditionClick = (e, contents) => {
                if (isRatingOpenRef.current) return;
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
                        const loc = locationRef.current;
                        if (loc) saveProgress(bookId, { spineIndex: loc.start.index, cfi: loc.start.cfi, percent: 100 }).catch(() => {});
                        isRatingOpenRef.current = true;
                        setIsRatingOpen(true);
                        return;
                    }
                    lockNav();
                    rendition.next();
                }
            };

            const onRelocated = (location) => {
                locationRef.current = location;
                const startCfi = location.start.cfi;
                const endCfi = location.end?.cfi ?? startCfi;
                loadPageHighlights(startCfi, endCfi);
                const totalSpine = bookRef.current?.spine?.length ?? 1;
                totalSpineRef.current = totalSpine;
                const percent = totalSpine > 1
                    ? location.start.index / (totalSpine - 1)
                    : 0;
                setReadPercent(percent);
            };

            const onMouseDown = () => {
                selectionReadyRef.current = false;
                mouseUpFiredRef.current = false;
                pendingSelectionRef.current = null;
            };
            const onMouseUp = () => {
                mouseUpFiredRef.current = true;
                if (selectionReadyRef.current) {
                    const p = pendingSelectionRef.current;
                    selectionReadyRef.current = false;
                    mouseUpFiredRef.current = false;
                    pendingSelectionRef.current = null;
                    if (p) processSelection(p.cfiRange, p.contents);
                }
            };

            rendition.on("rendered", onRendered);
            rendition.on("selected", onSelected);
            rendition.on("click", onRenditionClick);
            rendition.on("relocated", onRelocated);
            rendition.on("mousedown", onMouseDown);
            rendition.on("mouseup", onMouseUp);

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
                            makeHighlightClickHandler(hl.cfi),
                            className,
                            {
                                fill: HIGHLIGHT_FILL_MAP[hl.color] ?? HIGHLIGHT_FILL_MAP.BLUE,
                                "fill-opacity": "0.55",
                                "mix-blend-mode": "multiply",
                                "pointer-events": "all",
                            }
                        );
                        highlights.set(hl.cfi, { className, text: hl.text, id: hl.id, color: hl.color });
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
                    rendition.off("mousedown", onMouseDown);
                    rendition.off("mouseup", onMouseUp);
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
    }, [teamId, bookId, navigate]);

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
                        fill: HIGHLIGHT_FILL_MAP[userColorRef.current] ?? HIGHLIGHT_FILL_MAP.BLUE,
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

    useEffect(() => {
        const save = () => {
            const loc = locationRef.current;
            if (!loc || !bookId) return;
            const totalSpine = totalSpineRef.current;
            const percent = totalSpine > 1 ? Math.round((loc.start.index / (totalSpine - 1)) * 100) : 0;
            saveProgress(bookId, {
                spineIndex: loc.start.index,
                cfi: loc.start.cfi,
                percent,
            }).catch(() => {});
        };
        window.addEventListener("beforeunload", save);
        return () => {
            window.removeEventListener("beforeunload", save);
            save();
        };
    }, [bookId, teamId]);


    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = document.activeElement?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA") return;
            if (e.key === "ArrowLeft") handlePrev();
            else if (e.key === "ArrowRight") handleNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handlePrev, handleNext]);

    const handleProgressClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickPercent = (e.clientX - rect.left) / rect.width;
        const totalSpine = bookRef.current?.spine?.length ?? 1;
        const targetIndex = Math.round(clickPercent * (totalSpine - 1));
        const spineItem = bookRef.current?.spine?.get(targetIndex);
        if (spineItem?.href) renditionRef.current?.display(spineItem.href);
    };

    const handleHighlightDelete = useCallback((highlight) => {
        if (!window.confirm("하이라이트를 삭제할까요?")) return;
        const cfi = highlight.cfi;
        renditionRef.current?.annotations.remove(cfi, "highlight");
        highlightsRef.current.delete(cfi);
        setLeftHighlights((prev) => prev.filter((h) => h.cfi !== cfi));
        setRightHighlights((prev) => prev.filter((h) => h.cfi !== cfi));
        if (highlight.id) {
            deleteHighlight(teamId, highlight.id).catch(() => {});
        }
    }, [teamId]);

    return (
        <R.Reader>
            {isRatingOpen && (
                <BookRatingModal
                    bookId={bookId}
                    onClose={() => { isRatingOpenRef.current = false; setIsRatingOpen(false); }}
                    onRated={(newRating) => navigate(`/books/detail/${bookId}`, { state: { teamId, newRating } })}
                />
            )}

            <R.ReaderRow>
                <R.SideSection onClick={handlePrev}>
                    {leftHighlights.length > 0 && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <SideComment highlights={leftHighlights} teamId={teamId} onDelete={handleHighlightDelete} />
                        </div>
                    )}
                </R.SideSection>

                <R.CenterSection>
                    <R.BookFrame ref={bookFrameRef}>
                        <div
                            ref={viewerRef}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </R.BookFrame>
                </R.CenterSection>

                <R.SideSection onClick={handleNext}>
                    {rightHighlights.length > 0 && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <SideComment highlights={rightHighlights} teamId={teamId} onDelete={handleHighlightDelete} />
                        </div>
                    )}
                </R.SideSection>
            </R.ReaderRow>

            <R.ProgressSection>
                <R.ProgressTrack onClick={handleProgressClick}>
                    <R.ProgressFill $percent={readPercent} />
                </R.ProgressTrack>
                <R.ProgressLabel>{Math.round(readPercent * 100)}%</R.ProgressLabel>
            </R.ProgressSection>
        </R.Reader>
    );
}

export default Reader;

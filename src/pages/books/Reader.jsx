import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ePub, { EpubCFI } from "epubjs";
import * as R from "../../styles/books/ReaderStyle";
import SideComment from "../../components/SideComment";
import BookRatingModal from "../../components/BookRatingModal";
import { connectSocket, disconnectSocket, sendHighlight } from "../../api/socket";
import { getEpubData, getReadingEntry, saveProgress, saveHighlight, getHighlights, getHighlightComments, deleteHighlight } from "../../api/reading";
import { getTeamDetail } from "../../api/team";
import { getMyBookItems } from "../../api/book";
import { getUserInfo } from "../../utils/authStorage";

const HIGHLIGHT_FILL_MAP = {
    BLUE: "rgba(137, 209, 217, 0.55)",
    GREEN: "rgba(205, 242, 167, 0.55)",
    PINK: "rgba(242, 148, 156, 0.55)",
    YELLOW: "rgba(242, 207, 102, 0.55)",
};

const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

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
    const [myRating, setMyRating] = useState(0);

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
    const reloadPageHighlightsRef = useRef(null);
    const pendingSelectionRef = useRef(null);
    const selectionReadyRef = useRef(false);
    const mouseUpFiredRef = useRef(false);
    const justCreatedRef = useRef(new Set());
    const justSelectedRef = useRef(false);

    const isAtLastPage = useCallback(() => {
        const loc = locationRef.current;
        if (!loc) return false;
        if (loc.atEnd) return true;
        // Safari에서 atEnd가 정확히 설정 안 될 때를 대비해 spine 인덱스로 직접 판단
        // total <= 1 이면 spine이 아직 로드 안 됐거나 신뢰 불가 → false 반환해 오탐 방지
        const total = totalSpineRef.current;
        if (total <= 1) return false;
        const endIdx = loc.end?.index ?? loc.start?.index ?? -1;
        return endIdx >= total - 1;
    }, []);

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
        if (isAtLastPage()) {
            saveProgressNow(100);
            isRatingOpenRef.current = true;
            setIsRatingOpen(true);
            return;
        }
        lockNav();
        renditionRef.current?.next();
    }, [isAtLastPage, saveProgressNow]);

    const toSafeClassName = (cfi) =>
        "hl_" + String(cfi).replace(/[^a-zA-Z0-9_-]/g, "_");

    // annotations.remove()의 sectionIndex 불일치로 detach가 안 될 경우를 대비해
    // views에서 직접 unhighlight 호출 + DOM에서도 직접 제거
    const removeHighlightVisual = useCallback((rendition, cfi, className) => {
        try {
            rendition?.annotations?.remove(cfi, "highlight");
        } catch { /* ignore */ }
        try {
            rendition?.views()?.forEach?.((view) => {
                try { view.unhighlight?.(cfi); } catch { /* ignore */ }
            });
        } catch { /* ignore */ }
        try {
            const hlClassName = className ?? toSafeClassName(cfi);
            Array.from(viewerRef.current?.getElementsByClassName(hlClassName) ?? []).forEach((el) => el.remove());
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        if (!viewerRef.current || !teamId || !bookId) return;

        let cancelled = false;
        const cleanupActions = { fn: null };

        const init = async () => {
            let epubData;
            let entry = null;
            const [entryResult, detailResult, bookResult] = await Promise.allSettled([
                getReadingEntry(teamId, bookId),
                getTeamDetail(teamId),
                getMyBookItems(bookId),
            ]);
            if (bookResult.status === "fulfilled") {
                setMyRating(bookResult.value?.myRating ?? 0);
            }

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

            // Safari에서 onRelocated 이전에 spine 길이를 미리 설정해 isAtLastPage 오탐 방지
            book.ready.then(() => {
                const len = book.spine?.length;
                if (len && len > 1) totalSpineRef.current = len;
            }).catch(() => {});

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
                const hlData = highlightsRef.current.get(cfi);
                if (hlData?.userId != null && Number(hlData.userId) !== Number(getUserInfo()?.id)) return;
                markHighlightClick();
                e?.preventDefault?.();
                e?.stopPropagation?.();
                if (!window.confirm("하이라이트를 삭제할까요?")) return;
                removeHighlightVisual(rendition, cfi, hlData?.className);
                highlightsRef.current.delete(cfi);
                removeHighlightFromState(cfi);
                sendHighlight(teamId, bookId, { action: "DELETE", cfiRange: cfi });
                if (hlData?.id) {
                    deleteHighlight(teamId, hlData.id).catch(() => {});
                }
            };

            const loadPageHighlights = async (startCfi, endCfi) => {
                try {
                    const data = await getHighlights(Number(bookId), Number(teamId));
                    const all = data?.highlights ?? [];
                    const pageHls = all.filter((h) => {
                        if (!h.cfi || !h.text?.trim() || !startCfi || !endCfi) return false;
                        try {
                            return epubCfi.compare(h.cfi, startCfi) >= 0 && epubCfi.compare(h.cfi, endCfi) <= 0;
                        } catch {
                            return false;
                        }
                    });
                    // highlightsRef 업데이트 + 색상 오류 수정 + 미등록 하이라이트 신규 등록
                    pageHls.forEach((h) => {
                        const existing = highlightsRef.current.get(h.cfi);
                        if (existing) {
                            highlightsRef.current.set(h.cfi, { ...existing, id: h.id, color: h.color, userId: h.userId });
                            // 소켓 수신 시 색상이 잘못 설정된 경우 올바른 색으로 재적용
                            if (existing.color !== h.color) {
                                const newFill = HIGHLIGHT_FILL_MAP[h.color] ?? HIGHLIGHT_FILL_MAP.BLUE;
                                // 현재 렌더링된 iframe SVG를 직접 수정해 즉시 반영
                                try {
                                    const iframes = viewerRef.current?.querySelectorAll("iframe") ?? [];
                                    iframes.forEach((iframe) => {
                                        try {
                                            const doc = iframe.contentDocument || iframe.contentWindow?.document;
                                            if (!doc) return;
                                            Array.from(doc.getElementsByClassName(existing.className)).forEach((g) => {
                                                Array.from(g.getElementsByTagName("rect")).forEach((r) => {
                                                    r.setAttribute("fill", newFill);
                                                });
                                            });
                                        } catch { /* ignore */ }
                                    });
                                } catch { /* ignore */ }
                                // epubjs 어노테이션도 교체해 재렌더링 시에도 올바른 색 유지
                                try {
                                    rendition.annotations.remove(h.cfi, "highlight");
                                    rendition.annotations.highlight(
                                        h.cfi, {}, makeHighlightClickHandler(h.cfi), existing.className,
                                        {
                                            fill: newFill,
                                            "fill-opacity": "0.55",
                                            "mix-blend-mode": "multiply",
                                            "pointer-events": "all",
                                        }
                                    );
                                } catch { /* ignore */ }
                            }
                        } else {
                            // highlightsRef에 없는 하이라이트(타 유저 기존 하이라이트 또는 소켓 미수신)를 새로 등록
                            const className = toSafeClassName(h.cfi);
                            try {
                                rendition.annotations.highlight(
                                    h.cfi, {}, makeHighlightClickHandler(h.cfi), className,
                                    {
                                        fill: HIGHLIGHT_FILL_MAP[h.color] ?? HIGHLIGHT_FILL_MAP.BLUE,
                                        "fill-opacity": "0.55",
                                        "mix-blend-mode": "multiply",
                                        "pointer-events": "all",
                                    }
                                );
                                highlightsRef.current.set(h.cfi, { className, text: h.text, id: h.id, color: h.color, userId: h.userId });
                            } catch { /* ignore */ }
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

            reloadPageHighlightsRef.current = () => {
                const loc = locationRef.current;
                if (!loc) return;
                loadPageHighlights(loc.start.cfi, loc.end?.cfi ?? loc.start.cfi);
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
                        // 아이패드에서 연속 드래그 선택 허용
                        "*": {
                            "-webkit-user-select": "text",
                            "user-select": "text",
                        },
                    });
                } catch { /* ignore */ }
                // epub 자체 CSS의 hover 색상 변경 억제
                try {
                    const doc = contents.document;
                    if (doc?.head && !doc.querySelector("#ebooki-style-override")) {
                        const style = doc.createElement("style");
                        style.id = "ebooki-style-override";
                        style.textContent = "*:hover { color: inherit !important; }";
                        doc.head.appendChild(style);
                    }
                } catch { /* ignore */ }
                // iframe에 포커스가 있어도 방향키로 페이지 넘김 동작하도록
                try {
                    contents.window.addEventListener("keydown", (e) => {
                        if (e.key === "ArrowLeft") { e.preventDefault(); handlePrev(); }
                        else if (e.key === "ArrowRight") { e.preventDefault(); handleNext(); }
                    });
                } catch { /* ignore */ }
                // 드래그가 현재 페이지 뷰포트 밖(다음 페이지 컬럼)으로 넘어가면 선택 취소
                try {
                    contents.document.addEventListener("selectionchange", () => {
                        const sel = contents.window?.getSelection?.();
                        if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
                        const range = sel.getRangeAt(0);
                        const viewW = contents.document.documentElement.clientWidth;
                        const outOfBounds = Array.from(range.getClientRects()).some(
                            (r) => r.left > viewW + 20 || r.right > viewW + 20
                        );
                        if (outOfBounds) {
                            sel.removeAllRanges();
                            window.clearTimeout(selectionTimerRef.current);
                            selectionReadyRef.current = false;
                            pendingSelectionRef.current = null;
                        }
                    }, { passive: true });
                } catch { /* ignore */ }
            };

            const onSelected = (cfiRange, contents) => {
                pendingSelectionRef.current = { cfiRange, contents };
                selectionReadyRef.current = true;

                if (!isTouchDevice && mouseUpFiredRef.current) {
                    // 데스크탑: mouseup 이미 발생 → 즉시 처리
                    const p = pendingSelectionRef.current;
                    selectionReadyRef.current = false;
                    mouseUpFiredRef.current = false;
                    pendingSelectionRef.current = null;
                    if (p) processSelection(p.cfiRange, p.contents);
                } else {
                    // 터치 기기: 1500ms 디바운스 (선택 조정 중 타이머 계속 리셋)
                    // 데스크탑 fallback: mouseup 없을 때 100ms 후 처리
                    window.clearTimeout(selectionTimerRef.current);
                    selectionTimerRef.current = window.setTimeout(() => {
                        if (!selectionReadyRef.current) return;
                        const p = pendingSelectionRef.current;
                        selectionReadyRef.current = false;
                        pendingSelectionRef.current = null;
                        if (p) processSelection(p.cfiRange, p.contents);
                    }, isTouchDevice ? 1500 : 100);
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

                if (!selectedText) {
                    clearSelectionInThisContents(contents);
                    return;
                }

                // 선택 범위가 현재 페이지 viewport를 벗어나면 무시
                try {
                    const sel = contents.window?.getSelection?.();
                    if (sel && sel.rangeCount > 0) {
                        const range = sel.getRangeAt(0);
                        const viewW = contents.document.documentElement.clientWidth;
                        const viewH = contents.document.documentElement.clientHeight;
                        const rects = Array.from(range.getClientRects());
                        const outOfBounds = rects.length > 0 && rects.some(
                            (r) => r.right > viewW + 10 || r.bottom > viewH + 10
                        );
                        if (outOfBounds) {
                            clearSelectionInThisContents(contents);
                            return;
                        }
                    }
                } catch { /* ignore */ }

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
                    sendHighlight(teamId, bookId, { cfiRange, text: selectedText, color: userColorRef.current, userId: getUserInfo()?.id });
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

            const onRenditionClick = (_e, contents) => {
                if (isRatingOpenRef.current) return;
                if (justClickedHighlightRef.current) return;
                if (hasSelectionInThisContents(contents)) {
                    if (isTouchDevice && selectionReadyRef.current) {
                        window.clearTimeout(selectionTimerRef.current);
                        const p = pendingSelectionRef.current;
                        selectionReadyRef.current = false;
                        pendingSelectionRef.current = null;
                        clearSelectionInThisContents(contents);
                        if (p) processSelection(p.cfiRange, p.contents);
                    } else {
                        clearSelectionInThisContents(contents);
                    }
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

                // 페이지 이동마다 즉시 저장 — highlight 저장이 진행도를 덮어쓰는 문제 방지
                const pct = totalSpine > 1
                    ? Math.round((location.start.index / (totalSpine - 1)) * 100)
                    : 0;
                saveProgress(bookId, {
                    spineIndex: location.start.index,
                    cfi: location.start.cfi,
                    percent: pct,
                }).catch(() => {});
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

            // display() 전에 등록해야 Safari에서 렌더 패스에 바로 반영됨
            const highlights = highlightsRef.current;
            for (const hl of entry?.highlights ?? []) {
                if (!hl.text?.trim()) continue;
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
                    highlights.set(hl.cfi, { className, text: hl.text, id: hl.id, color: hl.color, userId: hl.userId });
                } catch { /* ignore */ }
            }

            const startCfi = entry?.progress?.cfi;
            rendition.display(startCfi || undefined);

            const handleResize = () => {
                rendition.resize("100%", "100%");
                rendition.spread("always");
            };
            window.addEventListener("resize", handleResize);

            cleanupActions.fn = () => {
                reloadPageHighlightsRef.current = null;
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
    }, [teamId, bookId, navigate, isAtLastPage, removeHighlightVisual, handlePrev, handleNext]);

    useEffect(() => {
        if (!teamId || !bookId) return;

        connectSocket({
            teamId,
            bookId,
            onHighlight: ({ cfiRange, text, color, userId, action }) => {
                if (action === "DELETE") {
                    const hlData = highlightsRef.current.get(cfiRange);
                    removeHighlightVisual(renditionRef.current, cfiRange, hlData?.className);
                    highlightsRef.current.delete(cfiRange);
                    setLeftHighlights((prev) => prev.filter((h) => h.cfi !== cfiRange));
                    setRightHighlights((prev) => prev.filter((h) => h.cfi !== cfiRange));
                    return;
                }
                const rendition = renditionRef.current;
                const highlights = highlightsRef.current;
                if (!rendition || highlights.has(cfiRange)) return;

                if (!color) {
                    // 백엔드가 color 필드를 제거한 경우 → API에서 올바른 색으로 등록
                    reloadPageHighlightsRef.current?.();
                    window.setTimeout(() => reloadPageHighlightsRef.current?.(), 2000);
                    return;
                }
                const className = toSafeClassName(cfiRange);
                rendition.annotations.highlight(
                    cfiRange,
                    {},
                    () => {},
                    className,
                    {
                        fill: HIGHLIGHT_FILL_MAP[color] ?? HIGHLIGHT_FILL_MAP.BLUE,
                        "fill-opacity": "0.55",
                        "mix-blend-mode": "multiply",
                        "pointer-events": "all",
                    }
                );
                highlights.set(cfiRange, { className, text, color, userId });
                reloadPageHighlightsRef.current?.();
                window.setTimeout(() => reloadPageHighlightsRef.current?.(), 2000);
            },
        });

        return () => disconnectSocket();
    }, [teamId, bookId, removeHighlightVisual]);

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
        removeHighlightVisual(renditionRef.current, cfi, highlight.className);
        highlightsRef.current.delete(cfi);
        setLeftHighlights((prev) => prev.filter((h) => h.cfi !== cfi));
        setRightHighlights((prev) => prev.filter((h) => h.cfi !== cfi));
        sendHighlight(teamId, bookId, { action: "DELETE", cfiRange: cfi });
        if (highlight.id) {
            deleteHighlight(teamId, highlight.id).catch(() => {});
        }
    }, [teamId, bookId, removeHighlightVisual]);

    return (
        <R.Reader>
            {isRatingOpen && (
                <BookRatingModal
                    bookId={bookId}
                    initialRating={myRating}
                    onClose={() => { isRatingOpenRef.current = false; setIsRatingOpen(false); }}
                    onRated={(newRating) => { setMyRating(newRating); navigate(`/books/detail/${bookId}`, { state: { teamId, newRating } }); }}
                />
            )}

            <R.ReaderRow>
                <R.SideSection>
                    {leftHighlights.length > 0 && (
                        <SideComment highlights={leftHighlights} teamId={teamId} onDelete={handleHighlightDelete} />
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

                <R.SideSection>
                    {rightHighlights.length > 0 && (
                        <SideComment highlights={rightHighlights} teamId={teamId} onDelete={handleHighlightDelete} />
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

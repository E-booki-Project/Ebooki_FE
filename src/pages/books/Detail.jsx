import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as D from "../../styles/books/DetailStyle";
import { getBook, getMyBookItems, toggleLike } from "../../api/book";
import { getHighlights, getHighlightComments } from "../../api/reading";
import { getUserInfo } from "../../utils/authStorage";

import BookRatingModal from "../../components/BookRatingModal";
import cover from "../../assets/images/book.png";
import star from "../../assets/images/star.png";
import starFull from "../../assets/images/star_full.png";
import bookmark from "../../assets/images/bookmark.png";
import link from "../../assets/images/link_black.png";
import highlight from "../../assets/images/highlight.png";

function Detail() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const teamId = state?.teamId;
    const newRatingFromNav = state?.newRating ?? null;
    const [bookData, setBookData] = useState(null);
    const [liked, setLiked] = useState(false);
    const [timeline, setTimeline] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [notePage, setNotePage] = useState(1);
    const NOTES_PER_PAGE = 5;
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const [toast, setToast] = useState(state?.completedMessage ?? null);

    const fetchBook = async () => {
        try {
            const [bookResult, myResult] = await Promise.allSettled([
                getBook(bookId),
                getMyBookItems(bookId),
            ]);
            if (bookResult.status !== "fulfilled") throw bookResult.reason;
            const data = bookResult.value;
            const myRating = newRatingFromNav ?? myResult.value?.myRating ?? data.myRating;
            setBookData({ ...data, myRating });
            setLiked(data.liked);
        } catch (error) {
            alert(error.response?.data?.message || "책 정보를 불러오는데 실패했습니다.");
        }
    };

    const currentUserId = getUserInfo()?.id;

    useEffect(() => {
        const fetchNotes = async () => {
            if (!teamId) { setTimeline([]); return; }
            try {
                const data = await getHighlights(Number(bookId), Number(teamId));
                const allHighlights = data?.highlights ?? [];

                // 내 하이라이트만 추출
                const myHighlights = allHighlights.filter(
                    (h) => Number(h.userId) === Number(currentUserId)
                );

                // 내 하이라이트 각각의 댓글 조회
                const commentResults = await Promise.all(
                    myHighlights.map((h) => getHighlightComments(h.id).catch(() => []))
                );

                // 내가 쓴 댓글만 수집
                const myCommentItems = [];
                commentResults.forEach((result) => {
                    const list = Array.isArray(result) ? result : (result?.data ?? []);
                    list
                        .filter((c) => Number(c.userId) === Number(currentUserId))
                        .forEach((c) => {
                            myCommentItems.push({
                                type: "COMMENT",
                                text: c.text,
                                createdAt: c.createdAt,
                                userId: Number(c.userId),
                                page: null,
                            });
                        });
                });

                setTimeline([
                    ...myHighlights.map((h) => ({
                        type: "HIGHLIGHT",
                        text: h.text,
                        createdAt: h.createdAt,
                        userId: Number(h.userId),
                        page: h.spineIndex,
                    })),
                    ...myCommentItems,
                ]);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBook();
        fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookId, teamId, newRatingFromNav]);

    const visibleItems = useMemo(() => {
        const myItems = timeline.filter((item) => Number(item.userId) === Number(currentUserId));
        if (activeTab === "highlight") return myItems.filter((item) => item.type === "HIGHLIGHT");
        if (activeTab === "comment") return myItems.filter((item) => item.type === "COMMENT");
        return [...myItems].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }, [timeline, activeTab, currentUserId]);

    const handleTabClick = (tab) => {
        setActiveTab((prev) => (prev === tab ? null : tab));
        setNotePage(1);
    };

    const totalNotePages = Math.ceil(visibleItems.length / NOTES_PER_PAGE);
    const paginatedItems = visibleItems.slice((notePage - 1) * NOTES_PER_PAGE, notePage * NOTES_PER_PAGE);


    return (
        <D.Detail>
            {toast && (
                <D.Toast onClick={() => setToast(null)}>{toast}</D.Toast>
            )}
            {isRatingOpen && (
                <BookRatingModal
                    bookId={bookId}
                    initialRating={bookData?.myRating ?? bookData?.rating}
                    onClose={() => setIsRatingOpen(false)}
                    onRated={(newRating) => {
                        setIsRatingOpen(false);
                        setBookData(prev => prev ? { ...prev, myRating: newRating } : prev);
                    }}
                />
            )}
            {/* 책 전체 layout */}
            <D.LeftPanel>
                <D.CoverWrapper>
                    <D.CoverImage src={bookData?.bookImage || cover} alt="cover" />
                    {/* <D.PreviewButton>미리보기</D.PreviewButton> */}
                    <D.CoverActions>
                        <D.ActionButton $variant="bookmark" onClick={async () => {
                            try {
                                await toggleLike(bookId);
                                setLiked((prev) => !prev);
                            } catch (error) {
                                alert(error.response?.data?.message || "북마크 처리에 실패했습니다.");
                            }
                        }}>
                            <D.ActionIcon src={bookmark} style={{ opacity: liked ? 1 : 0.3 }} />
                        </D.ActionButton>
                        <D.ActionButton $variant="link">
                            <D.ActionIcon src={link} />
                        </D.ActionButton>
                    </D.CoverActions>
                </D.CoverWrapper>
            </D.LeftPanel>

            {/* 오른쪽 패널 */}
            <D.InfoPanel>
                <D.BookInfoSection>
                    <D.BookTitle>{bookData?.title}</D.BookTitle>
                    <D.BookMeta>{bookData ? `${bookData.author} 지음 | ${bookData.publisher}` : ""}</D.BookMeta>

                    <D.RatingWrapper onClick={() => setIsRatingOpen(true)}>
                        {Array.from({ length: 5 }).map((_, index) => {
                            const displayRating = bookData?.myRating ?? bookData?.rating ?? 0;
                            const fill = Math.min(1, Math.max(0, displayRating - index));
                            return (
                                <div key={index} style={{ position: "relative", display: "inline-block" }}>
                                    <D.StarIcon src={star} alt="star" />
                                    {fill > 0 && (
                                        <div style={{ position: "absolute", top: 0, left: 0, width: `${fill * 100}%`, overflow: "hidden" }}>
                                            <D.StarIcon src={starFull} alt="star-full" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <D.RatingScore style={{ cursor: "pointer" }}>{(() => { const r = bookData?.myRating ?? bookData?.rating; return r != null ? Number(r).toFixed(1) : ""; })()}</D.RatingScore>
                    </D.RatingWrapper>

                    <D.ReadButton onClick={() => teamId && navigate(`/reader/${teamId}/${bookId}`)}>같이 읽으러 가기</D.ReadButton>
                </D.BookInfoSection>
            </D.InfoPanel>

            {/* 독서 메모 */}
            <D.NotePanel>
                <D.NoteSection>
                    <D.NoteHeader>
                        <D.NoteTitle>독서 메모</D.NoteTitle>
                        <D.SortTabs>
                            <D.TabButton
                                type="button"
                                $active={activeTab === "highlight"}
                                onClick={() => handleTabClick("highlight")}
                            >
                                하이라이트
                            </D.TabButton>
                            <D.TabButton
                                type="button"
                                $active={activeTab === "comment"}
                                onClick={() => handleTabClick("comment")}
                            >
                                댓글
                            </D.TabButton>
                        </D.SortTabs>
                    </D.NoteHeader>

                    <D.NoteList>
                        {paginatedItems.map((item) => {
                            const isHighlightItem = item.type === "HIGHLIGHT";
                            return (
                                <D.NoteCard key={`${item.type}-${item.createdAt}`}>
                                    {isHighlightItem && <D.NoteHighlight src={highlight} alt="" />}
                                    <D.NoteContent>
                                        <D.NoteText>{item.text}</D.NoteText>
                                        <D.NoteFooter>
                                            <div />
                                            <D.NoteDate>
                                                {(() => { const d = new Date(item.createdAt); return `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}  ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`; })()}
                                            </D.NoteDate>
                                        </D.NoteFooter>
                                    </D.NoteContent>
                                </D.NoteCard>
                            );
                        })}
                    </D.NoteList>
                </D.NoteSection>

                {totalNotePages > 1 && (
                    <D.PaginationWrapper>
                        <D.PageBtn disabled={notePage === 1} onClick={() => setNotePage((p) => p - 1)}>{"<"}</D.PageBtn>
                        <D.PageBtn disabled={notePage === totalNotePages} onClick={() => setNotePage((p) => p + 1)}>{">"}</D.PageBtn>
                    </D.PaginationWrapper>
                )}
            </D.NotePanel>
        </D.Detail>
    );
}

export default Detail;

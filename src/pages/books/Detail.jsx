import React, { useMemo, useRef, useState, useEffect } from "react";
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
import enter from "../../assets/images/enter.png";
import more from "../../assets/images/morehorizontal.png";
import userIcon from "../../assets/images/user.png";

const formatNoteDate = (value) => {
    const d = new Date(value);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}  ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// TODO: 백엔드 미연동 상태의 임시 데이터. 팀 전원이 완독(진행도 100%)하면
// AI가 "ㅋㅋㅋ" 같은 단순 감상평을 제외하고 토론 주제를 최대 3개까지 생성해 내려줄 예정.
const AI_TOPICS_MOCK = [
    {
        id: "topic-1",
        question: "두 가문의 오랜 반목이 로미오와 줄리엣의 비극으로 이어진 근본적인 원인은 무엇이라고 생각하나요?",
        comments: [
            { id: "c1", author: "민지", profileImage: null, isMine: false, text: "어른들의 명예와 자존심 싸움이 죄 없는 다음 세대까지 희생시킨 것 같아요.", createdAt: "2026-06-20T13:10:00" },
            { id: "c2", author: "현우", profileImage: null, isMine: false, text: "소통의 부재가 가장 큰 문제였다고 봐요. 누구도 먼저 화해를 시도하지 않았으니까요.", createdAt: "2026-06-20T14:32:00" },
        ],
    },
    {
        id: "topic-2",
        question: "줄리엣의 선택은 사랑을 위한 용기였을까요, 아니면 충동적인 결정이었을까요?",
        comments: [
            { id: "c3", author: "서윤", profileImage: null, isMine: false, text: "그 나이의 줄리엣에게는 그것이 할 수 있는 최선의 용기였다고 생각해요.", createdAt: "2026-06-21T09:05:00" },
        ],
    },
    {
        id: "topic-3",
        question: "현대 사회에서도 가족이나 집단 간의 반목이 개인의 삶을 좌우하는 경우가 있을까요?",
        comments: [],
    },
];

function AiTopicCard({ topic, index, onAddComment, onEditComment, onDeleteComment }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const isComposingRef = useRef(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!openMenuId) return;
        const handleOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [openMenuId]);

    const handleSubmit = () => {
        const text = commentText.trim();
        if (!text) return;
        onAddComment(topic.id, text);
        setCommentText("");
    };

    const handleKeyDown = (e) => {
        if (isComposingRef.current) return;
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleEditStart = (c) => {
        setOpenMenuId(null);
        setEditingId(c.id);
        setEditText(c.text);
    };

    const handleEditSubmit = (commentId) => {
        const text = editText.trim();
        if (!text) return;
        onEditComment(topic.id, commentId, text);
        setEditingId(null);
        setEditText("");
    };

    const handleDelete = (commentId) => {
        setOpenMenuId(null);
        onDeleteComment(topic.id, commentId);
    };

    return (
        <D.AiTopicCard onClick={() => setIsCollapsed((prev) => !prev)}>
            <D.AiTopicBadge>AI 토론 주제 {index + 1}</D.AiTopicBadge>
            <D.AiTopicQuestion>{topic.question}</D.AiTopicQuestion>

            {!isCollapsed && (
                <div onClick={(e) => e.stopPropagation()}>
                    {topic.comments.length > 0 && (
                        <D.AiCommentList>
                            {topic.comments.map((c) => (
                                <D.AiCommentItem key={c.id}>
                                    <D.AiCommentHeader>
                                        <D.AiCommentProfile>
                                            <D.AiCommentProfileIcon
                                                src={c.profileImage || userIcon}
                                                onError={(e) => { e.currentTarget.src = userIcon; }}
                                            />
                                            <D.AiCommentAuthor>{c.author}</D.AiCommentAuthor>
                                        </D.AiCommentProfile>
                                        {c.isMine && (
                                            <D.AiMoreWrapper ref={openMenuId === c.id ? menuRef : null}>
                                                <D.AiMoreIcon
                                                    src={more}
                                                    onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                                                />
                                                {openMenuId === c.id && (
                                                    <D.AiMoreMenu>
                                                        <D.AiMoreMenuItem onClick={() => handleEditStart(c)}>수정</D.AiMoreMenuItem>
                                                        <D.AiMoreMenuDivider />
                                                        <D.AiMoreMenuItem $danger onClick={() => handleDelete(c.id)}>삭제</D.AiMoreMenuItem>
                                                    </D.AiMoreMenu>
                                                )}
                                            </D.AiMoreWrapper>
                                        )}
                                    </D.AiCommentHeader>

                                    {editingId === c.id ? (
                                        <D.AiInputWrapper style={{ marginBottom: "4px" }}>
                                            <D.AiInput
                                                rows={1}
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleEditSubmit(c.id); }
                                                    if (e.key === "Escape") setEditingId(null);
                                                }}
                                                autoFocus
                                            />
                                            <D.AiSendIcon src={enter} onClick={() => handleEditSubmit(c.id)} />
                                        </D.AiInputWrapper>
                                    ) : (
                                        <D.AiCommentText>{c.text}</D.AiCommentText>
                                    )}
                                </D.AiCommentItem>
                            ))}
                        </D.AiCommentList>
                    )}

                    <D.AiInputWrapper>
                        <D.AiInput
                            rows={1}
                            placeholder="이 주제에 대한 생각을 남겨보세요"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onCompositionStart={() => { isComposingRef.current = true; }}
                            onCompositionEnd={() => { isComposingRef.current = false; }}
                        />
                        <D.AiSendIcon src={enter} onClick={handleSubmit} />
                    </D.AiInputWrapper>
                </div>
            )}
        </D.AiTopicCard>
    );
}

function Detail() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const teamId = state?.teamId;
    const newRatingFromNav = state?.newRating ?? null;
    const [bookData, setBookData] = useState(null);
    const [liked, setLiked] = useState(false);
    const [timeline, setTimeline] = useState([]);
    const [activeTab, setActiveTab] = useState("ai");
    const [notePage, setNotePage] = useState(1);
    const NOTES_PER_PAGE = 5;
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const [toast, setToast] = useState(state?.completedMessage ?? null);
    const [aiTopics, setAiTopics] = useState(AI_TOPICS_MOCK);

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

    const handleAddAiComment = (topicId, text) => {
        setAiTopics((prev) =>
            prev.map((t) =>
                t.id === topicId
                    ? {
                          ...t,
                          comments: [
                              ...t.comments,
                              {
                                  id: `local-${Date.now()}`,
                                  author: getUserInfo()?.nickname ?? "나",
                                  profileImage: getUserInfo()?.profileImage ?? null,
                                  isMine: true,
                                  text,
                                  createdAt: new Date().toISOString(),
                              },
                          ],
                      }
                    : t
            )
        );
    };

    const handleEditAiComment = (topicId, commentId, text) => {
        setAiTopics((prev) =>
            prev.map((t) =>
                t.id === topicId
                    ? { ...t, comments: t.comments.map((c) => (c.id === commentId ? { ...c, text } : c)) }
                    : t
            )
        );
    };

    const handleDeleteAiComment = (topicId, commentId) => {
        setAiTopics((prev) =>
            prev.map((t) =>
                t.id === topicId
                    ? { ...t, comments: t.comments.filter((c) => c.id !== commentId) }
                    : t
            )
        );
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
                                $active={activeTab === "ai"}
                                onClick={() => handleTabClick("ai")}
                            >
                                AI 토론
                            </D.TabButton>
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

                    {activeTab === "ai" ? (
                        <D.AiTopicList>
                            {aiTopics.length > 0 ? (
                                aiTopics.slice(0, 3).map((topic, index) => (
                                    <AiTopicCard
                                        key={topic.id}
                                        topic={topic}
                                        index={index}
                                        onAddComment={handleAddAiComment}
                                        onEditComment={handleEditAiComment}
                                        onDeleteComment={handleDeleteAiComment}
                                    />
                                ))
                            ) : (
                                <D.AiEmptyState>팀원 모두가 완독하면 AI가 토론 주제를 제안해드려요.</D.AiEmptyState>
                            )}
                        </D.AiTopicList>
                    ) : (
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
                                                <D.NoteDate>{formatNoteDate(item.createdAt)}</D.NoteDate>
                                            </D.NoteFooter>
                                        </D.NoteContent>
                                    </D.NoteCard>
                                );
                            })}
                        </D.NoteList>
                    )}
                </D.NoteSection>

                {activeTab !== "ai" && totalNotePages > 1 && (
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

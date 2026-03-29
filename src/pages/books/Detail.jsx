import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as D from "../../styles/books/DetailStyle";
import { getBook, getBookTimeline, toggleLike } from "../../api/book";

import cover from "../../assets/images/book.png";
import star from "../../assets/images/star.png";
import starFull from "../../assets/images/star_full.png";
import bookmark from "../../assets/images/bookmark.png";
import link from "../../assets/images/link_black.png";

function Detail() {
    const { bookId } = useParams();
    const [bookData, setBookData] = useState(null);
    const [liked, setLiked] = useState(false);
    const [timeline, setTimeline] = useState([]);
    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const data = await getBook(bookId);
                setBookData(data);
                setLiked(data.liked);
            } catch (error) {
                alert(error.response?.data?.message || "책 정보를 불러오는데 실패했습니다.");
            }
        };
        const fetchTimeline = async () => {
            try {
                const data = await getBookTimeline(bookId);
                setTimeline(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBook();
        fetchTimeline();
    }, [bookId]);

    const visibleItems = useMemo(() => {
        if (activeTab === "highlight") return timeline.filter((item) => item.type === "HIGHLIGHT");
        if (activeTab === "comment") return timeline.filter((item) => item.type === "COMMENT");
        return [...timeline].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }, [timeline, activeTab]);

    const handleTabClick = (tab) => {
        setActiveTab((prev) => (prev === tab ? null : tab));
    };

    return (
        <D.Detail>
            {/* 책 전체 layout */}
            <D.LeftPanel>
                <D.CoverWrapper>
                    <D.CoverImage src={bookData?.bookImage || cover} alt="cover" />
                    <D.PreviewButton>미리보기</D.PreviewButton>
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
            <D.RightPanel>
                <D.BookInfoSection>
                    <D.BookTitle>{bookData?.title}</D.BookTitle>
                    <D.BookMeta>{bookData ? `${bookData.author} 지음 ${bookData.publisher}` : ""}</D.BookMeta>

                    <D.RatingWrapper>
                        {Array.from({ length: 5 }).map((_, index) => {
                            const fill = Math.min(1, Math.max(0, (bookData?.rating ?? 0) - index));
                            return (
                                <div key={index} style={{ position: "relative", display: "inline-block" }}>
                                    <D.StarIcon src={star} alt="star" />
                                    <div style={{ position: "absolute", top: 0, left: 0, width: `${fill * 100}%`, overflow: "hidden" }}>
                                        <D.StarIcon src={starFull} alt="star-full" />
                                    </div>
                                </div>
                            );
                        })}
                        <D.RatingScore>{bookData?.rating}</D.RatingScore>
                    </D.RatingWrapper>

                    <D.ReadButton>같이 읽으러 가기</D.ReadButton>
                </D.BookInfoSection>

                {/* 독서 메모 */}
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
                        {visibleItems.map((item) => {
                            const isHighlightItem = item.type === "HIGHLIGHT";

                            return (
                                <D.NoteCard
                                    key={`${item.type}-${item.createdAt}`}
                                >
                                    {isHighlightItem && <D.NoteLeftBar />}

                                    <D.NoteContent>
                                        <D.NoteText>{item.text}</D.NoteText>

                                        <D.NoteFooter>
                                            {isHighlightItem ? (
                                                <D.NotePage>{item.page ?? ""}</D.NotePage>
                                            ) : (
                                                <div />
                                            )}
                                            <D.NoteDate>
                                                {new Date(item.createdAt).toLocaleString()}
                                            </D.NoteDate>
                                        </D.NoteFooter>
                                    </D.NoteContent>
                                </D.NoteCard>
                            );
                        })}
                    </D.NoteList>
                </D.NoteSection>
            </D.RightPanel>
        </D.Detail>
    );
}

export default Detail;

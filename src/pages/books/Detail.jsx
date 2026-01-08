import React, { useMemo, useState } from "react";
import * as D from "../../styles/books/DetailStyle";

import cover from "../../assets/images/book.png";
import star from "../../assets/images/star.png";
import bookmark from "../../assets/images/bookmark.png";
import link from "../../assets/images/link_black.png";

function Detail() {
    const [activeTab, setActiveTab] = useState(null);

    const highlights = [
        {
            id: 1,
            text: "내가 주제소에게까지 가게 될 때에는 나에게도 다소 책임이 있을지 모른다...",
            page: "p. 27",
            datetime: "2025.11.1  16:00",
        },
        {
            id: 2,
            text: "한 번도 저의 속을 털 일은 번번이 없다...",
            page: "p. 31",
            datetime: "2025.11.1  17:30",
        },
    ];

    const comments = [
        {
            id: 101,
            text: "이 부분 완전 공감.",
            datetime: "2025.11.1  17:50",
        },
    ];

    const toDate = (dt) => {
        const [datePart, timePart] = dt.trim().split(/\s+/);
        const [y, m, d] = datePart.split(".").map(Number);
        const [hh, mm] = timePart.split(":").map(Number);
        return new Date(y, m - 1, d, hh, mm);
    };

    const visibleItems = useMemo(() => {
        if (activeTab === "highlight") return highlights;
        if (activeTab === "comment") return comments;

        const merged = [
            ...highlights.map((h) => ({ ...h, type: "highlight" })),
            ...comments.map((c) => ({ ...c, type: "comment" })),
        ];
        merged.sort((a, b) => toDate(a.datetime) - toDate(b.datetime));
        return merged;
    }, [activeTab, highlights, comments]);

    const handleTabClick = (tab) => {
        setActiveTab((prev) => (prev === tab ? null : tab));
    };

    return (
        <D.Detail>
            {/* 책 전체 layout */}
            <D.LeftPanel>
                <D.CoverWrapper>
                    <D.CoverImage src={cover} alt="cover" />
                    <D.PreviewButton>미리보기</D.PreviewButton>
                    <D.CoverActions>
                        <D.ActionButton $variant="bookmark">
                            <D.ActionIcon src={bookmark} />
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
                    <D.BookTitle>가을</D.BookTitle>
                    <D.BookMeta>김유정 지음 돌곶컴퍼니</D.BookMeta>

                    <D.RatingWrapper>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <D.StarIcon key={index} src={star} alt="star" />
                        ))}
                        <D.RatingScore>4.0</D.RatingScore>
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
                            const isHighlightItem =
                                item.type === "highlight" ||
                                item.page !== undefined;

                            return (
                                <D.NoteCard
                                    key={`${isHighlightItem ? "h" : "c"}-${
                                        item.id
                                    }`}
                                >
                                    {/* 하이라이트일 때만 LeftBar */}
                                    {isHighlightItem && <D.NoteLeftBar />}

                                    <D.NoteContent>
                                        <D.NoteText>{item.text}</D.NoteText>

                                        <D.NoteFooter>
                                            {/* 하이라이트일 때만 page */}
                                            {isHighlightItem ? (
                                                <D.NotePage>
                                                    {item.page}
                                                </D.NotePage>
                                            ) : (
                                                <div />
                                            )}
                                            <D.NoteDate>
                                                {item.datetime}
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

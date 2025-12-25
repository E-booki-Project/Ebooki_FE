import React from "react";
import * as D from "../../styles/books/DetailStyle";

import cover from "../../assets/images/book.png";
import star from "../../assets/images/star.png";

function Detail() {
    const notes = [
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
        {
            id: 3,
            text: "이 부분 완전 공감.",
            page: "",
            datetime: "2025.11.1  17:50",
        },
    ];

    return (
        <D.Detail>
            {/* 책 전체 layout */}
            <D.LeftPanel>
                <D.CoverWrapper>
                    <D.CoverImage src={cover} alt="cover" />
                    <D.PreviewButton>미리보기</D.PreviewButton>
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
                    <D.NoteTitle>독서 메모</D.NoteTitle>

                    <D.NoteList>
                        {notes.map((note) => (
                            <D.NoteCard key={note.id}>
                                <D.NoteLeftBar />
                                <D.NoteContent>
                                    <D.NoteText>{note.text}</D.NoteText>
                                    <D.NoteFooter>
                                        <D.NotePage>{note.page}</D.NotePage>
                                        <D.NoteDate>{note.datetime}</D.NoteDate>
                                    </D.NoteFooter>
                                </D.NoteContent>
                            </D.NoteCard>
                        ))}
                    </D.NoteList>
                </D.NoteSection>
            </D.RightPanel>
        </D.Detail>
    );
}

export default Detail;

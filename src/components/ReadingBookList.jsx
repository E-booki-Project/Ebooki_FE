import React from "react";
import * as RB from "../styles/components/ReadingBookListStyle";
import bookFallback from "../assets/images/book.png";
import star from "../assets/images/star.png";
import starFull from "../assets/images/star_full.png";

function ReadingBookList({ teams }) {
    if (!teams || teams.length === 0) return null;

    return (
        <RB.Container>
            <RB.SectionLabel>읽고 있는 책</RB.SectionLabel>
            {teams.map((team) => (
                <RB.BookItem key={team.id}>
                    <RB.BookCover
                        src={team.bookImage || bookFallback}
                        alt={team.bookTitle}
                        onError={(e) => { e.currentTarget.src = bookFallback; }}
                    />
                    <RB.BookInfo>
                        <RB.BookTitle>{team.bookTitle}</RB.BookTitle>
                        <RB.TeamName>{team.teamName}</RB.TeamName>
                        <RB.ProgressWrapper>
                            <RB.ProgressBar>
                                <RB.ProgressFill $percent={team.progress ?? 0} />
                            </RB.ProgressBar>
                            <RB.ProgressText>{team.progress ?? 0}%</RB.ProgressText>
                        </RB.ProgressWrapper>
                    </RB.BookInfo>
                </RB.BookItem>
            ))}
        </RB.Container>
    );
}

export default ReadingBookList;

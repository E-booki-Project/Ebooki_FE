import React from "react";
import * as L from "../styles/components/LoggedInStyle";

import star from "../assets/images/star.png";
import bookCover from "../assets/images/book.png";

const books = [
    { cover: bookCover, title: "가을", rating: 4.0 },
    { cover: bookCover, title: "절창", rating: 4.0 },
    { cover: bookCover, title: "트렌드 코리아 2026", rating: 4.0 },
    { cover: bookCover, title: "위버멘쉬", rating: 4.0 },
    { cover: bookCover, title: "밤과 나침반", rating: 4.0 },
    { cover: bookCover, title: "가을", rating: 4.0 },
];

function LoggedIn() {
    return (
        <L.LoggedIn>
            <L.Banner>
                <L.BannerButton>시작하기</L.BannerButton>
            </L.Banner>
            <L.Content>
                <L.List>
                    <L.BookTitle>이번주 인기 독서</L.BookTitle>
                    <L.BookGrid>
                        {books.map((book, index) => (
                            <L.BookItem key={index}>
                                <L.BookCover
                                    src={book.cover}
                                    alt={book.title}
                                />
                                <L.BookTitle>{book.title}</L.BookTitle>
                                <L.RatingWrapper>
                                    <L.RatingIcon src={star} />
                                    <L.BookRating>{book.rating}</L.BookRating>
                                </L.RatingWrapper>
                            </L.BookItem>
                        ))}
                    </L.BookGrid>
                </L.List>
                <L.List>
                    <L.BookTitle>최신 독서</L.BookTitle>
                    <L.BookGrid>
                        {books.map((book, index) => (
                            <L.BookItem key={index}>
                                <L.BookCover
                                    src={book.cover}
                                    alt={book.title}
                                />
                                <L.BookTitle>{book.title}</L.BookTitle>
                                <L.RatingWrapper>
                                    <L.RatingIcon src={star} />
                                    <L.BookRating>{book.rating}</L.BookRating>
                                </L.RatingWrapper>
                            </L.BookItem>
                        ))}
                    </L.BookGrid>
                </L.List>
            </L.Content>
        </L.LoggedIn>
    );
}

export default LoggedIn;

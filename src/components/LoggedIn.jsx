import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as L from "../styles/components/LoggedInStyle";
import { getBooks } from "../api/book";

import star from "../assets/images/star_full.png";
import bookCover from "../assets/images/book.png";

function LoggedIn() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getBooks();
                setBooks(data);
            } catch {
                // fail silently on home page
            }
        };
        fetch();
    }, []);

    const popularBooks = useMemo(
        () => [...books].sort((a, b) => b.rating - a.rating).slice(0, 5),
        [books],
    );

    const latestBooks = useMemo(() => books.slice(0, 5), [books]);

    const handleBookClick = (id) => navigate(`/books/info/${id}`);

    return (
        <L.LoggedIn>
            <L.Banner>
                <L.BannerTextGroup>
                    <L.BannerTitle>책, 같이 읽으면 더 재밌다는 사실!</L.BannerTitle>
                    <L.BannerDesc>
                        한 페이지에서 만난 사람들은 지금 이 순간에도 독서를 함께하고 있어요.
                        <br />
                        혼자 읽을 땐 보지 못했던 생각을 만나보세요!
                    </L.BannerDesc>
                </L.BannerTextGroup>
                    <L.BannerButton onClick={() => navigate("/pricing")}>읽으러 가기</L.BannerButton>
            </L.Banner>

            <L.Content>
                <L.BookSection>
                    <L.SectionTitle>이번주 인기 독서</L.SectionTitle>
                    <L.BookGrid>
                        {popularBooks.map((book) => (
                            <L.BookItem key={book.id} onClick={() => handleBookClick(book.id)}>
                                <L.BookCover src={book.bookImage || bookCover} alt={book.title} />
                                <L.BookItemTitle>{book.title}</L.BookItemTitle>
                                <L.RatingWrapper>
                                    <L.RatingIcon src={star} />
                                    <L.BookRating>{book.rating != null ? Number(book.rating).toFixed(1) : ""}</L.BookRating>
                                </L.RatingWrapper>
                            </L.BookItem>
                        ))}
                    </L.BookGrid>
                </L.BookSection>

                <L.BookSection>
                    <L.SectionTitle>최신 독서</L.SectionTitle>
                    <L.BookGrid>
                        {latestBooks.map((book) => (
                            <L.BookItem key={book.id} onClick={() => handleBookClick(book.id)}>
                                <L.BookCover src={book.bookImage || bookCover} alt={book.title} />
                                <L.BookItemTitle>{book.title}</L.BookItemTitle>
                                <L.RatingWrapper>
                                    <L.RatingIcon src={star} />
                                    <L.BookRating>{book.rating != null ? Number(book.rating).toFixed(1) : ""}</L.BookRating>
                                </L.RatingWrapper>
                            </L.BookItem>
                        ))}
                    </L.BookGrid>
                </L.BookSection>
            </L.Content>
        </L.LoggedIn>
    );
}

export default LoggedIn;

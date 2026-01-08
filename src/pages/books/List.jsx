import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as L from "../../styles/books/ListStyle";
import SearchBox from "../../components/SearchBox";
import SortTabs from "../../components/SortTabs";

import star from "../../assets/images/star.png";
import bookCover from "../../assets/images/book.png";

const books = [
    { cover: bookCover, title: "가을", rating: 4.0 },
    { cover: bookCover, title: "절창", rating: 4.0 },
    { cover: bookCover, title: "트렌드 코리아 2026", rating: 4.0 },
    { cover: bookCover, title: "위버멘쉬", rating: 1.0 },
    { cover: bookCover, title: "밤과 나침반", rating: 4.0 },
    { cover: bookCover, title: "가을", rating: 4.0 },
    { cover: bookCover, title: "절창", rating: 4.0 },
    { cover: bookCover, title: "트렌드 코리아 2026", rating: 4.0 },
    { cover: bookCover, title: "위버멘쉬", rating: 4.0 },
    { cover: bookCover, title: "밤과 나침반", rating: 4.0 },
    { cover: bookCover, title: "가을", rating: 4.0 },
    { cover: bookCover, title: "절창", rating: 4.0 },
    { cover: bookCover, title: "트렌드 코리아 2026", rating: 4.0 },
    { cover: bookCover, title: "위버멘쉬", rating: 2.0 },
    { cover: bookCover, title: "밤과 나침반", rating: 4.0 },
    { cover: bookCover, title: "가을", rating: 4.0 },
    { cover: bookCover, title: "절창", rating: 4.0 },
    { cover: bookCover, title: "트렌드 코리아 2026", rating: 4.0 },
    { cover: bookCover, title: "위버멘쉬", rating: 4.0 },
    { cover: bookCover, title: "밤과 나침반", rating: 5.0 },
];

function List() {
    const navigate = useNavigate();
    const [sort, setSort] = useState("latest");
    const [query, setQuery] = useState("");

    const handleBookDetail = () => {
        navigate("/books/detail/${bookId}");
    };

    const sortedBooks = useMemo(() => {
        const arr = [...books];

        if (sort === "latest") {
            return arr.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        }
        if (sort === "popular") {
            return arr.sort((a, b) => b.views - a.views);
        }
        if (sort === "rating") {
            return arr.sort((a, b) => b.rating - a.rating);
        }
        return arr;
    }, [sort]);

    const filteredBooks = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return sortedBooks;

        return sortedBooks.filter((book) =>
            book.title.toLowerCase().includes(q)
        );
    }, [sortedBooks, query]);

    return (
        <L.List>
            <SearchBox onSearch={setQuery} />
            <SortTabs value={sort} onChange={setSort} />
            <L.BookGrid>
                {filteredBooks.map((book, index) => (
                    <L.BookItem
                        key={`${book.title}-${index}`}
                        onClick={() => handleBookDetail(index)}
                    >
                        <L.BookCover src={book.cover} alt={book.title} />
                        <L.BookTitle>{book.title}</L.BookTitle>

                        <L.RatingWrapper>
                            <L.RatingIcon src={star} alt="star" />
                            <L.BookRating>{book.rating}</L.BookRating>
                        </L.RatingWrapper>
                    </L.BookItem>
                ))}
            </L.BookGrid>
        </L.List>
    );
}

export default List;

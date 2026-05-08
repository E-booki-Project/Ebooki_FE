import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as L from "../../styles/books/ListStyle";
import SearchBox from "../../components/SearchBox";
import SortTabs from "../../components/SortTabs";
import { getBooks, searchBooks } from "../../api/book";

import star from "../../assets/images/star.png";
import bookCover from "../../assets/images/book.png";

function List() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [sort, setSort] = useState("latest");

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getBooks();
                setBooks(data);
            } catch (error) {
                alert(error.response?.data?.message || "책 목록을 불러오는데 실패했습니다.");
            }
        };
        fetchBooks();
    }, []);

    const handleSearch = async (q) => {
        if (!q.trim()) {
            const data = await getBooks();
            setBooks(data);
            return;
        }
        try {
            const data = await searchBooks(q);
            setBooks(data.bookList);
        } catch (error) {
            alert(error.response?.data?.message || "검색에 실패했습니다.");
        }
    };

    const filteredBooks = useMemo(() => {
        const arr = [...books];
        if (sort === "rating") {
            return arr.sort((a, b) => b.rating - a.rating);
        }
        return arr;
    }, [books, sort]);

    return (
        <L.List>
            <SearchBox onSearch={handleSearch} />
            <SortTabs value={sort} onChange={setSort} />
            <L.BookGrid>
                {filteredBooks.map((book) => (
                    <L.BookItem
                        key={book.id}
                        onClick={() => navigate(`/books/info/${book.id}`)}
                    >
                        <L.BookCover src={book.bookImage || bookCover} alt={book.title} />
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

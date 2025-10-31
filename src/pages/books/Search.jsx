import React from "react";
import * as L from "../../styles/books/ListStyle";
import SearchBox from "../../components/SearchBox";

import star from "../../assets/images/star.png";
import bookCover from "../../assets/images/book.png";

const books = [
    { cover: bookCover, title: "가을", rating: 4.0 },
    { cover: bookCover, title: "절창", rating: 4.0 },
    { cover: bookCover, title: "트렌드 코리아 2026", rating: 4.0 },
];

function List() {
    return (
        <L.List>
            <SearchBox />
            <L.BookGrid>
                {books.map((book, index) => (
                    <L.BookItem key={index}>
                        <L.BookCover src={book.cover} alt={book.title} />
                        <L.BookTitle>{book.title}</L.BookTitle>
                        <L.RatingWrapper>
                            <L.RatingIcon src={star} />
                            <L.BookRating>{book.rating}</L.BookRating>
                        </L.RatingWrapper>
                    </L.BookItem>
                ))}
            </L.BookGrid>
        </L.List>
    );
}

export default List;

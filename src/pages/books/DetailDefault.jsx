import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as D from "../../styles/books/DetailStyle";
import { getBook, toggleLike } from "../../api/book";

import cover from "../../assets/images/book.png";
import star from "../../assets/images/star.png";
import starFull from "../../assets/images/star_full.png";
import bookmark from "../../assets/images/bookmark.png";
import link from "../../assets/images/link_black.png";

function DetailDefault() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [bookData, setBookData] = useState(null);
    const [liked, setLiked] = useState(false);

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
        fetchBook();
    }, [bookId]);

    return (
        <D.Detail>
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

                    <D.ReadButton onClick={() => navigate(`/invite/${bookId}`)}>같이 읽으러 가기</D.ReadButton>
                </D.BookInfoSection>
            </D.RightPanel>
        </D.Detail>
    );
}

export default DetailDefault;

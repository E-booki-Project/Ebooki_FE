import React, { useState } from "react";
import * as BR from "../styles/components/BookRatingModalStyle";
import { patchRating } from "../api/rating";
import { getUserInfo } from "../utils/authStorage";
import close from "../assets/images/X.png";
import star from "../assets/images/star.png";
import starFull from "../assets/images/star_full.png";

const COUNT = 5;

// TODO: 백엔드 추천 API 연동 전까지의 임시 데이터. 연동 후 patchRating 응답 또는
// 별도 추천 API 호출 결과로 추천 도서명을 받아오도록 교체.
const DUMMY_RECOMMENDATIONS = ["데미안", "어린 왕자", "1984", "노인과 바다", "위대한 개츠비"];

function BookRatingModal({ onClose, onRated, initialRating, bookId }) {
    const [rating, setRating] = useState(initialRating ?? 0);
    const [recommendation, setRecommendation] = useState(null);

    const handleRecommendClick = () => {
        const dummy = DUMMY_RECOMMENDATIONS[Math.floor(Math.random() * DUMMY_RECOMMENDATIONS.length)];
        setRecommendation(dummy);
    };

    const getClickedRating = (_e, i) => i + 1;

    const handleClick = async (e, i) => {
        const newRating = getClickedRating(e, i);
        setRating(newRating);
        try {
            await patchRating(bookId, newRating);
            const userId = getUserInfo()?.id ?? "guest";
            const completed = JSON.parse(localStorage.getItem(`ebookiCompleted_${userId}`) || "{}");
            completed[String(bookId)] = true;
            localStorage.setItem(`ebookiCompleted_${userId}`, JSON.stringify(completed));
            onRated?.(newRating);
        } catch (error) {
            alert(error.response?.data?.message || "평점 저장에 실패했습니다.");
            setRating(initialRating ?? 0);
        }
    };

    return (
        <BR.Overlay onClick={onClose}>
            <BR.BookRating onClick={(e) => e.stopPropagation()}>
                <BR.CloseIcon src={close} onClick={onClose} />

                <BR.Content>
                    <BR.Title>
                        이번 책은 어떠셨나요? <br /> 평점을 남겨주세요!
                    </BR.Title>
                    <BR.SubTitle>
                        남긴 평점은 서비스 개발에 도움이 됩니다.
                    </BR.SubTitle>

                    <BR.RatingWrapper>
                        {[...Array(COUNT)].map((_, i) => {
                            const fill = Math.min(1, Math.max(0, rating - i));
                            return (
                                <BR.StarButton
                                    key={i}
                                    type="button"
                                    onClick={(e) => handleClick(e, i)}
                                >
                                    <div style={{ position: "relative", display: "inline-block" }}>
                                        <BR.StarImg src={star} alt="" draggable={false} />
                                        <div style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: `${fill * 100}%`,
                                            overflow: "hidden",
                                        }}>
                                            <BR.StarImg src={starFull} alt="" draggable={false} />
                                        </div>
                                    </div>
                                </BR.StarButton>
                            );
                        })}
                    </BR.RatingWrapper>

                    {recommendation ? (
                        <BR.RecommendText>
                            <BR.RecommendTitle>{recommendation}</BR.RecommendTitle> 도서를 추천드립니다.
                        </BR.RecommendText>
                    ) : (
                        <BR.RecommendButton type="button" onClick={handleRecommendClick}>
                            비슷한 도서 추천받기
                        </BR.RecommendButton>
                    )}
                </BR.Content>
            </BR.BookRating>
        </BR.Overlay>
    );
}

export default BookRatingModal;

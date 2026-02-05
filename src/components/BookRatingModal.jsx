import React, { useRef, useState } from "react";
import * as BR from "../styles/components/BookRatingModalStyle";
import close from "../assets/images/X.png";

function BookRatingModal({ onClose }) {
    const [rating, setRating] = useState(0);
    const [dragging, setDragging] = useState(false);
    const wrapRef = useRef(null);

    const COUNT = 5;

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    // ✅ "별 하나"의 영역 기준으로 rating 계산 (gap이 있어도 정확)
    const calcRating = (clientX) => {
        if (!wrapRef.current) return 0;

        const rect = wrapRef.current.getBoundingClientRect();
        const x = clamp(clientX - rect.left, 0, rect.width);

        // 0~5
        const next = Math.ceil((x / rect.width) * COUNT);
        return clamp(next, 0, COUNT);
    };

    const handleMove = (e) => {
        const clientX = e.touches?.[0]?.clientX ?? e.clientX;
        setRating(calcRating(clientX));
    };

    const startDrag = (e) => {
        setDragging(true);
        handleMove(e);
    };

    const stopDrag = () => setDragging(false);

    return (
        <BR.Overlay>
            <BR.BookRating>
                <BR.CloseIcon src={close} onClick={onClose} />

                <BR.Content>
                    <BR.Title>
                        이번 책은 어떠셨나요? <br /> 평점을 남겨주세요!
                    </BR.Title>

                    <BR.SubTitle>
                        남긴 평점은 서비스 개발에 도움이 됩니다.
                    </BR.SubTitle>

                    {/* ✅ 별을 "교체 렌더링" */}
                    <BR.RatingWrapper
                        ref={wrapRef}
                        onMouseDown={startDrag}
                        onMouseMove={(e) => dragging && handleMove(e)}
                        onMouseUp={stopDrag}
                        onMouseLeave={stopDrag}
                        onTouchStart={startDrag}
                        onTouchMove={(e) => dragging && handleMove(e)}
                        onTouchEnd={stopDrag}
                    >
                        {[...Array(COUNT)].map((_, i) => {
                            const value = i + 1;
                            const filled = value <= rating;

                            return (
                                <BR.StarButton
                                    key={i}
                                    type="button"
                                    onClick={() => setRating(value)}
                                    aria-label={`${value}점`}
                                >
                                    {filled ? (
                                        <BR.StarFull />
                                    ) : (
                                        <BR.StarEmpty />
                                    )}
                                </BR.StarButton>
                            );
                        })}
                    </BR.RatingWrapper>

                    {/* (선택) 점수 표시 */}
                    {/* <div>{rating} / 5</div> */}
                </BR.Content>
            </BR.BookRating>
        </BR.Overlay>
    );
}

export default BookRatingModal;

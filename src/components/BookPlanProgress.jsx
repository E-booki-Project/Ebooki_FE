import React from "react";
import { useNavigate } from "react-router-dom";
import * as BP from "../styles/components/BookPlanProgressStyle";
import help from "../assets/images/help.png";
import book from "../assets/images/book_grey.png";
import more from "../assets/images/chevronright.png";

function BookPlanProgress() {
    const navigate = useNavigate();

    const handlePlan = () => {
        navigate("/pricing");
    };

    const totalCount = 12;
    const usedCount = 2;

    const progressItems = Array.from(
        { length: totalCount },
        (_, index) => index,
    );

    return (
        <BP.BookPlanProgress>
            <BP.ProgressCard>
                <BP.Header>
                    <BP.PlanTitle>요금제 이름</BP.PlanTitle>
                    <BP.PlanIcon src={help} alt="도움말" />
                </BP.Header>

                <BP.ProgressContainer>
                    <BP.ProgressTitle>
                        {usedCount}/{totalCount} 권 독서 완료
                    </BP.ProgressTitle>

                    <BP.ProgressBarWrapper>
                        {progressItems.map((item) => (
                            <BP.ProgressSegment
                                key={item}
                                $isActive={item < usedCount}
                                $segmentCount={totalCount}
                            />
                        ))}
                    </BP.ProgressBarWrapper>
                </BP.ProgressContainer>
            </BP.ProgressCard>

            <BP.Footer>
                <BP.PlanText>
                    <BP.PlanIcon src={book} alt="책 아이콘" />
                    요금제 구매하기
                </BP.PlanText>
                <BP.PlanIcon src={more} alt="더보기" onClick={handlePlan} />
            </BP.Footer>
        </BP.BookPlanProgress>
    );
}

export default BookPlanProgress;

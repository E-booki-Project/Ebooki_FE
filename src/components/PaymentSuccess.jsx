import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../styles/components/PaymentSuccessStyle";

function PaymentSuccess() {
    const navigate = useNavigate();

    const handleBooklist = () => {
        navigate("/books");
    };
    return (
        <S.SuccessContainer>
            <S.ImageIcon />
            <S.SuccessText>
                <S.Title>결제가 완료되었어요</S.Title>
                <S.Content>
                    이제 책을 교환하며 새로운 이야기를 만나보세요!
                </S.Content>
            </S.SuccessText>
            <S.Button onClick={handleBooklist}>바로 읽으러 가기</S.Button>
        </S.SuccessContainer>
    );
}

export default PaymentSuccess;

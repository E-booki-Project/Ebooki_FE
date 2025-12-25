import React from "react";
import * as S from "../styles/components/PaymentSuccessStyle";

function PaymentSuccess() {
    return (
        <S.SuccessContainer>
            <S.ImageIcon />
            <S.SuccessText>
                <S.Title>결제가 완료되었어요</S.Title>
                <S.Content>결제 성공 메시지</S.Content>
            </S.SuccessText>
            <S.ButtonWrapper>
                <S.CancelButton>button</S.CancelButton>
                <S.ConfirmButton>확인</S.ConfirmButton>
            </S.ButtonWrapper>
        </S.SuccessContainer>
    );
}

export default PaymentSuccess;

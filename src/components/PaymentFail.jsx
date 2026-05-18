import React from "react";
import { useNavigate } from "react-router-dom";
import * as F from "../styles/components/PaymentFailStyle";

import payfail from "../assets/images/pay_fail.png";

function PaymentFail({ message }) {
    const navigate = useNavigate();

    const handlePricing = () => {
        navigate(message ? "/books" : "/pricing");
    };
    return (
        <F.FailContainer>
            <F.ImageIcon src={payfail} />
            <F.FailText>
                <F.Title>결제를 실패했어요</F.Title>
                <F.Content>
                    {message ?? "결제수단 확인 후 재시도 해보시기 바랍니다."}
                </F.Content>
            </F.FailText>
            <F.Button onClick={handlePricing}>{message ? "바로 읽으러 가기" : "재시도"}</F.Button>
        </F.FailContainer>
    );
}

export default PaymentFail;

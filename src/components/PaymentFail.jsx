import React from "react";
import { useNavigate } from "react-router-dom";
import * as F from "../styles/components/PaymentFailStyle";

function PaymentFail() {
    const navigate = useNavigate();

    const handlePricing = () => {
        navigate("/pricing");
    };
    return (
        <F.FailContainer>
            <F.ImageIcon />
            <F.FailText>
                <F.Title>결제를 실패했어요</F.Title>
                <F.Content>
                    결제수단 확인 후 재시도 해보시기 바랍니다.
                </F.Content>
            </F.FailText>
            <F.Button onClick={handlePricing}>재시도</F.Button>
        </F.FailContainer>
    );
}

export default PaymentFail;

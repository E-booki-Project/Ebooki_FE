import React from "react";
import * as F from "../styles/components/PaymentFailStyle";

function PaymentFail() {
    return (
        <F.FailContainer>
            <F.ImageIcon />
            <F.FailText>
                <F.Title>결제를 실패했어요</F.Title>
                <F.Content>
                    결제수단 확인 후 재시도 해보시기 바랍니다.
                </F.Content>
            </F.FailText>
            <F.Button>재시도</F.Button>
        </F.FailContainer>
    );
}

export default PaymentFail;

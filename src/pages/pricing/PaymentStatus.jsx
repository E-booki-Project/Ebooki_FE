import React, { useState } from "react";
import * as P from "../../styles/pricing/PaymentStatusStyle";
import PaymentSuccess from "../../components/PaymentSuccess";
import PaymentFail from "../../components/PaymentFail";

function PaymentStatus() {
    const [paymentStatus] = useState("fail");

    if (paymentStatus === "success") {
        return (
            <P.Payment>
                <PaymentSuccess />
            </P.Payment>
        );
    }
    if (paymentStatus === "fail") {
        return (
            <P.Payment>
                <PaymentFail />
            </P.Payment>
        );
    }
}

export default PaymentStatus;

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as P from "../../styles/pricing/PaymentStatusStyle";
import PaymentSuccess from "../../components/PaymentSuccess";
import PaymentFail from "../../components/PaymentFail";
import { paymentSuccess, paymentFail, paymentCancel } from "../../api/payment";

function PaymentStatus() {
    const [searchParams] = useSearchParams();
    const [paymentStatus, setPaymentStatus] = useState(null);

    useEffect(() => {
        const pgToken = searchParams.get("pg_token");
        const status = searchParams.get("status");

        if (pgToken) {
            const tid = sessionStorage.getItem("payment_tid");
            sessionStorage.removeItem("payment_tid");
            paymentSuccess(pgToken, tid)
                .then(() => setPaymentStatus("success"))
                .catch(() => setPaymentStatus("fail"));
        } else if (status === "cancel") {
            paymentCancel().finally(() => setPaymentStatus("fail"));
        } else {
            paymentFail().finally(() => setPaymentStatus("fail"));
        }
    }, []);

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
    return null;
}

export default PaymentStatus;

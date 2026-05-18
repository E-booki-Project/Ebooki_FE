import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import * as P from "../../styles/pricing/PaymentStatusStyle";
import PaymentSuccess from "../../components/PaymentSuccess";
import PaymentFail from "../../components/PaymentFail";
import { paymentSuccess, paymentFail, paymentCancel } from "../../api/payment";

function PaymentStatus() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const pgToken = searchParams.get("pg_token");
        const status = searchParams.get("status");
        const stateMessage = location.state?.message ?? null;

        if (pgToken) {
            const tid = sessionStorage.getItem("payment_tid");
            sessionStorage.removeItem("payment_tid");
            paymentSuccess(pgToken, tid)
                .then(() => setPaymentStatus("success"))
                .catch((error) => {
                    setErrorMessage(error.response?.data?.message ?? null);
                    setPaymentStatus("fail");
                });
        } else if (stateMessage !== null) {
            setErrorMessage(stateMessage);
            setPaymentStatus("fail");
        } else if (status === "cancel") {
            paymentCancel().finally(() => setPaymentStatus("fail"));
        } else {
            paymentFail().finally(() => setPaymentStatus("fail"));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
                <PaymentFail message={errorMessage} />
            </P.Payment>
        );
    }
    return null;
}

export default PaymentStatus;

import axiosInstance from "./axios";

export const paymentReady = async (planId) => {
    const response = await axiosInstance.post(`/payment/ready/${planId}`);
    return response.data;
};

export const paymentSuccess = async (pgToken, tid) => {
    const response = await axiosInstance.get(`/payment/success`, { params: { pg_token: pgToken, tid } });
    return response.data;
};

export const paymentFail = async () => {
    const response = await axiosInstance.get("/payment/fail");
    return response.data;
};

export const paymentCancel = async () => {
    const response = await axiosInstance.get("/payment/cancel");
    return response.data;
};

import axiosInstance from "./axios";

export const login = async (data) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
};

export const signup = async ({ email, password, profileImage }) => {
    const response = await axiosInstance.post("/auth/signup", { email, password, profileImage });
    return response.data;
};

export const getUser = async () => {
    const response = await axiosInstance.get("/auth/users");
    return response.data;
};

export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
};

export const kakaoLogin = async (code) => {
    const response = await axiosInstance.get("/auth/login/kakao", { params: { code } });
    return response.data;
};

export const naverLogin = async (code, state) => {
    const response = await axiosInstance.get("/auth/login/naver", { params: { code, state } });
    return response.data;
};

export const googleLogin = async (code) => {
    const response = await axiosInstance.get("/auth/login/google", { params: { code } });
    return response.data;
};

export const findpassword = async () => {};

export const deleteAccount = async () => {
    const response = await axiosInstance.delete("/auth/delete");
    return response.data;
};

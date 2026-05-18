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

export const findpassword = async () => {};

export const deleteAccount = async () => {
    const response = await axiosInstance.delete("/auth/delete");
    return response.data;
};

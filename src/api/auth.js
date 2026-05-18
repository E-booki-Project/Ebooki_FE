import axiosInstance from "./axios";

export const login = async (data) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
};

export const signup = async (formData) => {
    const response = await axiosInstance.post("/auth/signup", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const getUser = async () => {
    const response = await axiosInstance.get("/auth/users");
    return response.data;
};

export const logout = async () => {};

export const findpassword = async () => {};

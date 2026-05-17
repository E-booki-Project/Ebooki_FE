import axios from "axios";
import axiosInstance from "./axios";

export const getMypage = async () => {
    const response = await axiosInstance.get("/api/mypage");
    return response.data;
};

export const getProfilePresignedUrl = async (fileName, contentType) => {
    const response = await axiosInstance.post("/presigned/profile", { fileName, contentType });
    return response.data;
};

export const uploadToS3 = async (presignedUrl, file) => {
    await axios.put(presignedUrl, file, { headers: { "Content-Type": file.type } });
};

export const updateProfileImage = async (profileImage) => {
    const response = await axiosInstance.patch("/auth/update/profileImage", { profileImage });
    return response.data;
};

export const updateNickname = async (nickname) => {
    const response = await axiosInstance.patch("/auth/update/nickname", { nickname });
    return response.data;
};

export const updatePassword = async (currentPassword, newPassword) => {
    const response = await axiosInstance.patch("/auth/update/password", { currentPassword, newPassword });
    return response.data;
};

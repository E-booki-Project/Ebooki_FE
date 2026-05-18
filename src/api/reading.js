import axiosInstance from "./axios";

export const getEpubData = async (teamId, bookId) => {
    const response = await axiosInstance.get(`/api/teams/${teamId}/book/${bookId}`);
    const presignedUrl = response.data?.bookData?.presignedUrl;
    const s3Response = await fetch(presignedUrl);
    return await s3Response.arrayBuffer();
};

export const getReadingEntry = async (teamId, bookId) => {
    const response = await axiosInstance.get("/api/reading/entry", {
        params: { teamId, bookId },
    });
    return response.data;
};

export const saveProgress = async (bookId, payload) => {
    const response = await axiosInstance.post(
        `/api/reading/books/${bookId}/progress`,
        payload,
    );
    return response.data;
};

export const saveHighlight = async (teamId, payload) => {
    const response = await axiosInstance.post(
        `/api/reading/${teamId}/highlights`,
        payload,
    );
    return response.data;
};

import axiosInstance from "./axios";

export const getNextRecommendation = async (bookId) => {
    const response = await axiosInstance.get("/api/recommend/next", {
        params: { bookId },
    });
    return response.data;
};

export const getLibrariesByIsbn = async (isbn13, region = "서울") => {
    const response = await axiosInstance.get("/api/libraries", {
        params: { isbn: isbn13, region },
    });
    return response.data;
};

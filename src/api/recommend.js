import axiosInstance from "./axios";

export const getNextRecommendation = async (bookId) => {
    const response = await axiosInstance.get("/api/recommend/next", {
        params: { bookId },
    });
    return response.data;
};

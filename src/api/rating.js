import axiosInstance from "./axios";

export const patchRating = async (bookId, rating) => {
    const response = await axiosInstance.patch(`/api/books/${bookId}/rating`, { rating });
    return response.data;
};

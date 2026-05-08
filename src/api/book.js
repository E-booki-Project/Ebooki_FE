import axiosInstance from "./axios";

export const getBook = async (bookId) => {
    const response = await axiosInstance.get(`/api/books/${bookId}`);
    return response.data;
};

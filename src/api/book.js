import axiosInstance from "./axios";

export const getBooks = async () => {
    const response = await axiosInstance.get("/api/books");
    return response.data;
};

export const getBook = async (bookId) => {
    const response = await axiosInstance.get(`/api/books/${bookId}`);
    return response.data;
};

export const getBookTimeline = async (bookId) => {
    const response = await axiosInstance.get(`/api/books/${bookId}/timeline`);
    return response.data;
};

export const getMyBookItems = async (bookId) => {
    const response = await axiosInstance.get(`/api/books/${bookId}/my`);
    return response.data;
};

export const searchBooks = async (q) => {
    const response = await axiosInstance.get("/api/search", { params: { q } });
    return response.data;
};

export const toggleLike = async (bookId) => {
    const response = await axiosInstance.post(`/api/likes/${bookId}`);
    return response.data;
};

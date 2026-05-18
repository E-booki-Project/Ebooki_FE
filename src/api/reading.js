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

export const getHighlights = async (bookId, teamId) => {
    const response = await axiosInstance.get(`/api/reading/${bookId}/highlights`, {
        params: { teamId },
    });
    return response.data;
};

export const getHighlightComments = async (highlightId) => {
    const response = await axiosInstance.get(`/api/reading/highlights/${highlightId}/comments`);
    return response.data;
};

export const addHighlightComment = async (teamId, highlightId, text) => {
    const response = await axiosInstance.post(`/api/reading/${teamId}/comments`, { highlightId, text });
    return response.data;
};

export const addEmoticon = async (teamId, commentId, type) => {
    const response = await axiosInstance.post(`/api/reading/${teamId}/emoticons`, { commentId, type });
    return response.data;
};

export const updateComment = async (teamId, commentId, text) => {
    const response = await axiosInstance.patch(
        `/api/reading/teams/${teamId}/comments/${commentId}`,
        { text }
    );
    return response.data;
};

export const deleteComment = async (teamId, commentId) => {
    const response = await axiosInstance.delete(
        `/api/reading/teams/${teamId}/comments/${commentId}`
    );
    return response.data;
};

export const deleteHighlight = async (teamId, highlightId) => {
    const response = await axiosInstance.delete(
        `/api/reading/teams/${teamId}/highlights/${highlightId}`
    );
    return response.data;
};

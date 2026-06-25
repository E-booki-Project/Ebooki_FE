import axiosInstance from "./axios";

export const getDiscussion = async (teamId, bookId) => {
    const response = await axiosInstance.get(`/api/teams/${teamId}/books/${bookId}/discussion`);
    return response.data;
};

export const getDiscussionComments = async (discussionId) => {
    const response = await axiosInstance.get(`/api/discussions/${discussionId}/comments`);
    return response.data;
};

export const addDiscussionComment = async (discussionId, text, topicNo) => {
    const response = await axiosInstance.post(`/api/discussions/${discussionId}/comments`, { text, topicNo });
    return response.data;
};

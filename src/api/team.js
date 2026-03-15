import axiosInstance from "./axios";

export const createTeam = async (data) => {
    const response = await axiosInstance.post("/api/teams", data);
    return response.data;
};

export const joinTeam = async (token) => {
    const response = await axiosInstance.post(`/api/teams/invite?token=${token}`);
    return response.data;
};

export const acceptInvite = async (token) => {
    const response = await axiosInstance.post(`/api/teams/invite/join?token=${token}`);
    return response.data;
};

export const getTeamList = async () => {
    const response = await axiosInstance.get("/api/teams");
    return response.data;
};

export const getTeamDetail = async (teamId) => {
    const response = await axiosInstance.get(`/api/teams/${teamId}`);
    return response.data;
};

export const updateTeam = async (teamId, teamName) => {
    const response = await axiosInstance.put(`/api/teams/${teamId}`, { teamName });
    return response.data;
};

export const reissueInviteLink = async (teamId) => {
    const response = await axiosInstance.post(`/api/teams/invite/reissue?teamId=${teamId}`);
    return response.data;
};

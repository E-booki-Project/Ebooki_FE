const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_INFO_KEY = "userInfo";

export const setAuthStorage = ({ accessToken, refreshToken, userInfo }) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
};

export const getAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getUserInfo = () => {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
};

export const clearAuthStorage = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
};

export const isLoggedIn = () => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const updateUserInfo = (partial) => {
    const current = getUserInfo() ?? {};
    localStorage.setItem(USER_INFO_KEY, JSON.stringify({ ...current, ...partial }));
};

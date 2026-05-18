import axios from "axios";
import { getAccessToken, getRefreshToken, getUserInfo, setAuthStorage, clearAuthStorage } from "../utils/authStorage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
    pendingQueue.forEach(({ resolve, reject }) =>
        error ? reject(error) : resolve(token)
    );
    pendingQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                pendingQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axiosInstance(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const accessToken = getAccessToken();
            const refreshToken = getRefreshToken();

            const { data } = await axios.post(`${BASE_URL}/auth/reissue`, {
                accessToken,
                refreshToken,
            });

            const newAccessToken = data.data.accessToken;
            const newRefreshToken = data.data.refreshToken ?? refreshToken;

            setAuthStorage({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                userInfo: getUserInfo(),
            });

            processQueue(null, newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
        } catch (reissueError) {
            processQueue(reissueError, null);
            clearAuthStorage();
            window.location.replace("/signin");
            return Promise.reject(reissueError);
        } finally {
            isRefreshing = false;
        }
    },
);

export default axiosInstance;

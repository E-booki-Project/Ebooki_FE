import { Client } from "@stomp/stompjs";
import { getAccessToken } from "../utils/authStorage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WS_URL = BASE_URL.replace(/^https?/, "wss");

let stompClient = null;

export const connectSocket = ({ teamId, bookId, onHighlight }) => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
    }

    const token = getAccessToken();

    stompClient = new Client({
        webSocketFactory: () =>
            new WebSocket(`${WS_URL}/ws?token=${token}&teamId=${teamId}`),
        onConnect: () => {
            stompClient.subscribe(
                `/topic/teams/${teamId}/books/${bookId}`,
                (message) => {
                    const data = JSON.parse(message.body);
                    onHighlight(data);
                },
            );
        },
    });

    stompClient.activate();
    return stompClient;
};

export const disconnectSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
    }
};

export const sendHighlight = (teamId, bookId, payload) => {
    if (!stompClient?.connected) return;
    stompClient.publish({
        destination: `/topic/teams/${teamId}/books/${bookId}`,
        body: JSON.stringify(payload),
    });
};

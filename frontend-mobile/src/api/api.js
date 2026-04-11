import axios from "axios";
import { NativeModules, Platform } from "react-native";

const API_PORT = "5000";
const API_PATH = "/api";
const ENV_API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.trim();
const DEV_SERVER_HOST_PATTERN = /^[a-z]+:\/\/([^/:]+)/i;

const getDevServerHost = () => {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    const hostMatch = scriptURL?.match(DEV_SERVER_HOST_PATTERN);

    return hostMatch?.[1] ?? null;
};

const buildApiBaseUrl = () => {
    if (ENV_API_BASE_URL) {
        return ENV_API_BASE_URL.replace(/\/$/, "");
    }

    if (Platform.OS === "web") {
        return `http://localhost:${API_PORT}${API_PATH}`;
    }

    const devServerHost = getDevServerHost();

    if (devServerHost) {
        return `http://${devServerHost}:${API_PORT}${API_PATH}`;
    }

    if (Platform.OS === "android") {
        return `http://10.0.2.2:${API_PORT}${API_PATH}`;
    }

    return `http://localhost:${API_PORT}${API_PATH}`;
};

export const API_BASE_URL = buildApiBaseUrl();

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;

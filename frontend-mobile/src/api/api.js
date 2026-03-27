import axios from "axios";

const API_BASE_URL = "http://192.168.100.8:5000/api";

const API = axios.create({
    // Use your laptop's current Wi-Fi IPv4 address so physical phones can reach the backend.
    // Update this value again if your laptop joins a different network.
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;

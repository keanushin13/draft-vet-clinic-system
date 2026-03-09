import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api", // since you're using Expo Web
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;
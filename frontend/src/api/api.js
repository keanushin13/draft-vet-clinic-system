import axios from "axios";

const API_BASE_URL =
    process.env.REACT_APP_API_URL ||
    `http://${window.location.hostname}:5000/api`;

/* =========================
   AXIOS INSTANCE
========================= */
const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // REQUIRED for CSRF cookies
});

/* =========================
   INIT CSRF TOKEN
   Call ONCE on app load
========================= */
export const initCSRF = async () => {
    try {
        const res = await API.get("/users/csrf-token");
        API.defaults.headers.common["X-CSRF-Token"] = res.data.csrfToken;
    } catch (error) {
        console.error("Failed to initialize CSRF token", error);
    }
};

/* =========================
   OPTIONAL: RESET CSRF
   (use on logout)
========================= */
export const clearCSRF = () => {
    delete API.defaults.headers.common["X-CSRF-Token"];
};

export default API;

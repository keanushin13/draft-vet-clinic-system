import axios from "axios";

/* =========================
   AXIOS INSTANCE
========================= */
const API = axios.create({
    baseURL: "http://localhost:5000/api",
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

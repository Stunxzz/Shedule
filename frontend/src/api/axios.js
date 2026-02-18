// frontend/src/api/axios.js
import axios from "axios";

let accessToken = null;
let refreshToken = null;

// setter за токените
export const setTokens = ({ access, refresh }) => {
  accessToken = access;
  refreshToken = refresh;
};

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  withCredentials: true, // за future HttpOnly cookies
});

// Добавя access token към всеки request
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Ако 401 → опит за refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // refresh token request
        const res = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh: refreshToken },
          { withCredentials: true }
        );
        accessToken = res.data.access;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error(`Error: ${err}`);
        accessToken = null;
        refreshToken = null;
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

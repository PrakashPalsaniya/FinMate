import axios from "axios"
import { BASE_URL } from "./apiPath.js"
import { getUserFriendlyErrorMessage } from "./errorMessage.js"

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    // CRITICAL: withCredentials allows cookies to be sent with cross-origin requests
    withCredentials: true,
})

axiosInstance.interceptors.request.use(
    (config) => {
        // Access token is stored in an HttpOnly cookie; do not read from localStorage.
        return config;
    }, (error) => {
        return Promise.reject(error)
    }
)

// Response Interceptors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    }, async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and not already retrying
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                await axios.post(`${BASE_URL}/api/v1/auth/refresh-token`, {}, { withCredentials: true });
                
                // If refresh successful, retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        // Handle other common errors globally
        error.userMessage = getUserFriendlyErrorMessage(error)

        if (error.response) {
            if (error.response.status === 500) {
                console.error("Server Error. Please try again later")
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request Timeout. Please try again later")
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;

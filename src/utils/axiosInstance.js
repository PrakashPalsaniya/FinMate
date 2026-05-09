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


// Axios is a popular JavaScript library used to make HTTP requests (like GET, POST, PUT, DELETE) from the browser or Node.js applications, providing an easy way to communicate with APIs and web servers using Promises. It simplifies handling asynchronous requests, data transformation, error management, and supports features like automatic JSON parsing and interceptors for modifying requests or responses.

// Summary of the Code:

// Creates a custom Axios instance to use for all API requests in your application.

// Sets default settings:

// Uses a base URL for all requests.

// Sets JSON headers.

// Adds a 10-second timeout to requests.

// Uses HttpOnly cookie for authentication; does not read localStorage for tokens.

// Handles errors globally:

// If a 401 Unauthorized error happens, the user is redirected to the login page.

// If a 500 Server Error happens, it logs an error message.

// If the request times out, it logs a timeout message.

// Exports this configured Axios instance so you can import and use it throughout your app, ensuring all requests have the same configuration and error handling.

// In short:
// This code sets up Axios so all your API requests have the right headers, handle authentication automatically, and manage certain errors in one place.

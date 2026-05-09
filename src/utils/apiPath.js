const normalizeBaseUrl = (value = "") => String(value || "").trim().replace(/\/+$/, "")

const resolveBaseUrl = () => {
    const configuredUrl = normalizeBaseUrl(import.meta.env.VITE_API_URL)

    if (configuredUrl) {
        return configuredUrl
    }

    if (typeof window !== "undefined") {
        const { hostname, origin } = window.location
        const isLocalDevelopment =
            hostname === "localhost" ||
            hostname === "127.0.0.1" ||
            hostname === "0.0.0.0"

        if (isLocalDevelopment) {
            // In development with Vite proxy, use relative path so requests go through the proxy
            // The Vite server will proxy /api requests to http://localhost:5000
            return ""
        }

        console.warn("VITE_API_URL is not set. Falling back to same-origin API requests.")
        return normalizeBaseUrl(origin)
    }

    return ""
}

export const BASE_URL = resolveBaseUrl()
export const API_PATH = {
    BASE_URL,
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        SEND_OTP: "/api/v1/auth/send-otp",
        VERIFY_OTP: "/api/v1/auth/verify-otp",
        GET_USER_INFO: "/api/v1/auth/getUser",
        EXCHANGE_GOOGLE_CODE: (code) => `/api/v1/auth/exchange-google-code?code=${encodeURIComponent(code)}`,
        LOGOUT: "/api/v1/auth/logout",
    },
    DASHBOARD: {
        GET_DATA: "/api/v1/dashboard",
    },
    INCOME: {
        ADD_INCOME: "/api/v1/income/add",
        GET_ALL_INCOME: "/api/v1/income/get",
        UPDATE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
        DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
        DOWNLOAD_INCOME: "/api/v1/income/downloadexcel",
    },
    EXPENSE: {
        ADD_EXPENSE: "/api/v1/expense/add",
        GET_ALL_EXPENSE: "/api/v1/expense/get",
        UPDATE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
        DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: "/api/v1/expense/downloadexcel",
    },
    BUDGETS: {
        GET_ALL: "/api/v1/budgets",
        CREATE: "/api/v1/budgets",
        UPDATE: (budgetId) => `/api/v1/budgets/${budgetId}`,
        DELETE: (budgetId) => `/api/v1/budgets/${budgetId}`,
    },
    AI_SUMMARY: {
        GET_SUMMARY: "/api/v1/ai-summary",
    },
    CHAT: {
        SEND_MESSAGE: "/api/v1/chat",
    },
    SETTINGS: {
        GET_SETTINGS: "/api/v1/settings",
        UPDATE_SETTINGS: "/api/v1/settings",
    },
    TELEGRAM: {
        GET_STATUS: "/api/v1/telegram/status",
        START_LINK: "/api/v1/telegram/link/start",
        UNLINK: "/api/v1/telegram/link",
    },
    SUMMARY_DELIVERY: {
        GET_HISTORY: "/api/v1/summary-delivery/history",
        SEND: "/api/v1/summary-delivery/send",
    },
}



export const BASE_URL = 'https://fin-mate-backend.onrender.com'
export const API_PATH = {
    BASE_URL: 'https://fin-mate-backend.onrender.com',
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        SEND_OTP: "/api/v1/auth/send-otp",
        VERIFY_OTP: "/api/v1/auth/verify-otp",
        GET_USER_INFO: "/api/v1/auth/getUser",
    },
    DASHBOARD: {
        GET_DATA: "/api/v1/dashboard",
    },
    INCOME: {
        ADD_INCOME: "/api/v1/income/add",
        GET_ALL_INCOME: "/api/v1/income/get",
        DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
        DOWNLOAD_INCOME: "/api/v1/income/downloadexcel",
    },
    EXPENSE: {
        ADD_EXPENSE: "/api/v1/expense/add",
        GET_ALL_EXPENSE: "/api/v1/expense/get",
        DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: "/api/v1/expense/downloadexcel",
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/v1/auth/upload-image",
    },
    AI_SUMMARY: {
        GET_SUMMARY: "/api/v1/ai-summary",
    },
    CHAT: {
        SEND_MESSAGE: "/api/v1/chat",
    },
    GOALS: {
        CREATE_GOAL: "/api/v1/goals",
        GET_ALL_GOALS: "/api/v1/goals",
        GET_GOAL_BY_ID: (goalId) => `/api/v1/goals/${goalId}`,
        UPDATE_GOAL: (goalId) => `/api/v1/goals/${goalId}`,
        DELETE_GOAL: (goalId) => `/api/v1/goals/${goalId}`,
        UPDATE_GOAL_PROGRESS: (goalId) => `/api/v1/goals/${goalId}/progress`,
        GET_GOAL_INSIGHTS: (goalId) => `/api/v1/goals/${goalId}/insights`,
        GET_GOALS_SUMMARY: "/api/v1/goals/summary",
        GET_GOALS_AI_INSIGHTS: "/api/v1/goals/ai-insights",
    }
}

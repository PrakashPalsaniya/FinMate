import { LuHandCoins, LuLayoutDashboard, LuLogOut, LuWalletMinimal, LuBrain, LuMessageCircle, LuPiggyBank, LuSettings2 } from "react-icons/lu"

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard",
        group: "Workspace",
        caption: "Overview, balance, and recent activity",
    },
    {
        id: "02",
        label: "Income",
        icon: LuWalletMinimal,
        path: "/income",
        group: "Workspace",
        caption: "Track what is coming in",
    },
    {
        id: "03",
        label: "Expense",
        icon: LuHandCoins,
        path: "/expense",
        group: "Workspace",
        caption: "Watch spending and outflow",
    },
    {
        id: "04",
        label: "Budgets",
        icon: LuPiggyBank,
        path: "/budgets",
        group: "Workspace",
        caption: "Plan monthly spending limits",
    },
    {
        id: "05",
        label: "AI Summary",
        icon: LuBrain,
        path: "/ai-summary",
        group: "Insights",
        caption: "Get a fast, smart financial read",
    },
    {
        id: "06",
        label: "Finance Buddy",
        icon: LuMessageCircle,
        path: "/chat",
        group: "Insights",
        caption: "Ask questions about your money",
    },
    {
        id: "07",
        label: "Settings",
        icon: LuSettings2,
        path: "/settings",
        group: "Account",
        caption: "Timezone and notification controls",
    },

    {
        id: "08",
        label: "Logout",
        icon: LuLogOut,
        path: "logout",
        group: "Account",
    }
]

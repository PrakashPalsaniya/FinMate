import { LuHandCoins, LuLayoutDashboard, LuLogOut, LuWalletMinimal, LuBrain, LuMessageCircle, LuTarget } from "react-icons/lu"

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard"
    },
    {
        id: "02",
        label: "Income",
        icon: LuWalletMinimal,
        path: "/income"
    },
    {
        id: "03",
        label: "Expense",
        icon: LuHandCoins,
        path: "/expense"
    },
    {
        id: "04",
        label: "AI Summary",
        icon: LuBrain,
        path: "/ai-summary"
    },
    {
        id: "05",
        label: "Goals",
        icon: LuTarget,
        path: "/goals"
    },
    {
        id: "06",
        label: "Finance Buddy",
        icon: LuMessageCircle,
        path: "/chat"
    },

    {
        id: "07",
        label: "Logout",
        icon: LuLogOut,
        path: "logout"
    }
]

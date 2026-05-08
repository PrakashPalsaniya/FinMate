import { LuWalletMinimal, LuLaptop, LuBuilding, LuTrendingUp, LuUtensils, LuHouse, LuGamepad2, LuCar, LuZap, LuHeart, LuGraduationCap, LuShoppingBag } from "react-icons/lu";

export const CHART_COLORS = ["#0f766e", "#14b8a6", "#f59e0b", "#0f172a", "#64748b"];
export const INR_SYMBOL = "\u20B9";

export const validEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
    return regex.test(email);
}

export const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    let initials = "";
    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0]
    }
    return initials.toUpperCase();
}

export const formatDate = (date, format = "default") => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";

    if (format === "short") {
        return new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "short",
        }).format(d);
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(d);
}

export const formatCurrency = (number, options = {}) => {
    const amount = Number(number ?? 0);
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
        ...options,
    }).format(amount);
}

export const formatCompactAmount = (number) => {
    const amount = Number(number ?? 0);
    return new Intl.NumberFormat("en-IN", {
        notation: "compact",
        maximumFractionDigits: amount >= 100000 ? 1 : 0,
    }).format(amount);
}

export const prepareExpenseBarChartData = (data = []) => {
    return data.map((item) => ({
        category: item?.category,
        amount: item?.amount,
    }));
}

export const prepareIncomeBarChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date))
    return sortedData.map((item) => ({
        month: formatDate(item?.date, "short"),
        amount: item?.amount,
        category: item?.category,
    }));
}

export const prepareExpenseLineChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date))
    return sortedData.map((item) => ({
        month: formatDate(item?.date, "short"),
        amount: item?.amount,
        category: item?.category,
    }));
}

export const getIncomeIcon = (category) => {
    const iconMap = {
        salary: LuWalletMinimal,
        freelance: LuLaptop,
        business: LuBuilding,
        investment: LuTrendingUp,
        others: LuUtensils
    };
    return iconMap[category.toLowerCase()] || LuUtensils;
}

export const getIconComponent = (iconName) => {
    const iconMap = {
        LuWalletMinimal,
        LuLaptop,
        LuBuilding,
        LuTrendingUp,
        LuUtensils,
        LuHome: LuHouse,
        LuGamepad2,
        LuCar,
        LuZap,
        LuHeart,
        LuGraduationCap,
        LuShoppingBag
    };
    return iconMap[iconName] || LuUtensils;
}

export const getExpenseIcon = (category) => {
    const iconMap = {
        rent: LuHouse,
        entertainment: LuGamepad2,
        food: LuUtensils,
        transport: LuCar,
        utilities: LuZap,
        healthcare: LuHeart,
        education: LuGraduationCap,
        shopping: LuShoppingBag,
        others: LuUtensils
    };
    return iconMap[category.toLowerCase()] || LuUtensils;
}

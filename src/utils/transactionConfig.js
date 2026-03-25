export const TRANSACTION_CATEGORIES = {
    income: ["salary", "freelance", "business", "investment", "others"],
    expense: [
        "rent",
        "entertainment",
        "food",
        "transport",
        "utilities",
        "healthcare",
        "education",
        "shopping",
        "others",
    ],
};

export const formatDateForInput = (value) => {
    if (!value) return "";

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    const timezoneOffsetMs = parsedDate.getTimezoneOffset() * 60 * 1000;
    return new Date(parsedDate.getTime() - timezoneOffsetMs).toISOString().split("T")[0];
};

const normalizeTransactionSource = (transaction) =>
    transaction && typeof transaction === "object" ? transaction : {};

export const createTransactionFormState = (transaction) => {
    const source = normalizeTransactionSource(transaction);

    return {
    title: source.title || "",
    category: source.category ? String(source.category).toLowerCase() : "",
    amount:
        source.amount === undefined || source.amount === null
            ? ""
            : String(source.amount),
    date: formatDateForInput(source.date),
    };
};

export const validateTransactionInput = (transaction = {}) => {
    if (!String(transaction.title || "").trim()) {
        return "Title is required.";
    }

    if (!String(transaction.category || "").trim()) {
        return "Category is required.";
    }

    if (
        transaction.amount === undefined ||
        transaction.amount === null ||
        String(transaction.amount).trim() === "" ||
        Number.isNaN(Number(transaction.amount)) ||
        Number(transaction.amount) <= 0
    ) {
        return "Amount should be a valid number greater than 0.";
    }

    if (!transaction.date) {
        return "Date is required.";
    }

    return "";
};

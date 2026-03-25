export const DEFAULT_USER_SETTINGS = {
    timezone: "Asia/Kolkata",
    notifications: {
        emailEnabled: true,
        telegramEnabled: true,
        dailySummary: false,
        weeklySummary: true,
        monthlySummary: true,
        transactionAlerts: false,
    },
    summaries: {
        dailyTime: "08:00",
        weeklyDay: "monday",
        monthlyDay: 1,
    },
};

export const DEFAULT_TELEGRAM_STATUS = {
    bot: {
        configured: false,
        username: null,
        canGenerateDeepLink: false,
        webhookConfigured: false,
        webhookUrl: null,
    },
    telegram: {
        linked: false,
        account: null,
    },
};

export const WEEKDAY_OPTIONS = [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
];

export const NOTIFICATION_PREFERENCE_FIELDS = [
    {
        key: "emailEnabled",
        label: "Email delivery",
        description: "Allow summaries and reminders to be delivered by email.",
    },
    {
        key: "telegramEnabled",
        label: "Telegram delivery",
        description: "Allow linked Telegram bot summaries to be delivered to your chat.",
    },
    {
        key: "dailySummary",
        label: "Daily summary",
        description: "Receive a short daily recap of movement in your finances.",
    },
    {
        key: "weeklySummary",
        label: "Weekly summary",
        description: "Get a weekly digest with momentum and category trends.",
    },
    {
        key: "monthlySummary",
        label: "Monthly summary",
        description: "Send a deeper month-end wrap-up with key insights.",
    },
    {
        key: "transactionAlerts",
        label: "Transaction alerts",
        description: "Keep room for future transaction-triggered notifications.",
    },
];

export const cloneDefaultUserSettings = () =>
    JSON.parse(JSON.stringify(DEFAULT_USER_SETTINGS));

export const normalizeUserSettings = (settings = {}) => {
    const defaults = cloneDefaultUserSettings();

    return {
        timezone: settings.timezone || defaults.timezone,
        notifications: {
            ...defaults.notifications,
            ...(settings.notifications || {}),
        },
        summaries: {
            ...defaults.summaries,
            ...(settings.summaries || {}),
        },
    };
};

export const normalizeTelegramStatus = (status = {}) => ({
    bot: {
        ...DEFAULT_TELEGRAM_STATUS.bot,
        ...(status.bot || {}),
    },
    telegram: {
        linked: Boolean(status.telegram?.linked),
        account: status.telegram?.account || null,
    },
});

export const getTimezoneOptions = () => {
    if (typeof Intl !== "undefined" && typeof Intl.supportedValuesOf === "function") {
        try {
            return Intl.supportedValuesOf("timeZone");
        } catch {
            return [
                "Asia/Kolkata",
                "UTC",
                "Europe/London",
                "America/New_York",
                "America/Los_Angeles",
                "Asia/Singapore",
                "Australia/Sydney",
            ];
        }
    }

    return [
        "Asia/Kolkata",
        "UTC",
        "Europe/London",
        "America/New_York",
        "America/Los_Angeles",
        "Asia/Singapore",
        "Australia/Sydney",
    ];
};

import React, { useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
    LuBell,
    LuBot,
    LuClock3,
    LuGlobe,
    LuMailCheck,
    LuSend,
    LuSettings2,
    LuUserRound,
} from 'react-icons/lu'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import SettingSection from '../../components/Settings/SettingSection'
import PreferenceToggle from '../../components/Settings/PreferenceToggle'
import SettingsTabBar from '../../components/Settings/SettingsTabBar'
import TelegramBotCard from '../../components/Settings/TelegramBotCard'
import SummaryDeliveryCard from '../../components/Settings/SummaryDeliveryCard'
import { UserContext } from '../../context/UserContext'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATH } from '../../utils/apiPath'
import {
    DEFAULT_TELEGRAM_STATUS,
    NOTIFICATION_PREFERENCE_FIELDS,
    WEEKDAY_OPTIONS,
    getTimezoneOptions,
    normalizeTelegramStatus,
    normalizeUserSettings,
} from '../../utils/settingsConfig'
import { getUserFriendlyErrorMessage } from '../../utils/errorMessage'

const Settings = () => {
    useUserAuth()

    const { user, updateUser } = useContext(UserContext)
    const [settings, setSettings] = useState(() =>
        normalizeUserSettings(user?.settings)
    )
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [telegramLoading, setTelegramLoading] = useState(true)
    const [telegramActionLoading, setTelegramActionLoading] = useState(false)
    const [telegramStatus, setTelegramStatus] = useState(DEFAULT_TELEGRAM_STATUS)
    const [telegramError, setTelegramError] = useState('')
    const [linkSession, setLinkSession] = useState(null)
    const [summaryHistory, setSummaryHistory] = useState([])
    const [summaryHistoryLoading, setSummaryHistoryLoading] = useState(true)
    const [sendingSummaryFrequency, setSendingSummaryFrequency] = useState('')
    const [activeTab, setActiveTab] = useState(SETTINGS_TABS[0].key)

    const timezoneOptions = useMemo(() => getTimezoneOptions(), [])

    const enabledSummaryFrequencies = useMemo(
        () => ([
            settings.notifications.dailySummary && 'Daily',
            settings.notifications.weeklySummary && 'Weekly',
            settings.notifications.monthlySummary && 'Monthly',
        ].filter(Boolean)),
        [
            settings.notifications.dailySummary,
            settings.notifications.weeklySummary,
            settings.notifications.monthlySummary,
        ]
    )

    const activeDeliveryChannels = useMemo(
        () => ([
            settings.notifications.emailEnabled && 'Email',
            settings.notifications.telegramEnabled && telegramStatus.telegram.linked && 'Telegram',
        ].filter(Boolean)),
        [
            settings.notifications.emailEnabled,
            settings.notifications.telegramEnabled,
            telegramStatus.telegram.linked,
        ]
    )

    useEffect(() => {
        setSettings(normalizeUserSettings(user?.settings))
    }, [user])

    useEffect(() => {
        let isMounted = true

        const loadPageData = async () => {
            setLoading(true)
            setTelegramLoading(true)
            setSummaryHistoryLoading(true)
            setTelegramError('')

            const [settingsResult, telegramResult, summaryHistoryResult] = await Promise.allSettled([
                axiosInstance.get(API_PATH.SETTINGS.GET_SETTINGS),
                axiosInstance.get(API_PATH.TELEGRAM.GET_STATUS),
                axiosInstance.get(API_PATH.SUMMARY_DELIVERY.GET_HISTORY),
            ])

            if (!isMounted) {
                return
            }

            if (settingsResult.status === 'fulfilled' && settingsResult.value.data?.settings) {
                setSettings(normalizeUserSettings(settingsResult.value.data.settings))
            } else if (settingsResult.status === 'rejected') {
                console.error('Error loading settings:', settingsResult.reason)
                toast.error('Failed to load settings')
            }

            if (telegramResult.status === 'fulfilled') {
                setTelegramStatus(normalizeTelegramStatus(telegramResult.value.data))
                setTelegramError('')

                if (telegramResult.value.data?.telegram?.linked) {
                    setLinkSession(null)
                }

                if (telegramResult.value.data?.user) {
                    updateUser(telegramResult.value.data.user)
                }
            } else {
                console.error('Error loading Telegram status:', telegramResult.reason)
                setTelegramError(
                    getUserFriendlyErrorMessage(telegramResult.reason, {
                        fallback: 'Could not load Telegram status right now. Please try again later.',
                    })
                )
                toast.error('Failed to load Telegram status')
            }

            if (summaryHistoryResult.status === 'fulfilled') {
                setSummaryHistory(summaryHistoryResult.value.data?.history || [])
            } else {
                console.error('Error loading summary history:', summaryHistoryResult.reason)
                toast.error('Failed to load summary history')
            }

            setLoading(false)
            setTelegramLoading(false)
            setSummaryHistoryLoading(false)
        }

        loadPageData()

        return () => {
            isMounted = false
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleNotificationToggle = (key) => {
        setSettings((current) => ({
            ...current,
            notifications: {
                ...current.notifications,
                [key]: !current.notifications[key],
            },
        }))
    }

    const refreshTelegramStatus = async ({ silent = false } = {}) => {
        setTelegramLoading(true)
        setTelegramError('')

        try {
            const response = await axiosInstance.get(API_PATH.TELEGRAM.GET_STATUS)
            setTelegramStatus(normalizeTelegramStatus(response.data))
            setTelegramError('')

            if (response.data?.telegram?.linked) {
                setLinkSession(null)
            }

            if (response.data?.user) {
                updateUser(response.data.user)
            }

            if (!silent) {
                toast.success('Telegram status refreshed')
            }
        } catch (error) {
            console.error('Error refreshing Telegram status:', error)
            const message = getUserFriendlyErrorMessage(error, {
                fallback: 'Failed to refresh Telegram status. Please try again later.',
            })
            setTelegramError(message)
            toast.error(message)
        } finally {
            setTelegramLoading(false)
        }
    }

    const handleGenerateTelegramLink = async () => {
        setTelegramActionLoading(true)

        try {
            const response = await axiosInstance.post(API_PATH.TELEGRAM.START_LINK)

            setTelegramStatus(normalizeTelegramStatus(response.data))
            setTelegramError('')
            setLinkSession(response.data?.linkSession || null)

            if (response.data?.user) {
                updateUser(response.data.user)
            }

            toast.success('Telegram link code generated')
        } catch (error) {
            console.error('Error generating Telegram link:', error)
            toast.error(
                getUserFriendlyErrorMessage(error, {
                    fallback: 'Failed to generate Telegram link. Please try again later.',
                })
            )
        } finally {
            setTelegramActionLoading(false)
        }
    }

    const refreshSummaryHistory = async ({ silent = false } = {}) => {
        setSummaryHistoryLoading(true)

        try {
            const response = await axiosInstance.get(API_PATH.SUMMARY_DELIVERY.GET_HISTORY)
            setSummaryHistory(response.data?.history || [])

            if (!silent) {
                toast.success('Summary history refreshed')
            }
        } catch (error) {
            console.error('Error loading summary history:', error)
            toast.error(
                getUserFriendlyErrorMessage(error, {
                    fallback: 'Failed to load summary history. Please try again later.',
                })
            )
        } finally {
            setSummaryHistoryLoading(false)
        }
    }

    const handleSendSummaryNow = async (frequency) => {
        setSendingSummaryFrequency(frequency)

        try {
            const response = await axiosInstance.post(API_PATH.SUMMARY_DELIVERY.SEND, {
                frequency,
            })

            const sentChannels = (response.data?.channels || [])
                .filter((channel) => channel.status === 'sent')
                .map((channel) => channel.channel)
            const failedChannelMessage = (response.data?.channels || [])
                .find((channel) => channel.status === 'failed' && channel.error)?.error

            if (sentChannels.length > 0) {
                toast.success(`${capitalize(frequency)} summary sent via ${sentChannels.join(', ')}`)
            } else {
                toast.error(failedChannelMessage || `No ${frequency} summary channel was available right now.`)
            }

            await refreshSummaryHistory({ silent: true })
        } catch (error) {
            console.error(`Error sending ${frequency} summary:`, error)
            toast.error(
                getUserFriendlyErrorMessage(error, {
                    fallback: `Failed to send ${frequency} summary. Please try again later.`,
                })
            )
        } finally {
            setSendingSummaryFrequency('')
        }
    }

    const handleUnlinkTelegram = async () => {
        setTelegramActionLoading(true)

        try {
            const response = await axiosInstance.delete(API_PATH.TELEGRAM.UNLINK)

            setTelegramStatus(normalizeTelegramStatus(response.data))
            setTelegramError('')
            setLinkSession(null)

            if (response.data?.user) {
                updateUser(response.data.user)
            }

            toast.success('Telegram account unlinked')
        } catch (error) {
            console.error('Error unlinking Telegram:', error)
            toast.error(
                getUserFriendlyErrorMessage(error, {
                    fallback: 'Failed to unlink Telegram. Please try again later.',
                })
            )
        } finally {
            setTelegramActionLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)

        try {
            const response = await axiosInstance.patch(API_PATH.SETTINGS.UPDATE_SETTINGS, settings)
            const nextSettings = normalizeUserSettings(response.data?.settings)

            setSettings(nextSettings)
            if (response.data?.user) {
                updateUser(response.data.user)
            }

            toast.success('Settings updated successfully')
        } catch (error) {
            console.error('Error updating settings:', error)
            toast.error(
                getUserFriendlyErrorMessage(error, {
                    fallback: 'Failed to update settings. Please try again later.',
                })
            )
        } finally {
            setSaving(false)
        }
    }

    const overviewRows = [
        { label: 'Timezone', value: settings.timezone },
        { label: 'Summary cadence', value: enabledSummaryFrequencies.join(', ') || 'None' },
        { label: 'Email delivery', value: settings.notifications.emailEnabled ? 'Enabled' : 'Disabled' },
        { label: 'Telegram delivery', value: settings.notifications.telegramEnabled ? 'Enabled' : 'Disabled' },
        {
            label: 'Telegram bot',
            value: telegramStatus.telegram.linked
                ? `Connected to ${telegramStatus.telegram.account?.displayName || 'Telegram'}`
                : telegramStatus.bot.configured
                    ? 'Ready to link'
                    : 'Not configured',
        },
    ]

    const telegramRows = [
        { label: 'Bot status', value: telegramStatus.bot.configured ? 'Configured' : 'Not configured' },
        { label: 'Link status', value: telegramStatus.telegram.linked ? 'Connected' : 'Not linked' },
        { label: 'Chat account', value: telegramStatus.telegram.account?.displayName || 'Not linked' },
        { label: 'Linked on', value: formatDateTime(telegramStatus.telegram.account?.linkedAt, 'Not linked') },
    ]

    const renderTabContent = () => {
        if (activeTab === 'general') {
            return (
                <div className='grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.92fr)] xl:gap-5'>
                    <div className='space-y-4'>
                        <SettingSection
                            eyebrow="Account"
                            title="Profile snapshot"
                            description="A quick read on which account these settings belong to."
                        >
                            <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                                <InfoTile
                                    icon={<LuUserRound className='text-base' />}
                                    label="Name"
                                    value={user?.fullName || 'Not available'}
                                />
                                <InfoTile
                                    icon={<LuMailCheck className='text-base' />}
                                    label="Email"
                                    value={user?.email || 'Not available'}
                                    valueClassName='break-all'
                                />
                                <InfoTile
                                    icon={<LuBell className='text-base' />}
                                    label="Sign in"
                                    value={user?.authProvider || 'local'}
                                    valueClassName='capitalize'
                                />
                            </div>
                        </SettingSection>

                        <SettingSection
                            eyebrow="Regional"
                            title="Timezone and summary schedule"
                            description="These values decide when your daily, weekly, and monthly digests should be generated."
                        >
                            <div className='grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]'>
                                <div className='input-group !mb-0'>
                                    <label className='input-label'>Timezone</label>
                                    <div className='input-box'>
                                        <select
                                            value={settings.timezone}
                                            onChange={({ target }) =>
                                                setSettings((current) => ({
                                                    ...current,
                                                    timezone: target.value,
                                                }))
                                            }
                                            className='input-control'
                                            disabled={loading}
                                        >
                                            {timezoneOptions.map((timezone) => (
                                                <option key={timezone} value={timezone}>
                                                    {timezone}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                                    <InputField
                                        icon={<LuClock3 className='text-base text-slate-500' />}
                                        label="Daily time"
                                        type="time"
                                        value={settings.summaries.dailyTime}
                                        onChange={({ target }) =>
                                            setSettings((current) => ({
                                                ...current,
                                                summaries: {
                                                    ...current.summaries,
                                                    dailyTime: target.value,
                                                },
                                            }))
                                        }
                                    />
                                    <div className='input-group !mb-0'>
                                        <label className='input-label'>Weekly day</label>
                                        <div className='input-box'>
                                            <select
                                                value={settings.summaries.weeklyDay}
                                                onChange={({ target }) =>
                                                    setSettings((current) => ({
                                                        ...current,
                                                        summaries: {
                                                            ...current.summaries,
                                                            weeklyDay: target.value,
                                                        },
                                                    }))
                                                }
                                                className='input-control'
                                            >
                                                {WEEKDAY_OPTIONS.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <InputField
                                        icon={<LuGlobe className='text-base text-slate-500' />}
                                        label="Monthly day"
                                        type="number"
                                        min="1"
                                        max="28"
                                        value={settings.summaries.monthlyDay}
                                        onChange={({ target }) =>
                                            setSettings((current) => ({
                                                ...current,
                                                summaries: {
                                                    ...current.summaries,
                                                    monthlyDay: Number(target.value || 1),
                                                },
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </SettingSection>
                    </div>

                    <SettingsOverviewCard
                        rows={overviewRows}
                        chips={[
                            { icon: <LuSend className='text-sm' />, text: activeDeliveryChannels.join(', ') || 'No active channel' },
                            {
                                icon: <LuBot className='text-sm' />,
                                text: telegramStatus.telegram.linked ? 'Telegram connected' : 'Telegram not linked',
                            },
                        ]}
                    />
                </div>
            )
        }

        if (activeTab === 'notifications') {
            return (
                <div className='grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.92fr)] xl:gap-5'>
                    <SettingSection
                        eyebrow="Notifications"
                        title="Choose what should reach you"
                        description="Email reports, reminders, transaction alerts, and Telegram delivery all use the same saved preferences."
                    >
                        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                            {NOTIFICATION_PREFERENCE_FIELDS.map((field) => (
                                <PreferenceToggle
                                    key={field.key}
                                    label={field.label}
                                    description={field.description}
                                    checked={settings.notifications[field.key]}
                                    onChange={() => handleNotificationToggle(field.key)}
                                    disabled={loading}
                                />
                            ))}
                        </div>
                    </SettingSection>

                    <SettingsOverviewCard
                        title="Delivery overview"
                        description="See which channels and reminder types are currently enabled before saving."
                        rows={[
                            { label: 'Email delivery', value: settings.notifications.emailEnabled ? 'Enabled' : 'Disabled' },
                            { label: 'Telegram delivery', value: settings.notifications.telegramEnabled ? 'Enabled' : 'Disabled' },
                            { label: 'Daily summary', value: settings.notifications.dailySummary ? 'Enabled' : 'Disabled' },
                            { label: 'Weekly summary', value: settings.notifications.weeklySummary ? 'Enabled' : 'Disabled' },
                            { label: 'Monthly summary', value: settings.notifications.monthlySummary ? 'Enabled' : 'Disabled' },
                        ]}
                        chips={[
                            { icon: <LuClock3 className='text-sm' />, text: enabledSummaryFrequencies.join(', ') || 'No summary cadence' },
                            { icon: <LuSend className='text-sm' />, text: activeDeliveryChannels.join(', ') || 'No active channel' },
                        ]}
                    />
                </div>
            )
        }

        if (activeTab === 'telegram') {
            return (
                <div className='grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.92fr)] xl:gap-5'>
                    <TelegramBotCard
                        status={telegramStatus}
                        linkSession={linkSession}
                        loading={telegramLoading}
                        error={telegramError}
                        actionLoading={telegramActionLoading}
                        onGenerateLink={handleGenerateTelegramLink}
                        onRefresh={() => refreshTelegramStatus()}
                        onUnlink={handleUnlinkTelegram}
                    />

                    <SettingsOverviewCard
                        title="Telegram setup"
                        description="Your bot connection status and how it fits into the saved delivery settings."
                        rows={telegramRows}
                        chips={[
                            {
                                icon: <LuBot className='text-sm' />,
                                text: telegramStatus.bot.username ? `@${telegramStatus.bot.username}` : 'Username not set',
                            },
                            {
                                icon: <LuSend className='text-sm' />,
                                text: settings.notifications.telegramEnabled ? 'Telegram delivery enabled' : 'Telegram delivery disabled',
                            },
                        ]}
                    />
                </div>
            )
        }

        return (
            <SummaryDeliveryCard
                settings={settings}
                telegramStatus={telegramStatus}
                history={summaryHistory}
                loading={summaryHistoryLoading}
                sendingFrequency={sendingSummaryFrequency}
                onRefresh={() => refreshSummaryHistory()}
                onSend={handleSendSummaryNow}
            />
        )
    }

    return (
        <DashboardLayout activeMenu="Settings">
            <div className='page-shell'>
                <div className='page-header'>
                    <div>
                        <p className='page-eyebrow'>Workspace settings</p>
                        <h1 className='page-title flex items-center gap-3'>
                            <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_22px_48px_-30px_rgba(15,118,110,0.72)]'>
                                <LuSettings2 className='text-xl' />
                            </span>
                            Settings
                        </h1>
                        <p className='page-subtitle'>
                            Keep timezone, summary schedule, email delivery, and Telegram connection aligned in one clean view.
                        </p>
                        <div className='mt-4 flex flex-wrap gap-2'>
                            <StatusChip icon={<LuGlobe className='text-sm' />} text={settings.timezone} />
                            <StatusChip icon={<LuClock3 className='text-sm' />} text={enabledSummaryFrequencies.join(', ') || 'No summaries enabled'} />
                            <StatusChip
                                icon={<LuBot className='text-sm' />}
                                text={telegramStatus.telegram.linked ? 'Telegram linked' : telegramStatus.bot.configured ? 'Telegram ready' : 'Telegram not configured'}
                            />
                        </div>
                    </div>

                    <button
                        type='button'
                        className='btn-primary !rounded-full !px-5 sm:!w-auto'
                        onClick={handleSave}
                        disabled={loading || saving}
                    >
                        {saving ? 'Saving settings...' : 'Save settings'}
                    </button>
                </div>

                <SettingsTabBar
                    tabs={SETTINGS_TABS}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />

                {renderTabContent()}
            </div>
        </DashboardLayout>
    )
}

const SETTINGS_TABS = [
    {
        key: 'general',
        label: 'General',
        description: 'Profile and schedule',
        icon: LuSettings2,
    },
    {
        key: 'notifications',
        label: 'Notifications',
        description: 'Alerts and delivery',
        icon: LuBell,
    },
    {
        key: 'telegram',
        label: 'Telegram',
        description: 'Bot and linking',
        icon: LuBot,
    },
    {
        key: 'summaries',
        label: 'Summaries',
        description: 'Digests and history',
        icon: LuSend,
    },
]

const StatusChip = ({ icon, text }) => (
    <span className='inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-600'>
        {icon}
        {text}
    </span>
)

const SettingsOverviewCard = ({
    title = 'Current setup',
    description = 'A compact read of the preferences that are active right now.',
    rows = [],
    chips = [],
}) => (
    <SettingSection
        eyebrow="Overview"
        title={title}
        description={description}
    >
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1'>
            {rows.map((row) => (
                <PreviewRow key={row.label} label={row.label} value={row.value} />
            ))}
        </div>

        {chips.length > 0 && (
            <div className='mt-4 flex flex-wrap gap-2'>
                {chips.map((chip) => (
                    <StatusChip key={chip.text} icon={chip.icon} text={chip.text} />
                ))}
            </div>
        )}
    </SettingSection>
)

const InfoTile = ({ icon, label, value, valueClassName = '' }) => (
    <div className='rounded-[22px] border border-slate-200/80 bg-slate-50/70 p-4'>
        <div className='flex items-center gap-2 text-slate-500'>
            {icon}
            <span className='text-xs font-semibold uppercase tracking-[0.18em]'>{label}</span>
        </div>
        <p className={`mt-2.5 text-sm font-semibold text-slate-900 ${valueClassName}`.trim()}>
            {value}
        </p>
    </div>
)

const InputField = ({ icon, label, className = '', ...props }) => (
    <div className={`input-group !mb-0 ${className}`.trim()}>
        <label className='input-label'>{label}</label>
        <div className='input-box'>
            {icon}
            <input className='input-control' {...props} />
        </div>
    </div>
)

const PreviewRow = ({ label, value }) => (
    <div className='rounded-[20px] border border-slate-200/80 bg-slate-50/70 px-4 py-3'>
        <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
        <p className='mt-1.5 text-sm font-semibold text-slate-900'>{value}</p>
    </div>
)

const formatDateTime = (value, fallback = 'Not available') => {
    if (!value) return fallback

    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) {
        return fallback
    }

    return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(parsedDate)
}

const capitalize = (value = '') =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : value

export default Settings

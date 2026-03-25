import React from 'react'
import { LuClock3, LuMail, LuMessageCircle, LuRefreshCw, LuSend } from 'react-icons/lu'
import { sanitizeSummaryDeliveryError } from '../../utils/summaryDeliveryError'

const formatDateTime = (value) => {
    if (!value) return 'Not sent yet'

    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) {
        return 'Not sent yet'
    }

    return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(parsedDate)
}

const capitalize = (value = '') =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : value

const SummaryDeliveryCard = ({
    settings,
    telegramStatus,
    history,
    loading,
    sendingFrequency,
    onRefresh,
    onSend,
}) => {
    const channels = [
        settings.notifications.emailEnabled && {
            label: 'Email',
            active: true,
            icon: <LuMail className='text-base text-sky-600' />,
            description: 'Enabled',
        },
        {
            label: 'Telegram',
            active: settings.notifications.telegramEnabled && telegramStatus.telegram.linked,
            icon: <LuMessageCircle className='text-base text-emerald-600' />,
            description: settings.notifications.telegramEnabled
                ? telegramStatus.telegram.linked
                    ? 'Linked and enabled'
                    : 'Enabled but bot not linked'
                : 'Disabled',
        },
    ].filter(Boolean)

    return (
        <section className='card'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                <div className='max-w-2xl'>
                    <p className='page-eyebrow'>Digest delivery</p>
                    <h2 className='mt-2 text-xl font-semibold tracking-tight text-slate-900'>Automated summaries</h2>
                    <p className='mt-2 text-sm leading-6 text-slate-500'>
                        Daily, weekly, and monthly summaries follow your timezone and schedule settings, and you can send a test digest anytime.
                    </p>
                </div>

                <button
                    type='button'
                    className='inline-flex items-center justify-center gap-2 self-start rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
                    onClick={onRefresh}
                    disabled={loading}
                >
                    <LuRefreshCw className='text-sm' />
                    Refresh history
                </button>
            </div>

            <div className='mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]'>
                <div className='space-y-4'>
                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                        <InfoCard
                            label="Daily schedule"
                            value={settings.notifications.dailySummary ? `Enabled at ${settings.summaries.dailyTime}` : 'Disabled'}
                            icon={<LuClock3 className='text-base text-cyan-600' />}
                        />
                        <InfoCard
                            label="Weekly schedule"
                            value={settings.notifications.weeklySummary ? `${capitalize(settings.summaries.weeklyDay)} at ${settings.summaries.dailyTime}` : 'Disabled'}
                            icon={<LuClock3 className='text-base text-indigo-600' />}
                        />
                        <InfoCard
                            label="Monthly schedule"
                            value={settings.notifications.monthlySummary ? `Day ${settings.summaries.monthlyDay} at ${settings.summaries.dailyTime}` : 'Disabled'}
                            icon={<LuClock3 className='text-base text-amber-600' />}
                        />
                        <InfoCard
                            label="Active channels"
                            value={channels.filter((channel) => channel.active).map((channel) => channel.label).join(', ') || 'None available'}
                            icon={<LuSend className='text-base text-emerald-600' />}
                        />
                    </div>

                    <div className='rounded-[22px] border border-slate-200/80 bg-slate-50/70 p-4'>
                        <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>Channel availability</p>
                        <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                            {channels.map((channel) => (
                                <div key={channel.label} className='rounded-[18px] border border-slate-200 bg-white px-4 py-3'>
                                    <div className='flex items-center gap-2 text-slate-500'>
                                        {channel.icon}
                                        <span className='text-sm font-semibold text-slate-900'>{channel.label}</span>
                                    </div>
                                    <p className='mt-2 text-sm leading-5 text-slate-500'>{channel.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='space-y-4'>
                    <div className='rounded-[22px] border border-cyan-200/80 bg-[linear-gradient(145deg,rgba(236,254,255,0.95),rgba(240,249,255,0.88))] p-4'>
                        <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>Send test summary now</p>
                        <p className='mt-2 text-sm leading-6 text-slate-600'>
                            Trigger one digest immediately to confirm Telegram and email are using the current preferences.
                        </p>
                        <div className='mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 xl:grid-cols-1'>
                            {['daily', 'weekly', 'monthly'].map((frequency) => (
                                <button
                                    key={frequency}
                                    type='button'
                                    className='rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60'
                                    onClick={() => onSend(frequency)}
                                    disabled={Boolean(sendingFrequency)}
                                >
                                    {sendingFrequency === frequency ? `Sending ${frequency}...` : `Send ${frequency}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='rounded-[22px] border border-slate-200/80 bg-slate-50/70 p-4'>
                        <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>Recent delivery history</p>
                        <div className='mt-4 space-y-3 xl:max-h-[420px] xl:overflow-y-auto xl:pr-1'>
                            {history.length === 0 ? (
                                <div className='rounded-[18px] border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-500'>
                                    No summary deliveries yet. Send one manually or wait for the next scheduled window.
                                </div>
                            ) : (
                                history.map((item) => (
                                    <div key={item._id} className='rounded-[18px] border border-slate-200 bg-white px-4 py-3.5'>
                                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                                            <div>
                                                <p className='text-sm font-semibold text-slate-900'>
                                                    {capitalize(item.frequency)} - {capitalize(item.channel)}
                                                </p>
                                                <p className='mt-1 text-sm text-slate-500'>
                                                    {item.status === 'sent'
                                                        ? `Sent ${formatDateTime(item.sentAt)}`
                                                        : item.status === 'failed'
                                                            ? `Failed ${formatDateTime(item.updatedAt)}`
                                                            : `${capitalize(item.status)} ${formatDateTime(item.updatedAt)}`}
                                                </p>
                                            </div>

                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                item.status === 'sent'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : item.status === 'failed'
                                                        ? 'bg-rose-50 text-rose-700'
                                                        : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {capitalize(item.status)}
                                            </span>
                                        </div>

                                        {item.lastError && (
                                            <p className='mt-3 text-sm text-rose-600'>
                                                {sanitizeSummaryDeliveryError(item.channel, item.lastError)}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const InfoCard = ({ label, value, icon }) => (
    <div className='rounded-[22px] border border-slate-200/80 bg-slate-50/70 p-4'>
        <div className='flex items-center gap-2 text-slate-500'>
            {icon}
            <span className='text-xs font-semibold uppercase tracking-[0.18em]'>{label}</span>
        </div>
        <p className='mt-2.5 text-sm font-semibold text-slate-900'>{value}</p>
    </div>
)

export default SummaryDeliveryCard

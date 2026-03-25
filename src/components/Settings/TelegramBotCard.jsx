import React from 'react'
import toast from 'react-hot-toast'
import { LuBell, LuBot, LuMessageCircle, LuRefreshCw } from 'react-icons/lu'

const formatDateTime = (value) => {
    if (!value) return 'Not available'

    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) {
        return 'Not available'
    }

    return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(parsedDate)
}

const copyToClipboard = async (value, successMessage) => {
    try {
        await navigator.clipboard.writeText(value)
        toast.success(successMessage)
    } catch {
        toast.error('Could not copy right now')
    }
}

const TelegramBotCard = ({
    status,
    linkSession,
    loading,
    error,
    actionLoading,
    onGenerateLink,
    onRefresh,
    onUnlink,
}) => {
    const bot = status?.bot || {}
    const telegram = status?.telegram || {}
    const account = telegram.account

    return (
        <section className='card'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                <div className='max-w-2xl'>
                    <p className='page-eyebrow'>Telegram</p>
                    <h2 className='mt-2 text-xl font-semibold tracking-tight text-slate-900'>Bot connection</h2>
                    <p className='mt-2 text-sm leading-6 text-slate-500'>
                        Link one Telegram chat, confirm parsed transactions before saving, and keep summaries available in the same place.
                    </p>
                </div>

                <div className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-semibold ${
                    telegram.linked
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                }`}>
                    <LuBot className='text-sm' />
                    {telegram.linked ? 'Connected' : 'Not linked'}
                </div>
            </div>

            {loading ? (
                <div className='mt-5 rounded-[22px] border border-slate-200 bg-slate-50/90 p-4 text-sm leading-6 text-slate-700'>
                    Checking Telegram bot status...
                </div>
            ) : error ? (
                <div className='mt-5 rounded-[22px] border border-rose-200 bg-rose-50/90 p-4 text-sm leading-6 text-rose-900'>
                    <div className='flex items-center gap-2 font-semibold'>
                        <LuBell className='text-base' />
                        Could not load Telegram status.
                    </div>
                    <p className='mt-2'>{error}</p>
                    <div className='mt-4'>
                        <ActionButton
                            type='button'
                            className='border-rose-200 bg-white text-rose-700 hover:border-rose-300 hover:bg-rose-100'
                            onClick={onRefresh}
                            disabled={actionLoading}
                        >
                            Retry
                        </ActionButton>
                    </div>
                </div>
            ) : !bot.configured ? (
                <div className='mt-5 rounded-[22px] border border-amber-200 bg-amber-50/90 p-4 text-sm leading-6 text-amber-900'>
                    <div className='flex items-center gap-2 font-semibold'>
                        <LuBell className='text-base' />
                        Telegram bot env vars are not configured yet.
                    </div>
                    <p className='mt-2'>
                        Add `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, and `TELEGRAM_WEBHOOK_URL` in `backend/.env` first.
                    </p>
                </div>
            ) : (
                <>
                    <div className='mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                        <InfoCard
                            label="Bot username"
                            value={bot.username ? `@${bot.username}` : 'Not set'}
                            icon={<LuMessageCircle className='text-base text-sky-600' />}
                        />
                        <InfoCard
                            label="Webhook"
                            value={bot.webhookConfigured ? 'Configured' : 'Not configured'}
                            icon={<LuRefreshCw className='text-base text-cyan-600' />}
                        />
                        <InfoCard
                            label="Linked account"
                            value={telegram.linked ? account?.displayName || 'Connected' : 'Not linked'}
                            icon={<LuBot className='text-base text-emerald-600' />}
                        />
                        <InfoCard
                            label="Last interaction"
                            value={telegram.linked ? formatDateTime(account?.lastInteractionAt) : 'Not available'}
                            icon={<LuBell className='text-base text-amber-600' />}
                        />
                    </div>

                    {telegram.linked ? (
                        <div className='mt-5 rounded-[24px] border border-emerald-200 bg-[linear-gradient(145deg,rgba(236,253,245,0.92),rgba(220,252,231,0.88))] p-4 sm:p-5'>
                            <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start'>
                                <div className='min-w-0'>
                                    <p className='text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700'>Connected chat</p>
                                    <h3 className='mt-2 break-words text-lg font-semibold text-slate-900'>
                                        {account?.displayName || 'Telegram user'}
                                        {account?.username ? ` (@${account.username})` : ''}
                                    </h3>
                                    <p className='mt-2 text-sm leading-6 text-slate-600'>
                                        Linked on {formatDateTime(account?.linkedAt)}
                                    </p>
                                </div>

                                <div className='flex flex-wrap gap-2 xl:max-w-[240px] xl:justify-end'>
                                    <ActionButton
                                        type='button'
                                        onClick={onRefresh}
                                        disabled={loading || actionLoading}
                                    >
                                        Refresh status
                                    </ActionButton>
                                    <ActionButton
                                        type='button'
                                        className='border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100'
                                        onClick={onUnlink}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Working...' : 'Unlink Telegram'}
                                    </ActionButton>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(250px,0.82fr)]'>
                            <div className='rounded-[24px] border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5'>
                                <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>Link flow</p>
                                <h3 className='mt-2 text-lg font-semibold text-slate-900'>Generate a one-time Telegram code</h3>
                                <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-600'>
                                    Create a short-lived code, open the bot, and Telegram links back to this account through the `/start` command.
                                </p>

                                <div className='mt-4 flex flex-wrap gap-2'>
                                    <button
                                        type='button'
                                        className='btn-primary sm:!w-auto'
                                        onClick={onGenerateLink}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Generating...' : 'Generate link code'}
                                    </button>
                                    <ActionButton
                                        type='button'
                                        onClick={onRefresh}
                                        disabled={loading || actionLoading}
                                    >
                                        Refresh status
                                    </ActionButton>
                                </div>
                            </div>

                            {linkSession?.code && (
                                <div className='rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.18)]'>
                                    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>Latest link code</p>
                                    <div className='mt-3 break-all rounded-[18px] bg-slate-950 px-4 py-3 font-mono text-[13px] tracking-[0.16em] text-slate-100 sm:text-sm sm:tracking-[0.22em]'>
                                        {linkSession.code}
                                    </div>
                                    <p className='mt-3 text-sm leading-6 text-slate-500'>
                                        Expires at {formatDateTime(linkSession.expiresAt)}. Send{' '}
                                        <span className='break-all font-mono text-slate-700'>{linkSession.manualCommand}</span> if you want to link manually.
                                    </p>

                                    <div className='mt-4 flex flex-wrap gap-2'>
                                        <ActionButton
                                            type='button'
                                            onClick={() => copyToClipboard(linkSession.code, 'Telegram link code copied')}
                                        >
                                            Copy code
                                        </ActionButton>

                                        {linkSession.manualCommand && (
                                            <ActionButton
                                                type='button'
                                                onClick={() => copyToClipboard(linkSession.manualCommand, 'Telegram start command copied')}
                                            >
                                                Copy start command
                                            </ActionButton>
                                        )}

                                        {linkSession.deepLink && (
                                            <a
                                                href={linkSession.deepLink}
                                                target='_blank'
                                                rel='noreferrer'
                                                className='inline-flex items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100'
                                            >
                                                Open Telegram bot
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

const ActionButton = ({ className = '', children, ...props }) => (
    <button
        className={`rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
        {...props}
    >
        {children}
    </button>
)

const InfoCard = ({ label, value, icon }) => (
    <div className='rounded-[22px] border border-slate-200/80 bg-slate-50/70 p-4'>
        <div className='flex items-center gap-2 text-slate-500'>
            {icon}
            <span className='text-xs font-semibold uppercase tracking-[0.18em]'>{label}</span>
        </div>
        <p className='mt-2.5 text-sm font-semibold text-slate-900'>{value}</p>
    </div>
)

export default TelegramBotCard

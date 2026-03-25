import React, { useEffect, useMemo, useState } from 'react'
import {
  LuArrowRight,
  LuBrain,
  LuClock3,
  LuLightbulb,
  LuRefreshCw,
  LuRocket,
  LuShield,
  LuSparkles,
  LuTarget,
  LuTrendingDown,
  LuTrendingUp,
} from 'react-icons/lu'
import DashboardLayout from '../../components/layouts/DashboardLayout.jsx'
import axiosInstance from '../../utils/axiosInstance.js'
import { API_PATH } from '../../utils/apiPath.js'
import { useUserAuth } from '../../hooks/useUserAuth.jsx'
import { formatCurrency } from '../../utils/helper.js'

const AISummary = () => {
  useUserAuth()

  const [summaryData, setSummaryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAISummary = async () => {
    setSummaryData(null)
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.get(API_PATH.AI_SUMMARY.GET_SUMMARY)

      if (response.data?.success) {
        setSummaryData(response.data)
      } else {
        setError(response.data?.message || 'Something went wrong. Please try again later.')
      }
    } catch (requestError) {
      console.log('Error fetching AI summary:', requestError)
      setError(requestError?.userMessage || 'Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAISummary()
  }, [])

  const financialData = summaryData?.data
  const aiSummary = summaryData?.aiSummary
  const overview = summaryData?.overview
  const headerChips = useMemo(() => {
    if (!summaryData) {
      return []
    }

    return [
      summaryData.notice && {
        icon: <LuShield className='text-sm' />,
        label: summaryData.notice,
        tone: 'warning',
      },
      summaryData.generatedAt && {
        icon: <LuClock3 className='text-sm' />,
        label: `Updated ${formatDateTime(summaryData.generatedAt)}`,
        tone: 'neutral',
      },
    ].filter(Boolean)
  }, [summaryData])

  const topExpenseText = overview?.topExpense
    ? `${overview.topExpense.category} - ${formatCurrency(overview.topExpense.amount)}${overview.topExpense.share ? ` (${overview.topExpense.share}% of spend)` : ''}`
    : 'No expense category data yet'

  const topIncomeText = overview?.topIncome
    ? `${overview.topIncome.category} - ${formatCurrency(overview.topIncome.amount)}`
    : 'No income source data yet'

  return (
    <DashboardLayout activeMenu="AI Summary">
      <div className='page-shell'>
        <div className='page-header'>
          <div>
            <p className='page-eyebrow'>AI Money Coach</p>
            <h1 className='page-title'>AI Summary</h1>
            <p className='page-subtitle'>
              A clear view of your last 30 days, with the next steps that matter most.
            </p>

            {headerChips.length > 0 && (
              <div className='mt-4 flex flex-wrap gap-2'>
                {headerChips.map((chip) => (
                  <StatusChip
                    key={chip.label}
                    icon={chip.icon}
                    label={chip.label}
                    tone={chip.tone}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type='button'
            className='btn-primary !rounded-full !px-5 sm:!w-auto'
            onClick={fetchAISummary}
            disabled={loading}
          >
            <LuRefreshCw className={`text-base ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh summary'}
          </button>
        </div>

        {loading && (
          <div className='card flex min-h-[280px] flex-col items-center justify-center text-center'>
            <div className='flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-primary/15 border-t-primary' />
            <p className='mt-5 text-base font-semibold text-slate-900'>Preparing your summary...</p>
            <p className='mt-2 text-sm text-slate-500'>This may take a moment.</p>
          </div>
        )}

        {error && !loading && (
          <div className='card border-rose-200/80 bg-[linear-gradient(135deg,rgba(254,242,242,0.95),rgba(255,255,255,0.96))]'>
            <div className='flex items-start gap-4'>
              <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600'>
                <LuShield className='text-2xl' />
              </div>
              <div className='min-w-0'>
                <h2 className='text-lg font-semibold text-rose-700'>Summary unavailable</h2>
                <p className='mt-2 text-sm leading-6 text-rose-600'>{error}</p>
                <button
                  type='button'
                  onClick={fetchAISummary}
                  className='btn-secondary mt-4 !rounded-full !border-rose-200 !bg-white !px-5 !text-rose-700 hover:!border-rose-300 sm:!w-auto'
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {summaryData && !loading && !error && (
          <>
            <section className='card bg-[linear-gradient(135deg,rgba(15,118,110,0.08),rgba(255,255,255,0.98))]'>
              <div className='grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start'>
                <div className='flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary text-white shadow-[0_22px_48px_-30px_rgba(15,118,110,0.72)]'>
                  <LuBrain className='text-[1.7rem]' />
                </div>

                <div className='min-w-0'>
                  <div className='flex flex-wrap gap-2'>
                    {overview?.balanceLabel && (
                      <SubtleBadge label={overview.balanceLabel} />
                    )}
                    {overview?.focusLabel && (
                      <SubtleBadge label={overview.focusLabel} />
                    )}
                    {overview?.expenseTrendLabel && (
                      <SubtleBadge label={overview.expenseTrendLabel} />
                    )}
                  </div>

                  <h2 className='mt-4 text-[1.45rem] font-semibold tracking-tight text-slate-900 sm:text-[1.8rem]'>
                    {aiSummary?.summaryTitle || 'Your financial snapshot'}
                  </h2>
                  <p className='mt-3 max-w-4xl text-sm leading-7 text-slate-600 sm:text-[15px]'>
                    {aiSummary?.insightsSummary}
                  </p>
                </div>
              </div>
            </section>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
              <SummaryMetricCard
                icon={<LuTrendingUp className='text-xl' />}
                label='Total income'
                value={formatCurrency(financialData?.totalIncome || 0)}
                footnote={formatTrendText(financialData?.trends?.incomeChange, 'vs previous 30 days')}
                tone='success'
              />
              <SummaryMetricCard
                icon={<LuTrendingDown className='text-xl' />}
                label='Total expenses'
                value={formatCurrency(financialData?.totalExpenses || 0)}
                footnote={formatTrendText(financialData?.trends?.expenseChange, 'vs previous 30 days')}
                tone='danger'
              />
              <SummaryMetricCard
                icon={<LuTarget className='text-xl' />}
                label='Current balance'
                value={formatCurrency(financialData?.totalBalance || 0)}
                footnote={overview?.balanceLabel || 'Net result for the period'}
                tone={financialData?.totalBalance >= 0 ? 'primary' : 'danger'}
              />
              <SummaryMetricCard
                icon={<LuShield className='text-xl' />}
                label='Savings rate'
                value={`${financialData?.savingsRate?.toFixed(1) || 0}%`}
                footnote={getSavingsLabel(financialData?.savingsRate)}
                tone='accent'
                progressValue={financialData?.savingsRate || 0}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.16fr)_minmax(300px,0.84fr)]'>
              <div className='grid gap-4 lg:grid-cols-2'>
                <InsightListCard
                  title='Key insights'
                  icon={<LuSparkles className='text-lg' />}
                  items={aiSummary?.highlights}
                  tone='info'
                />
                <InsightListCard
                  title='Smart moves'
                  icon={<LuLightbulb className='text-lg' />}
                  items={aiSummary?.smartMoves}
                  tone='success'
                />
                <InsightListCard
                  title='Action plan'
                  icon={<LuRocket className='text-lg' />}
                  items={aiSummary?.nextSteps}
                  tone='accent'
                  numbered
                  className='lg:col-span-2'
                />
              </div>

              <div className='space-y-4'>
                <ScoreCard aiScore={aiSummary?.aiScore} />
                <SnapshotCard
                  topExpenseText={topExpenseText}
                  topIncomeText={topIncomeText}
                  dailySpend={formatCurrency(overview?.dailySpend || 0)}
                  projectedExpense={formatCurrency(overview?.projectedMonthlyExpense || 0)}
                  focusLabel={overview?.focusLabel || 'Keep tracking daily movement'}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

const SummaryMetricCard = ({
  icon,
  label,
  value,
  footnote,
  tone = 'neutral',
  progressValue,
}) => {
  const toneClasses = {
    success: {
      wrapper: 'border-emerald-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.95),rgba(255,255,255,0.96))]',
      icon: 'bg-emerald-100 text-emerald-600',
      value: 'text-emerald-700',
    },
    danger: {
      wrapper: 'border-rose-100 bg-[linear-gradient(135deg,rgba(255,241,242,0.95),rgba(255,255,255,0.96))]',
      icon: 'bg-rose-100 text-rose-600',
      value: 'text-rose-700',
    },
    primary: {
      wrapper: 'border-cyan-100 bg-[linear-gradient(135deg,rgba(236,254,255,0.95),rgba(255,255,255,0.96))]',
      icon: 'bg-cyan-100 text-cyan-700',
      value: 'text-cyan-700',
    },
    accent: {
      wrapper: 'border-amber-100 bg-[linear-gradient(135deg,rgba(255,251,235,0.95),rgba(255,255,255,0.96))]',
      icon: 'bg-amber-100 text-amber-600',
      value: 'text-amber-700',
    },
    neutral: {
      wrapper: 'border-slate-200 bg-white',
      icon: 'bg-slate-100 text-slate-600',
      value: 'text-slate-900',
    },
  }

  const selectedTone = toneClasses[tone] || toneClasses.neutral

  return (
    <div className={`card !p-4 ${selectedTone.wrapper}`.trim()}>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>{label}</p>
          <p className={`mt-3 text-2xl font-semibold tracking-tight ${selectedTone.value}`.trim()}>
            {value}
          </p>
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] ${selectedTone.icon}`.trim()}>
          {icon}
        </div>
      </div>

      {typeof progressValue === 'number' && (
        <div className='mt-4 h-2 rounded-full bg-white/90'>
          <div
            className='h-2 rounded-full bg-[linear-gradient(90deg,#0f766e,#14b8a6)] transition-all duration-700'
            style={{ width: `${Math.max(0, Math.min(progressValue, 100))}%` }}
          />
        </div>
      )}

      <p className='mt-3 text-sm leading-6 text-slate-500'>{footnote}</p>
    </div>
  )
}

const InsightListCard = ({
  title,
  icon,
  items = [],
  tone = 'neutral',
  numbered = false,
  className = '',
}) => {
  const toneClasses = {
    info: {
      header: 'text-sky-700',
      item: 'border-sky-100 bg-sky-50/80',
      marker: 'bg-sky-100 text-sky-700',
    },
    success: {
      header: 'text-emerald-700',
      item: 'border-emerald-100 bg-emerald-50/80',
      marker: 'bg-emerald-100 text-emerald-700',
    },
    accent: {
      header: 'text-violet-700',
      item: 'border-violet-100 bg-violet-50/80',
      marker: 'bg-violet-100 text-violet-700',
    },
    neutral: {
      header: 'text-slate-700',
      item: 'border-slate-200 bg-slate-50/80',
      marker: 'bg-slate-100 text-slate-700',
    },
  }

  const selectedTone = toneClasses[tone] || toneClasses.neutral

  return (
    <section className={`card ${className}`.trim()}>
      <div className={`flex items-center gap-2 text-lg font-semibold ${selectedTone.header}`.trim()}>
        {icon}
        <h3>{title}</h3>
      </div>

      <div className='mt-4 space-y-3'>
        {(items || []).map((item, index) => (
          <div
            key={`${title}-${index}`}
            className={`flex items-start gap-3 rounded-[20px] border px-4 py-3.5 ${selectedTone.item}`.trim()}
          >
            <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${selectedTone.marker}`.trim()}>
              {numbered ? index + 1 : <LuArrowRight className='text-sm' />}
            </span>
            <p className='text-sm leading-6 text-slate-700'>{item}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const ScoreCard = ({ aiScore }) => (
  <section className='card'>
    <div className='flex items-center gap-2 text-lg font-semibold text-slate-900'>
      <LuTarget className='text-lg text-primary' />
      <h3>Health score</h3>
    </div>

    <div className='mt-4 grid gap-3'>
      <ScoreRow label='Financial health' value={aiScore?.financialHealth} tone='success' />
      <ScoreRow label='Savings efficiency' value={aiScore?.savingsEfficiency} tone='primary' />
      <ScoreRow label='Risk level' value={aiScore?.riskLevel} tone='accent' />
    </div>
  </section>
)

const ScoreRow = ({ label, value, tone = 'primary' }) => {
  const toneClasses = {
    success: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    primary: 'border-cyan-100 bg-cyan-50 text-cyan-700',
    accent: 'border-amber-100 bg-amber-50 text-amber-700',
  }

  return (
    <div className='rounded-[20px] border border-slate-200/80 bg-slate-50/70 p-4'>
      <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
      <span className={`mt-3 inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${toneClasses[tone]}`.trim()}>
        {value || 'Not available'}
      </span>
    </div>
  )
}

const SnapshotCard = ({
  topExpenseText,
  topIncomeText,
  dailySpend,
  projectedExpense,
  focusLabel,
}) => (
  <section className='card'>
    <div className='flex items-center gap-2 text-lg font-semibold text-slate-900'>
      <LuLightbulb className='text-lg text-accent' />
      <h3>Money snapshot</h3>
    </div>

    <div className='mt-4 space-y-3'>
      <SnapshotRow label='Main expense pressure' value={topExpenseText} />
      <SnapshotRow label='Main income source' value={topIncomeText} />
      <SnapshotRow label='Daily spending pace' value={dailySpend} />
      <SnapshotRow label='Projected monthly spend' value={projectedExpense} />
      <SnapshotRow label='Current focus' value={focusLabel} />
    </div>
  </section>
)

const SnapshotRow = ({ label, value }) => (
  <div className='rounded-[20px] border border-slate-200/80 bg-slate-50/70 px-4 py-3'>
    <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
    <p className='mt-1.5 text-sm leading-6 text-slate-700'>{value}</p>
  </div>
)

const StatusChip = ({ icon, label, tone = 'neutral' }) => {
  const toneClasses = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    info: 'border-cyan-200 bg-cyan-50 text-cyan-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    neutral: 'border-slate-200/80 bg-slate-50/80 text-slate-600',
  }

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${toneClasses[tone] || toneClasses.neutral}`.trim()}>
      {icon}
      {label}
    </span>
  )
}

const SubtleBadge = ({ label }) => (
  <span className='inline-flex items-center rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600'>
    {label}
  </span>
)

const formatTrendText = (value, suffix) => {
  if (value === null || value === undefined) {
    return 'No comparison data yet'
  }

  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}${Math.abs(value)}% ${suffix}`
}

const getSavingsLabel = (rate = 0) => {
  if (rate >= 30) return 'Strong savings cushion'
  if (rate >= 15) return 'Healthy monthly buffer'
  if (rate >= 0) return 'Room to build more surplus'
  return 'Spending is ahead of income'
}

const formatDateTime = (value) => {
  if (!value) return 'Generated just now'

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Generated recently'
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate)
}

export default AISummary

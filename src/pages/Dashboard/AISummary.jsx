import React, { useEffect, useMemo, useState } from 'react'
import {
  LuBrain,
  LuClock3,
  LuLightbulb,
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

// Sub-components
import { AISummaryHeader, SubtleBadge } from '../../components/AISummary/AISummaryHeader'
import MetricCard from '../../components/AISummary/MetricCard'
import InsightCard from '../../components/AISummary/InsightCard'
import ScoreSection from '../../components/AISummary/ScoreSection'
import SnapshotSection from '../../components/AISummary/SnapshotSection'

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
    if (!summaryData) return []

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
            <p className='page-eyebrow'>Finance Intelligence</p>
            <h1 className='page-title'>AI Insights</h1>
            <p className='page-subtitle'>
              Deep-dive analysis generated using real-time spending behavior. Discover leakage and trends.
            </p>
          </div>

          <button
            className='btn-primary !px-6'
            onClick={fetchAISummary}
          >
            <LuSparkles className='text-lg' />
            Regenerate
          </button>
        </div>

        {loading && (
          <div className='card flex min-h-[320px] flex-col items-center justify-center text-center'>
            <div className='relative flex h-20 w-20 items-center justify-center'>
              <div className='absolute inset-0 animate-ping rounded-full bg-primary/20' />
              <div className='flex h-14 w-14 animate-spin items-center justify-center rounded-full border-4 border-primary/10 border-t-primary' />
            </div>
            <p className='mt-8 text-lg font-extrabold tracking-tight text-slate-900'>Synthesizing Data...</p>
            <p className='mt-2 text-sm font-medium text-slate-500'>Our AI is identifying patterns in your transaction history.</p>
          </div>
        )}

        {error && !loading && (
          <div className='card border-rose-100 bg-[linear-gradient(135deg,rgba(254,242,242,0.5),rgba(255,255,255,0.8))]'>
            <div className='flex items-start gap-5'>
              <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-rose-500 text-white shadow-lg'>
                <LuShield className='text-2xl' />
              </div>
              <div className='min-w-0'>
                <h2 className='text-xl font-extrabold tracking-tight text-rose-700'>Intelligence Dropout</h2>
                <p className='mt-2 text-base font-medium leading-relaxed text-rose-600/80'>{error}</p>
                <button
                  type='button'
                  onClick={fetchAISummary}
                  className='btn-secondary mt-5 !rounded-full !border-rose-200 !bg-white !px-6 !text-rose-700 hover:!bg-rose-50'
                >
                  Force Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {summaryData && !loading && !error && (
          <>
            <section className='card group border-white/5 !bg-[#0f172a] text-white shadow-xl'>
              <div className='grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start'>
                <div className='flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary text-white shadow-[0_20px_40px_-10px_rgba(16,185,129,0.5)] transition-transform group-hover:scale-105'>
                  <LuBrain className='text-3xl' />
                </div>

                <div className='min-w-0'>
                  <div className='flex flex-wrap gap-2'>
                    {overview?.balanceLabel && <SubtleBadge label={overview.balanceLabel} />}
                    {overview?.focusLabel && <SubtleBadge label={overview.focusLabel} />}
                  </div>

                  <h2 className='mt-5 text-2xl font-black tracking-tight text-white sm:text-4xl'>
                    {aiSummary?.summaryTitle || 'Executive Financial Summary'}
                  </h2>
                  <p className='mt-4 max-w-5xl text-base leading-8 text-white/60 sm:text-lg'>
                    {aiSummary?.insightsSummary}
                  </p>
                </div>
              </div>
            </section>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
              <MetricCard
                icon={<LuTrendingUp className='text-xl' />}
                label='Total income'
                value={formatCurrency(financialData?.totalIncome || 0)}
                footnote={formatTrendText(financialData?.trends?.incomeChange, 'vs previous 30 days')}
                tone='success'
              />
              <MetricCard
                icon={<LuTrendingDown className='text-xl' />}
                label='Total expenses'
                value={formatCurrency(financialData?.totalExpenses || 0)}
                footnote={formatTrendText(financialData?.trends?.expenseChange, 'vs previous 30 days')}
                tone='danger'
              />
              <MetricCard
                icon={<LuTarget className='text-xl' />}
                label='Current balance'
                value={formatCurrency(financialData?.totalBalance || 0)}
                footnote={overview?.balanceLabel || 'Net result for the period'}
                tone={financialData?.totalBalance >= 0 ? 'primary' : 'danger'}
              />
              <MetricCard
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
                <InsightCard
                  title='Key insights'
                  icon={<LuSparkles className='text-lg' />}
                  items={aiSummary?.highlights}
                  tone='info'
                />
                <InsightCard
                  title='Smart moves'
                  icon={<LuLightbulb className='text-lg' />}
                  items={aiSummary?.smartMoves}
                  tone='success'
                />
                <InsightCard
                  title='Action plan'
                  icon={<LuRocket className='text-lg' />}
                  items={aiSummary?.nextSteps}
                  tone='accent'
                  numbered
                  className='lg:col-span-2'
                />
              </div>

              <div className='space-y-4'>
                <ScoreSection aiScore={aiSummary?.aiScore} />
                <SnapshotSection
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

const formatTrendText = (value, suffix) => {
  if (value === null || value === undefined) return 'No comparison data yet'
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
  if (Number.isNaN(parsedDate.getTime())) return 'Generated recently'
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate)
}

export default AISummary

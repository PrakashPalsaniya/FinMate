import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdCard } from "react-icons/io"
import { LuArrowDownRight, LuArrowUpRight, LuBadgeIndianRupee, LuHandCoins, LuWalletMinimal } from 'react-icons/lu'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import InfoCard from '../../components/Cards/InfoCard'
import SkeletonCard from '../../components/SkeletonCard'
import RecentTransactions from '../../components/Dashboard/RecentTransactions.jsx'
import FinanceOverview from '../../components/Dashboard/FinanceOverview.jsx'
import ExpenseTransaction from '../../components/Dashboard/ExpenseTransaction.jsx'
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses.jsx'
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart.jsx'
import RecentIncome from '../../components/Dashboard/RecentIncome.jsx'
import CategoryPieChart from '../../components/Dashboard/CategoryPieChart.jsx'
import BudgetSnapshot from '../../components/Dashboard/BudgetSnapshot.jsx'
import { UserContext } from '../../context/UserContext'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATH } from '../../utils/apiPath'
import { formatCompactAmount, formatCurrency } from '../../utils/helper.js'

const Home = () => {
  useUserAuth()

  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)

    try {
      const response = await axiosInstance.get(API_PATH.DASHBOARD.GET_DATA)

      if (response.data) {
        setDashboardData(response.data)
      }
    } catch (error) {
      console.log("something went wrong. Please try again ", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"
  const firstName = user?.fullName?.split(" ")[0] || "there"

  const totalBalance = dashboardData?.totalBalance || 0
  const totalIncome = dashboardData?.totalIncome || 0
  const totalExpenses = dashboardData?.totalExpenses || 0
  const cashFlow = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? Math.round((cashFlow / totalIncome) * 100) : 0
  const trackedVolume = totalIncome + totalExpenses
  const totalCategories =
    Object.keys(dashboardData?.expenseCategories || {}).length +
    Object.keys(dashboardData?.incomeCategories || {}).length

  const topExpenseEntry = Object.entries(dashboardData?.expenseCategories || {}).sort((a, b) => b[1] - a[1])[0]
  const topExpenseCategory = topExpenseEntry ? `${topExpenseEntry[0]} spending leads` : "No spending pattern yet"

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='page-shell'>
        <section className='relative overflow-hidden rounded-[26px] bg-[linear-gradient(145deg,#0f172a_0%,#111827_55%,#0f766e_100%)] px-3.5 py-4 text-white shadow-[0_40px_100px_-44px_rgba(15,23,42,0.75)] sm:px-6 sm:py-6 md:rounded-[34px] md:px-8 md:py-8 xl:px-10 xl:py-9'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.28),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.16),transparent_24%)]' />
          <div className='absolute -left-8 top-8 h-40 w-40 rounded-full bg-white/8 blur-3xl' />
          <div className='absolute bottom-0 right-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl' />

          <div className='relative flex flex-col gap-4 sm:gap-6 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(380px,460px)] xl:items-center xl:gap-8'>
            <div className='max-w-3xl xl:max-w-2xl'>
              <span className='surface-chip border-white/12 bg-white/8 text-white/80'>
                <LuBadgeIndianRupee className='text-sm text-accent' />
                Daily money overview
              </span>
              <h1 className='mt-3 text-[1.55rem] font-semibold tracking-tight text-white sm:mt-4 sm:text-[2.35rem] md:mt-5 md:text-5xl'>
                {greeting}, {firstName}.
              </h1>
              <p className='mt-2.5 max-w-2xl text-[12px] leading-5 text-white/72 sm:mt-3 sm:text-sm sm:leading-7 md:mt-4 md:text-base'>
                Your dashboard is tuned for faster decisions now. Here is the latest read on balance, flow, and where your money is concentrating.
              </p>

              <div className='mt-3.5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3 xl:mt-7'>
                <button className='btn-primary !rounded-full !px-5 sm:!w-auto' onClick={() => navigate("/income")}>
                  <LuArrowUpRight className='text-base' />
                  Add income
                </button>
                <button className='btn-secondary !rounded-full !border-white/15 !bg-white/8 !px-5 !text-white hover:!border-white/25 hover:!text-white sm:!w-auto' onClick={() => navigate("/expense")}>
                  <LuArrowDownRight className='text-base' />
                  Track expense
                </button>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:gap-3 xl:w-full'>
              <div className='rounded-[20px] border border-white/10 bg-white/8 p-3 backdrop-blur-xl sm:rounded-[26px] sm:p-4 xl:min-h-[158px]'>
                <p className='text-xs font-semibold uppercase tracking-[0.22em] text-white/55'>Savings rate</p>
                <p className='mt-2 text-lg font-semibold tracking-tight text-white sm:mt-3 sm:text-3xl'>{loading ? "--" : `${savingsRate}%`}</p>
                <p className='mt-1.5 hidden text-[11px] leading-5 text-white/65 sm:mt-2 sm:block sm:text-sm'>How much income is still staying with you.</p>
              </div>
              <div className='rounded-[20px] border border-white/10 bg-white/8 p-3 backdrop-blur-xl sm:rounded-[26px] sm:p-4 xl:min-h-[158px]'>
                <p className='text-xs font-semibold uppercase tracking-[0.22em] text-white/55'>Tracked volume</p>
                <p className='mt-2 text-lg font-semibold tracking-tight text-white sm:mt-3 sm:text-3xl'>{loading ? "--" : formatCompactAmount(trackedVolume)}</p>
                <p className='mt-1.5 hidden text-[11px] leading-5 text-white/65 sm:mt-2 sm:block sm:text-sm'>Total movement already captured.</p>
              </div>
              <div className='rounded-[20px] border border-white/10 bg-white/8 p-3 backdrop-blur-xl sm:rounded-[26px] sm:p-4 xl:min-h-[158px]'>
                <p className='text-xs font-semibold uppercase tracking-[0.22em] text-white/55'>Category pulse</p>
                <p className='mt-2 text-[14px] font-semibold tracking-tight text-white sm:mt-3 sm:text-lg'>{loading ? "Loading..." : topExpenseCategory}</p>
                <p className='mt-1.5 hidden text-[11px] leading-5 text-white/65 sm:mt-2 sm:block sm:text-sm'>Most visible expense pattern right now.</p>
              </div>
              <div className='rounded-[20px] border border-white/10 bg-white/8 p-3 backdrop-blur-xl sm:rounded-[26px] sm:p-4 xl:min-h-[158px]'>
                <p className='text-xs font-semibold uppercase tracking-[0.22em] text-white/55'>Coverage</p>
                <p className='mt-2 text-lg font-semibold tracking-tight text-white sm:mt-3 sm:text-3xl'>{loading ? "--" : totalCategories}</p>
                <p className='mt-1.5 hidden text-[11px] leading-5 text-white/65 sm:mt-2 sm:block sm:text-sm'>Tracked income and expense categories.</p>
              </div>
            </div>
          </div>
        </section>

        <div className='grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-3 xl:gap-6'>
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <InfoCard
                icon={<IoMdCard />}
                label="Total Balance"
                value={formatCurrency(totalBalance)}
                tone="primary"
                description="What is currently left after combining your tracked income and expenses."
                badge="Available right now"
              />
              <InfoCard
                icon={<LuWalletMinimal />}
                label="Total Income"
                value={formatCurrency(totalIncome)}
                tone="success"
                description="Everything you have recorded coming in across your active categories."
                badge="Money in"
              />
              <InfoCard
                icon={<LuHandCoins />}
                label="Total Expense"
                value={formatCurrency(totalExpenses)}
                tone="danger"
                description="All outgoing money recorded so you can spot pressure early."
                badge="Money out"
              />
            </>
          )}
        </div>

        {loading ? (
          <SkeletonCard />
        ) : (
          <BudgetSnapshot
            budgetOverview={dashboardData?.budgetOverview}
            onOpenBudgets={() => navigate("/budgets")}
          />
        )}

        <div className='grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-2 xl:gap-6'>
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={totalBalance}
            totalIncome={totalIncome}
            totalExpense={totalExpenses}
          />

          <ExpenseTransaction
            transactions={dashboardData?.last30DaysExpenses?.transaction || []}
            onSeeMore={() => { navigate("/expense") }}
          />

          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transaction}
          />

          <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transaction?.slice(0, 4) || []}
            totalIncome={totalIncome}
          />

          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transaction || []}
            onSeeMore={() => navigate("/income")}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-2 xl:gap-6'>
          <CategoryPieChart
            data={dashboardData?.expenseCategories || {}}
            title="Expense Categories"
          />

          <CategoryPieChart
            data={dashboardData?.incomeCategories || {}}
            title="Income Categories"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home

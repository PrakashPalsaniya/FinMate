import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdCard } from "react-icons/io"
import { LuArrowDownRight, LuArrowUpRight, LuBadgeIndianRupee, LuHandCoins, LuWalletMinimal, LuSparkles, LuTrendingDown } from 'react-icons/lu'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import InfoCard from '../../components/Cards/InfoCard'
import SkeletonCard from '../../components/SkeletonCard'
import TabbedActivity from '../../components/Dashboard/TabbedActivity.jsx'
import FinanceOverview from '../../components/Dashboard/FinanceOverview.jsx'
import BudgetSnapshot from '../../components/Dashboard/BudgetSnapshot.jsx'
import CategoryPieChart from '../../components/Dashboard/CategoryPieChart.jsx'
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses.jsx'
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart.jsx'
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
      if (response.data) setDashboardData(response.data)
    } catch (error) {
      console.log("Dashboard fetch error:", error)
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
        <div className='page-header'>
          <div>
            <p className='page-eyebrow'>Portfolio Pulse</p>
            <h1 className='page-title'>{greeting}, {firstName}</h1>
            <p className='page-subtitle'>
                Here is the real-time status of your liquidity and spending behavior.
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <button className='btn-primary !px-6' onClick={() => navigate("/income")}>
              <LuArrowUpRight /> Add Income
            </button>
            <button className='btn-secondary !px-6' onClick={() => navigate("/expense")}>
              <LuArrowDownRight /> Track Expense
            </button>
          </div>
        </div>

        {/* Primary Metrics */}
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4'>
          {loading ? [1, 2, 3].map(i => <SkeletonCard key={i} />) : (
            <>
              <InfoCard
                icon={<IoMdCard />} label="Total Balance" value={formatCurrency(totalBalance)}
                tone="primary" description="Available liquidity" badge="Balance"
              />
              <InfoCard
                icon={<LuWalletMinimal />} label="Total Income" value={formatCurrency(totalIncome)}
                tone="success" description="Monthly inflow" badge="Income"
              />
              <InfoCard
                icon={<LuHandCoins />} label="Total Expense" value={formatCurrency(totalExpenses)}
                tone="danger" description="Monthly burn" badge="Expense"
              />
            </>
          )}
        </div>

        {/* Main Insights Grid */}
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px] xl:gap-6'>
          {/* Left Column: Charts & Activity */}
          <div className='space-y-4 xl:space-y-6'>
            {loading ? <SkeletonCard /> : (
              <FinanceOverview
                totalBalance={totalBalance}
                totalIncome={totalIncome}
                totalExpense={totalExpenses}
              />
            )}

            <TabbedActivity
              recentAll={dashboardData?.recentTransactions}
              recentIncome={dashboardData?.last60DaysIncome?.transaction}
              recentExpense={dashboardData?.last30DaysExpenses?.transaction}
              onSeeMoreAll={() => navigate("/expense")}
              onSeeMoreIncome={() => navigate("/income")}
              onSeeMoreExpense={() => navigate("/expense")}
            />
          </div>

          {/* Right Column: AI Insights & Budgets */}
          <div className='space-y-4 xl:space-y-5'>
            {/* Quick AI Metrics - Stacked Vertically */}
            <div className='flex flex-col gap-3'>
                <div className='card !bg-[#0f172a] text-white !p-4 border-white/5 shadow-xl'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-[10px] font-bold uppercase tracking-widest text-white/50'>Savings Rate</p>
                            <p className='mt-1 text-xl font-black text-white'>{loading ? "--" : `${savingsRate}%`}</p>
                        </div>
                        <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center text-primary">
                            <LuSparkles className="text-sm" />
                        </div>
                    </div>
                </div>
                <div className='card !bg-[#0f172a] text-white !p-4 border-white/5 shadow-xl'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-[10px] font-bold uppercase tracking-widest text-white/50'>Flow Volume</p>
                            <p className='mt-1 text-xl font-black text-white'>{loading ? "--" : formatCompactAmount(trackedVolume)}</p>
                        </div>
                        <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center text-accent">
                            <LuBadgeIndianRupee className="text-sm" />
                        </div>
                    </div>
                </div>
                <div className='card !bg-[#0f172a] text-white !p-4 border-white/5 shadow-xl'>
                    <div className='flex items-center justify-between'>
                        <div className='min-w-0 flex-1'>
                            <p className='text-[10px] font-bold uppercase tracking-widest text-white/50'>Top Category</p>
                            <p className='mt-1 text-lg font-bold text-white truncate'>{loading ? "..." : topExpenseCategory}</p>
                        </div>
                        <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center text-rose-400 shrink-0 ml-3">
                            <LuTrendingDown className="text-sm" />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? <SkeletonCard /> : (
              <BudgetSnapshot
                budgetOverview={dashboardData?.budgetOverview}
                onOpenBudgets={() => navigate("/budgets")}
              />
            )}

            <CategoryPieChart
              data={dashboardData?.expenseCategories || {}}
              title="Category Mix"
            />
          </div>
        </div>

        {/* Secondary Charts Row */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-6'>
          <Last30DaysExpenses data={dashboardData?.last30DaysExpenses?.transaction} />
          <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transaction?.slice(0, 4) || []}
            totalIncome={totalIncome}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home

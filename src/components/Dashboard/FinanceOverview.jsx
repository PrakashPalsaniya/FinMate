import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart'
import { CHART_COLORS, formatCurrency } from '../../utils/helper'

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const balanceData = [
    { name: "Balance", amount: totalBalance },
    { name: "Income", amount: totalIncome },
    { name: "Expenses", amount: totalExpense },
  ]

  return (
    <div className="card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Allocation</p>
          <h5 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Finance Overview</h5>
          <p className="mt-1.5 text-[13px] leading-6 text-slate-500 sm:mt-2 sm:text-sm">
            Compare what is coming in, what is going out, and what is left available.
          </p>
        </div>
      </div>

      <CustomPieChart
        data={balanceData}
        label="Available balance"
        totalAmount={formatCurrency(totalBalance)}
        colors={CHART_COLORS}
        showTextAnchor
      />
    </div>
  )
}

export default FinanceOverview

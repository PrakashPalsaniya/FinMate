import React from 'react'
import {
  LuBadgeIndianRupee,
  LuTriangleAlert,
  LuTrendingUp,
  LuWalletMinimal,
} from 'react-icons/lu'
import { formatCurrency } from '../../utils/helper'

const BudgetOverview = ({ summary }) => {
  const cards = [
    {
      label: 'Budgeted',
      value: formatCurrency(summary?.totalBudgeted || 0),
      helper: `${summary?.activeBudgets || 0} active categories`,
      icon: <LuWalletMinimal className='text-xl' />,
      tone: 'primary',
    },
    {
      label: 'Spent',
      value: formatCurrency(summary?.totalSpentThisMonth || 0),
      helper: 'Current month expense total',
      icon: <LuBadgeIndianRupee className='text-xl' />,
      tone: 'danger',
    },
    {
      label: 'Remaining',
      value: formatCurrency(summary?.totalRemaining || 0),
      helper: summary?.activeBudgets
        ? 'Budget room still available'
        : 'Create a budget to start tracking',
      icon: <LuTrendingUp className='text-xl' />,
      tone: 'success',
    },
    {
      label: 'Watch list',
      value: String((summary?.overBudgetCount || 0) + (summary?.closeToLimitCount || 0)),
      helper: `${summary?.overBudgetCount || 0} over budget, ${summary?.closeToLimitCount || 0} close`,
      icon: <LuTriangleAlert className='text-xl' />,
      tone: 'warning',
    },
  ]

  const toneStyles = {
    primary: 'border-cyan-100 bg-[linear-gradient(135deg,rgba(236,254,255,0.95),rgba(255,255,255,0.96))] text-cyan-700',
    success: 'border-emerald-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.95),rgba(255,255,255,0.96))] text-emerald-700',
    danger: 'border-rose-100 bg-[linear-gradient(135deg,rgba(255,241,242,0.95),rgba(255,255,255,0.96))] text-rose-700',
    warning: 'border-amber-100 bg-[linear-gradient(135deg,rgba(255,251,235,0.95),rgba(255,255,255,0.96))] text-amber-700',
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {cards.map((card) => (
        <div key={card.label} className='card !p-4'>
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400'>
                {card.label}
              </p>
              <p className='mt-3 text-[1.65rem] font-semibold tracking-tight text-slate-900'>
                {card.value}
              </p>
              <p className='mt-2 text-sm leading-6 text-slate-500'>{card.helper}</p>
            </div>

            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border ${toneStyles[card.tone]}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BudgetOverview

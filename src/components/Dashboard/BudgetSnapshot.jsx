import React from 'react'
import { LuArrowRight, LuPiggyBank } from 'react-icons/lu'
import { formatCurrency } from '../../utils/helper'

const BudgetSnapshot = ({ budgetOverview, onOpenBudgets }) => {
  const hasBudgets = Number(budgetOverview?.activeBudgets || 0) > 0

  return (
    <section className='card border-amber-100/50 bg-[linear-gradient(135deg,rgba(255,251,235,0.8),rgba(255,255,255,0.98))]'>
      <div className='flex flex-col gap-5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg'>
              <LuPiggyBank className='text-lg' />
            </div>
            <div>
              <p className='text-[10px] font-bold uppercase tracking-widest text-slate-400'>Monthly Budgets</p>
              <h2 className='text-sm font-bold text-slate-900'>
                {budgetOverview?.monthLabel || 'Current month'}
              </h2>
            </div>
          </div>
          <button 
            onClick={onOpenBudgets}
            className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-sm hover:bg-primary hover:text-white transition-colors'
          >
            <LuArrowRight className='text-sm' />
          </button>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <MiniStat label='Budgeted' value={formatCurrency(budgetOverview?.totalBudgeted || 0)} />
          <MiniStat label='Spent' value={formatCurrency(budgetOverview?.totalSpentThisMonth || 0)} />
        </div>

        {hasBudgets && (
          <div className='rounded-xl bg-amber-50/50 p-3'>
            <p className='text-[11px] leading-relaxed text-amber-900/70'>
               <span className='font-bold text-amber-900'>{budgetOverview.activeBudgets} active</span>. 
               {budgetOverview.overBudgetCount > 0 ? ` ${budgetOverview.overBudgetCount} exceeded limit.` : " All within parameters."}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

const MiniStat = ({ label, value }) => (
  <div className='rounded-xl border border-slate-100 bg-white p-3'>
    <p className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>{label}</p>
    <p className='mt-1 text-[15px] font-black tracking-tight text-slate-900'>{value}</p>
  </div>
)

export default BudgetSnapshot

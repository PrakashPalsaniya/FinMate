import React from 'react'
import { LuArrowRight, LuPiggyBank } from 'react-icons/lu'
import { formatCurrency } from '../../utils/helper'

const BudgetSnapshot = ({ budgetOverview, onOpenBudgets }) => {
  const hasBudgets = Number(budgetOverview?.activeBudgets || 0) > 0

  return (
    <section className='card border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,251,235,0.7),rgba(255,255,255,0.98))]'>
      <div className='flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex min-w-0 items-start gap-3'>
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-[0_22px_48px_-30px_rgba(245,158,11,0.6)]'>
            <LuPiggyBank className='text-xl' />
          </div>

          <div className='min-w-0'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400'>Monthly budgets</p>
            <h2 className='mt-1.5 text-base font-semibold tracking-tight text-slate-900 sm:mt-2 sm:text-lg'>
              {budgetOverview?.monthLabel || 'Current month'}
            </h2>
            <p className='mt-1.5 max-w-2xl text-[13px] leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6'>
              {hasBudgets
                ? `${budgetOverview.activeBudgets} budgets active, ${budgetOverview.overBudgetCount || 0} over budget, ${budgetOverview.closeToLimitCount || 0} close to limit.`
                : 'Set monthly category limits in the Budgets workspace and keep spending easier to control.'}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 sm:gap-3 lg:min-w-[520px] xl:grid-cols-4'>
          <MiniStat label='Budgeted' value={formatCurrency(budgetOverview?.totalBudgeted || 0)} />
          <MiniStat label='Spent' value={formatCurrency(budgetOverview?.totalSpentThisMonth || 0)} />
          <MiniStat label='Remaining' value={formatCurrency(budgetOverview?.totalRemaining || 0)} />
          <button
            type='button'
            className='flex min-h-[82px] flex-col items-start justify-between rounded-[22px] border border-slate-200/80 bg-white px-3.5 py-3.5 text-left transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_24px_50px_-36px_rgba(15,23,42,0.35)] sm:min-h-[92px] sm:rounded-[24px] sm:px-4 sm:py-4'
            onClick={onOpenBudgets}
          >
            <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400'>Open</p>
            <div className='flex w-full items-center justify-between gap-2'>
              <span className='text-[13px] font-semibold text-slate-900 sm:text-sm'>Budgets</span>
              <LuArrowRight className='text-base text-primary' />
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}

const MiniStat = ({ label, value }) => (
  <div className='rounded-[22px] border border-slate-200/80 bg-white px-3.5 py-3.5 sm:rounded-[24px] sm:px-4 sm:py-4'>
    <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
    <p className='mt-2 text-[15px] font-semibold tracking-tight text-slate-900 sm:mt-3 sm:text-lg'>{value}</p>
  </div>
)

export default BudgetSnapshot

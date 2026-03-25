import React from 'react'
import { LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu'
import { formatCurrency, getIconComponent } from '../../utils/helper'
import {
  getBudgetProgressWidth,
  getBudgetStatusMeta,
} from '../../utils/budgetConfig'

const BudgetList = ({ budgets = [], onEdit, onDelete, onCreate }) => {
  if (!budgets.length) {
    return (
      <div className='card flex flex-col items-start gap-4 border-dashed border-slate-300/90 bg-[linear-gradient(135deg,rgba(248,250,252,0.98),rgba(255,255,255,0.98))]'>
        <div>
          <p className='text-sm font-semibold text-slate-900'>No budgets for this month yet</p>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-500'>
            Create category budgets to see how much room is left before spending crosses your monthly plan.
          </p>
        </div>

        <button
          type='button'
          className='btn-primary !rounded-full !px-5 sm:!w-auto'
          onClick={onCreate}
        >
          <LuPlus className='text-base' />
          Create first budget
        </button>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
      {budgets.map((budget) => {
        const statusMeta = getBudgetStatusMeta(budget.status)
        const Icon = getIconComponent(budget.icon)
        const progressWidth = getBudgetProgressWidth(budget.usagePercentage)

        return (
          <section key={budget._id} className='card !p-4 sm:!p-5'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex min-w-0 items-start gap-3'>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700'>
                  <Icon className='text-xl' />
                </div>

                <div className='min-w-0'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <h3 className='text-lg font-semibold capitalize tracking-tight text-slate-900'>
                      {budget.category}
                    </h3>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${statusMeta.tone}`}>
                      {statusMeta.label}
                    </span>
                  </div>

                  <p className='mt-2 text-sm text-slate-500'>
                    Budget {formatCurrency(budget.amount)} for this month
                  </p>
                </div>
              </div>

              <div className='flex shrink-0 items-center gap-2'>
                <button
                  type='button'
                  className='inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-500 transition hover:text-slate-900'
                  onClick={() => onEdit(budget)}
                  aria-label={`Edit ${budget.category} budget`}
                >
                  <LuPencil className='text-base' />
                </button>
                <button
                  type='button'
                  className='inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100'
                  onClick={() => onDelete(budget._id)}
                  aria-label={`Delete ${budget.category} budget`}
                >
                  <LuTrash2 className='text-base' />
                </button>
              </div>
            </div>

            <div className='mt-5 grid grid-cols-2 gap-3'>
              <BudgetStat label='Spent' value={formatCurrency(budget.spent)} />
              <BudgetStat
                label={budget.overspend > 0 ? 'Over budget by' : 'Remaining'}
                value={formatCurrency(budget.overspend > 0 ? budget.overspend : budget.remaining)}
                highlight={budget.overspend > 0 ? 'danger' : 'success'}
              />
            </div>

            <div className='mt-5'>
              <div className='mb-2 flex items-center justify-between gap-3'>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>Usage</p>
                <p className='text-sm font-semibold text-slate-700'>{budget.usagePercentage}% used</p>
              </div>

              <div className='h-2.5 rounded-full bg-slate-100'>
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${statusMeta.progress}`}
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
            </div>

            {budget.note && (
              <div className='mt-4 rounded-[20px] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-600'>
                {budget.note}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

const BudgetStat = ({ label, value, highlight = 'neutral' }) => {
  const highlightClass =
    highlight === 'danger'
      ? 'text-rose-700'
      : highlight === 'success'
        ? 'text-emerald-700'
        : 'text-slate-900'

  return (
    <div className='rounded-[20px] border border-slate-200/80 bg-slate-50/70 px-4 py-3'>
      <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
      <p className={`mt-2 text-lg font-semibold tracking-tight ${highlightClass}`}>{value}</p>
    </div>
  )
}

export default BudgetList

import { TRANSACTION_CATEGORIES } from './transactionConfig'

export const BUDGET_CATEGORIES = TRANSACTION_CATEGORIES.expense

export const getCurrentMonthKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${year}-${month}`
}

export const formatBudgetMonthLabel = (monthKey) => {
  if (!monthKey) return 'Current month'

  const [year, month] = String(monthKey).split('-').map(Number)
  if (!year || !month) {
    return 'Current month'
  }

  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1))
}

const normalizeBudgetSource = (budget) =>
  budget && typeof budget === 'object' ? budget : {}

export const createBudgetFormState = (budget, defaultMonth = getCurrentMonthKey()) => {
  const source = normalizeBudgetSource(budget)

  return {
  category: source.category || '',
  amount:
    source.amount === undefined || source.amount === null
      ? ''
      : String(source.amount),
  month: source.month || defaultMonth,
  note: source.note || '',
  }
}

export const validateBudgetInput = (budget = {}) => {
  if (!String(budget.category || '').trim()) {
    return 'Category is required.'
  }

  if (
    budget.amount === undefined ||
    budget.amount === null ||
    String(budget.amount).trim() === '' ||
    Number.isNaN(Number(budget.amount)) ||
    Number(budget.amount) <= 0
  ) {
    return 'Amount should be a valid number greater than 0.'
  }

  if (!String(budget.month || '').trim()) {
    return 'Month is required.'
  }

  if (String(budget.note || '').trim().length > 160) {
    return 'Note should stay under 160 characters.'
  }

  return ''
}

export const getBudgetStatusMeta = (status) => {
  switch (status) {
    case 'over-budget':
      return {
        label: 'Over budget',
        tone: 'border-rose-200 bg-rose-50 text-rose-700',
        progress: 'bg-rose-500',
      }
    case 'close':
      return {
        label: 'Close to limit',
        tone: 'border-amber-200 bg-amber-50 text-amber-700',
        progress: 'bg-amber-500',
      }
    default:
      return {
        label: 'On track',
        tone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        progress: 'bg-emerald-500',
      }
  }
}

export const getBudgetProgressWidth = (usagePercentage) =>
  Math.max(0, Math.min(Number(usagePercentage || 0), 100))

import React, { useEffect, useState } from 'react'
import Input from '../inputs/Input'
import {
  BUDGET_CATEGORIES,
  createBudgetFormState,
} from '../../utils/budgetConfig'

const BudgetForm = ({
  initialData,
  onSubmit,
  submitLabel = 'Save budget',
  categories = BUDGET_CATEGORIES,
  selectedMonth,
}) => {
  const [budget, setBudget] = useState(() =>
    createBudgetFormState(initialData, selectedMonth)
  )

  useEffect(() => {
    setBudget(createBudgetFormState(initialData, selectedMonth))
  }, [initialData, selectedMonth])

  const categoryOptions = Array.from(
    new Set([...(categories || []), ...BUDGET_CATEGORIES])
  )

  const handleChange = (key, value) => {
    setBudget((current) => ({ ...current, [key]: value }))
  }

  return (
    <div>
      <div className='grid gap-4 md:grid-cols-2'>
        <div className='input-group'>
          <label className='input-label'>Category</label>
          <div className='input-box'>
            <select
              value={budget.category}
              onChange={({ target }) => handleChange('category', target.value)}
              className='input-control'
            >
              <option value=''>Select category</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label='Monthly limit'
          type='number'
          placeholder='6000'
          value={budget.amount}
          onChange={({ target }) => handleChange('amount', target.value)}
        />
      </div>

      <div className='grid gap-4 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]'>
        <Input
          label='Month'
          type='month'
          value={budget.month}
          onChange={({ target }) => handleChange('month', target.value)}
        />

        <div className='input-group'>
          <label className='input-label'>Note</label>
          <div className='input-box !items-start'>
            <textarea
              value={budget.note}
              onChange={({ target }) => handleChange('note', target.value)}
              placeholder='Optional note for this budget'
              className='input-control min-h-[120px] resize-none py-3'
              maxLength={160}
            />
          </div>
          <p className='mt-2 text-xs text-slate-400'>{String(budget.note || '').length}/160</p>
        </div>
      </div>

      <div className='mt-6 flex justify-stretch sm:justify-end'>
        <button
          type='button'
          className='btn-primary !rounded-full !px-5 sm:!w-auto'
          onClick={() => onSubmit(budget)}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  )
}

export default BudgetForm

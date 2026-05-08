import React, { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { LuPiggyBank, LuPlus } from 'react-icons/lu'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATH } from '../../utils/apiPath'
import {
  BUDGET_CATEGORIES,
  formatBudgetMonthLabel,
  getCurrentMonthKey,
  validateBudgetInput,
} from '../../utils/budgetConfig'
import BudgetOverview from '../../components/Budgets/BudgetOverview'
import BudgetList from '../../components/Budgets/BudgetList'
import Modal from '../../components/Modal'
import BudgetForm from '../../components/Budgets/BudgetForm'
import DeleteAlert from '../../components/DeleteAlert'
import { formatCurrency } from '../../utils/helper'
import { getUserFriendlyErrorMessage } from '../../utils/errorMessage'

const EMPTY_BUDGET_DATA = {
  month: '',
  monthLabel: '',
  summary: {
    month: '',
    monthLabel: '',
    activeBudgets: 0,
    totalBudgeted: 0,
    totalSpent: 0,
    totalRemaining: 0,
    totalOverspent: 0,
    overBudgetCount: 0,
    closeToLimitCount: 0,
    totalSpentThisMonth: 0,
    unbudgetedSpend: 0,
  },
  budgets: [],
  availableCategories: [],
}

const Budgets = () => {
  useUserAuth()

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey())
  const [budgetData, setBudgetData] = useState(EMPTY_BUDGET_DATA)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingBudget, setEditingBudget] = useState(null)
  const [openBudgetModal, setOpenBudgetModal] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null })

  const fetchBudgets = useCallback(async (month) => {
    setLoading(true)
    setError('')

    try {
      const response = await axiosInstance.get(API_PATH.BUDGETS.GET_ALL, {
        params: { month },
      })

      setBudgetData({
        ...EMPTY_BUDGET_DATA,
        ...(response.data || {}),
        summary: {
          ...EMPTY_BUDGET_DATA.summary,
          ...(response.data?.summary || {}),
        },
        budgets: Array.isArray(response.data?.budgets) ? response.data.budgets : [],
        availableCategories: Array.isArray(response.data?.availableCategories)
          ? response.data.availableCategories
          : [],
      })
    } catch (requestError) {
      console.error('Error loading budgets', requestError)
      setBudgetData(EMPTY_BUDGET_DATA)
      setError('Could not load budgets right now. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBudgets(selectedMonth)
  }, [fetchBudgets, selectedMonth])

  const availableCategories = useMemo(() => {
    const categories = budgetData?.availableCategories || []
    return Array.from(new Set([...categories, ...BUDGET_CATEGORIES]))
  }, [budgetData?.availableCategories])

  const closeBudgetModal = () => {
    setOpenBudgetModal(false)
    setEditingBudget(null)
  }

  const handleSubmitBudget = async (budget) => {
    const validationError = validateBudgetInput(budget)
    if (validationError) {
      toast.error(validationError)
      return
    }

    try {
      if (editingBudget?._id) {
        await axiosInstance.put(API_PATH.BUDGETS.UPDATE(editingBudget._id), budget)
        toast.success('Budget updated successfully')
      } else {
        await axiosInstance.post(API_PATH.BUDGETS.CREATE, budget)
        toast.success('Budget created successfully')
      }

      closeBudgetModal()
      const targetMonth = budget.month || selectedMonth

      if (targetMonth !== selectedMonth) {
        setSelectedMonth(targetMonth)
      } else {
        fetchBudgets(targetMonth)
      }
    } catch (requestError) {
      console.error('Error saving budget', requestError)
      toast.error(
        getUserFriendlyErrorMessage(requestError, {
          fallback: 'Failed to save budget. Please try again later.',
        })
      )
    }
  }

  const handleDeleteBudget = async (budgetId) => {
    try {
      await axiosInstance.delete(API_PATH.BUDGETS.DELETE(budgetId))
      setOpenDeleteAlert({ show: false, data: null })
      toast.success('Budget deleted successfully')
      fetchBudgets(selectedMonth)
    } catch (requestError) {
      console.error('Error deleting budget', requestError)
      toast.error(
        getUserFriendlyErrorMessage(requestError, {
          fallback: 'Failed to delete budget. Please try again later.',
        })
      )
    }
  }

  const summary = budgetData?.summary
  const budgets = Array.isArray(budgetData?.budgets) ? budgetData.budgets : []

  return (
    <DashboardLayout activeMenu='Budgets'>
      <div className='page-shell'>
        <div className='page-header'>
          <div>
            <p className='page-eyebrow'>Financial Planning</p>
            <h1 className='page-title'>Budgets</h1>
            <p className='page-subtitle'>
              Establish monthly guardrails. Define your limits across categories and monitor consumption.
            </p>
          </div>

          <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center'>
            <div className='group relative'>
                <input
                    type='month'
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                    className='input-box !mt-0 !rounded-full !py-2 !px-5 bg-white/50 backdrop-blur-sm transition-all focus:bg-white'
                />
            </div>

            <button
              type='button'
              className='btn-primary !px-6'
              onClick={() => {
                setEditingBudget(null)
                setOpenBudgetModal(true)
              }}
            >
              <LuPlus className='text-lg' />
              Add Budget
            </button>
          </div>
        </div>

        <div className='card group border-amber-100 bg-[linear-gradient(135deg,rgba(245,158,11,0.05),rgba(255,255,255,0.8))]'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex items-center gap-3.5'>
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md'>
                <LuPiggyBank className='text-xl' />
              </div>
              <div>
                <p className='text-sm font-bold tracking-tight text-slate-900'>
                  {budgetData?.monthLabel || formatBudgetMonthLabel(selectedMonth)} Snapshot
                </p>
                <p className='text-xs font-medium text-slate-500'>
                  {summary?.activeBudgets
                    ? `${summary.activeBudgets} active benchmarks, ${formatCurrency(summary.totalBudgeted || 0)} allocated.`
                    : 'Awaiting your first budget allocation for this cycle.'}
                </p>
              </div>
            </div>

            {summary?.unbudgetedSpend > 0 && (
              <div className='rounded-xl border border-amber-200 bg-white/80 px-4 py-2 text-xs font-bold text-slate-600 backdrop-blur-md'>
                <span className='text-slate-900'>
                  {formatCurrency(summary.unbudgetedSpend)}
                </span>{' '}
                unmonitored leakage.
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className='card flex min-h-[220px] flex-col items-center justify-center text-center'>
            <div className='flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-primary/15 border-t-primary' />
            <p className='mt-5 text-base font-semibold text-slate-900'>Loading budgets...</p>
            <p className='mt-2 text-sm text-slate-500'>Preparing your monthly budget view.</p>
          </div>
        ) : error ? (
          <div className='card border-rose-200/80 bg-[linear-gradient(135deg,rgba(254,242,242,0.95),rgba(255,255,255,0.96))]'>
            <p className='text-base font-semibold text-rose-700'>Budget view unavailable</p>
            <p className='mt-2 text-sm leading-6 text-rose-600'>{error}</p>
          </div>
        ) : (
          <>
            <BudgetOverview summary={summary} />
            <BudgetList
              budgets={budgets}
              onCreate={() => {
                setEditingBudget(null)
                setOpenBudgetModal(true)
              }}
              onEdit={(budget) => {
                setEditingBudget(budget)
                setOpenBudgetModal(true)
              }}
              onDelete={(budgetId) => {
                setOpenDeleteAlert({ show: true, data: budgetId })
              }}
            />
          </>
        )}

        <Modal
          isOpen={openBudgetModal}
          onClose={closeBudgetModal}
          title={editingBudget ? 'Edit Budget' : 'Add Budget'}
        >
          <BudgetForm
            initialData={editingBudget}
            selectedMonth={editingBudget?.month || selectedMonth}
            categories={availableCategories}
            onSubmit={handleSubmitBudget}
            submitLabel={editingBudget ? 'Save changes' : 'Add budget'}
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title='Delete Budget'
        >
          <DeleteAlert
            content='Are you sure you want to delete this monthly budget?'
            onDelete={() => handleDeleteBudget(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Budgets

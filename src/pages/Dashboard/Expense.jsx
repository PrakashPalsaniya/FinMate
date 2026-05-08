import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LuArrowDownRight, LuHandCoins } from 'react-icons/lu'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { API_PATH } from '../../utils/apiPath'
import axiosInstance from '../../utils/axiosInstance'
import ExpenseOverview from '../../components/Expense/ExpenseOverview'
import Modal from '../../components/Modal'
import AddExpenseForm from '../../components/Expense/AddExpenseForm'
import ExpenseList from '../../components/Expense/ExpenseList'
import DeleteAlert from '../../components/DeleteAlert'
import { validateTransactionInput } from '../../utils/transactionConfig'
import { getUserFriendlyErrorMessage } from '../../utils/errorMessage'

const Expense = () => {
  useUserAuth()

  const [expenseData, setExpenseData] = useState([])
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null })
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  const fetchExpenseDetails = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`${API_PATH.EXPENSE.GET_ALL_EXPENSE}`)

      if (response.data) {
        setExpenseData(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  const closeExpenseModal = () => {
    setOpenAddExpenseModal(false)
    setEditingExpense(null)
  }

  const handleExpenseSubmit = async (expense) => {
    const validationError = validateTransactionInput(expense)
    if (validationError) {
      toast.error(validationError)
      return
    }

    try {
      if (editingExpense?._id) {
        await axiosInstance.put(API_PATH.EXPENSE.UPDATE_EXPENSE(editingExpense._id), expense)
        toast.success("Expense updated successfully")
      } else {
        await axiosInstance.post(API_PATH.EXPENSE.ADD_EXPENSE, expense)
        toast.success("Expense added successfully")
      }

      closeExpenseModal()
      fetchExpenseDetails()
    } catch (error) {
      console.error("Error saving expense", error.response?.data?.message || error.message)
      toast.error(
        getUserFriendlyErrorMessage(error, {
          fallback: "Failed to save expense. Please try again later.",
        })
      )
    }
  }

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATH.EXPENSE.DELETE_EXPENSE(id))

      setOpenDeleteAlert({ show: false, data: null })
      toast.success("Expense details deleted successfully")
      fetchExpenseDetails()
    } catch (error) {
      console.error("Error deleting expense", error.response?.data?.message || error.message)
    }
  }

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.EXPENSE.DOWNLOAD_EXPENSE, { responseType: "blob" })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "expense_details.xlsx")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading expense details", error.message)
      toast.error("Failed to download expense details")
    }
  }

  useEffect(() => {
    fetchExpenseDetails()
  }, [fetchExpenseDetails])

  return (
    <DashboardLayout activeMenu="Expense">
      <div className='page-shell'>
        <div className='page-header'>
          <div>
            <p className='page-eyebrow'>Capital Outflow</p>
            <h1 className='page-title'>Expenses</h1>
            <p className='page-subtitle'>
              Maintain a strict overview of your liquidity flow. Identify spending leakage and optimize your monthly burn rate.
            </p>
          </div>

          <button
            className='btn-primary !px-6'
            onClick={() => {
              setEditingExpense(null)
              setOpenAddExpenseModal(true)
            }}
          >
            <LuArrowDownRight className='text-lg' />
            Add Expense
          </button>
        </div>

        <div className='card group border-rose-100 bg-[linear-gradient(135deg,rgba(244,63,94,0.05),rgba(255,255,255,0.8))]'>
          <div className='flex items-center gap-3.5'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500 text-white shadow-md'>
              <LuHandCoins className='text-xl' />
            </div>
            <div>
              <p className='text-sm font-bold text-slate-900'>Burn Rate Analysis</p>
              <p className='text-xs font-medium text-slate-500'>Proactive tracking helps prevent over-budget situations before they occur.</p>
            </div>
          </div>
        </div>

        <ExpenseOverview
          transactions={expenseData}
          onExpenseIncome={() => {
            setEditingExpense(null)
            setOpenAddExpenseModal(true)
          }}
        />

        <ExpenseList
          transactions={expenseData}
          onEdit={(expense) => {
            setEditingExpense(expense)
            setOpenAddExpenseModal(true)
          }}
          onDelete={(id) => {
            setOpenDeleteAlert({ show: true, data: id })
          }}
          onDownload={handleDownloadExpenseDetails}
        />

        <Modal
          isOpen={openAddExpenseModal}
          onClose={closeExpenseModal}
          title={editingExpense ? "Edit Expense" : "Add Expense"}
        >
          <AddExpenseForm
            onSubmit={handleExpenseSubmit}
            initialData={editingExpense}
            submitLabel={editingExpense ? "Save changes" : "Add expense"}
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense detail?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Expense

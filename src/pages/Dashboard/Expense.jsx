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
      <div className="page-shell">
        <div className='page-header'>
          <div>
            <p className='page-eyebrow'>Spending tracker</p>
            <h1 className='page-title'>Expenses</h1>
            <p className='page-subtitle'>
              Stay ahead of daily outflow with a cleaner view of every expense, trend, and category.
            </p>
          </div>

          <button
            className='btn-primary !rounded-full !px-5 sm:!w-auto'
            onClick={() => {
              setEditingExpense(null)
              setOpenAddExpenseModal(true)
            }}
          >
            <LuArrowDownRight className='text-base' />
            Add expense
          </button>
        </div>

        <div className='card bg-[linear-gradient(135deg,rgba(244,63,94,0.07),rgba(255,255,255,0.92))]'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-[0_22px_48px_-30px_rgba(244,63,94,0.72)]'>
              <LuHandCoins className='text-xl' />
            </div>
            <div>
              <p className='text-sm font-semibold text-slate-900'>Spend with more awareness</p>
              <p className='text-sm text-slate-500'>Catch patterns early and keep your budget decisions grounded.</p>
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

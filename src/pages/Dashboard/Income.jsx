import React, { useCallback, useEffect, useState } from 'react'
import toast from "react-hot-toast"
import { LuArrowUpRight, LuWalletMinimal } from 'react-icons/lu'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from '../../components/Income/IncomeOverview'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATH } from '../../utils/apiPath'
import Modal from '../../components/Modal'
import AddIncomeForm from '../../components/Income/AddIncomeForm'
import IncomeList from '../../components/Income/IncomeList'
import DeleteAlert from '../../components/DeleteAlert'
import { useUserAuth } from '../../hooks/useUserAuth'
import { validateTransactionInput } from '../../utils/transactionConfig'
import { getUserFriendlyErrorMessage } from '../../utils/errorMessage'

const Income = () => {
  useUserAuth()

  const [incomeData, setIncomeData] = useState([])
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null })
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false)
  const [editingIncome, setEditingIncome] = useState(null)

  const fetchIncomeDetails = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`${API_PATH.INCOME.GET_ALL_INCOME}`)

      if (response.data) {
        setIncomeData(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  const closeIncomeModal = () => {
    setOpenAddIncomeModal(false)
    setEditingIncome(null)
  }

  const handleIncomeSubmit = async (income) => {
    const validationError = validateTransactionInput(income)
    if (validationError) {
      toast.error(validationError)
      return
    }

    try {
      if (editingIncome?._id) {
        await axiosInstance.put(API_PATH.INCOME.UPDATE_INCOME(editingIncome._id), income)
        toast.success("Income updated successfully")
      } else {
        await axiosInstance.post(API_PATH.INCOME.ADD_INCOME, income)
        toast.success("Income added successfully")
      }

      closeIncomeModal()
      fetchIncomeDetails()
    } catch (error) {
      console.error("Error saving income", error.response?.data?.message || error.message)
      toast.error(
        getUserFriendlyErrorMessage(error, {
          fallback: "Failed to save income. Please try again later.",
        })
      )
    }
  }

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATH.INCOME.DELETE_INCOME(id))

      setOpenDeleteAlert({ show: false, data: null })
      toast.success("Income details deleted successfully")
      fetchIncomeDetails()
    } catch (error) {
      console.error("Error deleting income", error.response?.data?.message || error.message)
    }
  }

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.INCOME.DOWNLOAD_INCOME, { responseType: "blob" })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "income_details.xlsx")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading income details", error.message)
      toast.error("Failed to download income details")
    }
  }

  useEffect(() => {
    fetchIncomeDetails()
  }, [fetchIncomeDetails])

  return (
    <DashboardLayout activeMenu="Income">
      <div className='page-shell'>
        <div className='page-header'>
          <div>
            <p className='page-eyebrow'>Income tracking</p>
            <h1 className='page-title'>Income</h1>
            <p className='page-subtitle'>
              Keep your earnings clean, visible, and easy to review so your balance always has context.
            </p>
          </div>

          <button
            className='btn-primary !rounded-full !px-5 sm:!w-auto'
            onClick={() => {
              setEditingIncome(null)
              setOpenAddIncomeModal(true)
            }}
          >
            <LuArrowUpRight className='text-base' />
            Add income
          </button>
        </div>

        <div className='card bg-[linear-gradient(135deg,rgba(15,118,110,0.08),rgba(255,255,255,0.92))]'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_22px_48px_-30px_rgba(15,118,110,0.72)]'>
              <LuWalletMinimal className='text-xl' />
            </div>
            <div>
              <p className='text-sm font-semibold text-slate-900'>Income sources at a glance</p>
              <p className='text-sm text-slate-500'>Track every stream so your growth is easier to trust.</p>
            </div>
          </div>
        </div>

        <IncomeOverview
          transactions={incomeData}
          onAddIncome={() => {
            setEditingIncome(null)
            setOpenAddIncomeModal(true)
          }}
        />

        <IncomeList
          transactions={incomeData}
          onEdit={(income) => {
            setEditingIncome(income)
            setOpenAddIncomeModal(true)
          }}
          onDelete={(id) => {
            setOpenDeleteAlert({ show: true, data: id })
          }}
          onDownload={handleDownloadIncomeDetails}
        />

        <Modal
          isOpen={openAddIncomeModal}
          onClose={closeIncomeModal}
          title={editingIncome ? "Edit Income" : "Add Income"}
        >
          <AddIncomeForm
            onSubmit={handleIncomeSubmit}
            initialData={editingIncome}
            submitLabel={editingIncome ? "Save changes" : "Add income"}
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income detail?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Income

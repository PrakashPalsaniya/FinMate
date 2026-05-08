import React from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import { formatDate } from '../../utils/helper'

const ExpenseList = ({ transactions, onDelete, onDownload, onEdit }) => {
  return (
    <div className="card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Expense library</p>
                <h5 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">All Expenses</h5>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Review every outgoing transaction and export the full list whenever you need it.
                </p>
            </div>

            <button className="card-btn self-start" onClick={onDownload}>
                <LuDownload className='text-base' /> Download
            </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {transactions?.length ? transactions.map((expense) => (
                <TransactionInfoCard
                    key={expense._id}
                    title={expense.title || expense.category}
                    icon={expense.category}
                    date={formatDate(expense.date)}
                    amount={expense.amount}
                    type="expense"
                    onEdit={onEdit ? () => onEdit(expense) : undefined}
                    onDelete={() => onDelete(expense._id)}
                />
            )) : (
                <div className='rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center text-sm text-slate-500 md:col-span-2'>
                    No expenses recorded yet. Start adding entries to build your history.
                </div>
            )}
        </div>
    </div>
  )
}

export default ExpenseList

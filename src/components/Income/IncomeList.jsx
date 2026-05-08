import React from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import { formatDate } from '../../utils/helper'

const IncomeList = ({ transactions, onDelete, onDownload, onEdit }) => {
  return (
    <div className="card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Income library</p>
                <h5 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Income Sources</h5>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Keep every source tidy so your earnings stay easy to review and export.
                </p>
            </div>

            <button className="card-btn self-start" onClick={onDownload}>
                <LuDownload className='text-base' /> Download
            </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {transactions?.length ? transactions.map((income) => (
                <TransactionInfoCard
                    key={income._id}
                    title={income.title || income.category}
                    icon={income.category}
                    date={formatDate(income.date)}
                    amount={income.amount}
                    type="income"
                    onEdit={onEdit ? () => onEdit(income) : undefined}
                    onDelete={() => onDelete(income._id)}
                />
            )) : (
                <div className='rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center text-sm text-slate-500 md:col-span-2'>
                    No income entries recorded yet. Add your first source to get started.
                </div>
            )}
        </div>
    </div>
  )
}

export default IncomeList

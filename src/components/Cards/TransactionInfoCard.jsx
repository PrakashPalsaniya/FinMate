import React from 'react'
import { LuArrowDownRight, LuArrowUpRight, LuPencilLine, LuTrash2, LuUtensils } from 'react-icons/lu'
import { formatCurrency, getExpenseIcon, getIncomeIcon } from '../../utils/helper'

const AMOUNT_STYLES = {
    income: "bg-emerald-50 text-emerald-700",
    expense: "bg-rose-50 text-rose-700",
}

const TransactionInfoCard = ({ title, icon, date, amount, type, hideDeleteBtn, onDelete, onEdit }) => {
    const renderIcon = () => {
        if (icon && typeof icon === 'string') {
            if (type === 'income') {
                const IconComponent = getIncomeIcon(icon)
                return <IconComponent />
            }

            if (type === 'expense') {
                const IconComponent = getExpenseIcon(icon)
                return <IconComponent />
            }
        }

        return <LuUtensils />
    }

    const amountStyle = AMOUNT_STYLES[type] || AMOUNT_STYLES.expense

    return (
        <div className='group relative mt-2 flex items-start gap-2.5 rounded-[20px] border border-transparent bg-slate-50/70 p-2.5 transition hover:-translate-y-0.5 hover:border-slate-200/80 hover:bg-white sm:items-center sm:gap-3 sm:rounded-[22px] sm:p-3'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-base text-slate-700 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.4)] sm:h-12 sm:w-12 sm:text-lg'>
                {renderIcon()}
            </div>

            <div className='flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3'>
                <div className='min-w-0 flex-1'>
                    <p className='truncate text-[13px] font-semibold text-slate-800 sm:text-sm'>{title || "Untitled transaction"}</p>
                    <p className='mt-1 text-xs text-slate-500'>{date}</p>
                </div>

                <div className='flex w-full items-center justify-between gap-2 sm:w-auto sm:shrink-0 sm:justify-end'>
                    {onEdit && (
                        <button
                            className='inline-flex h-9 w-9 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-sky-50 hover:text-sky-600 sm:h-10 sm:w-10'
                            onClick={onEdit}
                            aria-label="Edit transaction"
                        >
                            <LuPencilLine size={17} />
                        </button>
                    )}

                    {!hideDeleteBtn && (
                        <button
                            className='inline-flex h-9 w-9 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 sm:h-10 sm:w-10'
                            onClick={onDelete}
                            aria-label="Delete transaction"
                        >
                            <LuTrash2 size={17} />
                        </button>
                    )}

                    <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold sm:gap-2 sm:px-3 sm:py-2 sm:text-xs ${amountStyle}`}>
                        <span className='truncate'>{formatCurrency(amount)}</span>
                        {type === "income" ? (
                            <LuArrowUpRight className='text-[13px] sm:text-sm' />
                        ) : (
                            <LuArrowDownRight className='text-[13px] sm:text-sm' />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionInfoCard

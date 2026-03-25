import React from 'react'
import moment from 'moment'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'

const ExpenseTransaction = ({ transactions, onSeeMore }) => {
    return (
        <div className='card'>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Spending watch</p>
                    <h5 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Recent Expenses</h5>
                    <p className="mt-1.5 text-[13px] leading-6 text-slate-500 sm:mt-2 sm:text-sm">
                        Keep a close eye on your latest outflow so surprises stay small.
                    </p>
                </div>

                <button className='card-btn cursor-pointer self-start' onClick={onSeeMore}>
                    See all <LuArrowRight className="text-base" />
                </button>
            </div>

            <div className="mt-4 sm:mt-6">
                {transactions && transactions.length > 0 ? (
                    transactions.slice(0, 4).map((expense) => (
                        <TransactionInfoCard
                            key={expense._id}
                            title={expense.title || expense.category}
                            icon={expense.category}
                            date={moment(expense.date).format("Do MMM YYYY")}
                            amount={expense.amount}
                            type="expense"
                            hideDeleteBtn
                        />
                    ))
                ) : (
                    <div className='mt-3 rounded-[22px] border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center text-[13px] text-slate-500 sm:mt-4 sm:rounded-[24px] sm:px-5 sm:py-10 sm:text-sm'>
                        No recent expenses yet. Add one and this view will start telling the story.
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExpenseTransaction

import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import { formatDate } from '../../utils/helper'

const RecentTransactions = ({ transactions, onSeeMore }) => {
    return (
        <div className="card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Recent activity</p>
                    <h5 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Recent Transactions</h5>
                    <p className="mt-1.5 text-[13px] leading-6 text-slate-500 sm:mt-2 sm:text-sm">
                        The newest money movement across your income and expense history.
                    </p>
                </div>

                <button className='card-btn cursor-pointer self-start' onClick={onSeeMore}>
                    See all <LuArrowRight className="text-base" />
                </button>
            </div>

            <div className="mt-4 sm:mt-6">
                {transactions && transactions.length > 0 ? (
                    transactions.slice(0, 5).map((item) => (
                        <TransactionInfoCard
                            key={item._id}
                            title={item.title || item.category}
                            icon={item.category}
                            date={formatDate(item.date)}
                            amount={item.amount}
                            type={item.type}
                            hideDeleteBtn
                        />
                    ))
                ) : (
                    <div className='mt-3 rounded-[22px] border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center text-[13px] text-slate-500 sm:mt-4 sm:rounded-[24px] sm:px-5 sm:py-10 sm:text-sm'>
                        No recent transactions yet. Your latest activity will show up here.
                    </div>
                )}
            </div>
        </div>
    )
}

export default RecentTransactions

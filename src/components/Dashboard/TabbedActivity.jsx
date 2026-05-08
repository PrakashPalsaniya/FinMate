import React, { useState } from 'react'
import { LuArrowRight, LuListTodo, LuTrendingDown, LuTrendingUp } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'

const TabbedActivity = ({ recentAll, recentIncome, recentExpense, onSeeMoreAll, onSeeMoreIncome, onSeeMoreExpense }) => {
    const [activeTab, setActiveTab] = useState('all')

    const tabs = [
        { id: 'all', label: 'All', icon: <LuListTodo className="text-sm" /> },
        { id: 'income', label: 'Income', icon: <LuTrendingUp className="text-sm" /> },
        { id: 'expense', label: 'Expenses', icon: <LuTrendingDown className="text-sm" /> },
    ]

    const getActiveData = () => {
        if (activeTab === 'income') return recentIncome || []
        if (activeTab === 'expense') return recentExpense || []
        return recentAll || []
    }

    const getSeeMoreAction = () => {
        if (activeTab === 'income') return onSeeMoreIncome
        if (activeTab === 'expense') return onSeeMoreExpense
        return onSeeMoreAll
    }

    return (
        <div className="card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Activity Center</p>
                    <h5 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Recent Transactions</h5>
                </div>

                <div className="flex rounded-full bg-slate-100/80 p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                                activeTab === tab.id
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-5 space-y-1">
                {getActiveData().length > 0 ? (
                    getActiveData().slice(0, 5).map((item) => (
                        <TransactionInfoCard
                            key={item._id}
                            title={item.title || item.category}
                            icon={item.category}
                            date={item.date}
                            amount={item.amount}
                            type={item.type || (activeTab === 'income' ? 'income' : 'expense')}
                            hideDeleteBtn
                        />
                    ))
                ) : (
                    <div className='rounded-[22px] border border-dashed border-slate-200 bg-slate-50/70 px-4 py-10 text-center text-sm text-slate-500'>
                        No transactions found in this category.
                    </div>
                )}
            </div>

            <button 
                className='card-btn mt-5 w-full justify-center !rounded-xl border-slate-200/60 bg-slate-50/50 py-3 text-slate-600 hover:bg-white' 
                onClick={getSeeMoreAction()}
            >
                View full history <LuArrowRight className="text-base" />
            </button>
        </div>
    )
}

export default TabbedActivity

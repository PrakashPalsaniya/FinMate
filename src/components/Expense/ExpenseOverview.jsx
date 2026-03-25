import React, { useEffect, useState } from 'react'
import { prepareExpenseLineChartData } from '../../utils/helper'
import { LuPlus } from 'react-icons/lu'
import CustomLineChart from '../Charts/CustomLineChart'

const ExpenseOverview = ({ transactions, onExpenseIncome }) => {

    const [chartData, setChartData] = useState([])

    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions)
        setChartData(result)

        return () => { }
    }, [transactions])

    return (
        <div className="card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h5 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Expense Overview</h5>
                    <p className="mt-1.5 text-[13px] leading-6 text-slate-500 sm:text-sm">
                        Track your spending trends over time and gain insights over your money.
                    </p>
                </div>

                <button className="add-btn self-start" onClick={onExpenseIncome}>
                    <LuPlus className='text-lg' />
                    Add Expense
                </button>
            </div>

            <div className="mt-5 sm:mt-8">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    )
}

export default ExpenseOverview

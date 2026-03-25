import React, { useEffect, useState } from 'react'
import { prepareIncomeBarChartData } from '../../utils/helper'
import { LuPlus } from 'react-icons/lu'
import CustomBarChart from '../Charts/CustomBarChart'

const IncomeOverview = ({ transactions, onAddIncome }) => {

    const [chartData, setChartData] = useState([])

    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions)
        setChartData(result)

        return () => { }
    }, [transactions])

    return (
        <div className="card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h5 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Income Overview</h5>
                    <p className="mt-1.5 text-[13px] leading-6 text-slate-500 sm:text-sm">
                        Track your earning over time and track your income trends.
                    </p>
                </div>

                <button className="add-btn self-start" onClick={onAddIncome}>
                    <LuPlus className='text-lg' />
                    Add Income
                </button>
            </div>

            <div className="mt-5 sm:mt-8">
                <CustomBarChart data={chartData} dataKey={"category"} />
            </div>
        </div>
    )
}

export default IncomeOverview

import React, { useEffect, useState } from 'react'
import { prepareExpenseBarChartData } from '../../utils/helper'
import CustomBarChart from '../Charts/CustomBarChart'

const Last30DaysExpenses = ({ data }) => {

    const [chartData, setChartData] = useState([])

    useEffect(() => {
        const result = prepareExpenseBarChartData(data)
        setChartData(result)

        return () => { }
    }, [data])


    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Trend</p>
                    <h5 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Last 30 Days Expense</h5>
                </div>
            </div>

            <CustomBarChart data={chartData} dataKey={"category"} />
        </div>
    )
}

export default Last30DaysExpenses

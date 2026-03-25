import React, { useEffect, useState } from 'react'
import CustomPieChart from '../Charts/CustomPieChart'
import { CHART_COLORS, formatCurrency } from '../../utils/helper'

const RecentIncomeWithChart = ({ data, totalIncome }) => {
    const [chartData, setChartData] = useState([])

    useEffect(() => {
      const dataArr = data.map((item) => ({
          name: item?.category,
          amount: item?.amount,
      }))

      setChartData(dataArr)
    }, [data])

    return (
        <div className="card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Income mix</p>
                    <h5 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Last 60 Days Income</h5>
                    <p className="mt-1.5 text-[13px] leading-6 text-slate-500 sm:mt-2 sm:text-sm">
                        See which income streams are contributing most recently.
                    </p>
                </div>
            </div>

            <CustomPieChart
                data={chartData}
                label="Total income"
                totalAmount={formatCurrency(totalIncome)}
                showTextAnchor
                colors={CHART_COLORS}
            />
        </div>
    )
}

export default RecentIncomeWithChart

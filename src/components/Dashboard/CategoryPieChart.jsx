import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart'
import { CHART_COLORS } from '../../utils/helper'

const CategoryPieChart = ({ data, title }) => {
    const chartData = Object.keys(data || {}).map((key) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        amount: data[key],
    }))

    return (
        <div className="card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Categories</p>
                    <h5 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">{title}</h5>
                    <p className="mt-1.5 text-[13px] leading-6 text-slate-500 sm:mt-2 sm:text-sm">
                        Spot where your money is concentrated so adjustments feel easier to make.
                    </p>
                </div>
            </div>

            <CustomPieChart
                data={chartData}
                colors={CHART_COLORS}
            />
        </div>
    )
}

export default CategoryPieChart

import React from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART_COLORS, formatCompactAmount, formatCurrency } from '../../utils/helper'

const CustomBarChart = ({ data = [], dataKey }) => {
    const CustomBarTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null

        const item = payload[0].payload

        return (
            <div className='rounded-2xl border border-white/90 bg-[rgba(255,255,255,0.96)] p-3 shadow-[0_24px_50px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl'>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>
                    {item.category || item.month}
                </p>
                <p className='mt-2 text-sm font-semibold text-slate-800'>{formatCurrency(item.amount)}</p>
            </div>
        )
    }

    return (
        <div className="mt-4 h-[220px] sm:mt-6 sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barCategoryGap={18}>
                    <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" vertical={false} />
                    <XAxis
                        dataKey={dataKey}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => formatCompactAmount(value)}
                    />
                    <Tooltip cursor={{ fill: "rgba(15, 118, 110, 0.06)" }} content={<CustomBarTooltip />} />

                    <Bar dataKey="amount" radius={[14, 14, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomBarChart

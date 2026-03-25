import React from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCompactAmount, formatCurrency } from '../../utils/helper'

const CustomLineChart = ({ data = [] }) => {
    const CustomLineTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null

        const item = payload[0].payload

        return (
            <div className='rounded-2xl border border-white/90 bg-[rgba(255,255,255,0.96)] p-3 shadow-[0_24px_50px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl'>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>
                    {item.month || item.category}
                </p>
                <p className='mt-2 text-sm font-semibold text-slate-800'>{formatCurrency(item.amount)}</p>
            </div>
        )
    }

    return (
        <div className="mt-4 h-[220px] sm:mt-6 sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id='expenseGradient' x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor='#0f766e' stopOpacity={0.36} />
                            <stop offset="95%" stopColor='#0f766e' stopOpacity={0.02} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" vertical={false} />
                    <XAxis
                        dataKey="month"
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
                    <Tooltip content={<CustomLineTooltip />} />

                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke='#0f766e'
                        fill='url(#expenseGradient)'
                        strokeWidth={3}
                        dot={{ r: 3, fill: "#0f766e", strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: "#0f172a", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomLineChart

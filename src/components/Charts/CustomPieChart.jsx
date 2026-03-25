import React from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import CustomLegend from './CustomLegend'
import CustomToolTip from './CustomToolTip'

const CustomPieChart = ({ data = [], label, totalAmount, colors = [], showTextAnchor }) => {
  if (!data.length) {
    return (
      <div className='mt-4 flex h-[240px] items-center justify-center rounded-[22px] border border-dashed border-slate-200 bg-slate-50/70 px-4 text-center text-[13px] text-slate-500 sm:mt-6 sm:h-[320px] sm:rounded-[24px] sm:px-6 sm:text-sm'>
        No data yet. Add more transactions to unlock this breakdown.
      </div>
    )
  }

  return (
    <div className='mt-4 h-[260px] sm:mt-6 sm:h-[320px]'>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="46%"
            outerRadius={88}
            innerRadius={58}
            paddingAngle={2}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>

          <Tooltip content={<CustomToolTip />} />
          <Legend verticalAlign="bottom" content={<CustomLegend />} />

          {showTextAnchor && (
            <>
              <text
              x="50%"
                y="46%"
                dy={-10}
                textAnchor="middle"
                fill='#64748b'
                fontSize="11px"
                fontWeight="600"
              >
                {label}
              </text>
              <text
                x="50%"
                y="46%"
                dy={12}
                textAnchor="middle"
                fill='#0f172a'
                fontSize="20px"
                fontWeight="700"
              >
                {totalAmount}
              </text>
            </>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CustomPieChart

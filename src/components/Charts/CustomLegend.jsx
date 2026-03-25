import React from 'react'

const CustomLegend = ({ payload = [] }) => {
    if (!payload.length) return null

    return (
        <div className='mt-3 flex flex-wrap justify-start gap-1.5 sm:mt-4 sm:justify-center sm:gap-2'>
            {payload.map((entry, index) => (
                <div key={`legend-${index}`} className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50/85 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 sm:px-3 sm:text-xs">
                    <span className="h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5" style={{ backgroundColor: entry.color }} />
                    <span className='truncate'>{entry.value}</span>
                </div>
            ))}
        </div>
    )
}

export default CustomLegend

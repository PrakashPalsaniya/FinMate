import React from 'react'
import { formatCurrency } from '../../utils/helper'

const CustomToolTip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null

    const item = payload[0]

    return (
        <div className='rounded-2xl border border-white/90 bg-[rgba(255,255,255,0.96)] p-3 shadow-[0_24px_50px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl'>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{item.name}</p>
            <p className='mt-2 text-sm font-semibold text-slate-800'>
                {formatCurrency(item.value)}
            </p>
        </div>
    )
}

export default CustomToolTip

import React from 'react';
import { LuArrowRight } from 'react-icons/lu';

const InsightCard = ({
  title,
  icon,
  items = [],
  tone = 'neutral',
  numbered = false,
  className = '',
}) => {
  const toneClasses = {
    info: {
      header: 'text-sky-700',
      item: 'border-sky-100 bg-sky-50/80',
      marker: 'bg-sky-100 text-sky-700',
    },
    success: {
      header: 'text-emerald-700',
      item: 'border-emerald-100 bg-emerald-50/80',
      marker: 'bg-emerald-100 text-emerald-700',
    },
    accent: {
      header: 'text-violet-700',
      item: 'border-violet-100 bg-violet-50/80',
      marker: 'bg-violet-100 text-violet-700',
    },
    neutral: {
      header: 'text-slate-700',
      item: 'border-slate-200 bg-slate-50/80',
      marker: 'bg-slate-100 text-slate-700',
    },
  }

  const selectedTone = toneClasses[tone] || toneClasses.neutral

  return (
    <section className={`card ${className}`.trim()}>
      <div className={`flex items-center gap-2 text-lg font-semibold ${selectedTone.header}`.trim()}>
        {icon}
        <h3>{title}</h3>
      </div>

      <div className='mt-4 space-y-3'>
        {(items || []).map((item, index) => (
          <div
            key={`${title}-${index}`}
            className={`flex items-start gap-3 rounded-[20px] border px-4 py-3.5 ${selectedTone.item}`.trim()}
          >
            <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${selectedTone.marker}`.trim()}>
              {numbered ? index + 1 : <LuArrowRight className='text-sm' />}
            </span>
            <p className='text-sm leading-6 text-slate-700'>{item}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default InsightCard;

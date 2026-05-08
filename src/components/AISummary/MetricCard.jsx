import React from 'react';

const MetricCard = ({
  icon,
  label,
  value,
  footnote,
  tone = 'neutral',
  progressValue,
}) => {
  const toneClasses = {
    success: {
      wrapper: 'border-emerald-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.95),rgba(255,255,255,0.96))]',
      icon: 'bg-emerald-100 text-emerald-600',
      value: 'text-emerald-700',
    },
    danger: {
      wrapper: 'border-rose-100 bg-[linear-gradient(135deg,rgba(255,241,242,0.95),rgba(255,255,255,0.96))]',
      icon: 'bg-rose-100 text-rose-600',
      value: 'text-rose-700',
    },
    primary: {
      wrapper: 'border-cyan-100 bg-[linear-gradient(135deg,rgba(236,254,255,0.95),rgba(255,255,255,0.96))]',
      icon: 'bg-cyan-100 text-cyan-700',
      value: 'text-cyan-700',
    },
    accent: {
      wrapper: 'border-amber-100 bg-[linear-gradient(135deg,rgba(255,251,235,0.95),rgba(255,255,255,0.96))]',
      icon: 'bg-amber-100 text-amber-600',
      value: 'text-amber-700',
    },
    neutral: {
      wrapper: 'border-slate-200 bg-white',
      icon: 'bg-slate-100 text-slate-600',
      value: 'text-slate-900',
    },
  }

  const selectedTone = toneClasses[tone] || toneClasses.neutral

  return (
    <div className={`card !p-4 ${selectedTone.wrapper}`.trim()}>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>{label}</p>
          <p className={`mt-3 text-2xl font-semibold tracking-tight ${selectedTone.value}`.trim()}>
            {value}
          </p>
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] ${selectedTone.icon}`.trim()}>
          {icon}
        </div>
      </div>

      {typeof progressValue === 'number' && (
        <div className='mt-4 h-2 rounded-full bg-white/90'>
          <div
            className='h-2 rounded-full bg-[linear-gradient(90deg,#0f766e,#14b8a6)] transition-all duration-700'
            style={{ width: `${Math.max(0, Math.min(progressValue, 100))}%` }}
          />
        </div>
      )}

      <p className='mt-3 text-sm leading-6 text-slate-500'>{footnote}</p>
    </div>
  )
}

export default MetricCard;

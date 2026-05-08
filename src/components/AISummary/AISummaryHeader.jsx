import React from 'react';
import { LuRefreshCw } from 'react-icons/lu';

const StatusChip = ({ icon, label, tone = 'neutral' }) => {
  const toneClasses = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    info: 'border-cyan-200 bg-cyan-50 text-cyan-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    neutral: 'border-slate-200/80 bg-slate-50/80 text-slate-600',
  }

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${toneClasses[tone] || toneClasses.neutral}`.trim()}>
      {icon}
      {label}
    </span>
  )
}

const SubtleBadge = ({ label }) => (
  <span className='inline-flex items-center rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600'>
    {label}
  </span>
)

const AISummaryHeader = ({ loading, onRefresh, headerChips = [] }) => {
  return (
    <div className='page-header'>
      <div>
        <p className='page-eyebrow'>AI Money Coach</p>
        <h1 className='page-title'>AI Summary</h1>
        <p className='page-subtitle'>
          A clear view of your last 30 days, with the next steps that matter most.
        </p>

        {headerChips.length > 0 && (
          <div className='mt-4 flex flex-wrap gap-2'>
            {headerChips.map((chip) => (
              <StatusChip
                key={chip.label}
                icon={chip.icon}
                label={chip.label}
                tone={chip.tone}
              />
            ))}
          </div>
        )}
      </div>

      <button
        type='button'
        className='btn-primary !rounded-full !px-5 sm:!w-auto'
        onClick={onRefresh}
        disabled={loading}
      >
        <LuRefreshCw className={`text-base ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Refreshing...' : 'Refresh summary'}
      </button>
    </div>
  )
}

export { AISummaryHeader, SubtleBadge };

import React from 'react';
import { LuTarget } from 'react-icons/lu';

const ScoreRow = ({ label, value, tone = 'primary' }) => {
  const toneClasses = {
    success: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    primary: 'border-cyan-100 bg-cyan-50 text-cyan-700',
    accent: 'border-amber-100 bg-amber-50 text-amber-700',
  }

  return (
    <div className='rounded-[20px] border border-slate-200/80 bg-slate-50/70 p-4'>
      <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
      <span className={`mt-3 inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${toneClasses[tone]}`.trim()}>
        {value || 'Not available'}
      </span>
    </div>
  )
}

const ScoreSection = ({ aiScore }) => (
  <section className='card'>
    <div className='flex items-center gap-2 text-lg font-semibold text-slate-900'>
      <LuTarget className='text-lg text-primary' />
      <h3>Health score</h3>
    </div>

    <div className='mt-4 grid gap-3'>
      <ScoreRow label='Financial health' value={aiScore?.financialHealth} tone='success' />
      <ScoreRow label='Savings efficiency' value={aiScore?.savingsEfficiency} tone='primary' />
      <ScoreRow label='Risk level' value={aiScore?.riskLevel} tone='accent' />
    </div>
  </section>
)

export default ScoreSection;

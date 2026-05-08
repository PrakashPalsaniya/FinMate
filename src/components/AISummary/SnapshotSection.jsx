import React from 'react';
import { LuLightbulb } from 'react-icons/lu';

const SnapshotRow = ({ label, value }) => (
  <div className='rounded-[20px] border border-slate-200/80 bg-slate-50/70 px-4 py-3'>
    <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
    <p className='mt-1.5 text-sm leading-6 text-slate-700'>{value}</p>
  </div>
)

const SnapshotSection = ({
  topExpenseText,
  topIncomeText,
  dailySpend,
  projectedExpense,
  focusLabel,
}) => (
  <section className='card'>
    <div className='flex items-center gap-2 text-lg font-semibold text-slate-900'>
      <LuLightbulb className='text-lg text-accent' />
      <h3>Money snapshot</h3>
    </div>

    <div className='mt-4 space-y-3'>
      <SnapshotRow label='Main expense pressure' value={topExpenseText} />
      <SnapshotRow label='Main income source' value={topIncomeText} />
      <SnapshotRow label='Daily spending pace' value={dailySpend} />
      <SnapshotRow label='Projected monthly spend' value={projectedExpense} />
      <SnapshotRow label='Current focus' value={focusLabel} />
    </div>
  </section>
)

export default SnapshotSection;

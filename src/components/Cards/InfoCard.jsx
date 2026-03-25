import React from 'react'

const TONE_STYLES = {
  primary: {
    icon: "bg-primary text-white shadow-[0_24px_48px_-28px_rgba(15,118,110,0.72)]",
    badge: "bg-primary/10 text-primary",
  },
  success: {
    icon: "bg-emerald-500 text-white shadow-[0_24px_48px_-28px_rgba(16,185,129,0.72)]",
    badge: "bg-emerald-50 text-emerald-700",
  },
  danger: {
    icon: "bg-rose-500 text-white shadow-[0_24px_48px_-28px_rgba(244,63,94,0.72)]",
    badge: "bg-rose-50 text-rose-700",
  },
}

const InfoCard = ({ icon, label, value, tone = "primary", description, badge }) => {
  const styles = TONE_STYLES[tone] || TONE_STYLES.primary

  return (
    <div className='card min-h-[188px] sm:min-h-[208px] lg:min-h-[220px]'>
      <div className='flex items-start justify-between gap-3 sm:gap-4'>
        <div className='min-w-0'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400'>{label}</p>
          <h3 className='mt-3 text-[1.75rem] font-semibold tracking-tight text-slate-900 sm:mt-4 sm:text-[1.95rem] md:text-[2rem]'>
            {value}
          </h3>
          <p className='mt-2 text-[13px] leading-6 text-slate-500 sm:mt-3 sm:text-sm'>{description}</p>
        </div>

        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[22px] sm:h-14 sm:w-14 sm:text-[26px] ${styles.icon}`}>
          {icon}
        </div>
      </div>

      {badge && (
        <div className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold sm:mt-6 sm:text-xs ${styles.badge}`}>
          {badge}
        </div>
      )}
    </div>
  )
}

export default InfoCard

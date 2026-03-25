import React from 'react'

const PreferenceToggle = ({ label, description, checked, onChange, disabled = false }) => {
    return (
        <label
            className={`flex items-start justify-between gap-4 rounded-[22px] border px-4 py-3.5 transition ${
                checked
                    ? 'border-primary/20 bg-primary/[0.05]'
                    : 'border-slate-200/80 bg-slate-50/70'
            } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-slate-300 hover:bg-white'}`}
        >
            <div className='min-w-0'>
                <p className='text-sm font-semibold text-slate-900'>{label}</p>
                <p className='mt-1 text-sm leading-5 text-slate-500'>{description}</p>
            </div>

            <span
                aria-hidden="true"
                className={`mt-1 inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition ${
                    checked
                        ? 'border-primary/30 bg-primary/90'
                        : 'border-slate-200 bg-slate-200/90'
                }`}
            >
                <span
                    className={`h-5 w-5 rounded-full bg-white shadow-[0_10px_20px_-12px_rgba(15,23,42,0.6)] transition ${
                        checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </span>

            <input
                type="checkbox"
                className='sr-only'
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />
        </label>
    )
}

export default PreferenceToggle

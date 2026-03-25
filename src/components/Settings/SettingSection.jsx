import React from 'react'

const SettingSection = ({
    eyebrow,
    title,
    description,
    children,
    className = '',
    headerClassName = '',
    contentClassName = '',
}) => {
    return (
        <section className={`card ${className}`.trim()}>
            <div className={`max-w-3xl ${headerClassName}`.trim()}>
                {eyebrow && <p className='page-eyebrow'>{eyebrow}</p>}
                <h2 className='mt-2 text-xl font-semibold tracking-tight text-slate-900'>{title}</h2>
                {description && (
                    <p className='mt-2 text-sm leading-6 text-slate-500'>{description}</p>
                )}
            </div>

            <div className={`mt-5 ${contentClassName}`.trim()}>
                {children}
            </div>
        </section>
    )
}

export default SettingSection

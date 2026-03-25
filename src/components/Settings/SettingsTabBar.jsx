import React from 'react'

const SettingsTabBar = ({ tabs, activeTab, onChange }) => {
    return (
        <div className='card !p-1.5 sm:!p-2.5'>
            <div
                className='grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 lg:grid-cols-4'
                role='tablist'
                aria-label='Settings sections'
            >
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.key

                    return (
                        <button
                            key={tab.key}
                            type='button'
                            role='tab'
                            aria-selected={isActive}
                            className={`flex w-full items-center gap-2.5 rounded-[18px] border px-3 py-2.5 text-left transition sm:gap-3 sm:rounded-[20px] sm:px-4 sm:py-3 ${
                                isActive
                                    ? 'border-primary/15 bg-primary text-white shadow-[0_20px_46px_-30px_rgba(15,118,110,0.72)]'
                                    : 'border-slate-200/80 bg-slate-50/70 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900'
                            }`}
                            onClick={() => onChange(tab.key)}
                        >
                            <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] text-[15px] sm:h-10 sm:w-10 sm:rounded-[16px] sm:text-base ${
                                    isActive
                                        ? 'bg-white/14 text-white'
                                        : 'bg-white text-slate-600 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.3)]'
                                }`}
                            >
                                <Icon />
                            </span>

                            <span className='min-w-0'>
                                <span className='block text-[13px] font-semibold sm:text-sm'>{tab.label}</span>
                                <span className={`mt-0.5 hidden text-[11px] leading-4 sm:mt-1 sm:block sm:text-xs sm:leading-5 ${isActive ? 'text-white/78' : 'text-slate-500'}`}>
                                    {tab.description}
                                </span>
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default SettingsTabBar

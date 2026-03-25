import React from 'react'
import { LuX } from 'react-icons/lu'

const Modal = ({ children, isOpen, onClose, title }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/30 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6">
            <button className='absolute inset-0' onClick={onClose} aria-label="Close modal" />

            <div className="relative z-10 my-auto w-full max-w-2xl overflow-hidden rounded-[26px] border border-white/80 bg-[rgba(255,255,255,0.96)] shadow-[0_36px_90px_-42px_rgba(15,23,42,0.45)] backdrop-blur-2xl sm:max-h-[calc(100vh-3rem)] sm:rounded-[30px]">
                <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-4 sm:px-6 sm:py-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/70">Action</p>
                        <h3 className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">{title}</h3>
                    </div>

                    <button
                        type='button'
                        className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-500 transition hover:text-slate-900 sm:h-10 sm:w-10"
                        onClick={onClose}
                    >
                        <LuX size={18} strokeWidth={2.6} />
                    </button>
                </div>

                <div className="max-h-[calc(100vh-10.5rem)] overflow-y-auto px-4 py-4 text-slate-700 sm:max-h-[calc(100vh-14rem)] sm:px-6 sm:py-6">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal

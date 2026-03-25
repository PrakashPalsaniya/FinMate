import React, { useContext, useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"
import { LuShieldCheck } from "react-icons/lu"
import { UserContext } from '../../context/UserContext'
import CharAvatar from '../Cards/CharAvatar'
import SideMenu from './SideMenu'

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false)
    const { user } = useContext(UserContext)

    const closeSideMenu = () => {
        setOpenSideMenu(false)
    }

    return (
        <>
            <header className='sticky top-0 z-40 border-b border-white/70 bg-[rgba(247,250,248,0.84)] backdrop-blur-2xl'>
                <div className='mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4 md:px-6 lg:px-8'>
                    <div className='flex min-w-0 items-center gap-2.5 sm:gap-3'>
                        <button
                            className='inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-slate-700 shadow-[0_18px_38px_-28px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:text-primary sm:h-11 sm:w-11 lg:hidden'
                            onClick={() => setOpenSideMenu((value) => !value)}
                            aria-label={openSideMenu ? "Close navigation" : "Open navigation"}
                        >
                            {openSideMenu ? <HiOutlineX className='text-[22px] sm:text-2xl' /> : <HiOutlineMenu className='text-[22px] sm:text-2xl' />}
                        </button>

                        <div className='min-w-0'>
                            <div className='flex items-center gap-2.5 sm:gap-3'>
                                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-[13px] font-bold uppercase tracking-[0.24em] text-white shadow-[0_24px_48px_-28px_rgba(15,118,110,0.75)] sm:h-11 sm:w-11 sm:text-sm'>
                                    FM
                                </div>
                                <div className='min-w-0'>
                                    <p className='truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg'>FinMate</p>
                                    <p className='hidden text-xs text-slate-500 sm:block'>Clear, calmer control over your cash flow</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='hidden items-center gap-3 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm text-slate-600 shadow-[0_18px_38px_-28px_rgba(15,23,42,0.34)] backdrop-blur-xl md:flex'>
                        <span className='h-2.5 w-2.5 rounded-full bg-primary' />
                        <div>
                            <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400'>Workspace</p>
                            <p className='font-semibold text-slate-800'>{activeMenu}</p>
                        </div>
                    </div>

                    <div className='flex shrink-0 items-center gap-3'>
                        <div className='hidden items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-2 text-xs font-semibold text-slate-600 shadow-[0_18px_38px_-28px_rgba(15,23,42,0.34)] backdrop-blur-xl md:flex'>
                            <LuShieldCheck className='text-base text-primary' />
                            Synced securely
                        </div>

                        {user && (
                            <div className='flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-2 py-1.5 shadow-[0_18px_38px_-28px_rgba(15,23,42,0.34)] backdrop-blur-xl sm:gap-3 sm:px-2.5 sm:py-2'>
                                <CharAvatar
                                    fullName={user?.fullName}
                                    width="w-9 sm:w-10"
                                    height="h-9 sm:h-10"
                                    style="text-sm"
                                />
                                <div className='hidden pr-1 sm:block'>
                                    <p className='text-sm font-semibold leading-5 text-slate-900'>{user?.fullName || "Welcome back"}</p>
                                    <p className='text-xs text-slate-500'>Your finances, one clean view</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {openSideMenu && (
                <div className='fixed inset-0 z-50 lg:hidden'>
                    <button
                        className='absolute inset-0 bg-slate-950/36 backdrop-blur-sm'
                        onClick={closeSideMenu}
                        aria-label='Close navigation drawer'
                    />

                    <div className='absolute inset-y-0 left-0 w-[min(88vw,380px)] border-r border-white/80 bg-[rgba(247,250,248,0.96)] p-4 shadow-[0_34px_100px_-38px_rgba(15,23,42,0.55)] backdrop-blur-2xl'>
                        <div className='flex h-full flex-col'>
                            <div className='mb-4 flex items-center justify-between px-1'>
                                <p className='text-sm font-semibold tracking-tight text-slate-900'>{activeMenu}</p>
                                <button
                                    className='inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-700 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.28)]'
                                    onClick={closeSideMenu}
                                    aria-label='Close mobile navigation'
                                >
                                    <HiOutlineX className='text-xl' />
                                </button>
                            </div>

                            <SideMenu activeMenu={activeMenu} mobile onNavigate={closeSideMenu} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar

import React from 'react'
import { LuBadgeIndianRupee, LuShieldCheck, LuSparkles, LuWalletMinimal } from "react-icons/lu"

const featureCards = [
  {
    icon: LuBadgeIndianRupee,
    title: "See your cash flow clearly",
    description: "Track income, expenses, and balances in a single calm workspace.",
  },
  {
    icon: LuWalletMinimal,
    title: "Track every rupee cleanly",
    description: "Capture income and expenses in a single flow that stays easy to trust.",
  },
  {
    icon: LuShieldCheck,
    title: "Stay organized with confidence",
    description: "Keep your everyday money decisions neat, visible, and easier to trust.",
  },
]

const AuthLayout = ({ children }) => {
  return (
    <div className='relative min-h-screen overflow-hidden px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.14),transparent_24%)]' />

      <div className='relative mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1460px] overflow-hidden rounded-[28px] border border-white/80 bg-[rgba(255,255,255,0.45)] shadow-[0_40px_100px_-48px_rgba(15,23,42,0.45)] backdrop-blur-2xl sm:min-h-[calc(100vh-3rem)] sm:rounded-[36px] lg:grid-cols-[minmax(0,1fr)_520px]'>
        <div className='flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-10 lg:px-14'>
          <div className='w-full max-w-[560px]'>
            <div className='flex items-center gap-2.5 sm:gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold uppercase tracking-[0.24em] text-white shadow-[0_24px_48px_-28px_rgba(15,118,110,0.75)]'>
                FM
              </div>
              <div>
                <h1 className='text-base font-semibold tracking-tight text-slate-900 sm:text-lg'>FinMate</h1>
                <p className='text-[13px] leading-5 text-slate-500 sm:text-sm'>A clearer home for your daily money decisions</p>
              </div>
            </div>

            <div className='mt-6 rounded-[28px] border border-white/80 bg-[rgba(255,255,255,0.88)] p-5 shadow-[0_28px_80px_-44px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:mt-8 sm:p-6 md:rounded-[32px] md:p-8'>
              {children}
            </div>
          </div>
        </div>

        <div className='relative hidden overflow-hidden bg-[linear-gradient(180deg,#0f172a_0%,#111827_52%,#0f766e_100%)] px-8 py-10 text-white lg:flex lg:flex-col lg:justify-between'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.3),transparent_26%),radial-gradient(circle_at_bottom,rgba(245,158,11,0.18),transparent_24%)]' />
          <div className='absolute -left-16 top-20 h-52 w-52 rounded-full bg-white/8 blur-3xl' />
          <div className='absolute bottom-10 right-0 h-64 w-64 rounded-full bg-primary/25 blur-3xl' />

          <div className='relative'>
            <span className='surface-chip border-white/10 bg-white/10 text-white/80'>
              <LuSparkles className='text-sm text-accent' />
              Designed for calmer money routines
            </span>
          </div>

          <div className='relative'>
            <p className='text-sm font-semibold uppercase tracking-[0.28em] text-white/55'>Welcome aboard</p>
            <h2 className='mt-4 text-4xl font-semibold tracking-tight leading-tight'>
              Make your finance tracker feel as polished as the habits you are building.
            </h2>
            <p className='mt-5 max-w-md text-base leading-7 text-white/70'>
              FinMate keeps daily cash flow, spending awareness, summaries, and Telegram capture in one elegant place so decisions stay easy.
            </p>
          </div>

          <div className='relative space-y-4'>
            {featureCards.map((item) => (
              <div key={item.title} className='rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl'>
                <div className='flex items-start gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 text-xl text-accent'>
                    <item.icon />
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-white'>{item.title}</h3>
                    <p className='mt-2 text-sm leading-6 text-white/68'>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout

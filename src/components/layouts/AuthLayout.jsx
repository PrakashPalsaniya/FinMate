import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className='relative flex h-screen w-screen items-center justify-center bg-slate-50/50 p-4'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.1),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_24%)]' />

      <div className='relative w-full max-w-[500px] overflow-y-auto rounded-[32px] border border-white/80 bg-white/60 shadow-[0_24px_48px_-24px_rgba(15,23,42,0.2)] backdrop-blur-3xl sm:rounded-[40px] max-h-[92vh]'>
        <div className='px-6 py-8 sm:px-10 sm:py-10 md:px-12'>
          <div className='mx-auto w-full'>
            <div className='flex items-center justify-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg'>
                FM
              </div>
              <div>
                <h1 className='text-base font-bold tracking-tight text-slate-900'>FinMate</h1>
                <p className='text-[12px] font-medium text-slate-500'>A clearer home for your money</p>
              </div>
            </div>

            <div className='mt-8'>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout

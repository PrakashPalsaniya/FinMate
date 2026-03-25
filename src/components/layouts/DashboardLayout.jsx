import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext)
    return (
        <div className='min-h-screen'>
            <Navbar activeMenu={activeMenu} />
            <div className='mx-auto flex w-full max-w-[1600px] gap-4 px-3 pb-6 pt-3 sm:px-4 sm:pb-8 sm:pt-4 md:px-6 lg:gap-7 lg:px-8'>
                {user && (
                    <div className='hidden lg:block lg:w-[320px] lg:shrink-0'>
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                )}
                <main className='min-w-0 flex-1'>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout

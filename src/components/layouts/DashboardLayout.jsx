import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext)
    return (
        <div className='min-h-screen'>
            <Navbar activeMenu={activeMenu} />
            <div className='mx-auto flex w-full max-w-[1720px] gap-6 px-4 pb-8 pt-4 sm:px-6 md:px-10 lg:gap-8 lg:px-12'>
                {user && (
                    <div className='hidden lg:block lg:w-[300px] lg:shrink-0'>
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                )}
                <main className='min-w-0 flex-1 pb-20 lg:pb-0'>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout

import React, { useContext, useMemo } from 'react'
import { LuArrowRight, LuLogOut } from 'react-icons/lu'
import { useNavigate } from "react-router-dom"
import { UserContext } from '../../context/UserContext'
import { SIDE_MENU_DATA } from '../../utils/data.js'

const SECTION_ORDER = ["Workspace", "Insights", "Account"]

const SideMenu = ({ activeMenu, mobile = false, onNavigate }) => {
  const { logout } = useContext(UserContext)
  const navigate = useNavigate()

  const menuItems = SIDE_MENU_DATA.filter((item) => item.path !== "logout")
  const logoutItem = SIDE_MENU_DATA.find((item) => item.path === "logout")

  const menuSections = useMemo(() => {
    return SECTION_ORDER.map((sectionTitle) => ({
      title: sectionTitle,
      items: menuItems.filter((item) => item.group === sectionTitle),
    })).filter((section) => section.items.length > 0)
  }, [menuItems])

  const handleClick = (route) => {
    if (route === "logout") {
      logout()
      navigate("/login")
      onNavigate?.()
      return
    }

    navigate(route)
    onNavigate?.()
  }

  return (
    <aside
      className={
        mobile
          ? 'flex h-full min-h-0 flex-col overflow-hidden'
          : 'sticky top-16 h-[calc(100vh-100px)] self-start overflow-hidden rounded-[28px] border border-white/40 bg-white/60 p-3 shadow-xl backdrop-blur-3xl'
      }
    >
      <div className='flex h-full min-h-0 flex-col'>
        <div className='flex-1 overflow-y-auto overscroll-contain pr-1 scrollbar-hide'>
          {menuSections.map((section, index) => (
            <div key={section.title} className={index === 0 ? "" : "mt-6"}>
              <div className='mb-2 px-3'>
                <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400'>{section.title}</p>
              </div>
 
              <div className='space-y-1'>
                {section.items.map((item) => {
                  const isActive = activeMenu === item.label

                   return (
                    <button
                      key={item.id}
                      className={`group flex w-full items-center gap-3 rounded-[20px] border px-3 py-2.5 text-left transition-all duration-200 ${
                        isActive
                          ? "border-primary/10 bg-[#0f172a] text-white shadow-lg"
                          : "border-transparent bg-transparent text-slate-500 hover:bg-white hover:text-slate-900"
                      }`}
                      onClick={() => handleClick(item.path)}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[16px] text-lg transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"
                        }`}
                      >
                        <item.icon />
                      </span>
 
                      <span className='min-w-0 flex-1'>
                        <span className={`block text-[14px] font-bold tracking-tight ${isActive ? "text-white" : "text-slate-700"}`}>{item.label}</span>
                      </span>
 
                      <span className={`shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${isActive ? "text-white/90" : "text-slate-300 group-hover:text-primary"}`}>
                        <LuArrowRight className='text-sm' />
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
 
        {logoutItem && (
          <div className='mt-4 border-t border-slate-200/50 pt-4'>
            <button
              className='group flex w-full items-center gap-3 rounded-[20px] border border-red-50 bg-red-50/30 px-3 py-3 text-left text-[14px] font-bold text-red-600 transition-all duration-200 hover:bg-red-50'
              onClick={() => handleClick(logoutItem.path)}
            >
              <span className='flex h-9 w-9 items-center justify-center rounded-[16px] bg-white text-lg text-red-500 shadow-sm'>
                <LuLogOut />
              </span>
              <span className='flex-1'>
                <span className='block leading-tight'>Logout</span>
              </span>
              <LuArrowRight className='text-base text-red-200 transition-transform group-hover:translate-x-0.5' />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default SideMenu

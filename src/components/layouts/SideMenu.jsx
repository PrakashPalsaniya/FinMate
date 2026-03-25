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
          : 'sticky top-[104px] h-[calc(100vh-128px)] self-start overflow-hidden rounded-[30px] border border-white/80 bg-[rgba(255,255,255,0.84)] p-3 shadow-[0_28px_80px_-46px_rgba(15,23,42,0.42)] backdrop-blur-2xl'
      }
    >
      <div className='flex h-full min-h-0 flex-col'>
        <div className='flex-1 overflow-y-auto overscroll-contain pr-1'>
          {menuSections.map((section, index) => (
            <div key={section.title} className={index === 0 ? "" : "mt-5"}>
              <div className='mb-2 px-2'>
                <p className='text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400'>{section.title}</p>
              </div>

              <div className='space-y-1.5'>
                {section.items.map((item) => {
                  const isActive = activeMenu === item.label

                  return (
                    <button
                      key={item.id}
                      className={`group flex w-full items-center gap-3 rounded-[22px] border px-3.5 py-3 text-left transition ${
                        isActive
                          ? "border-primary/15 bg-primary text-white shadow-[0_22px_48px_-30px_rgba(15,118,110,0.72)]"
                          : "border-transparent bg-transparent text-slate-600 hover:border-slate-200/80 hover:bg-slate-50/90 hover:text-slate-900"
                      }`}
                      onClick={() => handleClick(item.path)}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[18px] text-lg transition ${
                          isActive
                            ? "bg-white/14 text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-primary"
                        }`}
                      >
                        <item.icon />
                      </span>

                      <span className='min-w-0 flex-1'>
                        <span className='block text-sm font-semibold'>{item.label}</span>
                        {item.caption && (
                          <span className={`mt-1 block text-xs leading-5 ${isActive ? "text-white/78" : "text-slate-500"}`}>
                            {item.caption}
                          </span>
                        )}
                      </span>

                      <span className={`shrink-0 ${isActive ? "text-white/90" : "text-slate-300 group-hover:text-primary"}`}>
                        <LuArrowRight className='text-base' />
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {logoutItem && (
          <div className='mt-4 border-t border-slate-200/70 pt-4'>
            <button
              className='group flex w-full items-center gap-3 rounded-[22px] border border-red-100 bg-red-50/75 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50'
              onClick={() => handleClick(logoutItem.path)}
            >
              <span className='flex h-10 w-10 items-center justify-center rounded-[18px] bg-white text-lg shadow-[0_18px_40px_-28px_rgba(239,68,68,0.58)]'>
                <LuLogOut />
              </span>
              <span className='flex-1'>
                <span className='block'>Logout</span>
                <span className='mt-1 block text-xs font-medium text-red-500/80'>End this session safely</span>
              </span>
              <LuArrowRight className='text-base text-red-400' />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default SideMenu

import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import {
    BarChart3,
    PlusCircle,
    LayoutList,
    ClipboardList,
    Settings,
    HelpCircle,
    UserCircle,
    PackageSearch,
    RefreshCw
} from 'lucide-react'
import { themeDataContext } from '../context/ThemeContext'

function Sidebar() {
    const { isDark } = useContext(themeDataContext)
    const dk = isDark

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <BarChart3 size={20} /> },
        { name: 'Add Items', path: '/add', icon: <PlusCircle size={20} /> },
        { name: 'List Items', path: '/lists', icon: <LayoutList size={20} /> },
        { name: 'Orders', path: '/orders', icon: <ClipboardList size={20} /> },
    ]

    const utilityItems = [
        { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
        { name: 'Support', path: '/support', icon: <HelpCircle size={20} /> },
    ]

    return (
        <aside className={`hidden lg:flex w-[280px] h-screen border-r flex-col fixed left-0 top-0 z-40 pt-24 pb-8 px-4 transition-all duration-500 ${dk ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-gray-100'}`}>

            {/* Main Navigation */}
            <div className='flex flex-col gap-2'>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 mb-3 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Main Menu</p>
                {menuItems.map((item) => (
                    <Item key={item.path} item={item} dk={dk} />
                ))}
            </div>

            {/* Utility / Management */}
            <div className='mt-10 flex flex-col gap-2 flex-1'>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 mb-3 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Management</p>
                {utilityItems.map((item) => (
                    <Item key={item.path} item={item} dk={dk} />
                ))}
            </div>

            {/* System Info / Status */}
            <div className={`mt-auto pt-6 border-t px-4 ${dk ? 'border-slate-800' : 'border-gray-50'}`}>
                <div className={`flex items-center gap-3 p-3 rounded-2xl border ${dk ? 'bg-slate-800/50 border-slate-700/50' : 'bg-blue-50/50 border-blue-100'}`}>
                    <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]'></div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${dk ? 'text-slate-400' : 'text-blue-600'}`}>System Global Stable</span>
                </div>
            </div>

        </aside>
    )
}

function Item({ item, dk }) {
    return (
        <NavLink
            to={item.path}
            className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-[13px] transition-all duration-300 group
        ${isActive
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 active:scale-95'
                    : dk 
                        ? 'text-slate-400 hover:bg-slate-800 hover:text-white' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
      `}
        >
            <div className={`transition-transform duration-500 group-hover:scale-110 ${dk && 'group-hover:text-blue-400'}`}>
                {item.icon}
            </div>
            <span className='tracking-tight'>{item.name}</span>
        </NavLink>
    )
}

export default Sidebar

import React, { useContext, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, ChevronLeft } from 'lucide-react'
import axios from 'axios'
import {
    BarChart3,
    PlusCircle,
    LayoutList,
    ClipboardList,
    Settings,
    HelpCircle,
    PackageSearch,
    RefreshCw,
    Users,
    MessageSquare
} from 'lucide-react'
import { themeDataContext } from '../context/ThemeContext'

function Sidebar() {
    const { isDark } = useContext(themeDataContext)
    const [stats, setStats] = useState({ pendingOrders: 0, unrepliedMessages: 0, newUsers: 0 })
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const dk = isDark

    const serverUrl = import.meta.env.VITE_SERVER_URL || "https://vebstore-backend.onrender.com"

    useEffect(() => {
        fetchStats()
        const interval = setInterval(fetchStats, 60000) // update every minute
        return () => clearInterval(interval)
    }, [])

    const fetchStats = async () => {
        try {
            const response = await axios.get(serverUrl + '/api/admin/stats', { withCredentials: true })
            setStats(response.data)
        } catch (error) {
            console.error("fetchStats error", error)
        }
    }

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <BarChart3 size={20} /> },
        { name: 'Add Items', path: '/add', icon: <PlusCircle size={20} /> },
        { name: 'List Items', path: '/lists', icon: <LayoutList size={20} /> },
        { name: 'Orders', path: '/orders', icon: <ClipboardList size={20} />, count: stats.pendingOrders },
        { name: 'Exchanges', path: '/exchange-management', icon: <RefreshCw size={20} /> },
        { name: 'Inbox', path: '/messages', icon: <MessageSquare size={20} />, count: stats.unrepliedMessages },
        { name: 'Users', path: '/users', icon: <Users size={20} />, count: stats.newUsers },
    ]

    const utilityItems = [
        { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
        { name: 'Support', path: '/support', icon: <HelpCircle size={20} /> },
    ]

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden fixed top-24 left-4 z-50 p-3 rounded-lg transition-all ${
                    dk ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
                }`}
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40`} onClick={() => setMobileMenuOpen(false)}>
                    <div className={`fixed left-0 top-0 h-full w-[280px] ${dk ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-gray-100'} transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        
                        {/* Mobile Header */}
                        <div className={`flex items-center justify-between p-4 border-b ${dk ? 'border-slate-700' : 'border-gray-100'}`}>
                            <h2 className={`text-lg font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Admin Menu</h2>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className={`p-2 rounded-lg transition-all ${
                                    dk ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-600'
                                }`}
                            >
                                <ChevronLeft size={20} />
                            </button>
                        </div>

                        {/* Mobile Menu Items */}
                        <div className='flex-1 overflow-y-auto p-4'>
                            {/* Main Navigation */}
                            <div className='mb-6'>
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 mb-3 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Main Menu</p>
                                {menuItems.map((item) => (
                                    <Item key={item.path} item={item} dk={dk} isMobile={true} />
                                ))}
                            </div>

                            {/* Utility / Management */}
                            <div className='flex-1 flex flex-col gap-2'>
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 mb-3 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Management</p>
                                {utilityItems.map((item) => (
                                    <Item key={item.path} item={item} dk={dk} isMobile={true} />
                                ))}
                            </div>

                            {/* System Info / Status */}
                            <div className={`mt-auto pt-6 border-t px-4 ${dk ? 'border-slate-800' : 'border-gray-50'}`}>
                                <div className={`flex items-center gap-3 p-3 rounded-2xl border ${dk ? 'bg-slate-800/50 border-slate-700/50' : 'bg-blue-50/50 border-blue-100'}`}>
                                    <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]'></div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${dk ? 'text-slate-400' : 'text-blue-600'}`}>System Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex w-[280px] h-screen border-r flex-col fixed left-0 top-0 z-40 pt-24 pb-8 px-4 transition-all duration-500 ${dk ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-gray-100'}`}>

                {/* Main Navigation */}
                <div className='flex flex-col gap-2'>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 mb-3 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Main Menu</p>
                    {menuItems.map((item) => (
                        <Item key={item.path} item={item} dk={dk} isMobile={false} />
                    ))}
                </div>

                {/* Utility / Management */}
                <div className='mt-10 flex flex-col gap-2 flex-1'>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 mb-3 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Management</p>
                    {utilityItems.map((item) => (
                        <Item key={item.path} item={item} dk={dk} isMobile={false} />
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
        </>
    )
}

function Item({ item, dk, isMobile }) {
    return (
        <NavLink
            to={item.path}
            className={({ isActive }) => `
        flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-[13px] transition-all duration-300 group
        ${isActive
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 active:scale-95'
                    : dk 
                        ? 'text-slate-400 hover:bg-slate-800 hover:text-white' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
      `}
            onClick={() => {
                // Close mobile menu after navigation
                if (isMobile) {
                    setTimeout(() => {
                        const mobileMenu = document.querySelector('[class*="fixed inset-0"]')
                        if (mobileMenu) {
                            mobileMenu.click()
                        }
                    }, 100)
                }
            }}
        >
            <div className='flex items-center gap-3'>
                <div className={`transition-transform duration-500 group-hover:scale-110 ${dk && 'group-hover:text-blue-400'}`}>
                    {item.icon}
                </div>
                <span className='tracking-tight'>{item.name}</span>
            </div>
            {item.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border transition-all ${
                    dk ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-red-500 text-white border-white shadow-sm'
                }`}>
                    {item.count > 99 ? '99+' : item.count}
                </span>
            )}
        </NavLink>
    )
}

export default Sidebar

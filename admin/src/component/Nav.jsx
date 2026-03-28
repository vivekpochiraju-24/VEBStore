import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from "../assets/logo.png"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { adminDataContext } from '../context/AdminContext'
import { themeDataContext } from '../context/ThemeContext'
import { toast } from 'react-toastify'
import { LogOut, UserCircle, Sun, Moon, ChevronRight } from 'lucide-react'

function Nav() {
  const navigate = useNavigate()
  const { serverUrl } = useContext(authDataContext)
  const { getAdmin } = useContext(adminDataContext)
  const { isDark, toggleTheme } = useContext(themeDataContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dk = isDark

  const logOut = async () => {
    try {
      console.log("=== ADMIN LOGOUT START ===")
      console.log("Server URL:", serverUrl)
      
      // Make logout API call
      const response = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      console.log("Logout API response:", response.data)
      
      toast.success("Logged out successfully")
      
      // Clear admin data
      console.log("Clearing admin data...")
      getAdmin()
      
      // Close mobile menu
      setMobileMenuOpen(false)
      
      // Navigate to login
      console.log("Navigating to login...")
      navigate("/login")
      
      console.log("=== ADMIN LOGOUT COMPLETE ===")
      
    } catch (error) {
      console.error("Admin logout error:", error)
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        serverUrl
      })
      
      // Force logout even if API fails
      toast.error("Logout completed")
      getAdmin()
      setMobileMenuOpen(false)
      navigate("/login")
    }
  }

  return (
    <nav className={`w-full h-[75px] z-50 fixed top-0 flex items-center justify-between px-4 sm:px-6 border-b backdrop-blur-md transition-colors duration-500 ${dk ? 'bg-[#0f172a]/80 border-slate-800/60' : 'bg-white/80 border-gray-100'}`}>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`lg:hidden p-2 rounded-lg transition-all ${
          dk ? 'text-slate-300 hover:text-white hover:bg-slate-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Branding - Hidden on mobile, visible on desktop */}
      <div
        className='flex items-center gap-3 cursor-pointer group hidden lg:flex'
        onClick={() => navigate("/")}
      >
        <div className='relative'>
          <img src={logo} alt="Logo" className='w-9 h-9 object-contain group-hover:scale-110 transition-transform duration-500' />
          <div className='absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white'></div>
        </div>
        <div className={`flex flex-col ${dk ? 'text-white' : 'text-gray-900'}`}>
          <h1 className={`text-lg font-black tracking-tight leading-tight`}>VEBStore Admin</h1>
          <span className={`text-[10px] font-black uppercase tracking-widest ${dk ? 'text-slate-500' : 'text-gray-500'}`}>Management Console</span>
        </div>
      </div>

      {/* Desktop Actions */}
      <div className='hidden lg:flex items-center gap-3'>
        
        {/* Quick Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl border transition-all group ${
            dk ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:shadow-md'
          }`}
        >
          {dk ? <Sun size={18} className='group-hover:rotate-12 transition-transform' /> : <Moon size={18} className='group-hover:-rotate-12 transition-transform' />}
        </button>

        <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-black uppercase tracking-widest ${
          dk ? 'bg-slate-800/50 border-slate-700/50 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
        }`}>
          <UserCircle size={16} className={dk ? 'text-slate-500' : 'text-gray-400'} />
          <span className='hidden sm:inline'>Administrator</span>
        </div>

        <button
          onClick={logOut}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
            dk ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20' : 'bg-gray-950 text-white hover:bg-black shadow-gray-950/20'
          }`}
        >
          <LogOut size={16} />
          <span className='hidden sm:inline'>Sign Out</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden fixed top-[75px] left-0 right-0 h-[calc(100vh-75px)] bg-white dark:bg-slate-900 shadow-2xl border-t ${dk ? 'border-slate-700' : 'border-gray-200'} z-40 overflow-y-auto`}>
          <div className='p-6 space-y-6'>
            
            {/* Quick Stats Header */}
            <div className={`p-4 rounded-2xl border ${dk ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50 border-blue-100'}`}>
              <p className='text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1'>Admin Session</p>
              <div className='flex items-center gap-2'>
                <UserCircle size={16} className={dk ? 'text-slate-400' : 'text-gray-400'} />
                <span className={`text-sm font-black ${dk ? 'text-white' : 'text-gray-900'}`}>Administrator Console</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className='grid grid-cols-1 gap-2'>
               <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>General Management</p>
               {[
                 { name: 'Dashboard', path: '/' },
                 { name: 'Add Products', path: '/add' },
                 { name: 'Inventory List', path: '/lists' },
                 { name: 'Orders', path: '/orders' },
                 { name: 'Exchanges', path: '/exchange-management' },
                 { name: 'Inbox', path: '/messages' },
                 { name: 'User Management', path: '/users' },
               ].map(link => (
                 <button
                   key={link.path}
                   onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                   className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-sm transition-all ${dk ? 'bg-slate-800/30 text-slate-300 active:bg-slate-700' : 'bg-gray-50 text-gray-700 active:bg-gray-100'}`}
                 >
                   {link.name}
                   <ChevronRight size={14} className='text-blue-500' />
                 </button>
               ))}
            </div>

            <div className='flex flex-col gap-3 pt-4 border-t border-gray-100 dark:border-slate-800'>
              <button 
                onClick={toggleTheme}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${dk ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
              >
                <div className='flex items-center gap-3'>
                  {dk ? <Sun size={18} /> : <Moon size={18} />}
                  <span className='font-bold'>Change Appearance</span>
                </div>
                <span className='text-[10px] font-black uppercase'>{dk ? 'Light' : 'Dark'}</span>
              </button>

              <button
                onClick={logOut}
                className='w-full p-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all bg-rose-500 text-white shadow-lg active:scale-95 flex items-center justify-center gap-3'
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Nav

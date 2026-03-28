import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from "../assets/logo.png"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { adminDataContext } from '../context/AdminContext'
import { themeDataContext } from '../context/ThemeContext'
import { toast } from 'react-toastify'
import { LogOut, UserCircle, Sun, Moon } from 'lucide-react'

function Nav() {
  const navigate = useNavigate()
  const { serverUrl } = useContext(authDataContext)
  const { getAdmin } = useContext(adminDataContext)
  const { isDark, toggleTheme } = useContext(themeDataContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dk = isDark

  const logOut = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      toast.success("Logged out successfully")
      getAdmin()
      navigate("/login")
      setMobileMenuOpen(false)
    } catch (error) {
      console.log(error)
      toast.error("Logout failed")
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
        <div className={`lg:hidden fixed top-[75px] left-0 right-0 bg-white dark:bg-slate-900 shadow-2xl border-t ${dk ? 'border-slate-700' : 'border-gray-200'} z-40`}>
          <div className='p-4 space-y-3'>
            {/* Mobile Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`w-full p-3 rounded-xl border transition-all group ${
                dk ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:shadow-md'
              }`}
            >
              {dk ? <Sun size={18} className='group-hover:rotate-12 transition-transform' /> : <Moon size={18} className='group-hover:-rotate-12 transition-transform' />}
              <span className='ml-3'>Toggle Theme</span>
            </button>

            {/* Mobile User Info */}
            <div className={`w-full p-3 rounded-xl border ${
              dk ? 'bg-slate-800/50 border-slate-700/50 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
            }`}>
              <UserCircle size={16} />
              <span className='ml-3'>Administrator</span>
            </div>

            {/* Mobile Logout */}
            <button
              onClick={logOut}
              className={`w-full p-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                dk ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20' : 'bg-gray-950 text-white hover:bg-black shadow-gray-950/20'
              }`}
            >
              <LogOut size={16} />
              <span className='ml-3'>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Nav

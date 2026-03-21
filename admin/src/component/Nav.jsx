import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const dk = isDark

  const logOut = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      toast.success("Logged out successfully")
      getAdmin()
      navigate("/login")
    } catch (error) {
      console.log(error)
      toast.error("Logout failed")
    }
  }

  return (
    <nav className={`w-full h-[75px] z-50 fixed top-0 flex items-center justify-between px-6 sm:px-10 border-b backdrop-blur-md transition-colors duration-500 ${dk ? 'bg-[#0f172a]/80 border-slate-800/60' : 'bg-white/80 border-gray-100'}`}>

      {/* Branding */}
      <div
        className='flex items-center gap-3 cursor-pointer group'
        onClick={() => navigate("/")}
      >
        <div className='relative'>
          <img src={logo} alt="Logo" className='w-9 h-9 object-contain group-hover:scale-110 transition-transform duration-500' />
          <div className='absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white'></div>
        </div>
        <div className='flex flex-col'>
          <h1 className={`text-lg font-black tracking-tight leading-tight ${dk ? 'text-white' : 'text-gray-900'}`}>VEBStore Admin</h1>
          <span className={`text-[10px] font-black uppercase tracking-wider ${dk ? 'text-slate-500' : 'text-gray-500'}`}>Management Console</span>
        </div>
      </div>

      {/* Actions */}
      <div className='flex items-center gap-3 sm:gap-6'>
        
        {/* Quick Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl border transition-all duration-300 group ${dk ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:shadow-md'}`}
        >
          {dk ? <Sun size={18} className='group-hover:rotate-12 transition-transform' /> : <Moon size={18} className='group-hover:-rotate-12 transition-transform' />}
        </button>

        <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${dk ? 'bg-slate-800/50 border-slate-700 text-slate-300' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
          <UserCircle size={16} className={dk ? 'text-slate-500' : 'text-gray-400'} />
          <span className='text-[11px] font-black uppercase tracking-widest'>Administrator</span>
        </div>

        <button
          onClick={logOut}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${dk ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20' : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/20'}`}
        >
          <LogOut size={16} />
          <span className='hidden sm:inline'>Sign Out</span>
        </button>
      </div>

    </nav>
  )
}

export default Nav

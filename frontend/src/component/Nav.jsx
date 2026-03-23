import React, { useContext, useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { CiSearch } from "react-icons/ci";
import { FaCircleUser } from "react-icons/fa6";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { CiMenuFries } from "react-icons/ci";
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import { shopDataContext } from '../context/ShopContext';
import { themeDataContext } from '../context/ThemeContext';
import { IoMdHome } from "react-icons/io";
import { HiOutlineCollection } from "react-icons/hi";
import { MdContacts } from "react-icons/md";
import { User, LogOut, Package, ChevronDown, X, Sun, Moon, Plus } from 'lucide-react'

function Nav() {
  const { getCurrentUser, userData } = useContext(userDataContext)
  const { serverUrl } = useContext(authDataContext)
  const { showSearch, setShowSearch, search, setSearch, cartItem } = useContext(shopDataContext)
  const { isDark, toggleTheme } = useContext(themeDataContext)
  const [showProfile, setShowProfile] = useState(false)
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      navigate("/login")
      setShowProfile(false)
    } catch (error) {
      console.error(error)
    }
  }

  const cartCount = Object.keys(cartItem || {}).reduce((acc, id) => {
    return acc + Object.values(cartItem[id] || {}).reduce((s, q) => s + q, 0)
  }, 0)

  const dk = isDark

  return (
    <nav className={`w-full h-[85px] z-[100] fixed top-0 left-0 transition-all duration-500 flex items-center justify-between px-6 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]
      ${scrolled
        ? dk
          ? 'h-[72px] bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl shadow-black/30'
          : 'h-[72px] bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-2xl shadow-gray-200/40'
        : 'bg-transparent border-transparent'
      }`}>

      {/* Branding */}
      <div className='flex items-center gap-3 cursor-pointer group' onClick={() => navigate("/")}>
        <div className='relative'>
          <img src={logo} alt="Logo" className='w-11 h-11 object-contain transition-transform group-hover:scale-110 duration-500' />
          <div className='absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-sm'></div>
        </div>
        <div className='flex flex-col'>
          <h1 className={`text-[22px] font-black tracking-tighter leading-none mb-1 ${dk ? 'text-white' : 'text-gray-900'}`}>VEBStore</h1>
          <span className='text-[10px] font-extrabold text-blue-500 uppercase tracking-[0.3em]'>Premium Fashion</span>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className='hidden md:flex items-center gap-10'>
        <ul className='flex items-center gap-8'>
          {[
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/collections' },
            { name: 'About', path: '/about' },
            { name: 'Contact', path: '/contact' }
          ].map((item) => (
            <li
              key={item.name}
              className={`relative text-[13px] font-bold cursor-pointer transition-all uppercase tracking-widest group py-2 ${dk ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => navigate(item.path)}
            >
              <span>{item.name}</span>
              <span className='absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full'></span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side Icons */}
      <div className='flex items-center gap-2 sm:gap-3'>

        {/* Search */}
        <button
          className={`hidden sm:flex p-2 rounded-full transition-colors group ${dk ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
          onClick={() => { navigate("/collections"); setShowSearch(true); }}
        >
          <CiSearch className={`w-6 h-6 ${dk ? 'text-slate-300 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}`} />
        </button>

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-all duration-300 group ${dk ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
          title={dk ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {dk
            ? <Sun size={18} className='group-hover:rotate-12 transition-transform duration-300' />
            : <Moon size={18} className='group-hover:-rotate-12 transition-transform duration-300' />
          }
        </button>

        {/* User Profile */}
        <div className='relative'>
          <button
            className={`flex items-center gap-2 p-1.5 rounded-full transition-all group ${dk ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
            onClick={() => setShowProfile(!showProfile)}
          >
            {userData ? (
              <div className='w-9 h-9 bg-blue-600 text-white font-black rounded-full flex items-center justify-center shadow-lg shadow-blue-600/20 active:scale-95 transition-transform'>
                {userData.name[0].toUpperCase()}
              </div>
            ) : (
              <FaCircleUser className={`w-7 h-7 ${dk ? 'text-slate-300 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}`} />
            )}
            <ChevronDown size={14} className={`transition-transform duration-300 hidden sm:block ${showProfile ? 'rotate-180' : ''} ${dk ? 'text-slate-500' : 'text-gray-400'}`} />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className={`absolute top-[52px] right-0 shadow-2xl rounded-3xl p-4 w-[240px] z-50 animate-fade-in-up border ${dk ? 'bg-[#1e293b] border-slate-700/50 shadow-black/40' : 'bg-white border-gray-100 shadow-gray-300/20'}`}>
              {!userData ? (
                <div className='p-2'>
                  <button
                    className='w-full h-12 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95'
                    onClick={() => { navigate("/login"); setShowProfile(false); }}
                  >
                    Sign In / Join
                  </button>
                  <p className={`text-[10px] text-center mt-3 font-bold uppercase tracking-widest ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Unlock Premium Perks</p>
                </div>
              ) : (
                <div className='flex flex-col'>
                  <div className={`px-4 py-3 mb-2 rounded-2xl border ${dk ? 'bg-[#0f172a] border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-1.5 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Signed in as</p>
                    <p className={`text-sm font-black truncate ${dk ? 'text-white' : 'text-gray-900'}`}>{userData.name}</p>
                  </div>

                  <div className='py-2 space-y-1'>
                    {[
                      { name: 'Add Product', path: '/add-product', icon: <Plus size={16} /> },
                      { name: 'Order History', path: '/order', icon: <Package size={16} /> },
                      { name: 'Edit Profile', path: '/profile', icon: <User size={16} /> },
                    ].map(item => (
                      <button
                        key={item.name}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${dk ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
                        onClick={() => { navigate(item.path); setShowProfile(false); }}
                      >
                        {item.icon}
                        {item.name}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleLogout}
                    className={`w-full mt-2 flex items-center gap-3 px-4 py-3 text-sm font-bold border-t transition-all ${dk ? 'border-slate-700 text-rose-400 hover:text-rose-300' : 'border-gray-100 text-rose-500 hover:text-rose-700'}`}
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Shopping Bag */}
        <button
          className={`relative p-2 rounded-full transition-all group ${dk ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
          onClick={() => navigate("/cart")}
        >
          <LiaShoppingBagSolid className={`w-7 h-7 group-hover:scale-110 transition-transform ${dk ? 'text-slate-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'}`} />
          {cartCount > 0 && (
            <span className='absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm'>
              {cartCount}
            </span>
          )}
        </button>

        {/* Mobile Menu Icon */}
        <button
          className={`md:hidden p-2 rounded-xl ${dk ? 'bg-slate-800' : 'bg-gray-100'}`}
          onClick={() => setMenu(true)}
        >
          <CiMenuFries className={`w-6 h-6 ${dk ? 'text-white' : 'text-gray-900'}`} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`w-full h-full z-[200] transition-all duration-500 fixed top-0 ${menu ? 'left-0' : 'left-[-100%]'} flex flex-col p-8 md:hidden ${dk ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className='flex items-center justify-between mb-12'>
          <div className='flex items-center gap-3'>
            <img src={logo} alt="Logo" className='w-10 h-10' />
            <span className={`text-xl font-black ${dk ? 'text-white' : 'text-gray-900'}`}>VEBStore</span>
          </div>
          <button onClick={() => setMenu(false)} className={`p-3 rounded-2xl ${dk ? 'bg-slate-800' : 'bg-gray-100'}`}>
            <X size={24} className={dk ? 'text-white' : 'text-gray-900'} />
          </button>
        </div>

        <ul className='flex flex-col gap-6'>
          {['HOME', 'PRODUCTS', 'ABOUT', 'CONTACT'].map((item, i) => (
            <li
              key={item}
              className={`text-4xl font-black transition-all cursor-pointer ${dk ? 'text-slate-600 hover:text-blue-400' : 'text-gray-300 hover:text-blue-600'}`}
              style={{ animationDelay: `${i * 100}ms` }}
              onClick={() => { navigate(item === 'HOME' ? '/' : item === 'PRODUCTS' ? '/collections' : `/${item.toLowerCase()}`); setMenu(false); }}
            >
              {item}
            </li>
          ))}
        </ul>

        <div className='mt-auto space-y-4'>
          <button
            className='w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all'
            onClick={() => { navigate("/login"); setMenu(false); }}
          >
            SIGN IN
          </button>
          <p className={`text-center text-xs font-bold uppercase tracking-widest ${dk ? 'text-slate-600' : 'text-gray-400'}`}>VEBStore · Premium Fashion Platform</p>
        </div>
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className={`fixed inset-0 backdrop-blur-3xl z-[200] flex items-center justify-center p-6 animate-fade-in ${dk ? 'bg-black/60' : 'bg-white/50'}`}>
          <div className='w-full max-w-2xl relative animate-fade-in-up'>
            <CiSearch className={`absolute left-6 top-1/2 -translate-y-1/2`} size={28} />
            <input
              autoFocus
              type="text"
              className={`w-full h-20 pl-20 pr-20 rounded-[40px] text-2xl font-bold tracking-tight outline-none shadow-2xl border ${dk ? 'bg-[#1e293b] border-slate-600 text-white placeholder:text-slate-500' : 'bg-white/90 border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
              placeholder='Search elite collections...'
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <button
              className='absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-md'
              onClick={() => setShowSearch(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Nav

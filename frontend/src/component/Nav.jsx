import React, { useContext, useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { CiSearch } from "react-icons/ci";
import { FaCircleUser } from "react-icons/fa6";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { CiMenuFries } from "react-icons/ci";
import { userDataContext } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import { shopDataContext } from '../context/ShopContext';
import { themeDataContext } from '../context/ThemeContext';
import { IoMdHome } from "react-icons/io";
import { HiOutlineCollection } from "react-icons/hi";
import { MdContacts } from "react-icons/md";
import { User, LogOut, Package, ChevronDown, X, Sun, Moon, RefreshCw, MessageCircle, Sparkles, Menu } from 'lucide-react'

function Nav() {
  const { getCurrentUser, userData, logoutUser, setUserData } = useContext(userDataContext)
  const { serverUrl } = useContext(authDataContext)
  const { showSearch, setShowSearch, search, setSearch, cartItem, setShowWhatsapp } = useContext(shopDataContext)
  const { isDark, toggleTheme } = useContext(themeDataContext)
  const [showProfile, setShowProfile] = useState(false)
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [unreadReplies, setUnreadReplies] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (userData?._id) {
        fetchUnreadCount()
        const interval = setInterval(fetchUnreadCount, 60000) // check every minute
        return () => clearInterval(interval)
    }
  }, [userData])

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(serverUrl + `/api/message/user/${userData._id}/unread`)
      setUnreadReplies(response.data.count)
    } catch (error) {
      console.error("fetchUnreadCount error", error)
    }
  }

  const handleLogout = async () => {
    try {
        console.log("Logout button clicked!")
        console.log("Current user:", userData)
        
        // Direct API call to ensure logout works
        const response = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
        console.log("Logout API response:", response.data)
        
        // Clear user state directly
        setUserData(null)
        
        // Close profile dropdown
        setShowProfile(false)
        
        // Navigate to login using React Router
        navigate("/login")
        
        console.log("Logout completed successfully")
        
    } catch (error) {
        console.error("Logout failed:", error)
        // Force logout even if API fails
        setUserData(null)
        setShowProfile(false)
        navigate("/login")
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

      {/* Left Menu Trigger & Branding Group */}
      <div className='flex items-center gap-4'>
        {/* Mobile Menu Icon - Now on the Left */}
        <button
          className={`md:hidden p-2.5 rounded-xl transition-all active:scale-95 ${dk ? 'bg-slate-800/80 text-white' : 'bg-gray-100 text-gray-900'}`}
          onClick={() => setMenu(true)}
        >
          <Menu size={22} />
        </button>

        {/* Branding */}
        <div className='flex items-center gap-2.5 cursor-pointer group' onClick={() => navigate("/")}>
          <div className='relative'>
            <img src={logo} alt="Logo" className='w-9 h-9 sm:w-11 sm:h-11 object-contain transition-transform group-hover:scale-110 duration-500' />
            <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm'></div>
          </div>
          <div className='flex flex-col'>
            <h1 className={`text-lg sm:text-[22px] font-black tracking-tighter leading-none mb-0.5 sm:mb-1 ${dk ? 'text-white' : 'text-gray-900'}`}>VEBStore</h1>
            <span className='text-[8px] sm:text-[10px] font-extrabold text-blue-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]'>Elite Platform</span>
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className='hidden md:flex items-center gap-10'>
        <ul className='flex items-center gap-8'>
          {[
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
            { name: 'Exchange', path: '/exchange' },
            { name: 'About', path: '/about' },
            { name: 'Contact', path: '/contact' }
          ].map((item) => (
            <li
              key={item.name}
              className={`relative text-[13px] font-bold cursor-pointer transition-all uppercase tracking-widest group py-2 ${item.path === location.pathname ? (dk ? 'text-white':'text-gray-900') : (dk ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')}`}
              onClick={() => navigate(item.path)}
            >
              <span>{item.name}</span>
              <span className={`absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-all duration-300 ${item.path === location.pathname ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side Icons */}
      <div className='flex items-center gap-2 sm:gap-3'>

      {/* Desktop Search Button */}
        <button
          className={`hidden sm:flex p-2 rounded-full transition-colors group ${dk ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
          onClick={() => { setShowSearch(true); }}
        >
          <CiSearch className={`w-6 h-6 ${dk ? 'text-slate-300 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}`} />
        </button>

        {/* Global Search Interface - Modal Overlay */}
        {showSearch && (
          <div className={`fixed inset-0 z-[110] flex items-start justify-center pt-24 px-6 animate-fade-in`}>
            {/* Backdrop */}
            <div 
              className='absolute inset-0 bg-slate-900/60 backdrop-blur-md'
              onClick={() => setShowSearch(false)}
            ></div>
            
            {/* Search Box */}
            <div className={`relative w-full max-w-2xl bg-${dk ? '[#1e293b]' : 'white'} p-4 rounded-3xl shadow-2xl border ${dk ? 'border-slate-700' : 'border-gray-100'} animate-slide-down`}>
              <div className='relative flex items-center'>
                <CiSearch className={`absolute left-4 w-6 h-6 ${dk ? 'text-slate-400' : 'text-gray-400'}`} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search elite collections (e.g. Shirts, Denim)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        navigate('/products');
                        setShowSearch(false);
                    }
                  }}
                  className={`w-full h-14 pl-12 pr-12 rounded-2xl outline-none font-bold transition-all ${dk ? 'bg-slate-800 text-white placeholder:text-slate-500':'bg-gray-50 text-gray-900 placeholder:text-gray-400'}`}
                />
                <button 
                  onClick={() => setShowSearch(false)}
                  className={`absolute right-4 p-1.5 rounded-xl hover:bg-slate-200/20 transition-all ${dk ? 'text-slate-400':'text-gray-400 hover:text-gray-600'}`}
                >
                  <X size={18} />
                </button>
              </div>
              <div className='flex items-center gap-2 mt-4 px-2'>
                <span className={`text-[10px] font-black uppercase tracking-widest ${dk ? 'text-slate-500':'text-gray-400'}`}>Quick Tags:</span>
                {['Shirts', 'Summer', 'Winter', 'Kids'].map(tag => (
                    <button 
                        key={tag}
                        onClick={() => { setSearch(tag); navigate('/products'); setShowSearch(false); }}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border transition-all ${dk ? 'border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-400' : 'border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-600'}`}
                    >
                        {tag}
                    </button>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* Whatsapp Updates - New Button */}
        {userData && (
            <button 
                onClick={() => setShowWhatsapp(true)}
                className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-lg border ${dk ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 shadow-emerald-900/10' : 'bg-green-500 text-white border-green-400 hover:bg-green-600 shadow-green-500/10'}`}
            >
                <Sparkles size={14} className='animate-pulse' />
                Get Updates
            </button>
        )}

        {/* Supercoins Tracker Display */}
        {userData && (
          <div 
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm transition-all cursor-default ${dk ? 'bg-amber-900/20 border-amber-700/50 text-amber-400' : 'bg-yellow-50 border-yellow-200 text-yellow-600 hover:bg-yellow-100'}`} 
            title={`You have ${userData.supercoins || 0} Supercoins available for discounts!`}
          >
            <div className='w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center shadow-inner'>
               <span className='text-[10px] text-white font-black'>S</span>
            </div>
            <span className='font-black text-sm'>{userData.supercoins || 0}</span>
          </div>
        )}

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

        {/* Support Inquiries */}
        {userData && (
          <button
            onClick={() => navigate("/support")}
            className={`relative p-2 rounded-full transition-all duration-300 group ${dk ? 'bg-slate-800 hover:bg-slate-700 text-blue-400' : 'bg-gray-100 hover:bg-gray-200 text-blue-600'}`}
            title="View Support Inquiries & Replies"
          >
            <MessageCircle size={18} className='group-hover:scale-110 transition-transform' />
            {unreadReplies > 0 && (
                <span className='absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full' title={`${unreadReplies} New Replies`}></span>
            )}
          </button>
        )}

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
            <div className={`absolute top-[52px] right-0 shadow-2xl rounded-3xl p-4 w-[240px] z-50 animate-fade-in-up border ${dk ? 'bg-[#1e293b] border-slate-700/50 shadow-black/40' : 'bg-gray-50 border-gray-200 shadow-gray-300/20'}`}>
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
                  <div className={`px-4 py-3 mb-2 rounded-2xl border ${dk ? 'bg-[#0f172a] border-slate-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-1.5 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Signed in as</p>
                    <p className={`text-sm font-black truncate ${dk ? 'text-white' : 'text-gray-900'}`}>{userData.name}</p>
                  </div>

                  <div className='py-2 space-y-1'>
                    {[
                      { name: 'Order History', path: '/order', icon: <Package size={16} /> },
                      { name: 'Support Tickets', path: '/support', icon: <MessageCircle size={16} />, unread: unreadReplies },
                      { name: 'My Exchanges', path: '/my-exchanges', icon: <RefreshCw size={16} /> },
                      { name: 'Edit Profile', path: '/profile', icon: <User size={16} /> },
                    ].map(item => (
                      <button
                        key={item.name}
                        className={`relative w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${dk ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
                        onClick={() => { navigate(item.path); setShowProfile(false); }}
                      >
                        {item.icon}
                        {item.name}
                        {item.unread > 0 && <span className='absolute right-4 w-2 h-2 bg-red-500 rounded-full'></span>}
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
      </div>

      {/* Backdrop for Mobile Menu */}
      {menu && (
        <div 
            className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[190] md:hidden transition-opacity duration-500'
            onClick={() => setMenu(false)}
        ></div>
      )}

      {/* Mobile Drawer - Left Panel Design */}
      <div className={`w-[280px] h-full z-[200] transition-all duration-500 ease-in-out fixed top-0 ${menu ? 'left-0' : 'left-[-280px]'} flex flex-col p-8 md:hidden shadow-2xl ${dk ? 'bg-[#0f172a] border-r border-slate-800' : 'bg-white border-r border-gray-100'}`}>
        <div className='flex items-center justify-between mb-12'>
          <div className='flex items-center gap-3'>
            <img src={logo} alt="Logo" className='w-9 h-9' />
            <span className={`text-xl font-black ${dk ? 'text-white' : 'text-gray-900'}`}>VEBStore</span>
          </div>
          <button onClick={() => setMenu(false)} className={`p-2.5 rounded-xl transition-all active:scale-95 ${dk ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
            <X size={20} />
          </button>
        </div>

        <ul className='flex flex-col gap-6'>
          {['HOME', 'PRODUCTS', 'EXCHANGE', 'ABOUT', 'CONTACT'].map((item, i) => (
            <li
               key={item}
              className={`text-3xl font-black transition-all cursor-pointer tracking-tighter hover:translate-x-2 ${dk ? 'text-slate-600 hover:text-blue-400' : 'text-gray-300 hover:text-blue-600'}`}
              style={{ animationDelay: `${i * 100}ms` }}
              onClick={() => { navigate(item === 'HOME' ? '/' : `/${item.toLowerCase()}`); setMenu(false); }}
            >
              {item}
            </li>
          ))}
        </ul>

        <div className='mt-auto space-y-4'>
           {!userData ? (
             <button
               className='w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20'
               onClick={() => { navigate("/login"); setMenu(false); }}
             >
               SIGN IN
             </button>
           ) : (
             <div className={`p-4 rounded-2xl border ${dk ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                <p className='text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1'>Welcome Back</p>
                <p className={`text-sm font-black truncate ${dk ? 'text-white' : 'text-gray-900'}`}>{userData.name}</p>
             </div>
           )}
          <p className={`text-center text-[10px] font-black uppercase tracking-[0.2em] ${dk ? 'text-slate-700' : 'text-gray-400'}`}>VEBStore Elite Edition</p>
        </div>
      </div>
    </nav>
  )
}

export default Nav

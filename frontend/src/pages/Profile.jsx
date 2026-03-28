import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'
import { themeDataContext } from '../context/ThemeContext'
import { FaUser, FaPhone, FaLock, FaEye, FaEyeSlash, FaTags } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { Mail } from 'lucide-react'

function Profile() {
    const { serverUrl } = useContext(authDataContext)
    const { userData, getCurrentUser, forceRefreshUser } = useContext(userDataContext)
    const { isDark } = useContext(themeDataContext)
    const navigate = useNavigate()
    const dk = isDark

    const [form, setForm] = useState({
        name: userData?.name || '',
        phone: userData?.phone || '',
        preferredProductType: userData?.preferredProductType || 'TopWear',
        emailUpdatesOptIn: userData?.emailUpdatesOptIn ?? true,
        currentPassword: '',
        newPassword: '',
    })
    const [loading, setLoading] = useState(false)
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [changePassword, setChangePassword] = useState(false)

    useEffect(() => {
        console.log("=== PROFILE COMPONENT MOUNT ===")
        console.log("Current userData:", userData)
        
        // Force refresh user data when component mounts to ensure we have the latest data
        console.log("Forcing user data refresh...")
        forceRefreshUser();
        
        // Add delay and then fetch fresh data
        setTimeout(async () => {
            console.log("Fetching fresh user data in profile...")
            await getCurrentUser(true);
        }, 500);
    }, []);

    useEffect(() => {
        console.log("=== PROFILE USER DATA UPDATE ===")
        console.log("Updated userData:", userData)
        console.log("User ID:", userData?._id)
        console.log("User Email:", userData?.email)
        console.log("User Name:", userData?.name)
        
        if (userData) {
            setForm(prev => ({
                ...prev,
                name: userData.name || '',
                phone: userData.phone || '',
                preferredProductType: userData.preferredProductType || 'TopWear',
                emailUpdatesOptIn: userData.emailUpdatesOptIn ?? true
            }))
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        
        // Special handling for phone number
        if (name === 'phone') {
            // Only allow numbers and limit to 10 digits
            const phoneValue = value.replace(/\D/g, '').slice(0, 10)
            setForm(prev => ({ ...prev, [name]: phoneValue }))
            return
        }
        
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        console.log("=== PROFILE SUBMIT START ===")
        console.log("Form data:", form)
        console.log("Change password:", changePassword)
        
        if (form.phone && form.phone.trim().length !== 10) {
            console.log("Phone validation failed:", form.phone)
            return toast.error('Please enter a valid 10-digit mobile number')
        }
        
        // Validate phone format (should be exactly 10 digits)
        if (form.phone && !/^\d{10}$/.test(form.phone)) {
            console.log("Phone format validation failed:", form.phone)
            return toast.error('Mobile number must be exactly 10 digits')
        }
        
        try {
            setLoading(true)
            
            const payload = { 
                name: form.name, 
                phone: form.phone,
                preferredProductType: form.preferredProductType,
                emailUpdatesOptIn: form.emailUpdatesOptIn
            }
            
            if (changePassword) {
                if (!form.currentPassword || !form.newPassword) {
                    console.log("Password validation failed")
                    return toast.error('Passwords are required for change')
                }
                payload.currentPassword = form.currentPassword
                payload.newPassword = form.newPassword
            }
            
            console.log("Sending update payload:", payload)
            console.log("API endpoint:", serverUrl + '/api/auth/update-profile')
            
            // Add timestamp to prevent caching
            const timestamp = Date.now()
            const res = await axios.put(`${serverUrl}/api/auth/update-profile?t=${timestamp}`, payload, { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            })
            
            console.log("Update API response:", res.data)
            console.log("Update successful!")
            
            toast.success('Profile updated successfully! ✅')
            
            // Force refresh user data to get latest updates
            console.log("Refreshing user data after update...")
            await getCurrentUser(true)
            
            // Clear password fields after successful update
            if (changePassword) {
                setChangePassword(false)
                setForm(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: ''
                }))
            }
            
            console.log("=== PROFILE SUBMIT COMPLETE ===")
            
        } catch (err) {
            console.error("Profile update error:", err)
            console.error("Error details:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            })
            
            const errorMessage = err?.response?.data?.message || err?.message || 'Update failed'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    if (!userData) {
        return (
            <div className={`w-full min-h-screen flex items-center justify-center pt-[70px] ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
                <p className={`${dk ? 'text-slate-400' : 'text-gray-500'} text-lg`}>Please <span className='text-blue-500 cursor-pointer font-bold' onClick={() => navigate('/login')}>log in</span> to view your profile.</p>
            </div>
        )
    }

    return (
        <div className={`w-full min-h-screen pt-[100px] sm:pt-[120px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-32 transition-colors duration-500 ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
            <div className='max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12'>
                
                {/* Left Side: Summary & Navigation */}
                <div className='w-full lg:w-[350px] flex flex-col gap-4 sm:gap-6 shrink-0'>
                    <div className={`p-6 sm:p-10 rounded-[30px] sm:rounded-[40px] border shadow-2xl transition-all ${dk ? 'bg-[#1e293b] border-slate-700/50 shadow-black/30' : 'bg-white border-gray-100 shadow-gray-200/40'}`}>
                        <div className='flex flex-col items-center gap-4'>
                            <div className='w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-[0_10px_30px_rgba(37,99,235,0.3)]'>
                                {userData.name?.slice(0, 1).toUpperCase()}
                            </div>
                            <div className='text-center'>
                                <h1 className={`text-2xl font-black tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>{userData.name}</h1>
                                <p className={`text-sm font-medium ${dk ? 'text-slate-500' : 'text-gray-400'}`}>{userData.email}</p>
                            </div>
                            <div className={`flex items-center gap-2 px-5 py-2 rounded-full border text-[11px] font-black uppercase tracking-widest ${dk ? 'bg-slate-800 border-slate-700 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                <MdEdit /> Edit Profile
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <button 
                            onClick={() => navigate('/order')}
                            className={`p-6 rounded-[32px] border transition-all flex flex-col items-center gap-3 shadow-xl active:scale-95 group ${dk ? 'bg-[#1e293b] border-slate-700/50 shadow-black/20 hover:border-blue-500/50' : 'bg-white border-gray-100 shadow-gray-200/20 hover:border-blue-200'}`}
                        >
                            <span className='text-2xl group-hover:scale-125 transition-transform duration-500'>📦</span>
                            <span className={`text-[11px] font-black uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-gray-600'}`}>Orders</span>
                        </button>
                        <button 
                            onClick={() => navigate('/order')}
                            className={`p-6 rounded-[32px] border transition-all flex flex-col items-center gap-3 shadow-xl active:scale-95 group ${dk ? 'bg-[#1e293b] border-slate-700/50 shadow-black/20 hover:border-purple-500/50' : 'bg-white border-gray-100 shadow-gray-200/20 hover:border-purple-200'}`}
                        >
                            <span className='text-2xl group-hover:scale-125 transition-transform duration-500'>🔄</span>
                            <span className={`text-[11px] font-black uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-gray-600'}`}>Exchange</span>
                        </button>
                    </div>
                </div>

                {/* Right Side: Account Details Form */}
                <div className={`flex-1 p-8 sm:p-12 rounded-[48px] border shadow-2xl transition-all ${dk ? 'bg-[#1e293b] border-slate-700/50 shadow-black/30' : 'bg-white border-gray-100 shadow-gray-200/60'}`}>
                    <h2 className={`text-3xl font-black mb-10 tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>Signature Details</h2>

                    <form onSubmit={handleSubmit} className='space-y-8'>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                            {/* Name */}
                            <div className='space-y-2'>
                                <label className={`text-xs font-black uppercase tracking-[0.2em] ml-2 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Legal Name</label>
                                <div className={`flex items-center gap-4 h-14 px-6 rounded-2xl border transition-all ${dk ? 'bg-[#0f172a] border-slate-700 focus-within:border-blue-500 shadow-inner' : 'bg-gray-50 border-gray-200 focus-within:border-blue-500 shadow-sm'}`}>
                                    <FaUser className='text-blue-500 shrink-0' />
                                    <input
                                        type='text'
                                        name='name'
                                        value={form.name}
                                        onChange={handleChange}
                                        className={`bg-transparent flex-1 font-bold text-sm outline-none px-0 ${dk ? 'text-white' : 'text-gray-900'}`}
                                    />
                                </div>
                            </div>

                            {/* Mobile */}
                            <div className='space-y-2'>
                                <label className={`text-xs font-black uppercase tracking-[0.2em] ml-2 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Mobile Hub</label>
                                <div className={`flex items-center gap-4 h-14 px-6 rounded-2xl border transition-all ${dk ? 'bg-[#0f172a] border-slate-700 focus-within:border-blue-500 shadow-inner' : 'bg-gray-50 border-gray-200 focus-within:border-blue-500 shadow-sm'}`}>
                                    <FaPhone className='text-emerald-500 shrink-0' />
                                    <span className={`font-black text-xs ${dk ? 'text-slate-600' : 'text-gray-400'}`}>+91</span>
                                    <input
                                        type='tel'
                                        name='phone'
                                        value={form.phone}
                                        onChange={handleChange}
                                        maxLength={10}
                                        className={`bg-transparent flex-1 font-bold text-sm outline-none px-0 ${dk ? 'text-white' : 'text-gray-900'}`}
                                    />
                                </div>
                            </div>
                        </div>

                         {/* Product Type Functionality */}
                         <div className='space-y-2'>
                            <label className={`text-xs font-black uppercase tracking-[0.2em] ml-2 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Preferred Collection Type</label>
                            <div className={`flex items-center gap-4 h-14 px-6 rounded-2xl border transition-all ${dk ? 'bg-[#0f172a] border-slate-700 focus-within:border-blue-500 shadow-inner' : 'bg-gray-50 border-gray-100 focus-within:border-blue-500 shadow-sm'}`}>
                                <FaTags className='text-purple-500 shrink-0' />
                                <select
                                    name='preferredProductType'
                                    value={form.preferredProductType}
                                    onChange={handleChange}
                                    className={`bg-transparent flex-1 font-bold text-sm outline-none cursor-pointer appearance-none ${dk ? 'text-white' : 'text-gray-900'}`}
                                >
                                    <option value="TopWear" className={dk ? 'bg-slate-900' : ''}>TopWear Hub</option>
                                    <option value="BottomWear" className={dk ? 'bg-slate-900' : ''}>BottomWear Hub</option>
                                    <option value="WinterWear" className={dk ? 'bg-slate-900' : ''}>WinterWear Vault</option>
                                </select>
                                <div className={`pointer-events-none ${dk ? 'text-slate-500' : 'text-gray-400'}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            <p className={`text-[10px] font-bold ml-2 ${dk ? 'text-slate-600' : 'text-gray-400'}`}>This will prioritize your initial shop view.</p>
                        </div>

                        {/* Email Updates Opt-In */}
                        <div className={`p-6 rounded-3xl border transition-all ${dk ? 'bg-slate-800/50 border-slate-700' : 'bg-emerald-50/20 border-emerald-100'}`}>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-4'>
                                    <div className={`p-2.5 rounded-xl ${dk ? 'bg-emerald-600/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h3 className={`text-sm font-black ${dk ? 'text-slate-200' : 'text-gray-900'}`}>Order Updates via Email</h3>
                                        <p className={`text-[10px] font-bold ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Get real-time tracking & delivery notifications</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="emailUpdatesOptIn"
                                        checked={form.emailUpdatesOptIn}
                                        onChange={handleChange}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                        </div>

                        {/* Password Change Toggle */}
                        <div className={`p-6 rounded-3xl border transition-all ${dk ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50/30 border-blue-100'}`}>
                            <div className='flex items-center gap-3 mb-4'>
                                <input
                                    type='checkbox'
                                    id='changePassword'
                                    checked={changePassword}
                                    onChange={e => setChangePassword(e.target.checked)}
                                    className='w-5 h-5 accent-blue-600 cursor-pointer rounded-lg'
                                />
                                <label htmlFor='changePassword' className={`text-sm font-black cursor-pointer ${dk ? 'text-slate-300' : 'text-blue-900'}`}>Modify Security Credentials</label>
                            </div>

                            {changePassword && (
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-down'>
                                    <div className='space-y-1.5'>
                                        <label className={`text-[10px] font-black uppercase tracking-widest ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Current Key</label>
                                        <div className={`flex items-center gap-3 h-12 px-4 rounded-xl border ${dk ? 'bg-[#0f172a] border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                                            <input
                                                type={showCurrent ? 'text' : 'password'}
                                                name='currentPassword'
                                                value={form.currentPassword}
                                                onChange={handleChange}
                                                className={`bg-transparent flex-1 font-bold text-sm outline-none ${dk ? 'text-white' : 'text-gray-900'}`}
                                            />
                                            <button type='button' onClick={() => setShowCurrent(p => !p)} className='text-gray-400'>
                                                {showCurrent ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className='space-y-1.5'>
                                        <label className={`text-[10px] font-black uppercase tracking-widest ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Signature Key</label>
                                        <div className={`flex items-center gap-3 h-12 px-4 rounded-xl border ${dk ? 'bg-[#0f172a] border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                                            <input
                                                type={showNew ? 'text' : 'password'}
                                                name='newPassword'
                                                value={form.newPassword}
                                                onChange={handleChange}
                                                className={`bg-transparent flex-1 font-bold text-sm outline-none ${dk ? 'text-white' : 'text-gray-900'}`}
                                            />
                                            <button type='button' onClick={() => setShowNew(p => !p)} className='text-gray-400'>
                                                {showNew ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type='submit'
                            disabled={loading}
                            className={`w-full h-16 rounded-[20px] font-black text-sm uppercase tracking-[0.3em] text-white shadow-2xl transition-all active:scale-95 flex items-center justify-center ${loading ? 'bg-gray-400' : dk ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30' : 'bg-gray-950 hover:bg-black shadow-gray-950/20'}`}
                        >
                            {loading ? 'Processing...' : 'Sync Signature Profile'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile

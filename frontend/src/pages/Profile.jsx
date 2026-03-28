import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'
import { themeDataContext } from '../context/ThemeContext'
import { FaUser, FaPhoneAlt, FaLock, FaEye, FaEyeSlash, FaTags, FaClipboardList, FaExchangeAlt } from 'react-icons/fa'
import { MdEdit, MdVerifiedUser } from 'react-icons/md'
import { Mail, ShieldCheck } from 'lucide-react'

function Profile() {
    const { serverUrl } = useContext(authDataContext)
    const { userData, getCurrentUser, userLoading } = useContext(userDataContext)
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
        getCurrentUser(true);
    }, []);

    useEffect(() => {
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
        if (name === 'phone') {
            const phoneValue = value.replace(/\D/g, '').slice(0, 10)
            setForm(prev => ({ ...prev, [name]: phoneValue }))
            return
        }
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (form.phone && form.phone.trim().length !== 10) {
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
                    return toast.error('Passwords are required for change')
                }
                payload.currentPassword = form.currentPassword
                payload.newPassword = form.newPassword
            }
            
            const res = await axios.put(`${serverUrl}/api/auth/update-profile`, payload, { 
                withCredentials: true 
            })
            
            toast.success('Your Elite profile has been synchronized! ✅')
            await getCurrentUser(true)
            
            if (changePassword) {
                setChangePassword(false)
                setForm(prev => ({ ...prev, currentPassword: '', newPassword: '' }))
            }
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Synchronization failed'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    if (userLoading) {
        return (
            <div className={`w-full min-h-screen flex items-center justify-center ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                    <p className={`${dk ? 'text-slate-400' : 'text-gray-500'} font-black text-xs uppercase tracking-[0.4em]`}>Authenticating Hub...</p>
                </div>
            </div>
        )
    }

    if (!userData) {
        return (
            <div className={`w-full min-h-screen flex items-center justify-center ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
                <div className='text-center space-y-4'>
                    <p className={`${dk ? 'text-slate-400' : 'text-gray-500'} text-lg font-bold`}>Session Expired or Not Logged In</p>
                    <button onClick={() => navigate('/login')} className='px-8 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all'>Log In to Access</button>
                </div>
            </div>
        )
    }

    return (
        <div className={`w-full min-h-screen pt-[100px] sm:pt-[130px] px-4 sm:px-[5vw] pb-32 transition-colors duration-500 ${dk ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
            <div className='max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-14'>
                
                {/* Profile Identity Sidebar */}
                <div className='w-full lg:w-[350px] space-y-6 shrink-0'>
                    <div className={`relative p-8 rounded-[40px] border overflow-hidden shadow-2xl transition-all ${dk ? 'bg-slate-900/50 border-slate-800 shadow-black/40' : 'bg-white border-gray-100 shadow-slate-200/50'}`}>
                        {/* Decorative Background */}
                        <div className='absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl'></div>
                        
                        <div className='relative flex flex-col items-center gap-6'>
                            <div className='relative'>
                                <div className='w-28 h-28 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-[35px] flex items-center justify-center text-white text-4xl font-black shadow-2xl rotate-3'>
                                    <span className='-rotate-3'>{userData.name?.slice(0, 1).toUpperCase()}</span>
                                </div>
                                <div className='absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-4 border-white dark:border-slate-900'>
                                    <ShieldCheck size={18} />
                                </div>
                            </div>
                            
                            <div className='text-center'>
                                <h1 className={`text-2xl font-black tracking-tight ${dk ? 'text-white' : 'text-slate-900'}`}>{userData.name}</h1>
                                <p className={`text-sm font-bold mt-1 ${dk ? 'text-blue-400' : 'text-blue-600'}`}>ID: #{userData._id?.slice(-6).toUpperCase()}</p>
                            </div>

                            <div className={`w-full h-[1px] ${dk ? 'bg-slate-800' : 'bg-slate-100'}`}></div>

                            <div className='w-full space-y-3'>
                                <div className='flex items-center justify-between text-[11px] font-black uppercase tracking-widest opacity-60'>
                                    <span>Account Tier</span>
                                    <span className='text-emerald-500 font-black'>Elite Member</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Shortcut Cards */}
                    <div className='grid grid-cols-2 gap-4'>
                        <button onClick={() => navigate('/order')} className={`p-6 rounded-[35px] border flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95 group ${dk ? 'bg-slate-900/50 border-slate-800 hover:border-blue-500/50' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
                            <FaClipboardList className={`text-2xl ${dk ? 'text-slate-500 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-600'} transition-colors`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${dk ? 'text-slate-500' : 'text-slate-600'}`}>Orders</span>
                        </button>
                        <button onClick={() => navigate('/my-exchanges')} className={`p-6 rounded-[35px] border flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95 group ${dk ? 'bg-slate-900/50 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-100 hover:border-emerald-200'}`}>
                            <FaExchangeAlt className={`text-2xl ${dk ? 'text-slate-500 group-hover:text-emerald-400' : 'text-slate-400 group-hover:text-emerald-600'} transition-colors`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${dk ? 'text-slate-500' : 'text-slate-600'}`}>Exchanges</span>
                        </button>
                    </div>
                </div>

                {/* Account Settings Content Form */}
                <div className={`flex-1 p-8 sm:p-14 rounded-[50px] border shadow-2xl transition-all ${dk ? 'bg-slate-900/40 border-slate-800 shadow-black/30' : 'bg-white border-slate-100 shadow-slate-200/60'}`}>
                    <div className='flex items-center gap-4 mb-12'>
                        <div className={`p-4 rounded-2xl ${dk ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            <FaUser size={24} />
                        </div>
                        <div>
                            <h2 className={`text-3xl font-black tracking-tight ${dk ? 'text-white' : 'text-slate-900'}`}>Signature Vault</h2>
                            <p className={`text-sm font-bold opacity-60 ${dk ? 'text-slate-400' : 'text-slate-500'}`}>Personalize your elite shopping experience.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-10'>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                            {/* Legal Name */}
                            <div className='space-y-3'>
                                <label className={`text-[10px] font-black uppercase tracking-[0.3em] ml-2 ${dk ? 'text-slate-500' : 'text-slate-400'}`}>Signature Name</label>
                                <div className={`group flex items-center gap-4 h-16 px-6 rounded-2xl border transition-all duration-300 ${dk ? 'bg-slate-950/50 border-slate-800 focus-within:border-blue-500 focus-within:bg-slate-950' : 'bg-slate-50/50 border-slate-100 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-blue-500/5'}`}>
                                    <FaUser className='text-blue-500 transition-transform group-focus-within:scale-110' />
                                    <input type='text' name='name' value={form.name} onChange={handleChange} className={`bg-transparent flex-1 font-bold text-sm outline-none ${dk ? 'text-white' : 'text-slate-900'}`} required />
                                </div>
                            </div>

                            {/* Mobile Number */}
                            <div className='space-y-3'>
                                <label className={`text-[10px] font-black uppercase tracking-[0.3em] ml-2 ${dk ? 'text-slate-500' : 'text-slate-400'}`}>Verified Mobile</label>
                                <div className={`group flex items-center gap-4 h-16 px-6 rounded-2xl border transition-all duration-300 ${dk ? 'bg-slate-950/50 border-slate-800 focus-within:border-emerald-500 focus-within:bg-slate-950' : 'bg-slate-50/50 border-slate-100 focus-within:border-emerald-500 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-emerald-500/5'}`}>
                                    <FaPhoneAlt className='text-emerald-500 transition-transform group-focus-within:scale-110' />
                                    <span className={`text-xs font-black opacity-30 ${dk ? 'text-white' : 'text-slate-950'}`}>+91</span>
                                    <input type='tel' name='phone' value={form.phone} onChange={handleChange} maxLength={10} className={`bg-transparent flex-1 font-bold text-sm outline-none ${dk ? 'text-white' : 'text-slate-900'}`} placeholder="Mobile Number" />
                                </div>
                            </div>
                        </div>

                         {/* Collection Preference */}
                         <div className='space-y-3'>
                            <label className={`text-[10px] font-black uppercase tracking-[0.3em] ml-2 ${dk ? 'text-slate-500' : 'text-slate-400'}`}>Primary Collection Interest</label>
                            <div className={`relative group flex items-center gap-4 h-16 px-6 rounded-2xl border transition-all duration-300 ${dk ? 'bg-slate-950/50 border-slate-800 focus-within:border-purple-500 focus-within:bg-slate-950' : 'bg-slate-50/50 border-slate-100 focus-within:border-purple-500 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-purple-500/5'}`}>
                                <FaTags className='text-purple-500' />
                                <select name='preferredProductType' value={form.preferredProductType} onChange={handleChange} className={`bg-transparent flex-1 font-bold text-sm outline-none cursor-pointer appearance-none ${dk ? 'text-white' : 'text-slate-900'}`}>
                                    <option value="TopWear" className={dk ? 'bg-slate-900' : ''}>Luxury TopWear</option>
                                    <option value="BottomWear" className={dk ? 'bg-slate-900' : ''}>Elite BottomWear</option>
                                    <option value="WinterWear" className={dk ? 'bg-slate-900' : ''}>Seasonal Winter Vault</option>
                                </select>
                                <div className='pointer-events-none opacity-40'><FaTags size={12} /></div>
                            </div>
                        </div>

                        {/* Order Notifications Toggle */}
                        <div className={`p-8 rounded-[35px] border transition-all ${dk ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                            <div className='flex items-center justify-between gap-6'>
                                <div className='flex items-center gap-5'>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dk ? 'bg-emerald-600/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className={`text-base font-black ${dk ? 'text-slate-100' : 'text-slate-900'}`}>Email Notifications</h3>
                                        <p className={`text-[11px] font-bold mt-0.5 opacity-50 ${dk ? 'text-slate-400' : 'text-slate-500'}`}>Receive tracking & delivery alerts directly</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="emailUpdatesOptIn" checked={form.emailUpdatesOptIn} onChange={handleChange} className="sr-only peer" />
                                    <div className="w-14 h-7 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                                </label>
                            </div>
                        </div>

                        {/* Privacy & Security Section */}
                        <div className={`p-8 rounded-[35px] border transition-all ${dk ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                            <div className='flex items-center justify-between mb-8'>
                                <div className='flex items-center gap-4'>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dk ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 shadow-sm'}`}>
                                        <FaLock size={16} />
                                    </div>
                                    <h3 className={`text-sm font-black uppercase tracking-widest ${dk ? 'text-slate-300' : 'text-slate-900'}`}>Security Credentials</h3>
                                </div>
                                <button type='button' onClick={() => setChangePassword(!changePassword)} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg border transition-all ${changePassword ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                                    {changePassword ? 'Cancel Modification' : 'Modify Password'}
                                </button>
                            </div>

                            {changePassword && (
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 animate-fade-in-down'>
                                    <div className='space-y-3'>
                                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${dk ? 'text-slate-500' : 'text-slate-400'}`}>Current Key</label>
                                        <div className={`flex items-center gap-3 h-14 px-5 rounded-2xl border ${dk ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                            <input type={showCurrent ? 'text' : 'password'} name='currentPassword' value={form.currentPassword} onChange={handleChange} className={`bg-transparent flex-1 font-bold text-sm outline-none ${dk ? 'text-white' : 'text-slate-950'}`} placeholder="********" />
                                            <button type='button' onClick={() => setShowCurrent(!showCurrent)} className='text-slate-400 px-2'>
                                                {showCurrent ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className='space-y-3'>
                                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${dk ? 'text-slate-500' : 'text-slate-400'}`}>New Signature Key</label>
                                        <div className={`flex items-center gap-3 h-14 px-5 rounded-2xl border ${dk ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                            <input type={showNew ? 'text' : 'password'} name='newPassword' value={form.newPassword} onChange={handleChange} className={`bg-transparent flex-1 font-bold text-sm outline-none ${dk ? 'text-white' : 'text-slate-950'}`} placeholder="********" />
                                            <button type='button' onClick={() => setShowNew(!showNew)} className='text-slate-400 px-2'>
                                                {showNew ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Master Action Button */}
                        <div className='pt-6'>
                            <button
                                type='submit'
                                disabled={loading}
                                className={`w-full group relative overflow-hidden h-20 rounded-[25px] flex items-center justify-center transition-all active:scale-[0.98] shadow-[0_20px_50px_rgba(37,99,235,0.3)] ${loading ? 'opacity-70 cursor-wait' : dk ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-950 hover:bg-black'}`}
                            >
                                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                                <span className='relative text-white font-black text-xs sm:text-sm uppercase tracking-[0.5em] flex items-center gap-4'>
                                    {loading ? 'Synchronizing Intelligence...' : (
                                        <>
                                            <MdVerifiedUser size={20} />
                                            Sync Profile Hub
                                        </>
                                    )}
                                </span>
                            </button>
                            <p className={`text-center mt-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ${dk ? 'text-slate-400' : 'text-slate-500'}`}>Encrypted via VEBStore Security Protocol</p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile


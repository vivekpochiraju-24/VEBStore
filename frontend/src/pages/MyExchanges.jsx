import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { authDataContext } from '../context/AuthContext'
import { themeDataContext } from '../context/ThemeContext'
import { Package, Clock, CheckCircle, TrendingUp, XCircle, Search, Filter, ArrowRight, Coins, Info, Trash2 } from 'lucide-react'

const MyExchanges = () => {
    const [exchanges, setExchanges] = useState([])
    const [loading, setLoading] = useState(true)
    const { serverUrl } = useContext(authDataContext)
    const { isDark } = useContext(themeDataContext)
    const dk = isDark

    useEffect(() => {
        const fetchExchanges = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/exchange/my-requests`, { withCredentials: true })
                setExchanges(response.data)
            } catch (error) {
                console.error('Error fetching exchanges:', error)
                toast.error('Failed to fetch exchange requests')
            } finally {
                setLoading(false)
            }
        }
        fetchExchanges()
    }, [serverUrl])

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Pending': return { color: 'text-amber-500 bg-amber-500/10', icon: <Clock size={14} />, desc: 'Elite inspection in progress' }
            case 'Approved': return { color: 'text-emerald-500 bg-emerald-500/10', icon: <CheckCircle size={14} />, desc: 'Credit added to Supercoins' }
            case 'Rejected': return { color: 'text-rose-500 bg-rose-500/10', icon: <XCircle size={14} />, desc: 'Standard not met' }
            case 'In Review': return { color: 'text-blue-500 bg-blue-500/10', icon: <TrendingUp size={14} />, desc: 'Stylist verification' }
            default: return { color: 'text-gray-500 bg-gray-500/10', icon: <Info size={14} />, desc: 'Processing' }
        }
    }

    const handleDeleteExchange = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this request?')) return
        try {
            await axios.delete(`${serverUrl}/api/exchange/my-requests/${id}`, { withCredentials: true })
            setExchanges(prev => prev.filter(ex => ex._id !== id))
            toast.success('Exchange request cancelled')
        } catch (error) {
            toast.error('Failed to cancel request')
        }
    }

    if (loading) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen pb-24 ${dk ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
            <div className='max-w-7xl mx-auto px-4 pt-32'>
                {/* Header Section */}
                <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16'>
                    <div className='space-y-4'>
                        <div className='flex items-center gap-3'>
                            <div className='w-12 h-[2px] bg-blue-600 rounded-full blur-[1px]'></div>
                            <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${dk ? 'text-blue-400' : 'text-blue-600'}`}>Eco-System Dashboard</span>
                        </div>
                        <h1 className={`text-5xl sm:text-6xl font-black tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>My Portfolio<span className='text-blue-600'>.</span></h1>
                        <p className={`text-base font-medium max-w-xl ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Manage your circular fashion assets and track real-time credit valuations.</p>
                    </div>
                    
                    <div className={`p-2 rounded-[2rem] flex items-center gap-8 border-2 transition-all hover:shadow-2xl ${dk ? 'bg-slate-800/40 border-slate-700 shadow-blue-500/5' : 'bg-white border-gray-100 shadow-gray-200/50'}`}>
                        <div className='flex items-baseline gap-2 pl-6'>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Active Requests</span>
                            <span className={`text-4xl font-black ${dk ? 'text-blue-500' : 'text-blue-600'}`}>{exchanges.length}</span>
                        </div>
                        <button onClick={() => window.location.href='/exchange'} className={`px-8 h-14 rounded-2xl flex items-center gap-3 text-sm font-black transition-all group ${dk ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20' : 'bg-black text-white hover:bg-gray-800'}`}>
                             Plus New Request <ArrowRight size={18} className='transition-transform group-hover:translate-x-1' />
                        </button>
                    </div>
                </div>

                {exchanges.length === 0 ? (
                    <div className={`text-center py-32 rounded-[4rem] border-2 border-dashed flex flex-col items-center group transition-all duration-700 hover:border-blue-500/40 ${dk ? 'bg-slate-900/20 border-slate-800' : 'bg-white/50 border-gray-200 shadow-xl'}`}>
                        <div className={`w-32 h-32 rounded-[3.5rem] flex items-center justify-center mb-8 transition-all duration-700 group-hover:scale-110 group-hover:rotate-[15deg] ${dk ? 'bg-slate-800 shadow-2xl' : 'bg-white shadow-2xl shadow-gray-200/50'}`}>
                            <Package size={48} className='text-gray-300 group-hover:text-blue-500 transition-colors' />
                        </div>
                        <h3 className={`text-2xl font-black mb-4 ${dk ? 'text-white' : 'text-gray-900'}`}>Begin Your Journey</h3>
                        <p className={`text-base font-medium mb-10 max-w-md mx-auto ${dk ? 'text-slate-500' : 'text-gray-500'}`}>Transform your high-end apparel into premium Supercoins. Join the elite network of sustainable fashionistas today.</p>
                        <button onClick={() => window.location.href='/exchange'} className='flex items-center gap-3 group/btn text-blue-500 font-black uppercase tracking-widest text-xs h-12 px-8 rounded-full border-2 border-blue-500/20 hover:bg-blue-500/5 transition-all'>
                            Initiate Exchange <ArrowRight size={16} className='transition-transform group-hover/btn:translate-x-1' />
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 gap-10'>
                        {exchanges.map((exchange) => {
                            const status = getStatusConfig(exchange.status)
                            return (
                                <div key={exchange._id} className={`group rounded-[3.5rem] border-2 transition-all hover:translate-y-[-4px] overflow-hidden ${dk ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/60 hover:border-blue-500/30 shadow-2xl' : 'bg-white border-gray-100 shadow-2xl shadow-gray-200/40'}`}>
                                    <div className='p-10'>
                                        <div className='flex flex-col xl:flex-row gap-12'>
                                            {/* Left: Clean Single Image View */}
                                            <div className='xl:w-80 shrink-0'>
                                                <div className={`aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 relative group/primary transition-all duration-700 ${dk ? 'bg-slate-800 border-slate-800' : 'bg-gray-50 border-gray-50 shadow-lg'}`}>
                                                    <div className='absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.3em] bg-blue-600 text-white z-10 shadow-lg'>Primary View</div>
                                                    {exchange.oldProductImages && exchange.oldProductImages[0] ? (
                                                        <img 
                                                            src={exchange.oldProductImages[0]} 
                                                            alt="Primary" 
                                                            className='w-full h-full object-cover transition-transform duration-1000 group-hover/primary:scale-110'
                                                        />
                                                    ) : (
                                                        <div className='w-full h-full flex flex-col items-center justify-center gap-3 opacity-20'>
                                                            <Package size={40} />
                                                            <span className='text-[10px] font-black uppercase tracking-widest'>No Image Preview</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Rich Data Interface */}
                                            <div className='flex-1 flex flex-col'>
                                                <div className='flex flex-wrap items-start justify-between gap-6 mb-8'>
                                                    <div>
                                                        <div className='flex items-center gap-2 mb-2'>
                                                            <div className='w-2 h-2 rounded-full bg-blue-500 animate-pulse'></div>
                                                            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${dk ? 'text-blue-400/60' : 'text-blue-600/60'}`}>Asset ID: {exchange._id.slice(-8)}</span>
                                                        </div>
                                                        <h3 className={`text-4xl font-black mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>{exchange.oldProduct}</h3>
                                                        <div className='flex flex-wrap items-center gap-3'>
                                                            <div className={`px-4 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-widest ${dk ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                                                {exchange.clothQuality} Quality
                                                            </div>
                                                            <div className={`px-4 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-widest ${dk ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                                                {exchange.clothYearsUsed} Years Used 
                                                            </div>
                                                            <div className={`px-4 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-widest ${dk ? 'bg-slate-800 border-slate-700 text-rose-400/80 border-rose-500/10' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
                                                                Damages: {exchange.clothDamages}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className='flex flex-col items-end gap-3'>
                                                        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs h-12 shadow-inner ${status.color}`}>
                                                            {status.icon} {exchange.status.toUpperCase()}
                                                        </div>
                                                        {exchange.status === 'Pending' && (
                                                            <button 
                                                                onClick={() => handleDeleteExchange(exchange._id)}
                                                                className='flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity pr-2'
                                                            >
                                                                <Trash2 size={12} /> Cancel Request
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className={`text-sm leading-[1.8] mb-10 max-w-2xl font-medium ${dk ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    {exchange.oldProductDescription || 'Comprehensive garment appraisal in progress. Our stylists are matching your item against our premium quality standards.'}
                                                </p>

                                                <div className='mt-auto flex flex-wrap items-center gap-12'>
                                                    <div className='space-y-1.5'>
                                                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${dk ? 'text-slate-600' : 'text-gray-400'}`}>System Estimation</p>
                                                        <div className='flex items-baseline gap-1'>
                                                            <span className={`text-3xl font-black ${dk ? 'text-white' : 'text-gray-900'}`}>{exchange.requestedCoins || 0}</span>
                                                            <span className='text-xs font-bold text-amber-500'>COINS</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {exchange.status === 'Approved' ? (
                                                        <div className='flex items-center gap-4 bg-emerald-500/5 p-4 rounded-3xl border border-emerald-500/10'>
                                                            <div className='w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20'>
                                                                <Coins size={24} />
                                                            </div>
                                                            <div>
                                                                <p className='text-[10px] font-black uppercase tracking-widest text-emerald-500/60'>Reward Credited</p>
                                                                <p className='text-xl font-black text-emerald-500 tracking-tight'>+ {exchange.grantedCoins} Supercoins</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={`px-6 h-14 rounded-3xl flex items-center gap-4 border ${dk ? 'bg-slate-800/40 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                                                            <Clock size={20} className='text-blue-500' />
                                                            <p className={`text-xs font-bold ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Review completion expected in 2-3 business days.</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {exchange.adminNotes && (
                                                    <div className={`mt-10 p-8 rounded-[2rem] flex items-start gap-5 relative group/notes ${dk ? 'bg-blue-900/10 border-blue-500/20' : 'bg-blue-50/40 border-blue-100'}`}>
                                                        <div className='absolute top-0 right-10 w-20 h-full bg-blue-500/5 blur-3xl'></div>
                                                        <Info className='text-blue-500 shrink-0 mt-1' size={20} />
                                                        <div className='relative z-10'>
                                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${dk ? 'text-blue-400/60' : 'text-blue-600/60'}`}>Stylist Verification Notes</p>
                                                            <p className={`text-sm font-bold leading-relaxed italic ${dk ? 'text-slate-300' : 'text-gray-700'}`}>"{exchange.adminNotes}"</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyExchanges

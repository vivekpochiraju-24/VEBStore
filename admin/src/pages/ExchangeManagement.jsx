import React, { useState, useEffect, useContext } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { themeDataContext } from '../context/ThemeContext'
import { toast } from 'react-toastify'
import { Package, CheckCircle2, XCircle, Clock, RefreshCw, ChevronDown, ChevronUp, Coins, Home } from 'lucide-react'

const STATUS_META = {
    Pending:          { color: 'bg-amber-100 text-amber-700 border-amber-200',   icon: <Clock size={12} /> },
    Approved:         { color: 'bg-green-100 text-green-700 border-green-200',   icon: <CheckCircle2 size={12} /> },
    Rejected:         { color: 'bg-red-100 text-red-700 border-red-200',         icon: <XCircle size={12} /> },
    Completed:        { color: 'bg-blue-100 text-blue-700 border-blue-200',      icon: <CheckCircle2 size={12} /> },
    'Return to Hub':  { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: <Home size={12} /> },
}

const CONDITION_COLOR = {
    Excellent: 'text-green-600',
    Good:      'text-blue-600',
    Fair:      'text-yellow-600',
    Poor:      'text-red-600',
}

const ExchangeManagement = () => {
    const [exchanges, setExchanges]         = useState([])
    const [loading, setLoading]             = useState(true)
    const [selectedExchange, setSelectedExchange] = useState(null)
    const [formData, setFormData]           = useState({ status: '', grantedCoins: '', adminNotes: '' })
    const [updating, setUpdating]           = useState(false)
    const [expandedId, setExpandedId]       = useState(null)
    const [filterStatus, setFilterStatus]   = useState('All')
    const { serverUrl }  = useContext(authDataContext)
    const { isDark }     = useContext(themeDataContext)
    const dk = isDark

    const fetchExchanges = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${serverUrl}/api/exchange/all-requests`, { withCredentials: true })
            setExchanges(response.data)
        } catch (error) {
            console.error('Error fetching exchanges:', error)
            toast.error('Failed to load exchange requests')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchExchanges() }, [serverUrl])

    const handleSelect = (exchange) => {
        setSelectedExchange(exchange)
        setFormData({
            status:       exchange.status,
            grantedCoins: exchange.grantedCoins || '',
            adminNotes:   exchange.adminNotes   || ''
        })
    }

    const handleReturnToHub = async (exchange) => {
        setUpdating(true)
        try {
            await axios.put(
                `${serverUrl}/api/exchange/${exchange._id}/status`,
                { status: 'Return to Hub', grantedCoins: exchange.grantedCoins || 0, adminNotes: 'Item requested to be returned to hub for inspection.' },
                { withCredentials: true }
            )
            setExchanges(prev => prev.map(e =>
                e._id === exchange._id ? { ...e, status: 'Return to Hub' } : e
            ))
            toast.success(`Exchange #${exchange._id.slice(-6).toUpperCase()} marked as Return to Hub`)
        } catch (err) {
            toast.error('Could not mark as Return to Hub')
        } finally {
            setUpdating(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedExchange) return
        setUpdating(true)
        try {
            const updateData = {
                status:       formData.status,
                grantedCoins: Number(formData.grantedCoins) || 0,
                adminNotes:   formData.adminNotes
            }
            await axios.put(`${serverUrl}/api/exchange/${selectedExchange._id}/status`, updateData, { withCredentials: true })
            setExchanges(prev => prev.map(e =>
                e._id === selectedExchange._id
                    ? { ...e, ...updateData, adminApproved: updateData.status === 'Approved' }
                    : e
            ))
            toast.success(`Exchange ${formData.status.toLowerCase()} successfully!`)
            setSelectedExchange(null)
        } catch (error) {
            toast.error('Failed to update exchange')
        } finally {
            setUpdating(false)
        }
    }

    const counts = {
        All:              exchanges.length,
        Pending:          exchanges.filter(e => e.status === 'Pending').length,
        Approved:         exchanges.filter(e => e.status === 'Approved').length,
        Rejected:         exchanges.filter(e => e.status === 'Rejected').length,
        'Return to Hub':  exchanges.filter(e => e.status === 'Return to Hub').length,
    }

    const filtered = filterStatus === 'All' ? exchanges : exchanges.filter(e => e.status === filterStatus)

    return (
        <div className={`w-full min-h-screen flex flex-col transition-colors duration-500 ${dk ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            <Nav />
            <div className='flex flex-1'>
                <Sidebar />
                <main className='flex-1 p-6 lg:ml-[280px] mt-20 pb-20'>

                    {/* Header */}
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 text-white'>
                                <RefreshCw size={20} />
                            </div>
                            <div>
                                <h1 className={`text-3xl font-black tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>Exchange Management</h1>
                                <p className={`text-sm font-medium ${dk ? 'text-slate-500' : 'text-gray-500'}`}>Review · Approve · Allocate Supercoins · Return to Hub</p>
                            </div>
                        </div>
                        <button onClick={fetchExchanges} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${dk ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'}`}>
                            <RefreshCw size={14} /> Refresh
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className='flex flex-wrap gap-2 mb-6'>
                        {Object.entries(counts).map(([status, count]) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                                    filterStatus === status
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                                        : dk ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {status}
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${filterStatus === status ? 'bg-white/20 text-white' : dk ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                                    {count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className='flex items-center justify-center py-20'>
                            <div className='flex flex-col items-center gap-3'>
                                <div className='animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full'></div>
                                <p className={`text-sm font-medium ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Loading exchanges...</p>
                            </div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className={`text-center py-20 rounded-3xl border ${dk ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <div className='text-5xl mb-3'>📦</div>
                            <p className={`font-bold text-lg ${dk ? 'text-slate-300' : 'text-gray-700'}`}>No exchange requests</p>
                            <p className={`text-sm mt-1 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>No {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} exchanges found.</p>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {filtered.map((exchange) => {
                                const meta    = STATUS_META[exchange.status] || STATUS_META.Pending
                                const isOpen  = expandedId === exchange._id
                                const isEditing = selectedExchange?._id === exchange._id

                                return (
                                    <div key={exchange._id} className={`rounded-2xl border overflow-hidden transition-all duration-300 ${dk ? 'bg-[#1e293b] border-slate-700 shadow-black/10' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}`}>

                                        {/* Card Header Row */}
                                        <div
                                            className={`flex items-center justify-between gap-4 p-5 cursor-pointer ${dk ? 'hover:bg-slate-800/40' : 'hover:bg-gray-50/50'} transition-colors`}
                                            onClick={() => setExpandedId(isOpen ? null : exchange._id)}
                                        >
                                            {/* Left: Avatar + info */}
                                            <div className='flex items-center gap-4 min-w-0'>
                                                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-black text-sm flex items-center justify-center shadow shrink-0'>
                                                    {exchange.user?.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div className='min-w-0'>
                                                    <p className={`font-bold text-sm truncate ${dk ? 'text-white' : 'text-gray-900'}`}>{exchange.user?.name}</p>
                                                    <p className={`text-xs truncate ${dk ? 'text-slate-500' : 'text-gray-400'}`}>{exchange.user?.email}</p>
                                                </div>
                                            </div>

                                            {/* Center: Item + condition */}
                                            <div className='hidden md:block min-w-0 flex-1 text-center'>
                                                <p className={`text-sm font-bold truncate ${dk ? 'text-slate-200' : 'text-gray-800'}`}>{exchange.oldProduct}</p>
                                                <p className={`text-xs font-semibold ${CONDITION_COLOR[exchange.oldProductCondition] || 'text-gray-500'}`}>{exchange.oldProductCondition}</p>
                                            </div>

                                            {/* Right: coins + status + expand */}
                                            <div className='flex items-center gap-3 shrink-0'>
                                                {exchange.grantedCoins > 0 && (
                                                    <span className='flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs font-black rounded-full border border-yellow-200'>
                                                        💛 {exchange.grantedCoins}
                                                    </span>
                                                )}
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.color}`}>
                                                    {meta.icon} {exchange.status}
                                                </span>
                                                {isOpen ? <ChevronUp size={16} className='text-gray-400' /> : <ChevronDown size={16} className='text-gray-400' />}
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        {isOpen && (
                                            <div className={`border-t px-5 pb-5 pt-4 ${dk ? 'border-slate-700' : 'border-gray-100'}`}>
                                                <div className='flex flex-col xl:flex-row gap-6'>

                                                    {/* Left: dress details + images */}
                                                    <div className='flex-1 space-y-4'>
                                                        <div className={`p-4 rounded-xl ${dk ? 'bg-slate-800' : 'bg-gray-50'}`}>
                                                            <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Old Dress Details</p>
                                                            <div className='grid grid-cols-2 gap-4 text-sm'>
                                                                <div>
                                                                    <span className={`text-xs ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Cloth Quality</span>
                                                                    <p className={`font-black text-blue-500 uppercase tracking-widest`}>{exchange.clothQuality || 'N/A'}</p>
                                                                </div>
                                                                <div>
                                                                    <span className={`text-xs ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Years Used</span>
                                                                    <p className={`font-black ${dk ? 'text-slate-300' : 'text-gray-600'}`}>{exchange.clothYearsUsed || 'N/A'}</p>
                                                                </div>
                                                                <div className='col-span-2'>
                                                                    <span className={`text-xs ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Garment Damages</span>
                                                                    <p className={`font-bold ${exchange.clothDamages === 'None' ? 'text-emerald-500' : 'text-rose-500'}`}>{exchange.clothDamages || 'None Reported'}</p>
                                                                </div>
                                                                <div>
                                                                    <span className={`text-xs ${dk ? 'text-slate-500' : 'text-gray-400'}`}>System Recommended Credit</span>
                                                                    <p className={`font-black text-amber-500 uppercase tracking-widest`}>{exchange.requestedCoins || 0} Coins</p>
                                                                </div>
                                                                <div>
                                                                    <span className={`text-xs ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Submitted On</span>
                                                                    <p className={`font-semibold ${dk ? 'text-white' : 'text-gray-800'}`}>{new Date(exchange.createdAt).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                            {exchange.oldProductDescription && (
                                                                <div className='mt-3'>
                                                                    <span className={`text-xs ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Description</span>
                                                                    <p className={`text-sm mt-1 ${dk ? 'text-slate-300' : 'text-gray-600'}`}>{exchange.oldProductDescription}</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Images */}
                                                        {exchange.oldProductImages?.length > 0 && (
                                                            <div>
                                                                <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Submitted Photos ({exchange.oldProductImages.length})</p>
                                                                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                                                                    {['Front', 'Back', 'Left', 'Right'].map((label, idx) => (
                                                                        exchange.oldProductImages[idx] && (
                                                                            <div key={idx} className='relative group'>
                                                                                <div className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[9px] uppercase font-black bg-black/70 text-white z-10`}>
                                                                                    {label}
                                                                                </div>
                                                                                <img
                                                                                    src={exchange.oldProductImages[idx]}
                                                                                    alt={label}
                                                                                    className='w-full h-24 object-cover rounded-xl cursor-pointer border-2 border-transparent group-hover:border-blue-400 transition-all shadow-sm'
                                                                                    onClick={() => window.open(exchange.oldProductImages[idx], '_blank')}
                                                                                />
                                                                            </div>
                                                                        )
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Right: actions */}
                                                    <div className='xl:w-80 space-y-3'>

                                                        {/* Quick action: Return to Hub */}
                                                        {exchange.status !== 'Return to Hub' && exchange.status !== 'Completed' && (
                                                            <button
                                                                onClick={() => handleReturnToHub(exchange)}
                                                                disabled={updating}
                                                                className='w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-purple-600/20'
                                                            >
                                                                <Home size={16} />
                                                                Return to Hub
                                                            </button>
                                                        )}
                                                        {exchange.status === 'Return to Hub' && (
                                                            <div className='flex items-center gap-2 py-3 px-4 bg-purple-50 border border-purple-200 text-purple-700 rounded-xl font-bold text-sm'>
                                                                <Home size={16} /> Marked: Return to Hub
                                                            </div>
                                                        )}

                                                        {/* Update Status form */}
                                                        {isEditing ? (
                                                            <form onSubmit={handleSubmit} className={`space-y-3 p-4 rounded-xl border ${dk ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                                                                <p className={`text-xs font-black uppercase tracking-widest ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Update Exchange</p>

                                                                <select
                                                                    name='status'
                                                                    value={formData.status}
                                                                    onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
                                                                    className={`w-full px-3 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-blue-500/30 ${dk ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-800'}`}
                                                                >
                                                                    <option value='Pending'>⏳ Pending</option>
                                                                    <option value='Approved'>✅ Approved</option>
                                                                    <option value='Rejected'>❌ Rejected</option>
                                                                    <option value='Completed'>🎉 Completed</option>
                                                                    <option value='Return to Hub'>🏠 Return to Hub</option>
                                                                </select>

                                                                <div className='relative'>
                                                                    <Coins size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-amber-500' />
                                                                    <input
                                                                        type='number'
                                                                        name='grantedCoins'
                                                                        value={formData.grantedCoins}
                                                                        onChange={e => setFormData(p => ({ ...p, grantedCoins: e.target.value }))}
                                                                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500/30 ${dk ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-800'}`}
                                                                        placeholder={`Allocate (System: ${exchange.requestedCoins || 0} Coins)`}
                                                                        min='10'
                                                                        max='50'
                                                                    />
                                                                    <div className='absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-amber-500 opacity-60'>Range: 10-50</div>
                                                                </div>

                                                                <textarea
                                                                    name='adminNotes'
                                                                    value={formData.adminNotes}
                                                                    onChange={e => setFormData(p => ({ ...p, adminNotes: e.target.value }))}
                                                                    rows={2}
                                                                    className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500/30 resize-none ${dk ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500' : 'bg-white border-gray-200 text-gray-800 placeholder:text-gray-400'}`}
                                                                    placeholder='Notes for the user...'
                                                                />

                                                                <div className='flex gap-2'>
                                                                    <button type='submit' disabled={updating} className='flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm transition-all active:scale-95'>
                                                                        {updating ? 'Saving...' : '✅ Save Update'}
                                                                    </button>
                                                                    <button type='button' onClick={() => setSelectedExchange(null)} className={`px-4 py-2.5 rounded-xl font-bold text-sm border transition-all ${dk ? 'border-slate-600 text-slate-400 hover:bg-slate-700' : 'border-gray-200 text-gray-500 hover:bg-gray-100'}`}>
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleSelect(exchange)}
                                                                className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md shadow-blue-600/20'
                                                            >
                                                                Review & Update Status
                                                            </button>
                                                        )}

                                                        {/* Info pills */}
                                                        {exchange.adminNotes && (
                                                            <div className={`p-3 rounded-xl text-xs ${dk ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                                                                <p className='font-black uppercase tracking-widest text-[10px] mb-1'>Admin Notes</p>
                                                                {exchange.adminNotes}
                                                            </div>
                                                        )}
                                                        {exchange.adminApproved && exchange.grantedCoins > 0 && (
                                                            <div className='flex items-center gap-2 px-4 py-2.5 bg-yellow-50 border border-yellow-200 rounded-xl'>
                                                                <span className='text-lg'>💛</span>
                                                                <div>
                                                                    <p className='text-[10px] text-yellow-600 font-black uppercase tracking-widest'>Supercoins Granted</p>
                                                                    <p className='font-black text-yellow-700 text-lg'>{exchange.grantedCoins}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default ExchangeManagement

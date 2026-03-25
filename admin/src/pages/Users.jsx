import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../component/Sidebar'
import Nav from '../component/Nav'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { themeDataContext } from '../context/ThemeContext'
import { FaWhatsapp } from 'react-icons/fa'
import { Users as UsersIcon, ShoppingBag, Coins, Phone, Mail, Search, Send } from 'lucide-react'
import { toast } from 'react-toastify'

const STORE_NUMBER = '919603673436'

function Users() {
    const { serverUrl } = useContext(authDataContext)
    const { isDark } = useContext(themeDataContext)
    const dk = isDark

    const [users, setUsers]       = useState([])
    const [loading, setLoading]   = useState(true)
    const [search, setSearch]     = useState('')
    const [filter, setFilter]     = useState('all')  // all | buyers | whatsapp

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${serverUrl}/api/user/admin/all-users`, { withCredentials: true })
            setUsers(data)
        } catch (err) {
            console.error(err)
            toast.error('Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchUsers() }, [])

    // Build WhatsApp blast message for a single user
    const buildUpdateMessage = (user) => {
        const lines = []
        lines.push(`╔══════════════════════════╗`)
        lines.push(`  💎 *VEBStore — Exclusive Update*`)
        lines.push(`╚══════════════════════════╝`)
        lines.push(``)
        lines.push(`🌟 *Hi ${user.name}!* 🌟`)
        lines.push(``)
        lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━`)
        lines.push(`👤 *Your Account Summary:*`)
        lines.push(`   📧 Email: ${user.email}`)
        lines.push(`   🛍️ Total Orders: *${user.orderCount}*`)
        lines.push(`   💰 Total Spent: *₹${user.totalSpent}*`)
        lines.push(`   💛 Supercoins Balance: *${user.supercoins} Coins*`)
        lines.push(``)
        lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━`)
        lines.push(`🎁 *EXCLUSIVE OFFERS FOR YOU:*`)
        lines.push(`   ♻️ Exchange old clothes → Earn Supercoins`)
        lines.push(`   🪙 Apply Supercoins at checkout for instant discounts`)
        lines.push(`   🚚 Free delivery on orders above ₹999`)
        lines.push(`   🏷️ New collections dropping this week!`)
        lines.push(``)
        lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━`)
        lines.push(`🛍️ Shop Now: http://localhost:5173`)
        lines.push(``)
        lines.push(`💜 *Thank you for being a VEBStore VIP!*`)
        lines.push(`_Reply STOP to unsubscribe._`)
        return lines.join('\n')
    }

    const handleSendUpdate = (user) => {
        const phone = user.whatsappPhone || user.phone
        if (!phone) {
            toast.error(`${user.name} has no WhatsApp number saved!`)
            return
        }
        const cleanPhone = phone.replace(/\D/g, '')
        const msg = buildUpdateMessage(user)
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
        window.open(url, '_blank', 'noopener,noreferrer')
        toast.success(`Opening WhatsApp for ${user.name}`)
    }

    const handleBroadcast = () => {
        const whatsappUsers = users.filter(u => u.whatsappOptIn && u.whatsappPhone)
        if (whatsappUsers.length === 0) {
            toast.error('No WhatsApp-subscribed users found!')
            return
        }
        // Open one by one (browsers allow first click, subsequent must be manual)
        whatsappUsers.slice(0, 1).forEach(user => handleSendUpdate(user))
        toast.info(`Opened WhatsApp for ${whatsappUsers[0].name}. Open more individually to avoid popup blocks.`)
    }

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                            u.email.toLowerCase().includes(search.toLowerCase())
        if (filter === 'buyers')   return matchSearch && u.orderCount > 0
        if (filter === 'whatsapp') return matchSearch && u.whatsappOptIn
        return matchSearch
    })

    const stats = {
        total:    users.length,
        buyers:   users.filter(u => u.orderCount > 0).length,
        whatsapp: users.filter(u => u.whatsappOptIn).length,
        coins:    users.reduce((a, u) => a + (u.supercoins || 0), 0)
    }

    return (
        <div className={`w-full min-h-screen flex flex-col transition-colors duration-500 ${dk ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            <Nav />
            <div className='flex flex-1'>
                <Sidebar />
                <main className='flex-1 p-6 lg:ml-[280px] mt-20 pb-20'>
                <div className='max-w-7xl mx-auto'>

                    {/* Header */}
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
                        <div>
                            <h1 className={`text-3xl font-black ${dk ? 'text-white' : 'text-gray-900'}`}>
                                User Management
                            </h1>
                            <p className={`mt-1 text-sm ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
                                All registered users, purchase history & WhatsApp subscribers
                            </p>
                        </div>
                        <button
                            onClick={handleBroadcast}
                            className='flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-green-500/20 transition-all active:scale-95'
                        >
                            <FaWhatsapp size={18} />
                            Broadcast Update
                        </button>
                    </div>

                    {/* Stat Cards */}
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                        {[
                            { label: 'Total Users',         value: stats.total,    icon: <UsersIcon size={20} />,   color: 'blue' },
                            { label: 'Buyers',              value: stats.buyers,   icon: <ShoppingBag size={20} />, color: 'green' },
                            { label: 'WhatsApp Opted-in',   value: stats.whatsapp, icon: <FaWhatsapp size={20} />,  color: 'emerald' },
                            { label: 'Total Supercoins Out',value: stats.coins,    icon: <Coins size={20} />,       color: 'yellow' },
                        ].map(s => (
                            <div key={s.label} className={`rounded-2xl p-5 border shadow-sm ${dk ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-gray-100'}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                                    s.color === 'blue'    ? 'bg-blue-100 text-blue-600' :
                                    s.color === 'green'   ? 'bg-green-100 text-green-600' :
                                    s.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                                    'bg-yellow-100 text-yellow-600'
                                }`}>{s.icon}</div>
                                <p className={`text-2xl font-black ${dk ? 'text-white' : 'text-gray-900'}`}>{s.value}</p>
                                <p className={`text-xs font-semibold mt-0.5 ${dk ? 'text-slate-400' : 'text-gray-500'}`}>{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Search & Filter */}
                    <div className={`rounded-2xl border p-4 mb-4 flex flex-col sm:flex-row gap-3 ${dk ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-gray-100'}`}>
                        <div className='relative flex-1'>
                            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dk ? 'text-slate-500' : 'text-gray-400'}`} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder='Search by name or email...'
                                className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${dk ? 'bg-slate-800 border-slate-600 text-white placeholder:text-slate-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400'}`}
                            />
                        </div>
                        <div className='flex gap-2'>
                            {[['all', 'All'], ['buyers', '🛍️ Buyers Only'], ['whatsapp', '📱 WhatsApp Only']].map(([val, lbl]) => (
                                <button
                                    key={val}
                                    onClick={() => setFilter(val)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === val ? 'bg-blue-600 text-white shadow-md' : dk ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {lbl}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* User Table */}
                    <div className={`rounded-2xl border overflow-hidden shadow-sm ${dk ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-gray-100'}`}>
                        {loading ? (
                            <div className='flex items-center justify-center py-20'>
                                <div className='flex flex-col items-center gap-3'>
                                    <div className='animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full'></div>
                                    <p className={`text-sm font-medium ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Loading users...</p>
                                </div>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className='text-center py-16'>
                                <UsersIcon size={48} className='mx-auto mb-3 text-gray-300' />
                                <p className={`font-semibold ${dk ? 'text-slate-400' : 'text-gray-500'}`}>No users found</p>
                            </div>
                        ) : (
                            <div className='overflow-x-auto'>
                                <table className='w-full'>
                                    <thead>
                                        <tr className={`border-b text-xs font-black uppercase tracking-widest ${dk ? 'border-slate-700 text-slate-500' : 'border-gray-100 text-gray-400'}`}>
                                            <th className='px-6 py-4 text-left'>#</th>
                                            <th className='px-6 py-4 text-left'>User</th>
                                            <th className='px-6 py-4 text-left'>Contact</th>
                                            <th className='px-6 py-4 text-center'>Orders</th>
                                            <th className='px-6 py-4 text-center'>Total Spent</th>
                                            <th className='px-6 py-4 text-center'>Supercoins</th>
                                            <th className='px-6 py-4 text-center'>WhatsApp</th>
                                            <th className='px-6 py-4 text-center'>Email News</th>
                                            <th className='px-6 py-4 text-center'>Joined</th>
                                            <th className='px-6 py-4 text-center'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-slate-100/10'>
                                        {filtered.map((user, idx) => (
                                            <tr key={user._id} className={`transition-colors ${dk ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}>
                                                <td className={`px-6 py-4 text-sm font-bold ${dk ? 'text-slate-500' : 'text-gray-400'}`}>{idx + 1}</td>

                                                {/* User */}
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-3'>
                                                        <div className='w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 text-white font-black rounded-full flex items-center justify-center shadow text-sm'>
                                                            {user.name[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className={`font-bold text-sm ${dk ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                                                            <p className={`text-xs ${dk ? 'text-slate-500' : 'text-gray-400'}`}>{user._id.slice(-6).toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact */}
                                                <td className='px-6 py-4'>
                                                    <div className='space-y-1'>
                                                        <div className='flex items-center gap-1.5'>
                                                            <Mail size={12} className={dk ? 'text-slate-500' : 'text-gray-400'} />
                                                            <span className={`text-xs ${dk ? 'text-slate-300' : 'text-gray-600'}`}>{user.email}</span>
                                                        </div>
                                                        {user.phone && (
                                                            <div className='flex items-center gap-1.5'>
                                                                <Phone size={12} className={dk ? 'text-slate-500' : 'text-gray-400'} />
                                                                <span className={`text-xs ${dk ? 'text-slate-300' : 'text-gray-600'}`}>+91 {user.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Orders */}
                                                <td className='px-6 py-4 text-center'>
                                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-black ${user.orderCount > 0 ? 'bg-green-100 text-green-700' : dk ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-400'}`}>
                                                        {user.orderCount}
                                                    </span>
                                                </td>

                                                {/* Total Spent */}
                                                <td className='px-6 py-4 text-center'>
                                                    <span className={`text-sm font-bold ${user.totalSpent > 0 ? 'text-green-600' : dk ? 'text-slate-500' : 'text-gray-400'}`}>
                                                        {user.totalSpent > 0 ? `₹${user.totalSpent.toLocaleString('en-IN')}` : '—'}
                                                    </span>
                                                </td>

                                                {/* Supercoins */}
                                                <td className='px-6 py-4 text-center'>
                                                    {user.supercoins > 0 ? (
                                                        <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs font-black rounded-full border border-yellow-200'>
                                                            💛 {user.supercoins}
                                                        </span>
                                                    ) : (
                                                        <span className={`text-xs ${dk ? 'text-slate-600' : 'text-gray-400'}`}>—</span>
                                                    )}
                                                </td>

                                                {/* WhatsApp */}
                                                <td className='px-6 py-4 text-center'>
                                                    {user.whatsappOptIn ? (
                                                        <div className='flex flex-col items-center gap-1'>
                                                            <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200'>
                                                                <FaWhatsapp size={10} /> Subscribed
                                                            </span>
                                                            {user.whatsappPhone && (
                                                                <span className={`text-[10px] ${dk ? 'text-slate-500' : 'text-gray-400'}`}>+{user.whatsappPhone}</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${dk ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                                                            Not Opted-in
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Email Updates */}
                                                <td className='px-6 py-4 text-center'>
                                                    {user.emailUpdatesOptIn ? (
                                                        <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200'>
                                                            <Mail size={10} /> Subscribed
                                                        </span>
                                                    ) : (
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${dk ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                                                            Opted-out
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Joined */}
                                                <td className='px-6 py-4 text-center'>
                                                    <span className={`text-xs ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                                    </span>
                                                </td>

                                                {/* Action */}
                                                <td className='px-6 py-4 text-center'>
                                                    <button
                                                        onClick={() => handleSendUpdate(user)}
                                                        disabled={!user.whatsappPhone && !user.phone}
                                                        className='inline-flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-bold rounded-xl transition-all active:scale-95 shadow-sm'
                                                        title='Send WhatsApp update to this user'
                                                    >
                                                        <Send size={12} />
                                                        Send
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Footer count */}
                        {!loading && (
                            <div className={`px-6 py-3 border-t text-xs font-semibold ${dk ? 'border-slate-700 text-slate-500' : 'border-gray-100 text-gray-400'}`}>
                                Showing {filtered.length} of {users.length} users
                            </div>
                        )}
                    </div>
                </div>
                </main>
            </div>
        </div>
    )
}

export default Users

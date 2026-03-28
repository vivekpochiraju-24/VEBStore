import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../component/Sidebar'
import Nav from '../component/Nav'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { themeDataContext } from '../context/ThemeContext'
import { FaWhatsapp } from 'react-icons/fa'
import { Users as UsersIcon, ShoppingBag, Coins, Phone, Mail, Search, Send } from 'lucide-react'
import { MdEdit } from 'react-icons/md'
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

    const [editUser, setEditUser] = useState(null)
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', supercoins: 0 })
    const [updating, setUpdating] = useState(false)

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

    const openEditModal = (user) => {
        setEditUser(user)
        setEditForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            supercoins: user.supercoins || 0
        })
    }

    const handleUpdateUser = async (e) => {
        e.preventDefault()
        try {
            setUpdating(true)
            await axios.put(`${serverUrl}/api/user/admin/update-user`, {
                userId: editUser._id,
                ...editForm
            }, { withCredentials: true })
            
            toast.success('User updated successfully')
            setEditUser(null)
            fetchUsers()
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message || 'Update failed')
        } finally {
            setUpdating(false)
        }
    }

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to permanently delete this user account?')) return
        try {
            await axios.delete(`${serverUrl}/api/user/admin/delete-user/${userId}`, { withCredentials: true })
            toast.success('User deleted')
            fetchUsers()
        } catch (err) {
            console.error(err)
            toast.error('Delete failed')
        }
    }

    useEffect(() => { fetchUsers() }, [])

    // ... (rest of the functions: buildUpdateMessage, handleSendUpdate, handleBroadcast)

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
        const matchSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
                            (u.email || '').toLowerCase().includes(search.toLowerCase())
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
                                            <th className='px-6 py-4 text-center'>Supercoins</th>
                                            <th className='px-6 py-4 text-center border-l border-slate-100/5'>Joined</th>
                                            <th className='px-6 py-4 text-right'>Action</th>
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
                                                            {(user.name || 'U')[0].toUpperCase()}
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
                                                    {user.totalSpent > 0 && <p className='text-[10px] font-bold mt-1 text-emerald-600'>₹{user.totalSpent.toLocaleString()}</p>}
                                                </td>

                                                {/* Supercoins */}
                                                <td className='px-6 py-4 text-center'>
                                                    <div className='flex flex-col items-center gap-1'>
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-black rounded-full border ${user.supercoins > 0 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : dk ? 'bg-slate-800 border-slate-700 text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                                            💛 {user.supercoins || 0}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Joined */}
                                                <td className='px-6 py-4 text-center border-l border-slate-100/5'>
                                                    <span className={`text-xs ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                                                    </span>
                                                </td>

                                                {/* Action */}
                                                <td className='px-6 py-4 text-right'>
                                                    <div className='flex items-center justify-end gap-2'>
                                                        <button
                                                            onClick={() => openEditModal(user)}
                                                            className='p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-all'
                                                            title='Edit User Details'
                                                        >
                                                            <MdEdit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleSendUpdate(user)}
                                                            className='p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-all'
                                                            title='WhatsApp Update'
                                                        >
                                                            <FaWhatsapp size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className='p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-all'
                                                            title='Delete User'
                                                        >
                                                            <ShoppingBag size={18} className='rotate-45' />
                                                        </button>
                                                    </div>
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

                {/* Edit User Modal */}
                {editUser && (
                    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in'>
                        <div className={`w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl ${dk ? 'bg-[#1e293b] border border-slate-700' : 'bg-white'}`}>
                            <div className='p-8 border-b border-slate-100/10'>
                                <h3 className={`text-2xl font-black ${dk ? 'text-white' : 'text-gray-900'}`}>Refine User Profile</h3>
                                <p className={`text-sm ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Editing ID: {editUser._id.toUpperCase()}</p>
                            </div>
                            <form onSubmit={handleUpdateUser} className='p-8 space-y-6'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-1.5'>
                                        <label className='text-[10px] font-black uppercase text-slate-500 ml-1'>Legal Name</label>
                                        <input 
                                            value={editForm.name} 
                                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                                            className={`w-full px-4 py-3 rounded-xl border outline-none text-sm font-bold ${dk ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100'}`}
                                        />
                                    </div>
                                    <div className='space-y-1.5'>
                                        <label className='text-[10px] font-black uppercase text-slate-500 ml-1'>Supercoins Balance</label>
                                        <input 
                                            type="number"
                                            value={editForm.supercoins} 
                                            onChange={e => setEditForm({...editForm, supercoins: parseInt(e.target.value) || 0})}
                                            className={`w-full px-4 py-3 rounded-xl border outline-none text-sm font-bold ${dk ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100'}`}
                                        />
                                    </div>
                                </div>

                                <div className='space-y-1.5'>
                                    <label className='text-[10px] font-black uppercase text-slate-500 ml-1'>E-Mail Signature</label>
                                    <input 
                                        type="email"
                                        value={editForm.email} 
                                        onChange={e => setEditForm({...editForm, email: e.target.value})}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm font-bold ${dk ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100'}`}
                                    />
                                </div>

                                <div className='space-y-1.5'>
                                    <label className='text-[10px] font-black uppercase text-slate-500 ml-1'>Mobile Link</label>
                                    <input 
                                        value={editForm.phone} 
                                        onChange={e => setEditForm({...editForm, phone: e.target.value})}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm font-bold ${dk ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100'}`}
                                    />
                                </div>

                                <div className='flex gap-4 pt-4'>
                                    <button 
                                        type="button"
                                        onClick={() => setEditUser(null)}
                                        className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest ${dk ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={updating}
                                        className='flex-1 py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all'
                                    >
                                        {updating ? 'Processing...' : 'Sync Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                </main>
            </div>
        </div>
    )
}

export default Users

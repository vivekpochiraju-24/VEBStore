import React, { useState, useEffect } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { MessageSquare, Send, CheckCircle, Clock, User, Mail, Search, Eye } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

function MessageInbox() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [replyText, setReplyText] = useState("")
    const [selectedMsg, setSelectedMsg] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState("All")

    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000"

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            const response = await axios.get(serverUrl + '/api/message/admin/all', { withCredentials: true })
            setMessages(response.data)
        } catch (error) {
            console.error("fetchMessages error", error)
            toast.error("Failed to load messages")
        } finally {
            setLoading(false)
        }
    }

    const handleReply = async (e) => {
        e.preventDefault()
        if (!replyText.trim()) return

        try {
            const response = await axios.post(serverUrl + '/api/message/admin/reply', {
                id: selectedMsg._id,
                adminReply: replyText
            }, { withCredentials: true })

            if (response.data) {
                toast.success("Reply sent successfully!")
                setReplyText("")
                setSelectedMsg(null)
                fetchMessages()
            }
        } catch (error) {
            toast.error("Failed to send reply")
        }
    }

    const filteredMessages = messages.filter(msg => {
        const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || msg.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filter === "All" || msg.status === filter
        return matchesSearch && matchesFilter
    })

    return (
        <div className='w-full min-h-screen bg-[#f8fafc] flex flex-col'>
            <Nav />
            <div className='flex flex-1'>
                <Sidebar />
                <main className='flex-1 p-6 lg:ml-[280px] mt-20 pb-20'>
                    <div className='max-w-6xl mx-auto'>
                        
                        {/* Summary Header */}
                        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12'>
                            <div>
                                <h1 className='text-3xl font-black text-gray-900 tracking-tight'>User Inquiries</h1>
                                <p className='text-gray-500 text-sm font-medium mt-1'>Manage and reply to customer support requests from the store hub.</p>
                            </div>
                            <div className='flex items-center gap-3'>
                                {["All", "Pending", "Replied"].map(f => (
                                    <button 
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${filter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className='relative mb-8'>
                            <Search className='absolute left-6 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
                            <input 
                                type="text"
                                placeholder='Search by name or email...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full h-16 pl-16 pr-6 bg-white border border-gray-100 rounded-[28px] shadow-xl shadow-gray-200/20 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-900'
                            />
                        </div>

                        {loading ? (
                            <div className='text-center py-20'>
                                <div className='animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto'></div>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 gap-6'>
                                {filteredMessages.map((msg) => (
                                    <div key={msg._id} className={`bg-white p-8 rounded-[40px] border transition-all ${selectedMsg?._id === msg._id ? 'border-blue-500 shadow-2xl shadow-blue-500/10' : 'border-gray-100 hover:shadow-xl hover:shadow-gray-200/40'}`}>
                                        <div className='flex flex-col md:flex-row justify-between gap-6'>
                                            <div className='flex gap-5'>
                                                <div className='w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400'>
                                                    {msg.userId ? <User size={28} /> : <Eye size={28} />}
                                                </div>
                                                <div>
                                                    <h3 className='text-lg font-black text-gray-900 leading-none mb-2'>{msg.name}</h3>
                                                    <p className='text-sm text-gray-500 font-bold mb-2'>{msg.email}</p>
                                                    <div className='flex items-center gap-2'>
                                                        {msg.status === 'Replied' ? (
                                                            <span className='px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full border border-green-100'>Replied</span>
                                                        ) : (
                                                            <span className='px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-full border border-amber-100'>Pending</span>
                                                        )}
                                                        <span className='text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-2'>{new Date(msg.createdAt).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex items-start gap-3'>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedMsg(msg);
                                                        setReplyText(msg.adminReply || "");
                                                    }}
                                                    className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 ${msg.status === 'Replied' ? 'bg-emerald-100 text-emerald-700 shadow-emerald-500/10 hover:bg-emerald-200' : 'bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700'}`}
                                                >
                                                    {msg.status === 'Replied' ? 'Edit Response' : 'Reply Now'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className='mt-8 p-6 bg-gray-50 rounded-3xl border border-gray-100 italic text-gray-700 font-medium leading-relaxed'>
                                            "{msg.message}"
                                        </div>

                                        {msg.adminReply && (
                                            <div className='mt-6 pl-8 border-l-4 border-emerald-500 py-2'>
                                                <p className='text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1.5'>Official Response</p>
                                                <p className='text-sm font-extrabold text-gray-900'>{msg.adminReply}</p>
                                            </div>
                                        )}

                                        {selectedMsg?._id === msg._id && (
                                            <form onSubmit={handleReply} className='mt-8 pt-8 border-t border-gray-100 animate-fade-in'>
                                                <textarea 
                                                    autoFocus
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder='Draft your reply here...'
                                                    className='w-full h-32 p-6 bg-blue-50/50 border border-blue-100 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 font-medium transition-all resize-none mb-4'
                                                ></textarea>
                                                <div className='flex justify-end gap-3'>
                                                    <button type='button' onClick={() => setSelectedMsg(null)} className='px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all'>Cancel</button>
                                                    <button type='submit' className='px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20 flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all'>
                                                        Send Reply <Send size={14} />
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                ))}

                                {filteredMessages.length === 0 && (
                                    <div className='text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/20'>
                                        <MessageSquare size={64} className='mx-auto mb-4 text-gray-200' />
                                        <p className='text-xl font-black text-gray-400'>No messages found in this filter.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default MessageInbox

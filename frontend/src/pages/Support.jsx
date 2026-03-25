import React, { useContext, useState, useEffect } from 'react'
import Title from '../component/Title'
import { MessageSquare, Clock, CheckCircle2, Navigation } from 'lucide-react'
import { themeDataContext } from '../context/ThemeContext'
import { userDataContext } from '../context/UserContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Support() {
  const { isDark } = useContext(themeDataContext)
  const { userData } = useContext(userDataContext)
  const { serverUrl } = useContext(authDataContext)
  const dk = isDark
  const navigate = useNavigate()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userData?._id) {
        fetchMessages()
    } else {
        setLoading(false)
    }
  }, [userData])

  const fetchMessages = async () => {
    try {
      const response = await axios.get(serverUrl + `/api/message/user/${userData._id}`)
      setMessages(response.data)
    } catch (error) {
      console.error("fetchMessages error", error)
    } finally {
      setLoading(false)
    }
  }

  if (!userData) {
      return (
          <div className={`min-h-screen pt-40 text-center ${dk ? 'text-white' : 'text-gray-900'}`}>
              <h2 className='text-2xl font-black'>Please login to view support messages.</h2>
              <button onClick={() => navigate('/login')} className='mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold'>Login Now</button>
          </div>
      )
  }

  return (
    <div className={`w-full min-h-screen pt-[120px] pb-24 px-6 sm:px-[10vw] transition-colors duration-300 ${dk ? 'bg-[#0f172a]' : 'bg-white'}`}>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-12'>
            <Title text1={'SUPPORT'} text2={'MESSAGES'} />
            <button 
                onClick={() => navigate('/contact')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${dk ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
            >
                <Navigation size={16} /> New Inquiry
            </button>
        </div>

        {loading ? (
            <div className='text-center py-20'>
                <div className='animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto'></div>
            </div>
        ) : messages.length === 0 ? (
            <div className={`text-center py-20 border-2 border-dashed rounded-[40px] ${dk ? 'border-slate-800 text-slate-500' : 'border-gray-100 text-gray-400'}`}>
                <MessageSquare size={48} className='mx-auto mb-4 opacity-20' />
                <p className='text-lg font-bold'>No inquiries found yet.</p>
                <p className='text-sm'>Any messages you send via Contact Us will appear here.</p>
            </div>
        ) : (
            <div className='space-y-6'>
                {messages.map((msg) => (
                    <div key={msg._id} className={`p-8 rounded-[32px] border transition-all ${dk ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/20'}`}>
                        <div className='flex flex-col sm:flex-row justify-between gap-4 mb-6'>
                            <div>
                                <h3 className={`text-xl font-black ${dk ? 'text-white' : 'text-gray-900'}`}>{msg.subject || "General Inquiry"}</h3>
                                <p className='text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mt-1'>
                                    Sent on {new Date(msg.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className='flex items-center gap-2'>
                                {msg.status === 'Replied' ? (
                                    <span className='flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded-full border border-green-500/20'>
                                        <CheckCircle2 size={12} /> Replied
                                    </span>
                                ) : (
                                    <span className='flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase rounded-full border border-amber-500/20'>
                                        <Clock size={12} /> Pending
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className={`p-5 rounded-2xl mb-6 ${dk ? 'bg-slate-900/50 text-slate-300' : 'bg-gray-50 text-gray-700'} italic font-medium leading-relaxed`}>
                            "{msg.message}"
                        </div>

                        {msg.adminReply && (
                            <div className='space-y-3 relative'>
                                 <div className={`absolute left-0 top-0 w-1 h-full rounded-full ${dk ? 'bg-blue-500/30' : 'bg-blue-600/10'}`}></div>
                                 <div className='pl-6'>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Official Reply from VEB Concierge</p>
                                    <p className={`text-base font-extrabold leading-relaxed ${dk ? 'text-white' : 'text-gray-900'}`}>{msg.adminReply}</p>
                                    <p className='text-[10px] text-gray-500 mt-2 font-medium'>{new Date(msg.repliedAt).toLocaleString()}</p>
                                 </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}

export default Support

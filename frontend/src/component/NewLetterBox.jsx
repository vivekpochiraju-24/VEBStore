import React, { useContext, useState } from 'react'
import { themeDataContext } from '../context/ThemeContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function NewLetterBox() {
  const { isDark } = useContext(themeDataContext)
  const { serverUrl } = useContext(authDataContext)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const dk = isDark

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return;
    
    setLoading(true)
    try {
        const response = await axios.post(`${serverUrl}/api/admin/subscribe`, { email });
        if (response.data.success) {
            toast.success("💎 Welcome to the Elite! Check your email for your 20% off code.");
            setEmail("");
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Subscription failed. Please try again.");
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className={`w-full py-20 flex items-center justify-center gap-4 flex-col border-y transition-colors duration-300 ${dk ? 'bg-[#1e293b] border-slate-700/50' : 'bg-blue-50 border-blue-100'}`}>
      <p className={`md:text-4xl text-2xl font-extrabold px-6 tracking-tight text-center ${dk ? 'text-white' : 'text-gray-900'}`}>
        Subscribe now &amp; get 20% off
      </p>
      <p className={`md:text-lg text-base text-center font-medium px-6 max-w-2xl mt-2 ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
        Subscribe now and enjoy exclusive savings, special deals, and early access to new collections.
      </p>
      <form onSubmit={handleSubmit} className='w-full flex sm:flex-row flex-col items-center justify-center mt-8 gap-4 px-6'>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email address'
          className={`w-full sm:w-[450px] h-14 px-6 rounded-2xl shadow-sm border focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all outline-none font-medium ${dk ? 'bg-[#0f172a] border-slate-600 text-white placeholder:text-slate-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
          required
          disabled={loading}
        />
        <button
          type='submit'
          disabled={loading}
          className={`h-14 px-10 font-bold rounded-2xl transition-all active:scale-[0.98] shadow-md tracking-wide w-full sm:w-auto flex items-center justify-center ${dk ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20' : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/10'} ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
        </button>
      </form>
    </div>
  )
}

export default NewLetterBox

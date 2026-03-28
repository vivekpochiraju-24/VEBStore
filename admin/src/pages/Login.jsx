import React, { useContext, useState } from 'react'
import logo from '../assets/logo.png'
import { IoEyeOutline, IoEye } from "react-icons/io5"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { adminDataContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'
import { ShieldCheck, Lock, Mail } from 'lucide-react'

function Login() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { serverUrl } = useContext(authDataContext)
  const { getAdmin } = useContext(adminDataContext)
  const navigate = useNavigate()

  const AdminLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      console.log("Frontend - Sending login request:", { 
        url: serverUrl + '/api/adminlogin',
        email, 
        password: password ? "***" : "undefined",
        serverUrl 
      });
      
      const result = await axios.post(serverUrl + '/api/adminlogin', { email, password }, { withCredentials: true })
      
      console.log("Frontend - Login successful:", result.data);
      toast.success("Welcome back, Administrator")
      getAdmin()
      navigate("/")
    } catch (error) {
      console.error("Frontend - Login error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        serverUrl
      })
      toast.error(error.response?.data?.message || "Invalid administrator credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 sm:p-10'>

      {/* Background Decoration */}
      <div className='fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0'>
        <div className='absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px]'></div>
        <div className='absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100/20 rounded-full blur-[120px]'></div>
      </div>

      <div className='w-full max-w-[480px] relative z-10'>

        {/* Branding */}
        <div className='flex flex-col items-center mb-10 group'>
          <div className='relative mb-4'>
            <img className='w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-500' src={logo} alt="VEBStore Logo" />
            <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-4 border-white flex items-center justify-center'>
              <ShieldCheck size={10} className='text-white' />
            </div>
          </div>
          <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>VEBStore Admin</h1>
          <p className='text-gray-400 text-sm font-bold uppercase tracking-[0.2em] mt-2'>Management Console</p>
        </div>

        {/* Login Card */}
        <div className='bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/50 p-8 sm:p-12 animate-fade-in-up'>
          <div className='mb-8'>
            <h2 className='text-xl font-bold text-gray-900 mb-1'>Administrator Sign In</h2>
            <p className='text-gray-400 text-sm font-medium italic'>Authorized access only</p>
          </div>

          <form onSubmit={AdminLogin} className='space-y-6'>

            <div className='space-y-2'>
              <label className='text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1'>Station Email</label>
              <div className='relative group'>
                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors' size={18} />
                <input
                  type="email"
                  className='w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300'
                  placeholder='admin@vebstore.com'
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1'>Security Key</label>
              <div className='relative group'>
                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors' size={18} />
                <input
                  type={show ? "text" : "password"}
                  className='w-full h-14 pl-12 pr-12 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300'
                  placeholder='••••••••'
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <button
                  type='button'
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors'
                  onClick={() => setShow(!show)}
                >
                  {show ? <IoEye size={20} /> : <IoEyeOutline size={20} />}
                </button>
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3'
            >
              {loading ? <Loading /> : (
                <>
                  <Lock size={18} />
                  Gain Access
                </>
              )}
            </button>

            <div className='pt-4 text-center'>
              <p className='text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed px-6'>
                By signing in, you agree to our <span className='text-blue-500 cursor-pointer hover:underline'>Security Protocols</span> and internal data policies.
              </p>
            </div>

          </form>
        </div>

        {/* Footer info */}
        <div className='mt-10 text-center opacity-50'>
          <p className='text-xs font-bold text-gray-400'>&copy; 2026 VEBStore Infrastructure Hub</p>
        </div>

      </div>
    </div>
  )
}

export default Login

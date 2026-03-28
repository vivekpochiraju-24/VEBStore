import React, { useContext, useState } from 'react'
import logo from '../assets/logo.png'
import { IoEyeOutline, IoEye } from "react-icons/io5"
import { ArrowLeft } from 'lucide-react'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { adminDataContext } from '../context/AdminContext'
import { themeDataContext } from '../context/ThemeContext'
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
  const { isDark } = useContext(themeDataContext)
  const dk = isDark
  const navigate = useNavigate()

  const AdminLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      console.log("Frontend - Sending login request:", { 
        url: serverUrl + '/api/auth/adminlogin',
        email, 
        password: password ? "***" : "undefined",
        serverUrl 
      });
      
      const result = await axios.post(serverUrl + '/api/auth/adminlogin', { email, password }, { withCredentials: true })
      
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
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${dk ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-100'}`}>
      {/* Mobile Back Button */}
      <button 
        onClick={() => window.history.back()}
        className={`lg:hidden fixed top-4 left-4 p-2 rounded-lg transition-all z-50 ${
          dk ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="w-full max-w-md mx-auto">
        {/* Mobile Logo */}
        <div className="lg:hidden flex justify-center mb-8">
          <img src={logo} alt="VEBStore Admin" className="w-16 h-16 object-contain" />
        </div>

        <div className={`rounded-3xl shadow-2xl p-8 ${dk ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-gray-100'}`}>
          {/* Desktop Logo */}
          <div className="hidden lg:flex justify-center mb-8">
            <img src={logo} alt="VEBStore Admin" className="w-16 h-16 object-contain" />
          </div>

          <div className="text-center mb-8">
            <h1 className={`text-3xl font-black mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>
              Admin Portal
            </h1>
            <p className={`text-sm ${dk ? 'text-slate-400' : 'text-gray-600'}`}>
              Secure Management Dashboard
            </p>
          </div>

          <form onSubmit={AdminLogin} className="space-y-6">
            <div>
              <label className={`block text-sm font-black mb-2 ${dk ? 'text-slate-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-3 w-5 h-5 ${dk ? 'text-slate-400' : 'text-gray-400'}`} />
                <input
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border font-black transition-all ${
                    dk 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  type="email"
                  placeholder="admin@vebstore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-black mb-2 ${dk ? 'text-slate-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-3 w-5 h-5 ${dk ? 'text-slate-400' : 'text-gray-400'}`} />
                <input
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border font-black transition-all ${
                    dk 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  type={show ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className={`absolute right-3 top-3 p-1 rounded-lg transition-all ${
                    dk ? 'text-slate-400 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {show ? <IoEye size={20} /> : <IoEyeOutline size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : dk 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30' 
                    : 'bg-gray-900 hover:bg-black text-white shadow-gray-900/30'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-transparent animate-spin rounded-full"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          <div className={`text-center mt-6 text-sm ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
            <p>Secure admin access only</p>
            <p className="mt-1">© 2026 VEBStore Admin</p>
          </div>
        </div>
      </div>

      {loading && <Loading />}
    </div>
  )
}

export default Login

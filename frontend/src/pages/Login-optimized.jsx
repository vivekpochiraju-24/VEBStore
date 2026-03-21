import React, { useState, useContext } from 'react';
import Logo from "../assets/logo.png";
import googleIcon from '../assets/google.png';
import fashionBg from '../assets/fashion_login_bg.png';
import { useNavigate, Link } from 'react-router-dom';
import { IoEyeOutline, IoEye } from "react-icons/io5";
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import { authDataContext } from '../context/authContext';
import { userDataContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import Loading from '../component/Loading';

function Login() {
  const [show, setShow] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(serverUrl + '/api/auth/login', formData, {
        withCredentials: true,
        timeout: 10000
      });
      
      if (response.data.success) {
        await getCurrentUser();
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 404) {
        toast.error("User not found. Please check your credentials.");
      } else if (error.response?.status === 400) {
        toast.error("Invalid email or password.");
      } else if (error.code === 'ECONNABORTED') {
        toast.error("Request timeout. Please try again.");
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const googlelogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      if (response.user) {
        const result = await axios.post(serverUrl + "/api/auth/googlelogin", {
          name: response.user.displayName,
          email: response.user.email
        }, { withCredentials: true });
        
        await getCurrentUser();
        toast.success("Login successful with Google!");
        navigate("/");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col'>
      <div className='w-full h-16 bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center px-8 gap-3 cursor-pointer hover:bg-white/95 transition-all' onClick={() => navigate("/")}>
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <img className='w-8 h-8 object-contain' src={Logo} alt="VEBStore Logo" />
            <div className='absolute -bottom-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse'></div>
          </div>
          <div className='flex flex-col'>
            <h1 className='text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight'>VEBStore</h1>
            <span className='text-[10px] text-gray-500 font-medium'>Fashion & Style</span>
          </div>
        </div>
      </div>

      <div className='flex-1 flex items-center justify-center px-4 py-8'>
        <div className='w-full max-w-md'>
          <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8'>
            <div className='text-center mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>Welcome Back</h2>
              <p className='text-base text-gray-600'>Sign in to your VEBStore account</p>
            </div>

            <form onSubmit={handleLogin} className='space-y-6'>
              <button 
                type='button'
                onClick={googlelogin}
                className='w-full h-11 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group'
                disabled={loading}
              >
                <img src={googleIcon} alt="Google" className='w-5 h-5' />
                <span className='text-sm font-medium text-gray-700 group-hover:text-gray-900'>Continue with Google</span>
              </button>

              <div className='flex items-center gap-4'>
                <div className='flex-1 h-px bg-gray-200'></div>
                <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Or</span>
                <div className='flex-1 h-px bg-gray-200'></div>
              </div>

              <div className='space-y-5'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full h-11 border rounded-lg px-4 text-sm outline-none transition-all ${
                      errors.email ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                    placeholder='Enter your email' 
                    required
                    disabled={loading}
                  />
                  {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                  <div className='relative'>
                    <input 
                      type={show ? "text" : "password"} 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full h-11 border rounded-lg px-4 pr-12 text-sm outline-none transition-all ${
                        errors.password ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                      placeholder='Enter your password' 
                      required
                      disabled={loading}
                    />
                    <button 
                      type='button'
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors' 
                      onClick={() => setShow(!show)}
                      disabled={loading}
                    >
                      {show ? <IoEye size={18} /> : <IoEyeOutline size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password}</p>}
                </div>
                
                <div className='text-right'>
                  <Link to="/forgot-password" className='text-sm text-blue-600 hover:text-blue-700 font-medium'>Forgot password?</Link>
                </div>
                
                <button 
                  type='submit'
                  className='w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={loading}
                >
                  {loading ? (
                    <div className='flex items-center justify-center'>
                      <Loading />
                    </div>
                  ) : "Sign In"}
                </button>
                
                <div className='text-center pt-4 border-t border-gray-100'>
                  <p className='text-sm text-gray-600'>
                    Don't have an account? 
                    <Link 
                      to="/signup" 
                      className='text-blue-600 font-semibold cursor-pointer hover:text-blue-700 hover:underline ml-1'
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>

          <div className='text-center mt-6 text-xs text-gray-500'>
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;

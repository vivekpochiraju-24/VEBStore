import React, { useState, useContext, useEffect } from 'react';
import Logo from "../assets/logo.png";
import googleIcon from '../assets/google.png';
import fashionBg from '../assets/fashion_login_bg.png';
import { useNavigate, Link } from 'react-router-dom';
import { IoEyeOutline, IoEye, IoArrowBackOutline } from "react-icons/io5";
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import Loading from '../component/Loading';

function Login() {
  const [show, setShow] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser, userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [isForgotPass, setIsForgotPass] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (userData) {
      navigate("/");
    }
  }, [userData, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + '/api/auth/login', {
        email, password
      }, { withCredentials: true });
      
      // Clear any existing user data and fetch fresh data
      setUserData(null);
      
      // Add delay to ensure login is processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch fresh user data
      await getCurrentUser();
      
      // Add another delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("User Login Successful");
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate("/");
      }, 100);
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "User Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const googlelogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      await axios.post(serverUrl + "/api/auth/googlelogin", {
        name: user.displayName,
        email: user.email
      }, { withCredentials: true })
      
      // Clear any existing user data and fetch fresh data
      setUserData(null);
      
      // Add small delay to ensure login is processed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fetch fresh user data
      await getCurrentUser();
      
      toast.success("User Login Successful");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Google Login Failed");
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') return;
      toast.error(error.code === 'auth/operation-not-allowed' ? "Enable Google Auth in Firebase Console first!" : (error.response?.data?.message || error.message || "Google Login Failed"));
    }
  };

  const sendEmailOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(serverUrl + '/api/auth/send-otp', { email });
      setOtpSent(true);
      toast.success(response.data.message || "Email OTP sent successfully! Check your inbox.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(serverUrl + '/api/auth/resetpassword', {
        email, newPassword, otp
      }, { withCredentials: true });

      toast.success("Password reset securely. You can now log in!");
      setIsForgotPass(false);
      setOtpSent(false);
      setOtp("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Password Reset Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col'>
      {/* Header */}
      <div className='w-full h-16 bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center px-8 gap-3 cursor-pointer hover:bg-white/95 transition-all' onClick={() => navigate("/")}>
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <img className='w-8 h-8 object-contain' src={Logo} alt="VEBStore Logo" />
            <div className='absolute -bottom-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse'></div>
          </div>
          <div className='flex flex-col'>
            <h1 className='text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight'>VEBStore</h1>
            <span className='text-[10px] text-blue-500 font-extrabold uppercase tracking-[0.2em]'>Premium Fashion</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-4 py-8'>
        <div className='w-full max-w-md'>
          {/* Login Form Card */}
          <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8'>
            {/* Welcome Section */}
            <div className='text-center mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>Welcome Back</h2>
              <p className='text-base text-gray-600'>Sign in to your VEBStore account</p>
            </div>

            <form onSubmit={handleLogin} className='space-y-6'>
              {/* Google Login Button */}
              <button 
                type='button'
                onClick={googlelogin}
                className='w-full h-11 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group'
                disabled={loading}
              >
                <img src={googleIcon} alt="Google" className='w-5 h-5' />
                <span className='text-sm font-medium text-gray-700 group-hover:text-gray-900'>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className='flex items-center gap-4'>
                <div className='flex-1 h-px bg-gray-200'></div>
                <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Or</span>
                <div className='flex-1 h-px bg-gray-200'></div>
              </div>

              {/* Form Fields */}
              <div className='space-y-5'>
                {/* Email Input */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-11 border rounded-lg px-4 text-sm outline-none transition-all border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}

                    placeholder='Enter your email' 
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                  <div className='relative'>
                    <input 
                      type={show ? "text" : "password"} 
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full h-11 border rounded-lg px-4 pr-12 text-sm outline-none transition-all border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}

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
                </div>
                
                {/* Forgot Password Link */}
                <div className='text-right'>
                  <Link to="/forgot-password" className='text-sm text-blue-600 hover:text-blue-700 font-medium'>Forgot password?</Link>
                </div>
                
                {/* Login Button */}
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
                
                {/* Sign Up Link */}
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

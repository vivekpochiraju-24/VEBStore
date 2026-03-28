import React, { useState, useContext } from 'react';
import Logo from "../assets/logo.png";
import googleIcon from '../assets/google.png';
import fashionBg from '../assets/fashion_login_bg.png';
import { useNavigate, Link } from 'react-router-dom';
import { IoEyeOutline, IoEye } from "react-icons/io5";
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import Loading from '../component/Loading';

function Registration() {
  const [show, setShow] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await axios.post(serverUrl + '/api/auth/registration', {
        name, email, password, phone
      }, { withCredentials: true });
      
      // Add a small delay to ensure user is saved in database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear any existing user data and fetch fresh data
      setUserData(null);
      await getCurrentUser();
      
      toast.success("User Registration Successful!");
      navigate("/");
      
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleSignup = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      await axios.post(serverUrl + "/api/auth/googlelogin", {
        name: user.displayName,
        email: user.email
      }, { withCredentials: true });

      await getCurrentUser();
      toast.success("Google Registration Successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') return;
      toast.error(error.code === 'auth/operation-not-allowed' ? "Enable Google Auth in Firebase Console first!" : (error.response?.data?.message || error.message || "Google Registration Failed"));
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
          {/* Signup Form Card */}
          <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8'>
            {/* Welcome Section */}
            <div className='text-center mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>Create Account</h2>
              <p className='text-base text-gray-600'>Join the VEBStore elite community</p>
            </div>

            <form onSubmit={handleSignup} className='space-y-6'>
              {/* Google Signup Button */}
              <button 
                type='button'
                onClick={googleSignup}
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
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full h-11 border rounded-lg px-4 text-sm outline-none transition-all border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    placeholder='Enter your full name' 
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full h-11 border rounded-lg px-4 text-sm outline-none transition-all border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    placeholder='Enter your email' 
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number (Optional)</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className='w-full h-11 border rounded-lg px-4 text-sm outline-none transition-all border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    placeholder='+1234567890' 
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                  <div className='relative'>
                    <input 
                      type={show ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='w-full h-11 border rounded-lg px-4 pr-12 text-sm outline-none transition-all border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      placeholder='Create a password' 
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
                
                {/* Signup Button */}
                <button 
                  type='submit'
                  className='w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4'
                  disabled={loading}
                >
                  {loading ? (
                    <div className='flex items-center justify-center'>
                      <Loading />
                    </div>
                  ) : "Create Account"}
                </button>
                
                {/* Sign In Link */}
                <div className='text-center pt-4 border-t border-gray-100'>
                  <p className='text-sm text-gray-600'>
                    Already have an account? 
                    <Link 
                      to="/login" 
                      className='text-blue-600 font-semibold cursor-pointer hover:text-blue-700 hover:underline ml-1'
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>

          <div className='text-center mt-6 text-xs text-gray-500'>
            <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registration;

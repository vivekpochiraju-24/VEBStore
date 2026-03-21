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

      await getCurrentUser();
      toast.success("User Registration Successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "User Registration Failed");
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
    <div className='min-h-screen bg-white flex'>
      {/* Left Split */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900'>
        <img
          src={fashionBg}
          alt="Fashion Lifestyle"
          className='absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />
        <div className='relative z-10 flex flex-col justify-end p-16 text-white h-full'>
          <h1 className='text-5xl font-bold mb-4 tracking-tight leading-tight'>
            Discover the New Standard of Elegance.
          </h1>
          <p className='text-lg text-gray-300 max-w-md'>
            Join VEBStore to explore exclusive collections and premium fashion curation tailored just for you.
          </p>
        </div>
      </div>

      {/* Right Split */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16'>
        <div className='w-full max-w-md'>

          <div className='flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all mb-10' onClick={() => navigate("/")}>
            <div className='relative'>
              <img className='w-11 h-11 object-contain' src={Logo} alt="VEBStore Logo" />
              <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm'></div>
            </div>
            <div className='flex flex-col'>
              <h2 className='text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-none mb-1'>VEBStore</h2>
              <span className='text-[10px] font-extrabold text-blue-500 uppercase tracking-[0.2em]'>Premium Fashion</span>
            </div>
          </div>

          <div className='mb-8'>
            <h3 className='text-3xl font-bold text-gray-900 mb-2'>Create Account</h3>
            <p className='text-gray-500'>Enter your details to get started.</p>
          </div>

          <form onSubmit={handleSignup} className='space-y-6'>
            <button
              type='button'
              onClick={googleSignup}
              className='w-full h-12 bg-white border border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 group shadow-sm'
            >
              <img src={googleIcon} alt="Google" className='w-5 h-5' />
              <span className='text-sm font-semibold text-gray-700 group-hover:text-gray-900'>Sign up with Google</span>
            </button>

            <div className='flex items-center gap-4 py-2'>
              <div className='flex-1 h-px bg-gray-200'></div>
              <span className='text-xs font-semibold text-gray-400 uppercase tracking-widest'>Or continue with</span>
              <div className='flex-1 h-px bg-gray-200'></div>
            </div>

            <div className='space-y-4'>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  className='peer w-full h-14 border border-gray-300 rounded-xl px-4 pt-4 pb-1 text-base text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-white placeholder-transparent'
                  placeholder='Full Name'
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                <label htmlFor="name" className='absolute left-4 top-2 text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-900'>Full Name</label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className='peer w-full h-14 border border-gray-300 rounded-xl px-4 pt-4 pb-1 text-base text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-white placeholder-transparent'
                  placeholder='Email Address'
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <label htmlFor="email" className='absolute left-4 top-2 text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-900'>Email Address</label>
              </div>

              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  className='peer w-full h-14 border border-gray-300 rounded-xl px-4 pt-4 pb-1 text-base text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-white placeholder-transparent'
                  placeholder='+1234567890'
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                />
                <label htmlFor="phone" className='absolute left-4 top-2 text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-900'>Phone (Optional)</label>
              </div>

              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  id="password"
                  className='peer w-full h-14 border border-gray-300 rounded-xl px-4 pr-12 pt-4 pb-1 text-base text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-white placeholder-transparent'
                  placeholder='Password'
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <label htmlFor="password" className='absolute left-4 top-2 text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-900'>Password</label>
                <button
                  type='button'
                  tabIndex="-1"
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                  onClick={() => setShow(!show)}
                >
                  {show ? <IoEye size={22} /> : <IoEyeOutline size={22} />}
                </button>
              </div>
            </div>

            <button
              type='submit'
              className='w-full h-14 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 shadow-md flex items-center justify-center'
            >
              {loading ? <Loading /> : "Create Account"}
            </button>

            <p className='text-center text-sm text-gray-600 mt-6'>
              Already have an account?{' '}
              <Link to="/login" className='font-bold text-gray-900 hover:underline'>
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Registration;

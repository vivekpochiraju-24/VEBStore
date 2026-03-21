import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import { X, MessageCircle, Phone } from 'lucide-react';

function WhatsappModal() {
  const { serverUrl } = useContext(authDataContext);
  const { userData, setUserData } = useContext(userDataContext);
  
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show modal if user is logged in, but hasn't opted in for WhatsApp yet.
    if (userData && !userData.whatsappOptIn) {
      // Add a slight delay for realistic, non-intrusive pop-up experience
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/user/whatsapp-optin`,
        { whatsappPhone: phoneNumber },
        { withCredentials: true }
      );
      
      toast.success(response.data.message || 'Subscribed to WhatsApp updates!');
      
      // Update local user data so modal won't show again
      setUserData((prev) => ({
        ...prev,
        whatsappOptIn: true,
        whatsappPhone: phoneNumber
      }));
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to opt in');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in'>
      <div className='relative w-full max-w-[400px] bg-white rounded-3xl shadow-2xl p-8 overflow-hidden mx-4 animate-scale-up'>
        
        {/* Decorative background circle */}
        <div className='absolute -top-16 -right-16 w-48 h-48 bg-green-500/10 rounded-full blur-3xl'></div>
        <div className='absolute -bottom-16 -left-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl'></div>
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className='absolute top-4 right-4 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all'
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className='flex justify-center mb-6 relative z-10'>
          <div className='w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shadow-inner'>
            <MessageCircle size={32} />
          </div>
        </div>

        {/* Text Area */}
        <div className='text-center mb-8 relative z-10'>
          <h2 className='text-2xl font-black text-gray-900 mb-2'>Get WhatsApp Updates</h2>
          <p className='text-sm text-gray-500 leading-relaxed px-2'>
            Never miss an exclusive drop! Enter your number to receive tracking details and new product alerts directly on WhatsApp.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className='relative z-10 space-y-4'>
          <div>
            <div className='relative flex items-center group'>
              <Phone className='absolute left-4 text-gray-400 group-focus-within:text-green-500 transition-colors' size={20} />
              <input
                type='tel'
                placeholder='Enter WhatsApp Number'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className='w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-400'
                disabled={loading}
              />
            </div>
            <p className='text-[11px] text-gray-400 mt-2 text-center'>
              We respect your privacy. No spam, just pure updates.
            </p>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xl shadow-green-500/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2'
          >
            {loading ? (
              <span className='animate-pulse'>Subscribing...</span>
            ) : (
              <>
                <MessageCircle size={18} />
                Send Me Updates
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

export default WhatsappModal;

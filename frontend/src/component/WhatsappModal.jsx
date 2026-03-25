import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import { shopDataContext } from '../context/ShopContext';
import { X, MessageCircle, Phone, Sparkles } from 'lucide-react';

function WhatsappModal() {
  const { serverUrl } = useContext(authDataContext);
  const { userData, setUserData } = useContext(userDataContext);
  const { products, currency } = useContext(shopDataContext);

  const { showWhatsapp, setShowWhatsapp } = useContext(shopDataContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('91');
  const [loading, setLoading] = useState(false);

  // Sync shopContext state with local visibility
  const isOpen = showWhatsapp;
  const setIsOpen = setShowWhatsapp;

  // Build a stunning welcome & product showcase message for the user's number
  const buildWelcomeMessage = () => {
    // Pick up to 3 featured products to showcase
    const featured = products.slice(0, 3);
    const fullPhone = `+${countryCode} ${phoneNumber}`;

    const lines = [];
    lines.push(`╔══════════════════════════╗`);
    lines.push(`  💎 *VEBStore Premium Fashion* 💎`);
    lines.push(`╚══════════════════════════╝`);
    lines.push(``);
    lines.push(`🌟 *Hi ${userData?.name || 'Valued Customer'}!* 🌟`);
    lines.push(``);
    lines.push(`✨ You've been officially enrolled in our *WhatsApp VIP Club!*`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(``);
    lines.push(`📱 *Your Registered Number:* ${fullPhone}`);
    lines.push(`💛 *Supercoins Balance:* ${userData?.supercoins || 0} Coins`);
    lines.push(``);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`🛍️ *HANDPICKED FOR YOU TODAY:*`);
    lines.push(``);

    featured.forEach((p, i) => {
      const emoji = ['👗', '👔', '👘'][i] || '🧥';
      lines.push(`${emoji} *${p.name}*`);
      lines.push(`   💰 Price: *${currency}${p.price}*`);
      if (p.category) lines.push(`   🏷️ Category: ${p.category}`);
      if (p.image?.[0]) lines.push(`   🖼️ View: ${p.image[0]}`);
      lines.push(``);
    });

    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`🎁 *EXCLUSIVE VIP BENEFITS:*`);
    lines.push(`   🪙 Earn Supercoins on exchange`);
    lines.push(`   🏷️ Early access to drops`);
    lines.push(`   🚚 Free delivery on orders ₹999+`);
    lines.push(`   ♻️ Dress Exchange Rewards Program`);
    lines.push(``);
    lines.push(`💬 *Reply to this message to chat with us!*`);
    lines.push(`🔕 Reply *STOP* anytime to unsubscribe.`);
    lines.push(``);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`💜 *Thank you for choosing VEBStore!*`);
    lines.push(`_Where fashion meets feeling._`);

    return lines.join('\n');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanDigits = phoneNumber.replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `${countryCode}${cleanDigits}`;

      // Save to DB
      await axios.post(
        `${serverUrl}/api/user/whatsapp-optin`,
        { whatsappPhone: fullPhone },
        { withCredentials: true }
      );

      toast.success('🎉 Subscribed! Opening WhatsApp for your number...');

      // Build a personalised welcome message sent TO the entered number
      const featured = products.slice(0, 3);
      const lines = [];
      lines.push(`╔══════════════════════════╗`);
      lines.push(`  💎 *VEBStore — Welcome to VIP!*`);
      lines.push(`╚══════════════════════════╝`);
      lines.push(``);
      lines.push(`🌟 *Hi ${userData?.name || 'Valued Customer'}!* 🌟`);
      lines.push(``);
      lines.push(`✅ You've been subscribed to *VEBStore WhatsApp VIP Updates!*`);
      lines.push(`📱 Updates will be sent to: *+${fullPhone}*`);
      lines.push(``);
      lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━`);
      lines.push(`👑 *YOUR VIP ACCOUNT:*`);
      lines.push(`   • 💛 Supercoins Balance: *${userData?.supercoins || 0} coins*`);
      if (userData?.email) lines.push(`   • 📧 ${userData.email}`);
      lines.push(``);
      lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━`);
      lines.push(`🛍️ *HANDPICKED FOR YOU TODAY:*`);
      lines.push(``);
      featured.forEach((p, i) => {
        const icons = ['👗', '👔', '👘'];
        lines.push(`${icons[i] || '🧥'} *${p.name}*`);
        lines.push(`   💰 ₹${p.price}  🏷️ ${p.category || ''}`);
        lines.push(``);
      });
      lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━`);
      lines.push(`🎁 *YOUR VIP BENEFITS:*`);
      lines.push(`   ♻️ Exchange old clothes → Earn Supercoins`);
      lines.push(`   🪙 Use Supercoins as discount at checkout`);
      lines.push(`   🚚 Free delivery on orders ₹999+`);
      lines.push(`   🏷️ Early access to new drops`);
      lines.push(``);
      lines.push(`💜 *Thank you for choosing VEBStore!*`);
      lines.push(`_Reply STOP to unsubscribe._`);

      const message = lines.join('\n');
      // ✅ Opens WhatsApp TO the entered number — message goes directly to them
      const waUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      setUserData((prev) => ({
        ...prev,
        whatsappOptIn: true,
        whatsappPhone: fullPhone,
      }));
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to subscribe. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in p-4'>
      <div className='relative w-full max-w-[420px] rounded-3xl shadow-2xl overflow-hidden animate-scale-up'>

        {/* Gradient Header */}
        <div className='relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 p-8 pb-12'>
          {/* Decorative circles */}
          <div className='absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2'></div>
          <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2'></div>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className='absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all z-10'
          >
            <X size={16} />
          </button>

          {/* Icon & Title */}
          <div className='relative z-10 flex flex-col items-center text-center'>
            <div className='w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-4'>
              <svg viewBox='0 0 32 32' className='w-10 h-10'>
                <path fill='#25D366' d='M16 0C7.163 0 0 7.163 0 16c0 2.817.731 5.463 2.01 7.767L0 32l8.523-2.235A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0z'/>
                <path fill='white' d='M23.5 19.875c-.375-.187-2.219-1.094-2.562-1.219s-.594-.187-.844.188-.969 1.219-1.187 1.469-.437.281-.812.094c-.375-.188-1.586-.584-3.02-1.864-1.116-.997-1.87-2.228-2.088-2.603s-.023-.578.164-.765c.168-.168.375-.437.562-.656s.25-.375.375-.625.063-.469-.031-.656-.844-2.031-1.156-2.781c-.305-.73-.614-.63-.844-.642-.218-.011-.469-.013-.719-.013s-.656.094-.999.469-1.313 1.281-1.313 3.125 1.344 3.625 1.531 3.875c.188.25 2.645 4.04 6.407 5.663.895.387 1.594.617 2.138.790.898.285 1.715.245 2.361.149.72-.108 2.219-.907 2.532-1.783.312-.875.312-1.625.218-1.781-.093-.156-.343-.25-.718-.437z'/>
              </svg>
            </div>
            <h2 className='text-2xl font-black text-white mb-1'>Get VIP Updates</h2>
            <p className='text-green-100 text-sm font-medium'>Fashion drops · Order alerts · Supercoins</p>
          </div>
        </div>

        {/* White body card */}
        <div className='bg-white px-6 pt-6 pb-8'>

          {/* Feature pills */}
          <div className='flex flex-wrap gap-2 justify-center mb-6 -mt-14 relative z-10'>
            {['🛍️ New Drops', '📦 Order Tracking', '💛 Supercoin Alerts', '♻️ Exchange Rewards'].map(tag => (
              <span key={tag} className='px-3 py-1 bg-white text-xs font-bold text-gray-700 rounded-full shadow-md border border-gray-100'>
                {tag}
              </span>
            ))}
          </div>

          <p className='text-center text-sm text-gray-500 mb-5 leading-relaxed'>
            Enter your WhatsApp number — we'll send your <strong>personalised welcome message</strong> with today's featured collections instantly!
          </p>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Phone Number Input */}
            <div className='flex gap-2'>
              {/* Country code selector */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className='h-14 px-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-500 transition-all w-[80px]'
              >
                <option value='91'>🇮🇳 +91</option>
                <option value='1'>🇺🇸 +1</option>
                <option value='44'>🇬🇧 +44</option>
                <option value='971'>🇦🇪 +971</option>
                <option value='65'>🇸🇬 +65</option>
                <option value='61'>🇦🇺 +61</option>
              </select>
              <div className='relative flex-1 group'>
                <Phone className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors' size={18} />
                <input
                  type='tel'
                  placeholder='WhatsApp Number'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={15}
                  className='w-full h-14 bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 text-sm font-semibold focus:ring-2 focus:ring-green-400/30 focus:border-green-500 outline-none transition-all placeholder:text-gray-400 text-gray-800'
                  disabled={loading}
                />
              </div>
            </div>

            <p className='text-[11px] text-center text-gray-400 flex items-center justify-center gap-1'>
              <span>🔒</span> We never share your number. Pure fashion updates only.
            </p>

            <button
              type='submit'
              disabled={loading}
              className='w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-black text-sm tracking-wide transition-all shadow-xl shadow-green-500/30 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2'
            >
              {loading ? (
                <span className='flex items-center gap-2'>
                  <svg className='animate-spin w-4 h-4' viewBox='0 0 24 24' fill='none'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/>
                  </svg>
                  Subscribing...
                </span>
              ) : (
                <>
                  <MessageCircle size={18} />
                  Send Me Personalised Updates
                  <Sparkles size={14} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WhatsappModal;

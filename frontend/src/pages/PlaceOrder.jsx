import React, { useContext, useState } from 'react'
import Title from '../component/Title'
import CartTotal from '../component/CartTotal'
import razorpay from '../assets/Razorpay.jpg'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'
import { FaMoneyBillWave } from "react-icons/fa";
import { themeDataContext } from '../context/ThemeContext'
import { CheckCircle2 } from 'lucide-react'

function PlaceOrder() {
  let [method, setMethod] = useState('cod')
  let [upiId, setUpiId] = useState('')
  let navigate = useNavigate()
  const { cartItem, setCartItem, getCartAmount, delivery_fee, products, appliedCoins, setAppliedCoins } = useContext(shopDataContext)
  const { userData } = useContext(userDataContext)
  let { serverUrl } = useContext(authDataContext)
  const { isDark } = useContext(themeDataContext)
  const dk = isDark
  let [loading, setLoading] = useState(false)
  let [isMagicProcessing, setIsMagicProcessing] = useState(false)
  let [magicStage, setMagicStage] = useState(0)
  let [magicTimer, setMagicTimer] = useState(5)

  const magicStages = [
    "Verifying UPI Identity...",
    "Requesting ₹" + (getCartAmount() + delivery_fee - appliedCoins) + " from Wallet...",
    "Securely Processing Payment...",
    "Authorizing with Bank...",
    "Finalizing Order..."
  ]

  let [formData, setFormData] = useState({
    firstName: userData?.name?.split(' ')[0] || '',
    lastName: userData?.name?.split(' ')[1] || '',
    email: userData?.email || '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    phone: userData?.phone || ''
  })

  React.useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || userData.name?.split(' ')[0] || '',
        lastName: prev.lastName || userData.name?.split(' ')[1] || '',
        email: prev.email || userData.email || '',
        phone: prev.phone || userData.phone || ''
      }))
    }
  }, [userData])

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(data => ({ ...data, [name]: value }))
  }

  const initPay = (order) => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SSMJtAPB3B3MTE';
    
    if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
      console.warn("⚠️ Razorpay VITE_RAZORPAY_KEY_ID is missing from .env. Using fallback.");
    }

    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log("Payment Confirmed. Response:", response);
        try {
          const { data } = await axios.post(serverUrl + '/api/order/verifyrazorpay', response, { withCredentials: true })
          console.log("Verification Result:", data);
          if (data && data.message === "Payment Successful") {
            toast.success("Payment Received! 🎉")
            setCartItem({})
            
            // Wait 2 seconds before navigating
            setTimeout(() => {
              console.log("Redirecting to /order...");
              navigate("/order")
              // Atomic fallback
              setTimeout(() => {
                if (window.location.pathname !== "/order") {
                  window.location.href = "/order";
                }
              }, 1000);
            }, 2000)
            
          } else {
            toast.warning("Payment Status: " + (data?.message || "Incomplete"))
          }
        } catch (err) {
          console.error("Verification error", err)
          toast.error("Payment verification failed. Checking orders...")
          setTimeout(() => navigate("/order"), 3000)
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      theme: {
        color: "#3b82f6"
      },
      ...(method === 'phonepe' && upiId ? {
        method: 'upi',
        vpa: upiId
      } : {})
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        toast.error("Payment Connection Error: " + response.error.description)
      });
      rzp.open()
    } catch (err) {
      console.error("Razorpay Open Error:", err)
      toast.error("Could not initialize payment gateway")
    }
  }


  const onSubmitHandler = async (e) => {

    setLoading(true)
    e.preventDefault()
    try {
      let orderItems = []
      for (const items in cartItem) {
        for (const item in cartItem[items]) {
          if (cartItem[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItem[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee - appliedCoins,
        appliedCoins: appliedCoins,
        paymentMethod: method === 'phonepe' ? 'UPI' : (method === 'razorpay' ? 'Razorpay' : 'COD'),
        paymentStatus: (method === 'phonepe' || method === 'razorpay') ? true : false
      }
      switch (method) {
        case 'cod': 
        case 'razorpay': // Razorpay now follows the same simulation logic
        case 'phonepe': { 
          
          const result = await axios.post(serverUrl + "/api/order/placeorder", orderData, { withCredentials: true })
          console.log(result.data)
          if (result.data) {
            setCartItem({})
            setAppliedCoins(0)
            
            if (method === 'phonepe') {
                toast.success("UPI Payment Successful!")
            } else if (method === 'razorpay') {
                toast.success("Razorpay Payment Successful!")
            } else {
                toast.success("Order Placed")
            }
            
            navigate("/order")
            setLoading(false)
            setIsMagicProcessing(false)

          } else {
            console.log(result.data.message)
            toast.error("Order placed error")
            setLoading(false)
            setIsMagicProcessing(false)
          }

          break;
        }

        default:
          break;
      }


    } catch (error) {
      console.log(error)

    }
  }
  return (
    <div className={`w-full min-h-screen pt-[100px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-32 transition-colors duration-500 flex flex-col lg:flex-row gap-12 relative ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>

      {/* Back Button */}
      <div className='w-full absolute left-0 top-[100px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-4'>
          <button 
            type="button"
            onClick={() => navigate('/cart')}
            className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all p-2 rounded-xl border ${dk ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-gray-100 text-gray-500 hover:text-gray-900 shadow-sm'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Bag
          </button>
      </div>

      {/* Left: Delivery Information */}
      <div className='flex-1 w-full mt-10'>
        <form action="" onSubmit={onSubmitHandler} className='w-full flex flex-col gap-6' id="checkout-form">
          <div className='mb-2'>
            <Title text1={'DELIVERY'} text2={'INFORMATION'} />
          </div>

          <div className={`p-6 sm:p-8 border rounded-2xl shadow-sm flex flex-col gap-5 ${dk ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-gray-100'}`}>
            <div className='flex gap-5'>
              <input type="text" placeholder='First name' className={`w-full h-12 rounded-xl border px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required onChange={onChangeHandler} name='firstName' value={formData.firstName} />
              <input type="text" placeholder='Last name' className={`w-full h-12 rounded-xl border px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required onChange={onChangeHandler} name='lastName' value={formData.lastName} />
            </div>

            <input type="email" placeholder='Email address' className={`w-full h-12 rounded-xl border px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required onChange={onChangeHandler} name='email' value={formData.email} />

            <input type="text" placeholder='Street address' className={`w-full h-12 rounded-xl border px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required onChange={onChangeHandler} name='street' value={formData.street} />

            <div className='flex gap-5'>
              <input type="text" placeholder='City' className={`w-full h-12 rounded-xl border px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required onChange={onChangeHandler} name='city' value={formData.city} />
              <input type="text" placeholder='State / Province' className={`w-full h-12 rounded-xl border px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required onChange={onChangeHandler} name='state' value={formData.state} />
            </div>

            <div className='flex gap-5'>
              <input type="text" placeholder='Postal code' className={`w-full h-12 rounded-xl border px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required onChange={onChangeHandler} name='pinCode' value={formData.pinCode} />
              <input type="text" placeholder='Country' className={`w-full h-12 rounded-xl border px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required onChange={onChangeHandler} name='country' value={formData.country} />
            </div>

            <input type="tel" placeholder='Phone number' className={`w-full h-12 rounded-xl border px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required onChange={onChangeHandler} name='phone' value={formData.phone} />
          </div>
        </form>
      </div>

      {/* Right: Cart Total & Payment */}
      <div className='w-full lg:w-[450px] shrink-0 flex flex-col gap-10'>
        <CartTotal />

        <div className='w-full flex justify-end flex-col'>
          <div className='mb-4'>
            <Title text1={'PAYMENT'} text2={'METHOD'} />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 w-full'>
            <div
              onClick={() => setMethod('razorpay')}
              className={`flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all bg-white shadow-sm ${method === 'razorpay' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <img src={razorpay} className='h-8 object-contain' alt="Razorpay" />
            </div>
            <div
              onClick={() => setMethod('phonepe')}
              className={`flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all bg-white shadow-sm gap-2 ${method === 'phonepe' ? 'border-purple-600 bg-purple-50/30' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className={`p-1.5 rounded-lg ${method === 'phonepe' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </div>
              <div className='flex flex-col'>
                <span className={`text-[10px] leading-none font-black ${method === 'phonepe' ? 'text-purple-700' : 'text-gray-400'}`}>UPI PAY</span>
                <span className={`text-xs font-black tracking-tight ${method === 'phonepe' ? 'text-gray-900' : 'text-gray-600'}`}>@YBL / PHONEPE</span>
              </div>
            </div>
            <div
              onClick={() => setMethod('cod')}
              className={`flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all bg-white shadow-sm gap-2 ${method === 'cod' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <FaMoneyBillWave className={`text-xl ${method === 'cod' ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={`text-xs font-black tracking-tight ${method === 'cod' ? 'text-gray-900' : 'text-gray-500'}`}>CASH ON DELIVERY</span>
            </div>
          </div>

          {/* UPI ID Input Section - Appears when UPI is selected */}
          {method === 'phonepe' && (
            <div className={`mt-6 p-5 rounded-2xl border animate-in fade-in slide-in-from-top-4 duration-500 ${dk ? 'bg-slate-800/40 border-slate-700' : 'bg-purple-50/40 border-purple-100 shadow-sm'}`}>
              <div className='flex items-center gap-2 mb-4'>
                <div className='w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white'>
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                   </svg>
                </div>
                <div>
                  <h4 className={`text-xs font-black uppercase tracking-widest ${dk ? 'text-white' : 'text-gray-900'}`}>Pay via UPI ID</h4>
                  <p className='text-[10px] text-gray-400 font-bold uppercase'>Instant & Secure</p>
                </div>
              </div>

              <div className='relative'>
                <input 
                  type="text" 
                  placeholder='Enter UPI ID (e.g. vishal@ybl)' 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className={`w-full h-12 rounded-xl border px-4 text-sm font-bold outline-none transition-all shadow-inner focus:ring-2 focus:ring-purple-500/20 ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 focus:border-purple-500' : 'bg-white border-gray-200 text-gray-900 focus:border-purple-600'}`}
                />
                {upiId.includes('@') && (
                  <div className='absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in duration-300'>
                    <CheckCircle2 size={18} />
                  </div>
                )}
              </div>

              <div className='mt-4'>
                <p className={`text-[10px] font-black uppercase tracking-wider mb-2 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Popular Examples (Click to Pay):</p>
                <div className='flex flex-wrap gap-2'>
                  {['vk@ybl', 'vivek@okaxis', 'test@paytm', 'user@okhdfcbank'].map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setUpiId(id);
                        setMethod('phonepe');
                        
                        // Start Magic Processing Simulation
                        setIsMagicProcessing(true);
                        setMagicTimer(5);
                        setMagicStage(0);
                        
                        const interval = setInterval(() => {
                           setMagicTimer(prev => {
                              if (prev <= 1) {
                                 clearInterval(interval);
                                 return 0;
                              }
                              return prev - 1;
                           });
                           setMagicStage(prev => (prev + 1) % magicStages.length);
                        }, 1000);

                        setTimeout(() => {
                           const form = document.getElementById('checkout-form');
                           if (form) form.requestSubmit();
                        }, 5000);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all border ${upiId === id ? (dk ? 'bg-purple-600 border-purple-500 text-white' : 'bg-purple-600 border-purple-600 text-white shadow-md') : (dk ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-purple-600 hover:text-purple-600')}`}
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Supercoins Section */}
          <div className={`mt-8 p-6 rounded-2xl border transition-all ${dk ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50/30 border-blue-100'}`}>
              <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-2'>
                      <span className='text-xl'>💛</span>
                      <h3 className={`font-bold text-sm tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>USE SUPERCOINS</h3>
                  </div>
                  <span className={`text-xs font-black px-2 py-1 rounded-lg ${dk ? 'bg-yellow-500/20 text-yellow-500' : 'bg-yellow-100 text-yellow-700'}`}>
                      BALANCE: {userData?.supercoins || 0}
                  </span>
              </div>
              
              <div className='flex gap-2'>
                  <input 
                    type="number" 
                    placeholder="Enter coins to use"
                    value={appliedCoins || ''}
                    onChange={(e) => {
                        const val = Math.min(Number(e.target.value), userData?.supercoins || 0, getCartAmount() + delivery_fee);
                        setAppliedCoins(val >= 0 ? val : 0);
                    }}
                    className={`flex-1 h-11 px-4 rounded-xl border text-sm font-bold outline-none transition-all ${dk ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-200'}`}
                  />
                  <button 
                    type="button"
                    onClick={() => setAppliedCoins(Math.min(userData?.supercoins || 0, getCartAmount() + delivery_fee))}
                    className='px-4 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all'
                  >
                    MAX
                  </button>
              </div>
              {appliedCoins > 0 && (
                  <p className='text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1 uppercase tracking-widest'>
                      <CheckCircle2 size={10} /> Extra ₹{appliedCoins} discount applied!
                  </p>
              )}
          </div>

          <button
            type='button' // Changed to button to handle custom flow
            onClick={() => {
               if (method === 'razorpay') {
                  setIsMagicProcessing(true);
                  setMagicTimer(5);
                  setMagicStage(0);
                  const interval = setInterval(() => {
                     setMagicTimer(prev => {
                        if (prev <= 1) { clearInterval(interval); return 0; }
                        return prev - 1;
                     });
                     setMagicStage(prev => (prev + 1) % magicStages.length);
                  }, 1000);

                  setTimeout(() => {
                     const form = document.getElementById('checkout-form');
                     if (form) form.requestSubmit();
                  }, 5000);
               } else {
                  const form = document.getElementById('checkout-form');
                  if (form) form.requestSubmit();
               }
            }}
            disabled={loading}
            className='w-full mt-8 bg-gray-900 text-white font-bold text-lg py-4 rounded-2xl hover:bg-black active:scale-[0.98] transition-all shadow-md disabled:bg-gray-400 flex justify-center items-center h-[60px]'
          >
            {loading ? <Loading /> : "PLACE ORDER"}
          </button>
        </div>
      </div>

      {/* Magic Payment Processing Overlay */}
      {isMagicProcessing && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
           <div className={`p-10 rounded-[40px] max-w-md w-full mx-4 shadow-2xl border text-center relative overflow-hidden transition-all duration-500 transform scale-100 ${dk ? 'bg-[#0f172a] border-slate-700' : 'bg-white border-blue-50'}`}>
              
              {/* Progress Ring */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle 
                       cx="64" cy="64" r="60" 
                       className={`${dk ? 'stroke-slate-800' : 'stroke-blue-50'}`}
                       strokeWidth="8" fill="none" 
                    />
                    <circle 
                       cx="64" cy="64" r="60" 
                       className="stroke-blue-600 transition-all duration-1000 ease-linear"
                       strokeWidth="8" fill="none" 
                       strokeLinecap="round"
                       style={{
                          strokeDasharray: '377',
                          strokeDashoffset: 377 - (377 * (5 - magicTimer) / 5)
                       }}
                    />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black text-blue-600">{magicTimer}</span>
                 </div>
              </div>

              <div className="space-y-4">
                  <h3 className={`text-2xl font-black tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>
                     Processing Payment
                  </h3>
                  <div className="flex flex-col items-center gap-2">
                     <p className="text-blue-500 font-black text-xs uppercase tracking-[0.2em] animate-pulse">
                        {magicStages[magicStage]}
                     </p>
                     <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map(i => (
                           <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${magicStage === i ? 'bg-blue-600 w-4' : 'bg-blue-200'}`} />
                        ))}
                     </div>
                  </div>
              </div>

              <div className={`mt-8 p-4 rounded-2xl flex items-center gap-4 text-left border ${dk ? 'bg-slate-900/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                 <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                    <CheckCircle2 />
                 </div>
                 <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Paying via {method === 'phonepe' ? 'UPI' : 'Razorpay'}</p>
                    <p className={`text-sm font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>{method === 'phonepe' ? upiId : (formData.email || 'Razorpay Gateway')}</p>
                 </div>
              </div>

              <p className="mt-8 text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                 Please do not refresh or close this window.<br/>
                 Secure transaction encrypted by VEBStore.
              </p>

              {/* Decorative light effect */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full" />
           </div>
        </div>
      )}
    </div>
  )
}

export default PlaceOrder

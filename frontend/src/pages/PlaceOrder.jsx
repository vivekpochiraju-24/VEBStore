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
  let navigate = useNavigate()
  const { cartItem, setCartItem, getCartAmount, delivery_fee, products, appliedCoins, setAppliedCoins } = useContext(shopDataContext)
  const { userData } = useContext(userDataContext)
  let { serverUrl } = useContext(authDataContext)
  const { isDark } = useContext(themeDataContext)
  const dk = isDark
  let [loading, setLoading] = useState(false)

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
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response)
        const { data } = await axios.post(serverUrl + '/api/order/verifyrazorpay', response, { withCredentials: true })
        if (data) {
          navigate("/order")
          setCartItem({})

        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
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
        appliedCoins: appliedCoins
      }
      switch (method) {
        case 'cod': {

          const result = await axios.post(serverUrl + "/api/order/placeorder", orderData, { withCredentials: true })
          console.log(result.data)
          if (result.data) {
            setCartItem({})
            setAppliedCoins(0) // Reset coins after order
            toast.success("Order Placed")
            navigate("/order")
            setLoading(false)

          } else {
            console.log(result.data.message)
            toast.error("Order Placed Error")
            setLoading(false)
          }

          break;
        }

        case 'razorpay': {
          const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay", orderData, { withCredentials: true })
          if (resultRazorpay.data) {
            initPay(resultRazorpay.data)
            setLoading(false)
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

          <div className='flex flex-col sm:flex-row gap-4 w-full'>
            <div
              onClick={() => setMethod('razorpay')}
              className={`flex-1 flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all bg-white shadow-sm ${method === 'razorpay' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <img src={razorpay} className='h-8 object-contain' alt="Razorpay" />
            </div>
            <div
              onClick={() => setMethod('cod')}
              className={`flex-1 flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all bg-white shadow-sm gap-2 ${method === 'cod' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <FaMoneyBillWave className={`text-xl ${method === 'cod' ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-bold tracking-tight ${method === 'cod' ? 'text-gray-900' : 'text-gray-500'}`}>CASH ON DELIVERY</span>
            </div>
          </div>

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
            type='submit'
            form="checkout-form"
            disabled={loading}
            className='w-full mt-8 bg-gray-900 text-white font-bold text-lg py-4 rounded-2xl hover:bg-black active:scale-[0.98] transition-all shadow-md disabled:bg-gray-400 flex justify-center items-center h-[60px]'
          >
            {loading ? <Loading /> : "PLACE ORDER"}
          </button>
        </div>
      </div>

    </div>
  )
}

export default PlaceOrder

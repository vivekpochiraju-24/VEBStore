import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import { themeDataContext } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { RiDeleteBin6Line } from "react-icons/ri"
import CartTotal from '../component/CartTotal'

function Cart() {
  const { products, currency, cartItem, updateQuantity } = useContext(shopDataContext)
  const { isDark } = useContext(themeDataContext)
  const [cartData, setCartData] = useState([])
  const navigate = useNavigate()
  const dk = isDark

  useEffect(() => {
    const tempData = []
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItem[items][item],
          })
        }
      }
    }
    setCartData(tempData)
  }, [cartItem])

  return (
    <div className={`w-full min-h-screen pt-[100px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-32 transition-colors duration-300 ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      
      {/* Back Button */}
      <div className='w-full pb-6'>
          <button 
            onClick={() => navigate('/collections')}
            className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all p-2 rounded-xl border ${dk ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-gray-100 text-gray-500 hover:text-gray-900 shadow-sm'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path>
            </svg>
            Return to Boutique
          </button>
      </div>

      <div className='mb-8'>
        <Title text1={'YOUR'} text2={'BAG'} />
        <p className={`text-sm mt-1 font-medium ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Review your signature items before checkout</p>
      </div>

      <div className='w-full flex justify-between lg:flex-row flex-col gap-12'>
        {/* Cart Items List */}
        <div className='flex-1 flex flex-col gap-4'>
          {cartData.length === 0 && (
            <div className={`text-center py-20 rounded-2xl border border-dashed transition-colors duration-300 ${dk ? 'bg-[#1e293b] border-slate-700 text-slate-400' : 'bg-white border-gray-300 text-gray-500'}`}>
              <p className='text-lg font-bold'>Your bag is completely empty.</p>
              <button 
                onClick={() => navigate('/collections')} 
                className='mt-4 text-blue-500 font-black uppercase tracking-widest text-sm hover:underline'
              >
                Continue Shopping
              </button>
            </div>
          )}

          {cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id)
            if (!productData) return null
            return (
              <div key={index} className={`w-full border-b transition-all duration-300 overflow-hidden ${dk ? 'bg-[#1e293b] border-slate-800 shadow-black/20' : 'bg-white border-gray-100 shadow-gray-200/50'} rounded-2xl p-5 hover:shadow-xl group`}>
                <div className='flex items-center gap-6'>
                  <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border transition-all ${dk ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                    <img className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000' src={productData.image1} alt="" />
                  </div>
                  
                  <div className='flex flex-col gap-1.5 flex-1 min-w-0'>
                    <p className={`text-lg sm:text-xl font-black truncate pr-16 ${dk ? 'text-white' : 'text-gray-900'}`}>{productData.name}</p>
                    <div className='flex flex-wrap items-center gap-4 sm:gap-6 mt-1'>
                      <p className='text-xl text-blue-500 font-black'>{currency}{productData.price}</p>
                      <p className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border leading-none ${dk ? 'text-slate-400 bg-slate-800 border-slate-700' : 'text-gray-600 bg-gray-50 border-gray-200'}`}>Size: {item.size}</p>
                    </div>
                  </div>

                  <div className='flex flex-col sm:flex-row items-center justify-end gap-6 sm:w-auto w-16 px-4'>
                    <div className='flex flex-col items-center gap-1.5'>
                       <p className={`text-[10px] font-black uppercase tracking-widest leading-none ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Qty</p>
                       <input
                        type="number"
                        min={1}
                        defaultValue={item.quantity}
                        className={`w-14 h-10 px-1 text-center font-black rounded-lg border outline-none focus:ring-2 focus:ring-blue-500/30 transition-all ${dk ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        onChange={(e) => (e.target.value === ' ' || e.target.value === '0') ? null : updateQuantity(item._id, item.size, Number(e.target.value))}
                      />
                    </div>
                    
                    <button
                      className={`p-3 rounded-xl transition-all ${dk ? 'text-slate-500 hover:text-rose-500 hover:bg-rose-500/10' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                    >
                      <RiDeleteBin6Line className='w-5 h-5' />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Cart Total & Checkout */}
        {cartData.length > 0 && (
          <div className='w-full lg:w-[420px] shrink-0'>
            <div className={`sticky top-[110px] p-8 rounded-3xl border shadow-2xl ${dk ? 'bg-[#1e293b] border-slate-700 shadow-black/30' : 'bg-white border-gray-100 shadow-gray-200/40'}`}>
              <CartTotal />
              <button
                className={`w-full mt-10 h-16 font-black text-sm uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-xl ${dk ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30' : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/30'}`}
                onClick={() => navigate("/placeorder")}
              >
                Complete Purchase
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart

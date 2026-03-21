import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import Title from './Title'

function CartTotal() {
  const { currency, delivery_fee, getCartAmount } = useContext(shopDataContext)
  return (
    <div className='w-full'>
      <div className='text-xl sm:text-2xl mb-4'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>
      <div className='flex flex-col gap-3 mt-2 text-sm bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100'>
        <div className='flex justify-between text-gray-600 text-base'>
          <p>Subtotal</p>
          <p className='text-gray-900 font-semibold'>{currency}{getCartAmount()}.00</p>
        </div>
        <hr className='border-gray-100' />
        <div className='flex justify-between text-gray-600 text-base'>
          <p>Shipping Fee</p>
          <p className='text-gray-900 font-semibold'>{currency}{delivery_fee}</p>
        </div>
        <hr className='border-gray-100' />
        <div className='flex justify-between text-gray-900 text-lg pt-2'>
          <b>Total</b>
          <b className='text-blue-600'>{currency}{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}</b>
        </div>
      </div>
    </div>
  )
}

export default CartTotal

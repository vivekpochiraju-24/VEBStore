import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { userDataContext } from '../context/UserContext'
import Title from './Title'
import { toast } from 'react-toastify'

function CartTotal() {
  const { currency, delivery_fee, getCartAmount, appliedCoins, setAppliedCoins } = useContext(shopDataContext)
  const { userData } = useContext(userDataContext)

  const handleApplyCoins = () => {
    if (!userData) {
      toast.error("Please login to apply Supercoins")
      return;
    }
    
    const subtotal = getCartAmount();
    if (subtotal < 1000) {
      toast.error("Supercoin discounts are only applicable on orders above ₹1000");
      return;
    }

    const maxApplicable = Math.min(userData.supercoins || 0, subtotal);
    if (maxApplicable > 0) {
      if (appliedCoins > 0) {
        setAppliedCoins(0);
        toast.info("Supercoins removed");
      } else {
        setAppliedCoins(maxApplicable);
        toast.success(`Applied ${maxApplicable} Supercoins!`);
      }
    } else {
      toast.error("You don't have any Supercoins to apply, or cart is empty");
    }
  }

  const finalCartAmount = getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee - appliedCoins;

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
        
        {userData && (userData.supercoins > 0 || appliedCoins > 0) && (
          <>
            <hr className='border-gray-100' />
            <div className='flex justify-between items-center text-gray-600 text-base'>
              <div>
                <p className='font-medium text-yellow-600'>Supercoins (Balance: {userData.supercoins})</p>
                <button 
                  onClick={handleApplyCoins}
                  className={`mt-1 text-xs px-3 py-1 rounded-full font-bold transition-all ${appliedCoins > 0 ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-100'}`}
                >
                  {appliedCoins > 0 ? 'Remove Coins' : 'Apply Coins Max'}
                </button>
                {getCartAmount() < 1000 && (
                  <p className='text-[10px] font-bold text-amber-600 uppercase tracking-tighter mt-2'>
                    ⚠️ Min ₹1000 required for discount
                  </p>
                )}
              </div>
              {appliedCoins > 0 && <p className='text-green-600 font-bold'>-{currency}{appliedCoins}</p>}
            </div>
          </>
        )}

        <hr className='border-gray-100' />
        <div className='flex justify-between text-gray-600 text-base'>
          <p>Shipping Fee</p>
          <p className='text-gray-900 font-semibold'>{currency}{delivery_fee}</p>
        </div>
        <hr className='border-gray-100' />
        <div className='flex justify-between text-gray-900 text-lg pt-2'>
          <b>Total</b>
          <b className='text-blue-600'>{currency}{finalCartAmount}</b>
        </div>
      </div>
    </div>
  )
}

export default CartTotal

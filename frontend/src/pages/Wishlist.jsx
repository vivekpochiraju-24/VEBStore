import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import { themeDataContext } from '../context/ThemeContext'
import Card from '../component/Card'
import { Heart, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Wishlist() {
  const { isDark } = useContext(themeDataContext)
  const { products, wishlist } = useContext(shopDataContext)
  const [wishlistProducts, setWishlistProducts] = useState([])
  const navigate = useNavigate()
  const dk = isDark

  useEffect(() => {
    if (products.length > 0 && wishlist.length > 0) {
      const filtered = products.filter(item => wishlist.includes(item._id))
      setWishlistProducts(filtered)
    } else {
      setWishlistProducts([])
    }
  }, [wishlist, products])

  return (
    <div className={`w-full min-h-screen pt-[120px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-32 transition-colors duration-300 ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className='mb-10'>
        <Title text1={'MY'} text2={'WISHLIST'} />
        <p className={`text-sm mt-1 font-bold ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Your personal collection of signature styles</p>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
          {wishlistProducts.map((item, index) => (
            <Card 
                key={index} 
                id={item._id} 
                name={item.name} 
                image={item.image1} 
                price={item.price} 
                fabric={item.fabric} 
                suitableFor={item.suitableFor} 
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-24 px-4 text-center'>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border-2 border-dashed ${dk ? 'bg-slate-800/50 border-slate-700 text-slate-600' : 'bg-white border-gray-200 text-gray-300'}`}>
                <Heart size={40} />
            </div>
            <h2 className={`text-2xl font-black mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>Your wishlist is empty</h2>
            <p className={`max-w-md mb-8 font-medium ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
                Discover our elite collections and save your favorite pieces to find them easily later.
            </p>
            <button 
                onClick={() => navigate('/products')}
                className='px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2'
            >
                <ShoppingBag size={18} />
                Explore Boutique
            </button>
        </div>
      )}
    </div>
  )
}

export default Wishlist

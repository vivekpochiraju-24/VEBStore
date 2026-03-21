import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { themeDataContext } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { Plus, Heart } from 'lucide-react'

function Card({ name, image, id, price }) {
  const { currency, products } = useContext(shopDataContext)
  const { isDark } = useContext(themeDataContext)
  const navigate = useNavigate()
  const dk = isDark

  const productData = products.find(p => p._id === id)
  const reviews = productData?.reviews || []
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div
      className={`w-full group cursor-pointer transition-all duration-500 rounded-[28px] ${dk ? 'bg-[#1e293b]' : 'bg-white'}`}
      onClick={() => navigate(`/productdetail/${id}`)}
    >
      {/* Image Container */}
      <div className={`w-full aspect-[3/4] overflow-hidden relative rounded-[28px] border shadow-sm group-hover:shadow-xl transition-all duration-500 ${dk ? 'bg-[#0f172a] border-slate-700/50 group-hover:shadow-black/30' : 'bg-[#fdfdfd] border-gray-50 group-hover:shadow-gray-200/50'}`}>
        <img
          src={image}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out'
          alt={name}
        />

        {/* Overlay Actions */}
        <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

        <div className='absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500 delay-75'>
          <button className='w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-lg hover:bg-blue-600 hover:text-white transition-all'>
            <Heart size={18} />
          </button>
          <button className='w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-lg hover:bg-blue-600 hover:text-white transition-all'>
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className='px-3 py-4 flex flex-col gap-1.5'>
        <p className={`text-[15px] font-bold group-hover:text-blue-500 transition-colors line-clamp-1 leading-tight ${dk ? 'text-slate-100' : 'text-gray-900'}`}>{name}</p>

        {/* Reviews */}
        <div className='flex items-center gap-1.5 mt-0.5'>
          {averageRating > 0 ? (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${dk ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-100'}`}>
              <span className={`text-xs font-bold ${dk ? 'text-slate-200' : 'text-gray-800'}`}>{averageRating}</span>
              <span className='text-[#FFD700] text-xs'>★</span>
              <span className={`text-[10px] font-medium ml-1 ${dk ? 'text-slate-400' : 'text-gray-400'}`}>({reviews.length})</span>
            </div>
          ) : (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${dk ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-100'}`}>
              <span className={`text-[10px] font-medium ${dk ? 'text-slate-400' : 'text-gray-400'}`}>No reviews yet</span>
            </div>
          )}
        </div>

        <div className='flex items-center gap-2 mt-1'>
          <p className={`text-[18px] font-black tracking-tighter ${dk ? 'text-white' : 'text-gray-900'}`}>{currency}{price}</p>
          <p className={`text-[13px] font-medium line-through ${dk ? 'text-slate-600' : 'text-gray-300'}`}>₹{Math.floor(price * 1.2)}</p>
        </div>
      </div>
    </div>
  )
}

export default Card

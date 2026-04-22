import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { themeDataContext } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { Plus, Heart } from 'lucide-react'

function Card({ name, image, id, price, fabric, suitableFor }) {
  const { currency, products, toggleWishlist, wishlist } = useContext(shopDataContext)
  const isWishlisted = wishlist.includes(id)
  const { isDark } = useContext(themeDataContext)
  const navigate = useNavigate()
  const dk = isDark

  const productData = products.find(p => p._id === id)
  const reviews = productData?.reviews || []
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0

  const [showAllSuitable, setShowAllSuitable] = React.useState(false)

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

        <div 
          onClick={(e) => e.stopPropagation()}
          className='absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500 delay-75'
        >
          <button 
            onClick={(e) => { 
                e.stopPropagation(); 
                e.preventDefault(); 
                toggleWishlist(id); 
            }}
            className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transition-all z-10 ${
              isWishlisted 
                ? 'bg-rose-500 text-white' 
                : 'bg-white/90 text-gray-900 hover:bg-blue-600 hover:text-white'
            }`}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); /* Add to cart logic */ }}
            className='w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-lg hover:bg-blue-600 hover:text-white transition-all'
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className='px-3 py-4 flex flex-col gap-1.5'>
        <p className={`text-[15px] font-bold group-hover:text-blue-500 transition-colors line-clamp-1 leading-tight ${dk ? 'text-slate-100' : 'text-gray-900'}`}>{name}</p>

        {/* Fabric and Suitable For Badges */}
        <div className='flex flex-wrap gap-1.5 mt-1'>
          {fabric && (
            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${dk ? 'bg-blue-900/30 text-blue-400 border border-blue-800/30' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
              {fabric}
            </span>
          )}
          {suitableFor && Array.isArray(suitableFor) ? (
            <>
              {(showAllSuitable ? suitableFor : suitableFor.slice(0, 2)).map((occasion, index) => (
                <span 
                  key={index} 
                  className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${dk ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}
                >
                  {occasion}
                </span>
              ))}
              {suitableFor.length > 2 && (
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllSuitable(!showAllSuitable);
                  }}
                  title={!showAllSuitable ? `Show more: ${suitableFor.slice(2).join(', ')}` : 'Show less'}
                  className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-md cursor-pointer transition-all hover:scale-110 active:scale-95 ${
                    showAllSuitable 
                      ? (dk ? 'bg-amber-900/30 text-amber-400 border border-amber-800/30' : 'bg-amber-50 text-amber-600 border border-amber-100')
                      : (dk ? 'bg-slate-700 text-slate-300 border border-slate-600' : 'bg-gray-200 text-gray-700 border border-gray-300')
                  }`}
                >
                  {showAllSuitable ? 'LESS' : `+${suitableFor.length - 2}`}
                </span>
              )}
            </>
          ) : suitableFor && (
            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${dk ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
              {suitableFor}
            </span>
          )}
        </div>

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

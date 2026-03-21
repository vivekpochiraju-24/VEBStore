import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { shopDataContext } from '../context/ShopContext'
import { themeDataContext } from '../context/ThemeContext'
import { FaStar, FaStarHalfAlt } from "react-icons/fa"
import RelatedProduct from '../component/RelatedProduct'
import Loading from '../component/Loading'
import ProductReviews from '../component/ProductReviews'

function ProductDetail() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const { products, currency, addtoCart, loading } = useContext(shopDataContext)
  const { isDark } = useContext(themeDataContext)
  const dk = isDark

  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [image1, setImage1] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')
  const [image4, setImage4] = useState('')
  const [size, setSize] = useState('')
  const [activeTab, setActiveTab] = useState('description')

  const calculateAverage = (reviews = []) => {
      if (reviews.length === 0) return 0
      const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0)
      return (sum / reviews.length).toFixed(1)
  }
  const averageRating = productData ? calculateAverage(productData.reviews) : 0
  const reviewCount = productData?.reviews?.length || 0

  const fetchProductData = async () => {
    products.forEach((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage1(item.image1)
        setImage2(item.image2)
        setImage3(item.image3)
        setImage4(item.image4)
        setImage(item.image1)
      }
    })
  }

  useEffect(() => {
    fetchProductData()
  }, [productId, products])

  return productData ? (
    <div className={`w-full min-h-screen flex flex-col pt-[100px] transition-colors duration-300 ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      
      {/* Back Button */}
      <div className='w-full px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-6'>
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

      {/* Main Product Viewer */}
      <div className={`w-full px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] flex flex-col lg:flex-row gap-12 lg:gap-16 pb-16 border-b transition-colors duration-300 ${dk ? 'border-slate-800' : 'border-gray-200'}`}>

        {/* Left: Images */}
        <div className='flex-1 flex flex-col-reverse sm:flex-row gap-4 sm:gap-6'>
          {/* Thumbnails */}
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-auto gap-4 sm:w-[120px] shrink-0 scrollbar-hide'>
            {[image1, image2, image3, image4].filter(Boolean).map((img, idx) => (
              <div key={idx} className={`w-[80px] sm:w-full aspect-[4/5] sm:h-auto rounded-xl overflow-hidden cursor-pointer border-2 transition-all shrink-0 ${image === img ? 'border-blue-600 shadow-md scale-95' : dk ? 'border-slate-700 opacity-50 hover:opacity-100 bg-slate-800' : 'border-gray-200 opacity-70 hover:opacity-100 bg-gray-100'}`} onClick={() => setImage(img)}>
                <img src={img} alt="" className='w-full h-full object-cover' />
              </div>
            ))}
          </div>
          {/* Main Image */}
          <div className={`flex-1 w-full aspect-[4/5] sm:aspect-auto sm:min-h-[600px] rounded-2xl overflow-hidden border shadow-sm transition-colors duration-300 ${dk ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'}`}>
            <img src={image} alt={productData.name} className='w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-crosshair' />
          </div>
        </div>

        {/* Right: Info */}
        <div className='flex-1 flex flex-col gap-6 py-4'>
          <div className='flex flex-col gap-2'>
            <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight ${dk ? 'text-white' : 'text-gray-900'}`}>{productData.name}</h1>
            <div className='flex items-center gap-3 mt-1'>
              <div className='flex items-center gap-1'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className={averageRating >= star ? 'text-[#FFD700] text-lg' : dk ? 'text-slate-700 text-lg' : 'text-gray-200 text-lg'} />
                ))}
              </div>
              <p className={`font-medium text-sm ${dk ? 'text-slate-400' : 'text-gray-500'}`}>({reviewCount} Reviews)</p>
            </div>
            <p className='text-3xl sm:text-4xl font-black text-blue-500 mt-2'>{currency}{productData.price}</p>
          </div>

          <p className={`text-lg leading-relaxed ${dk ? 'text-slate-300' : 'text-gray-600'}`}>
            {productData.description}
          </p>

          <div className='flex flex-col gap-4 mt-4'>
            <div className='flex items-center justify-between'>
              <p className={`font-bold text-lg ${dk ? 'text-white' : 'text-gray-900'}`}>Select Size</p>
              <p className='text-blue-500 text-sm font-semibold cursor-pointer hover:underline'>Size Guide</p>
            </div>
            <div className='flex flex-wrap gap-3'>
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  className={`h-12 w-12 sm:h-14 sm:w-14 border-2 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base transition-all
                                ${item === size ? (dk ? 'border-blue-500 bg-blue-600 text-white shadow-lg' : 'border-gray-900 bg-gray-900 text-white shadow-md') : dk ? 'border-slate-700 text-slate-400 bg-slate-800 hover:border-slate-500' : 'border-gray-100 text-gray-600 bg-white hover:border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              className={`w-full sm:w-[350px] mt-6 py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-xl transition-all flex items-center justify-center h-[60px] active:scale-95
                            ${loading ? 'bg-gray-400' : dk ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-gray-900 hover:bg-black shadow-gray-900/20'}`}
              onClick={() => addtoCart(productData._id, size)}
              disabled={loading}
            >
              {loading ? <Loading /> : "Add to Signature Bag"}
            </button>
          </div>

          <hr className={`my-4 ${dk ? 'border-slate-800' : 'border-gray-200'}`} />

          <div className={`flex flex-col gap-3 text-sm font-medium ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
            <p className='flex items-center gap-2'>✓ <span className={dk ? 'text-slate-300' : 'text-gray-700'}>100% Original Product.</span></p>
            <p className='flex items-center gap-2'>✓ <span className={dk ? 'text-slate-300' : 'text-gray-700'}>Cash on delivery is available on this product.</span></p>
            <p className='flex items-center gap-2'>✓ <span className={dk ? 'text-slate-300' : 'text-gray-700'}>Easy return and exchange policy within 7 days.</span></p>
          </div>
        </div>
      </div>

      {/* Description & Reviews Tabs */}
      <div className={`w-full px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-16 transition-colors duration-300 ${dk ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className={`flex gap-4 border-b mb-8 ${dk ? 'border-slate-800' : 'border-gray-100'}`}>
          <p onClick={() => setActiveTab('description')} className={`font-bold sm:text-lg pb-4 border-b-2 cursor-pointer transition-colors ${activeTab === 'description' ? (dk ? 'text-blue-500 border-blue-500' : 'text-gray-900 border-gray-900') : dk ? 'text-slate-500 border-transparent hover:text-slate-300' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>Description</p>
          <p onClick={() => setActiveTab('reviews')} className={`font-bold sm:text-lg pb-4 border-b-2 cursor-pointer transition-colors ${activeTab === 'reviews' ? (dk ? 'text-blue-500 border-blue-500' : 'text-gray-900 border-gray-900') : dk ? 'text-slate-500 border-transparent hover:text-slate-300' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>Reviews ({reviewCount})</p>
        </div>
        
        {activeTab === 'description' ? (
          <div className={`w-full max-w-4xl leading-relaxed text-base sm:text-lg p-8 rounded-2xl border transition-all ${dk ? 'bg-slate-800/50 text-slate-300 border-slate-700/50' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
            {productData.description}
          </div>
        ) : (
          <div className='w-full max-w-4xl'>
            <ProductReviews productData={productData} onReviewAdded={() => fetchProductData()} />
          </div>
        )}
      </div>

      {/* Related Products */}
      <div className={`w-full py-16 transition-colors duration-300 ${dk ? 'bg-[#1e293b]/20' : 'bg-gray-50'}`}>
        <RelatedProduct category={productData.category} subCategory={productData.subCategory} currentProductId={productData._id} />
      </div>

    </div>
  ) : <div className='opacity-0'></div>
}

export default ProductDetail

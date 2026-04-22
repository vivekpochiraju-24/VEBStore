import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { shopDataContext } from '../context/ShopContext'
import { themeDataContext } from '../context/ThemeContext'
import { FaStar, FaStarHalfAlt } from "react-icons/fa"
import { RefreshCw, X } from 'lucide-react'
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
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  const calculateAverage = (reviews = []) => {
      if (reviews.length === 0) return 0
      const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0)
      return (sum / reviews.length).toFixed(1)
  }
  const averageRating = productData ? calculateAverage(productData.reviews) : 0
  const reviewCount = productData?.reviews?.length || 0

  const fetchProductData = async () => {
    if (products && Array.isArray(products)) {
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
  }

  useEffect(() => {
    fetchProductData()
  }, [productId, products])

  return productData ? (
    <div className={`w-full min-h-screen flex flex-col pt-[100px] transition-colors duration-300 ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      
      {/* Back Button */}
      <div className='w-full px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-6'>
          <button 
            onClick={() => navigate('/products')}
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
            
            {/* Tags / Badges */}
            <div className='flex flex-wrap gap-2 mt-2'>
              {productData.fabric && (
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border flex items-center gap-2 ${dk ? 'bg-blue-900/20 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${dk ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                  Fabric: {productData.fabric}
                </span>
              )}
              {productData.suitableFor && (Array.isArray(productData.suitableFor) ? productData.suitableFor : [productData.suitableFor]).map((occasion, index) => (
                <span key={index} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border flex items-center gap-2 ${dk ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${dk ? 'bg-emerald-400' : 'bg-emerald-500'}`}></div>
                  {occasion}
                </span>
              ))}
            </div>

            <div className='flex items-center gap-4 mt-3'>
              <p className='text-3xl sm:text-4xl font-black text-blue-500'>₹{productData.price}</p>
              {productData.exchangeEligible && (
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200 bg-green-50 text-green-600 flex items-center gap-1.5`}>
                  <div className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></div>
                  Exchange Eligible
                </span>
              )}
            </div>
          </div>

          <p className={`text-lg leading-relaxed ${dk ? 'text-slate-300' : 'text-gray-600'}`}>
            {productData.description}
          </p>

          {productData.exchangeEligible && (
            <div className={`p-4 rounded-xl border-2 border-dashed ${dk ? 'bg-indigo-900/10 border-indigo-900/40 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
              <div className='flex items-center gap-2 mb-2'>
                <span className='text-lg'>♻️</span>
                <p className='font-bold text-sm uppercase tracking-tight'>Premium Exchange Program</p>
              </div>
              <p className='text-xs font-medium leading-relaxed'>
                Trade your old dress and get a specialized discount. 
                <br />
                <span className='font-black'>Admin Review:</span> 2-3 business days. 
                <br />
                <span className='font-black'>Home Pickup:</span> Delivery person will verify & collect from your home.
              </p>
            </div>
          )}

          <div className='flex flex-col gap-4 mt-2'>
            <div className='flex items-center justify-between'>
              <p className={`font-bold text-lg ${dk ? 'text-white' : 'text-gray-900'}`}>Select Size</p>
              <p 
                onClick={() => setShowSizeGuide(true)}
                className='text-blue-500 text-sm font-bold uppercase tracking-wider cursor-pointer hover:underline flex items-center gap-2'
              >
                <RefreshCw size={14} className='animate-spin-slow' /> Size Guide
              </p>
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
            {productData.price < 1000 && productData.exchangeEligible && (
              <p className='text-[10px] font-bold text-amber-600 uppercase tracking-widest text-center sm:text-left mt-1'>⚠️ Exchange is not applicable for items below ₹1,000</p>
            )}
          </div>

          <hr className={`my-4 ${dk ? 'border-slate-800' : 'border-gray-200'}`} />

          <div className={`flex flex-col gap-3 text-sm font-medium ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
            <p className='flex items-center gap-2'>✓ <span className={dk ? 'text-slate-300' : 'text-gray-700'}>100% Original Product.</span></p>
            <p className='flex items-center gap-2'>✓ <span className={dk ? 'text-slate-300' : 'text-gray-700'}>Cash on delivery is available on this product.</span></p>
            <p className='flex items-center gap-2'>✓ <span className={dk ? 'text-slate-300' : 'text-gray-700'}>{productData.exchangeEligible ? 'Participates in the Exchange Program.' : 'Standard 7-day return policy applies.'}</span></p>
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

      {/* Size Guide Modal Overlay */}
      {showSizeGuide && (
        <div className='fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6'>
           <div className='absolute inset-0 bg-slate-900/60 backdrop-blur-md' onClick={() => setShowSizeGuide(false)}></div>
           <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border transition-all animate-scale-up ${dk ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-gray-100'} p-6 sm:p-10 scrollbar-hide`}>
              <div className='flex items-center justify-between mb-8'>
                <div>
                   <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>Size Guide</h2>
                   <p className={`text-xs sm:text-sm font-bold uppercase tracking-widest mt-1 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Professional Measurements (Standard Fit)</p>
                </div>
                <button onClick={() => setShowSizeGuide(false)} className={`p-2.5 rounded-xl transition-all active:scale-95 ${dk ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900'}`}>
                   <X size={20} />
                </button>
              </div>

              <div className='space-y-8'>
                {/* Inches Table */}
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${dk ? 'text-blue-400' : 'text-blue-600'}`}>
                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div> Measurements in Inches
                  </h3>
                  <div className='overflow-x-auto rounded-2xl border border-dashed border-slate-700/50'>
                    <table className='w-full text-left border-collapse'>
                      <thead>
                        <tr className={dk ? 'bg-slate-800/50' : 'bg-gray-50'}>
                          <th className={`px-4 py-3 text-xs font-black uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Size</th>
                          <th className={`px-4 py-3 text-xs font-black uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Chest</th>
                          <th className={`px-4 py-3 text-xs font-black uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Waist</th>
                          <th className={`px-4 py-3 text-xs font-black uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Shoulder</th>
                          <th className={`px-4 py-3 text-xs font-black uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Length</th>
                        </tr>
                      </thead>
                      <tbody className={`text-sm ${dk ? 'text-slate-300' : 'text-gray-600'}`}>
                        {[
                          { s: 'S', c: '38', w: '32', sh: '17', l: '27' },
                          { s: 'M', c: '40', w: '34', sh: '18', l: '28' },
                          { s: 'L', c: '42', w: '36', sh: '19', l: '29' },
                          { s: 'XL', c: '44', w: '38', sh: '20', l: '30' },
                          { s: 'XXL', c: '46', w: '40', sh: '21', l: '31' }
                        ].map((row, i) => (
                          <tr key={i} className={`border-t border-dashed ${dk ? 'border-slate-800 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'}`}>
                            <td className='px-4 py-3 font-black text-blue-500'>{row.s}</td>
                            <td className='px-4 py-3'>{row.c}"</td>
                            <td className='px-4 py-3'>{row.w}"</td>
                            <td className='px-4 py-3'>{row.sh}"</td>
                            <td className='px-4 py-3'>{row.l}"</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CM Table */}
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${dk ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div> Measurements in Centimeters
                  </h3>
                  <div className='overflow-x-auto rounded-2xl border border-dashed border-slate-700/50'>
                    <table className='w-full text-left border-collapse'>
                      <thead>
                        <tr className={dk ? 'bg-slate-800/50' : 'bg-gray-50'}>
                          <th className={`px-4 py-3 text-xs font-black uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Size</th>
                          <th className={`px-4 py-3 text-xs font-black uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Chest</th>
                          <th className={`px-4 py-3 text-xs font-black uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Waist</th>
                          <th className={`px-4 py-3 text-xs font-black uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Shoulder</th>
                          <th className={`px-4 py-3 text-xs font-black uppercase tracking-widest ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Length</th>
                        </tr>
                      </thead>
                      <tbody className={`text-sm ${dk ? 'text-slate-300' : 'text-gray-600'}`}>
                        {[
                          { s: 'S', c: '96.5', w: '81.3', sh: '43.2', l: '68.6' },
                          { s: 'M', c: '101.6', w: '86.4', sh: '45.7', l: '71.1' },
                          { s: 'L', c: '106.7', w: '91.4', sh: '48.3', l: '73.7' },
                          { s: 'XL', c: '111.8', w: '96.5', sh: '50.8', l: '76.2' },
                          { s: 'XXL', c: '116.8', w: '101.6', sh: '53.3', l: '78.7' }
                        ].map((row, i) => (
                          <tr key={i} className={`border-t border-dashed ${dk ? 'border-slate-800 hover:bg-slate-800/30' : 'border-gray-100 hover:bg-gray-50'}`}>
                            <td className='px-4 py-3 font-black text-emerald-500'>{row.s}</td>
                            <td className='px-4 py-3'>{row.c} cm</td>
                            <td className='px-4 py-3'>{row.w} cm</td>
                            <td className='px-4 py-3'>{row.sh} cm</td>
                            <td className='px-4 py-3'>{row.l} cm</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className={`mt-10 p-4 rounded-2xl border ${dk ? 'bg-slate-800/30 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider leading-relaxed ${dk ? 'text-slate-500' : 'text-gray-400'}`}>
                  * Note: This chart represents general product styling. Actual fit may vary by up to ±1 inch due to fabric elasticity and cut. If you are between sizes, we recommend selecting the larger size for a relaxed premium fit.
                </p>
              </div>
           </div>
        </div>
      )}

    </div>
  ) : <div className='opacity-0'></div>
}

export default ProductDetail

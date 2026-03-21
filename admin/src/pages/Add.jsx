import React, { useContext, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import uploadIcon from '../assets/upload image.jpg'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'
import { PlusCircle, Image as ImageIcon, Sparkles, Check } from 'lucide-react'
import { themeDataContext } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

function Add() {
  const [images, setImages] = useState([null, null, null, null])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Men")
  const [price, setPrice] = useState("")
  const [subCategory, setSubCategory] = useState("TopWear")
  const [bestseller, setBestSeller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { serverUrl } = useContext(authDataContext)
  const { isDark } = useContext(themeDataContext)
  const dk = isDark

  const handleImageChange = (index, file) => {
    const newImages = [...images]
    newImages[index] = file
    setImages(newImages)
  }

  const toggleSize = (size) => {
    setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!images[0]) return toast.error("Please upload at least the primary image")
    if (sizes.length === 0) return toast.error("Please select at least one size")

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))

      images.forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img)
      })

      const result = await axios.post(serverUrl + "/api/product/addproduct", formData, { withCredentials: true })

      toast.success("Product added successfully!")

      // Reset form
      setName("")
      setDescription("")
      setPrice("")
      setImages([null, null, null, null])
      setSizes([])
      setBestSeller(false)

    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Failed to add product")
    } finally {
      setLoading(false)
    }
  }

  const allSizes = ["S", "M", "L", "XL", "XXL"]

  return (
    <div className={`w-full min-h-screen flex flex-col transition-colors duration-500 ${dk ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <Nav />
      <div className='flex flex-1'>
        <Sidebar />

        <main className='flex-1 p-6 lg:ml-[280px] mt-20 pb-20'>

          {/* Back Button */}
          <div className='w-full max-w-4xl mx-auto mb-6'>
              <button 
                onClick={() => navigate('/')}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all p-2 px-3 rounded-xl border ${dk ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-gray-100 text-gray-500 hover:text-gray-900 shadow-sm'}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path>
                </svg>
                Return to Hub
              </button>
          </div>

          <div className='max-w-4xl mx-auto'>
            {/* Header */}
            <div className='mb-8'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='p-2 bg-blue-600 shadow-lg shadow-blue-600/20 text-white rounded-lg'>
                  <PlusCircle size={20} />
                </div>
                <h1 className={`text-2xl font-extrabold tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>Create Product</h1>
              </div>
              <p className={`text-sm font-medium ${dk ? 'text-slate-500' : 'text-gray-500'}`}>Add a new item to your store's digital collection.</p>
            </div>

            <form onSubmit={handleAddProduct} className='space-y-8 animate-fade-in-up'>

              {/* Image Upload Section */}
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl shadow-gray-200/40 ${dk ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-gray-100'}`}>
                <div className='flex items-center gap-2 mb-6'>
                  <ImageIcon size={18} className='text-blue-600' />
                  <h3 className={`text-[15px] font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Product Imagery</h3>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                  {images.map((img, index) => (
                    <label
                      key={index}
                      htmlFor={`image-${index}`}
                      className='aspect-square rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all overflow-hidden relative'
                    >
                      {img ? (
                        <img src={URL.createObjectURL(img)} className='w-full h-full object-cover' alt="" />
                      ) : (
                        <>
                          <img src={uploadIcon} className='w-10 opacity-20 grayscale brightness-150 rounded-md' alt="" />
                          <span className='text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter'>
                            {index === 0 ? "Primary" : `View ${index + 1}`}
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        id={`image-${index}`}
                        hidden
                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Basic Info Section */}
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl shadow-gray-200/40 space-y-6 ${dk ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-gray-100'}`}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <label className={`text-[13px] font-bold ml-1 ${dk ? 'text-slate-400' : 'text-gray-700'}`}>Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Premium Linen Shirt"
                      className={`w-full h-12 px-4 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className={`text-[13px] font-bold ml-1 ${dk ? 'text-slate-400' : 'text-gray-700'}`}>Base Price (INR)</label>
                    <div className='relative'>
                      <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold'>₹</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        className={`w-full h-12 pl-8 pr-4 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className={`text-[13px] font-bold ml-1 ${dk ? 'text-slate-400' : 'text-gray-700'}`}>Description</label>
                  <textarea
                    placeholder="Describe the product materials, fit, and highlights..."
                    className={`w-full h-32 p-4 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none ${dk ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Classification Section */}
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl shadow-gray-200/40 ${dk ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-gray-100'}`}>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                  <div className='space-y-4'>
                    <label className={`text-[13px] font-bold ml-1 ${dk ? 'text-slate-400' : 'text-gray-700'}`}>Main Category</label>
                    <div className='grid grid-cols-3 gap-2'>
                      {["Men", "Women", "Kids"].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${category === cat ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20" : dk ? "bg-slate-900 text-slate-500 border-slate-700 hover:bg-slate-800" : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100"}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <label className={`text-[13px] font-bold ml-1 ${dk ? 'text-slate-400' : 'text-gray-700'}`}>Sub Category</label>
                    <select
                      className={`w-full h-11 px-4 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer border ${dk ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-gray-50 border-gray-100 text-gray-700'}`}
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                    >
                      <option value="TopWear">TopWear</option>
                      <option value="BottomWear">BottomWear</option>
                      <option value="WinterWear">WinterWear</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sizes & Features */}
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl shadow-gray-200/40 space-y-8 ${dk ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-gray-100'}`}>
                <div className='space-y-4'>
                  <label className={`text-[13px] font-bold ml-1 ${dk ? 'text-slate-400' : 'text-gray-700'}`}>Available Sizes</label>
                  <div className='flex flex-wrap gap-2'>
                    {allSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`w-12 h-12 rounded-xl text-xs font-extrabold flex items-center justify-center transition-all border-2 ${sizes.includes(size) ? (dk ? "bg-white text-black border-white" : "bg-black text-white border-black") : (dk ? "bg-slate-900 text-slate-600 border-slate-700 hover:border-slate-500" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300")}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <label className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer group transition-all ${dk ? 'bg-blue-900/10 border-blue-900/30 hover:bg-blue-900/20' : 'bg-blue-50/30 border-blue-100 hover:bg-blue-50'}`}>
                  <input
                    type="checkbox"
                    className='w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500'
                    checked={bestseller}
                    onChange={() => setBestSeller(!bestseller)}
                  />
                  <div className='flex items-center gap-2'>
                    <Sparkles size={16} className='text-amber-500' />
                    <span className={`text-sm font-bold ${dk ? 'text-slate-200' : 'text-gray-900'}`}>Mark as Best Seller Collection</span>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className='w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-extrabold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70'
              >
                {loading ? <Loading /> : (
                  <>
                    <Check size={22} />
                    Publish Product
                  </>
                )}
              </button>

            </form>
          </div>

        </main>
      </div>
    </div>
  )
}

export default Add

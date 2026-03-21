import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { themeDataContext } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { Trash2, Package, Search, Filter, LayoutGrid, List as ListIcon, Edit2, X, Star, MessageSquare } from 'lucide-react'

function Lists() {
  const [list, setList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const { serverUrl } = useContext(authDataContext)
  const { isDark } = useContext(themeDataContext)
  const navigate = useNavigate()
  const dk = isDark

  // Edit State
  const [editingProduct, setEditingProduct] = useState(null)
  const [editDesc, setEditDesc] = useState("")
  const [reviewName, setReviewName] = useState("Admin")
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchList = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/product/list")
      setList(result.data)
    } catch (error) {
      console.error("Fetch error", error)
      toast.error("Failed to fetch products")
    }
  }

  const removeList = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    try {
      const result = await axios.post(`${serverUrl}/api/product/remove/${id}`, {}, { withCredentials: true })
      if (result.data) {
        toast.success("Product removed successfully")
        fetchList()
      }
    } catch (error) {
      console.error("Remove error", error)
      toast.error("Failed to remove product")
    }
  }

  const openEditModal = (item) => {
    setEditingProduct(item)
    setEditDesc(item.description || "")
    setReviewName("Admin")
    setReviewRating(5)
    setReviewComment("")
  }

  const handleUpdateDescription = async () => {
    setIsUpdating(true)
    try {
      await axios.post(`${serverUrl}/api/product/edit/${editingProduct._id}`, 
        { description: editDesc },
        { withCredentials: true }
      )
      toast.success("Description updated successfully")
      setEditingProduct(null)
      fetchList()
    } catch (error) {
      console.error(error)
      toast.error("Failed to update description")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddReview = async () => {
    if (!reviewComment.trim()) return toast.error("Review comment is required")
    setIsUpdating(true)
    try {
      await axios.post(`${serverUrl}/api/product/admin-review/${editingProduct._id}`, 
        { name: reviewName, rating: reviewRating, comment: reviewComment },
        { withCredentials: true }
      )
      toast.success("Review added successfully")
      setEditingProduct(null)
      fetchList()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Failed to add review")
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const filteredList = list.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`w-full min-h-screen flex flex-col transition-colors duration-500 ${dk ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <Nav />
      <div className='flex flex-1'>
        <Sidebar />

        <main className='flex-1 p-6 lg:ml-[280px] mt-20 pb-20'>

          {/* Back Button */}
          <div className='w-full pb-6'>
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

          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='p-2 bg-blue-600 shadow-lg shadow-blue-600/20 text-white rounded-lg'>
                <Package size={20} />
              </div>
              <h1 className={`text-2xl font-extrabold tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>Product Inventory</h1>
            </div>
            <p className={`text-sm font-medium ${dk ? 'text-slate-500' : 'text-gray-500'}`}>Manage and monitor your digital storefront collection.</p>
          </div>

          {/* Controls */}
          <div className='flex flex-col md:flex-row items-center justify-between gap-4 mb-8'>
            <div className='relative w-full md:w-96'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
              <input
                type="text"
                placeholder="Search by name or category..."
                className='w-full h-11 pl-11 pr-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none shadow-sm transition-all'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='flex items-center gap-2 w-full md:w-auto'>
              <button className='flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm'>
                <Filter size={14} /> Category
              </button>
              <div className='h-8 w-px bg-gray-200 mx-2 hidden md:block'></div>
              <div className='flex bg-white p-1 border border-gray-100 rounded-xl shadow-sm'>
                <button className='p-1.5 bg-gray-50 text-blue-600 rounded-lg'><LayoutGrid size={16} /></button>
                <button className='p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors'><ListIcon size={16} /></button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up'>
            {filteredList.length > 0 ? (
              filteredList.map((item, index) => (
                <div key={item._id} className='bg-white group rounded-3xl border border-gray-100 p-4 shadow-lg shadow-gray-200/20 hover:shadow-xl hover:shadow-gray-200/40 transition-all'>
                  <div className='flex gap-4'>
                    <div className='relative w-28 h-28 shrink-0 overflow-hidden rounded-2xl bg-gray-50'>
                      <img src={item.image1} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' alt={item.name} />
                      <div className='absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-md rounded-lg text-[8px] font-extrabold text-blue-600 border border-blue-50 tracking-tighter shadow-sm uppercase'>
                        {item.category}
                      </div>
                    </div>

                    <div className='flex-1 flex flex-col justify-between py-1'>
                      <div>
                        <h3 className='text-[15px] font-bold text-gray-900 line-clamp-2 leading-tight mb-1'>{item.name}</h3>
                        <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>{item.subCategory}</p>
                      </div>
                      <div className='flex items-center justify-between mt-2'>
                        <span className='text-lg font-black text-blue-600'>₹{item.price}</span>
                        <div className='flex gap-2'>
                          <button
                            onClick={() => openEditModal(item)}
                            className='p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90'
                            title="Edit Product"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => removeList(item._id)}
                            className='p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90'
                            title="Remove Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='col-span-full py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center'>
                <div className='w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4'>
                  <Package size={32} />
                </div>
                <h3 className='text-lg font-bold text-gray-900'>No products found</h3>
                <p className='text-gray-500 text-sm'>Try adjusting your search terms or add new items.</p>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in'>
          <div className='relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden mx-4 animate-scale-up max-h-[90vh] overflow-y-auto'>
            {/* Header */}
            <div className='flex items-center justify-between bg-gray-50 p-6 border-b border-gray-100'>
              <h2 className='text-xl font-bold text-gray-900'>Manage: {editingProduct.name}</h2>
              <button onClick={() => setEditingProduct(null)} className='p-2 bg-white rounded-full text-gray-400 hover:text-gray-900 shadow-sm'>
                <X size={20} />
              </button>
            </div>

            <div className='p-6 space-y-8'>
              {/* Description Edit Section */}
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Edit2 size={18} className='text-blue-600' />
                  <h3 className='font-bold text-gray-900'>Edit Description</h3>
                </div>
                <textarea 
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className='w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none text-sm text-gray-700'
                  placeholder='Product description...'
                ></textarea>
                <div className='flex justify-end'>
                  <button 
                    onClick={handleUpdateDescription}
                    disabled={isUpdating}
                    className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm'
                  >
                    {isUpdating ? 'Saving...' : 'Save Description'}
                  </button>
                </div>
              </div>

              <hr className='border-gray-100' />

              {/* Add Review Section */}
              <div className='space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-100'>
                <div className='flex items-center gap-2 mb-2'>
                  <MessageSquare size={18} className='text-green-600' />
                  <h3 className='font-bold text-gray-900'>Simulate / Add Custom Review</h3>
                </div>
                
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-bold text-gray-500 uppercase mb-1.5'>Reviewer Name</label>
                    <input 
                      type="text" 
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className='w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none'
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-bold text-gray-500 uppercase mb-1.5'>Rating ({reviewRating}/5)</label>
                    <div className='flex gap-1 h-10 items-center'>
                      {[1,2,3,4,5].map(star => (
                        <Star 
                          key={star} 
                          size={22} 
                          className={`cursor-pointer ${star <= reviewRating ? 'text-[#FFD700] fill-[#FFD700]' : 'text-gray-300'}`}
                          onClick={() => setReviewRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-bold text-gray-500 uppercase mb-1.5'>Comment</label>
                  <textarea 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className='w-full h-24 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none resize-none text-sm'
                    placeholder='Great product, totally recommend it...'
                  ></textarea>
                </div>

                <div className='flex justify-end pt-2'>
                  <button 
                    onClick={handleAddReview}
                    disabled={isUpdating}
                    className='px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm'
                  >
                    {isUpdating ? 'Adding...' : 'Post Review'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Lists

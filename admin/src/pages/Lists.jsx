import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { themeDataContext } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { Trash2, Package, Search, Filter, LayoutGrid, List as ListIcon, Edit2, X, Star, MessageSquare, Sparkles } from 'lucide-react'

function Lists() {
  const [list, setList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const { serverUrl } = useContext(authDataContext)
  const { isDark } = useContext(themeDataContext)
  const navigate = useNavigate()
  const dk = isDark

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSubCategory, setSelectedSubCategory] = useState('all')
  const [selectedFabric, setSelectedFabric] = useState('all')
  const [selectedSuitableFor, setSelectedSuitableFor] = useState('all')
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [fabrics, setFabrics] = useState([])
  const [suitableFors, setSuitableFors] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [allSubCategories, setAllSubCategories] = useState([])
  const [showCategoryFilter, setShowCategoryFilter] = useState(false)
  const [showSubCategoryFilter, setShowSubCategoryFilter] = useState(false)
  const [showFabricFilter, setShowFabricFilter] = useState(false)
  const [showSuitableForFilter, setShowSuitableForFilter] = useState(false)

  // Edit State
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    category: "",
    subCategory: "",
    description: "",
    stock: "",
    fabric: "",
    suitableFor: [],
    bestseller: false
  })
  const [reviewName, setReviewName] = useState("Admin")
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchList = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/product/list")
      setList(result.data)
      
      // Extract unique categories and subcategories for filters
      const cats = [...new Set(result.data.map(item => item.category))]
      const subCats = [...new Set(result.data.map(item => item.subCategory))]
      const fabricTypes = [...new Set(result.data.map(item => item.fabric).filter(f => f))]
      const suitableForTypes = [...new Set(result.data.map(item => item.suitableFor).filter(s => s))]
      
      setAllCategories(cats)
      setAllSubCategories(subCats)
      setFabrics(fabricTypes)
      setSuitableFors(suitableForTypes)
      
      // Set default filters to show all
      setCategories(cats)
      setSubCategories(subCats)
    } catch (error) {
      console.error("Fetch error", error)
      toast.error("Failed to fetch products")
    }
  }

  const fetchAllCategories = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/product/categories")
      console.log("Categories API response:", result.data)
      setAllCategories(result.data.categories)
      setAllSubCategories(result.data.subCategories)
    } catch (error) {
      console.error("Fetch categories error", error)
      // Use fallback categories if API fails
      const fallbackCategories = ['men', 'women', 'kids', 'accessories', 'electronics', 'home']
      const fallbackSubCategories = ['t-shirts', 'shirts', 'pants', 'dresses', 'shoes', 'jackets', 'watches', 'bags']
      setAllCategories(fallbackCategories)
      setAllSubCategories(fallbackSubCategories)
      console.log("Using fallback categories:", fallbackCategories)
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
    console.log("Opening edit modal for:", item.name)
    console.log("Available allCategories:", allCategories)
    console.log("Available allSubCategories:", allSubCategories)
    setEditingProduct(item)
    setEditForm({
      name: item.name || "",
      price: item.price || "",
      category: item.category || "",
      subCategory: item.subCategory || "",
      description: item.description || "",
      stock: item.stock || "",
      fabric: item.fabric || "",
      suitableFor: item.suitableFor || [],
      bestseller: item.bestseller || false
    })
    setReviewName("Admin")
    setReviewRating(5)
    setReviewComment("")
  }

  const handleUpdateProduct = async () => {
    // Validation
    if (!editForm.name.trim()) {
      toast.error("Product name is required")
      return
    }
    if (!editForm.price || editForm.price <= 0) {
      toast.error("Price must be greater than 0")
      return
    }
    if (!editForm.category) {
      toast.error("Category is required")
      return
    }
    if (!editForm.subCategory) {
      toast.error("Subcategory is required")
      return
    }
    if (!editForm.description.trim()) {
      toast.error("Description is required")
      return
    }

    setIsUpdating(true)
    try {
      const updateData = {
        name: editForm.name.trim(),
        price: Number(editForm.price),
        category: editForm.category,
        subCategory: editForm.subCategory,
        description: editForm.description.trim(),
        stock: editForm.stock ? Number(editForm.stock) : 0,
        bestseller: editForm.bestseller
      }

      // Only include fabric and suitableFor if they have values
      if (editForm.fabric) {
        updateData.fabric = editForm.fabric
      }
      if (editForm.suitableFor && editForm.suitableFor.length > 0) {
        updateData.suitableFor = editForm.suitableFor
      }

      await axios.post(`${serverUrl}/api/product/edit/${editingProduct._id}`, 
        updateData,
        { withCredentials: true }
      )
      toast.success("Product updated successfully")
      setEditingProduct(null)
      fetchList()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Failed to update product")
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
    fetchAllCategories()
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCategoryFilter && !event.target.closest('.category-filter')) {
        setShowCategoryFilter(false)
      }
      if (showSubCategoryFilter && !event.target.closest('.subcategory-filter')) {
        setShowSubCategoryFilter(false)
      }
      if (showFabricFilter && !event.target.closest('.fabric-filter')) {
        setShowFabricFilter(false)
      }
      if (showSuitableForFilter && !event.target.closest('.suitablefor-filter')) {
        setShowSuitableForFilter(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCategoryFilter, showSubCategoryFilter, showFabricFilter, showSuitableForFilter])

  const filteredList = list.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.fabric && item.fabric.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.suitableFor && item.suitableFor.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSubCategory = selectedSubCategory === 'all' || item.subCategory === selectedSubCategory
    const matchesFabric = selectedFabric === 'all' || item.fabric === selectedFabric
    const matchesSuitableFor = selectedSuitableFor === 'all' || item.suitableFor === selectedSuitableFor
    
    return matchesSearch && matchesCategory && matchesSubCategory && matchesFabric && matchesSuitableFor
  })

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
            <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6'>
              <div>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='p-3 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 text-white rounded-xl'>
                    <Package size={24} />
                  </div>
                  <div>
                    <h1 className={`text-3xl font-black tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>Product Inventory</h1>
                    <p className={`text-sm font-medium ${dk ? 'text-slate-500' : 'text-gray-500'}`}>Manage and monitor your digital storefront collection</p>
                  </div>
                </div>
              </div>
              
              <div className='flex items-center gap-3'>
                <div className='text-center'>
                  <div className='text-2xl font-black text-blue-600'>{list.length}</div>
                  <div className='text-xs text-gray-500 font-medium uppercase'>Total Products</div>
                </div>
                <button 
                  onClick={() => navigate('/add')}
                  className='px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm flex items-center gap-2'
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Add Product
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8'>
            <div className='flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4'>
              <div className='relative w-full xl:w-96'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
                <input
                  type="text"
                  placeholder="Search products by name, category, or subcategory..."
                  className='w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className='flex items-center gap-3 w-full xl:w-auto flex-wrap'>
                {/* Category Filter */}
                <div className='relative category-filter'>
                  <button 
                    onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                      selectedCategory !== 'all' 
                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Filter size={16} /> 
                    Category {selectedCategory !== 'all' && `(${selectedCategory})`}
                  </button>
                  
                  {showCategoryFilter && (
                    <div className='absolute top-full mt-2 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-2 min-w-[200px] animate-fade-in-up'>
                      <div className='max-h-60 overflow-y-auto'>
                        <button
                          onClick={() => {setSelectedCategory('all'); setShowCategoryFilter(false)}}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            selectedCategory === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          All Categories
                        </button>
                        {allCategories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => {setSelectedCategory(cat); setShowCategoryFilter(false)}}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                              selectedCategory === cat ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Subcategory Filter */}
                <div className='relative subcategory-filter'>
                  <button 
                    onClick={() => setShowSubCategoryFilter(!showSubCategoryFilter)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                      selectedSubCategory !== 'all' 
                        ? 'bg-purple-50 text-purple-600 border-purple-200' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Filter size={16} /> 
                    Subcategory {selectedSubCategory !== 'all' && `(${selectedSubCategory})`}
                  </button>
                  
                  {showSubCategoryFilter && (
                    <div className='absolute top-full mt-2 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-2 min-w-[200px] animate-fade-in-up'>
                      <div className='max-h-60 overflow-y-auto'>
                        <button
                          onClick={() => {setSelectedSubCategory('all'); setShowSubCategoryFilter(false)}}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            selectedSubCategory === 'all' ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          All Subcategories
                        </button>
                        {allSubCategories.map(subCat => (
                          <button
                            key={subCat}
                            onClick={() => {setSelectedSubCategory(subCat); setShowSubCategoryFilter(false)}}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                              selectedSubCategory === subCat ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {subCat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fabric Filter */}
                <div className='relative fabric-filter'>
                  <button 
                    onClick={() => setShowFabricFilter(!showFabricFilter)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                      selectedFabric !== 'all' 
                        ? 'bg-green-50 text-green-600 border-green-200' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Filter size={16} /> 
                    Fabric {selectedFabric !== 'all' && `(${selectedFabric})`}
                  </button>
                  
                  {showFabricFilter && (
                    <div className='absolute top-full mt-2 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-2 min-w-[200px] animate-fade-in-up'>
                      <div className='max-h-60 overflow-y-auto'>
                        <button
                          onClick={() => {setSelectedFabric('all'); setShowFabricFilter(false)}}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            selectedFabric === 'all' ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          All Fabrics
                        </button>
                        {fabrics.map(fabric => (
                          <button
                            key={fabric}
                            onClick={() => {setSelectedFabric(fabric); setShowFabricFilter(false)}}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                              selectedFabric === fabric ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {fabric}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Suitable For Filter */}
                <div className='relative suitablefor-filter'>
                  <button 
                    onClick={() => setShowSuitableForFilter(!showSuitableForFilter)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                      selectedSuitableFor !== 'all' 
                        ? 'bg-orange-50 text-orange-600 border-orange-200' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Filter size={16} /> 
                    Suitable For {selectedSuitableFor !== 'all' && `(${selectedSuitableFor})`}
                  </button>
                  
                  {showSuitableForFilter && (
                    <div className='absolute top-full mt-2 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-2 min-w-[200px] animate-fade-in-up'>
                      <div className='max-h-60 overflow-y-auto'>
                        <button
                          onClick={() => {setSelectedSuitableFor('all'); setShowSuitableForFilter(false)}}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            selectedSuitableFor === 'all' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          All Occasions
                        </button>
                        {suitableFors.map(occasion => (
                          <button
                            key={occasion}
                            onClick={() => {setSelectedSuitableFor(occasion); setShowSuitableForFilter(false)}}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                              selectedSuitableFor === occasion ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {occasion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Clear Filters */}
                {(selectedCategory !== 'all' || selectedSubCategory !== 'all' || selectedFabric !== 'all' || selectedSuitableFor !== 'all' || searchTerm) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('all')
                      setSelectedSubCategory('all')
                      setSelectedFabric('all')
                      setSelectedSuitableFor('all')
                      setSearchTerm('')
                    }}
                    className='px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100 transition-all'
                  >
                    Clear Filters
                  </button>
                )}

                <div className='h-8 w-px bg-gray-200 hidden xl:block'></div>
                <div className='flex bg-gray-100 p-1 rounded-xl border border-gray-200'>
                  <button className='p-2 bg-white text-blue-600 rounded-lg shadow-sm'><LayoutGrid size={16} /></button>
                  <button className='p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors'><ListIcon size={16} /></button>
                </div>
              </div>
            </div>
            
            {/* Active Filters Display */}
            {(selectedCategory !== 'all' || selectedSubCategory !== 'all' || searchTerm) && (
              <div className='flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100'>
                {searchTerm && (
                  <span className='px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium flex items-center gap-1'>
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className='ml-1 text-blue-500 hover:text-blue-700'>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className='px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium flex items-center gap-1 capitalize'>
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('all')} className='ml-1 text-blue-500 hover:text-blue-700'>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedSubCategory !== 'all' && (
                  <span className='px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium flex items-center gap-1 capitalize'>
                    Subcategory: {selectedSubCategory}
                    <button onClick={() => setSelectedSubCategory('all')} className='ml-1 text-purple-500 hover:text-purple-700'>
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in-up'>
            {filteredList.length > 0 ? (
              filteredList.map((item, index) => (
                <div key={item._id} className='bg-white group rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300'>
                  {/* Product Image */}
                  <div className='relative aspect-square overflow-hidden bg-gray-50'>
                    <img 
                      src={item.image1} 
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' 
                      alt={item.name} 
                    />
                    <div className='absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-blue-600 border border-blue-50 shadow-sm uppercase cursor-pointer hover:bg-blue-50 transition-colors'
                     onClick={() => openEditModal(item)}
                     title="Click to edit category">
                      {item.category}
                    </div>
                    <div className='absolute top-2 right-2 flex gap-1'>
                      <button
                        onClick={() => openEditModal(item)}
                        className='p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm'
                        title="Edit Product"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => removeList(item._id)}
                        className='p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm'
                        title="Remove Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className='p-4'>
                    <div className='mb-3'>
                      <h3 className='text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-1 cursor-pointer hover:text-blue-600 transition-colors'
                        onClick={() => openEditModal(item)}
                        title="Click to edit product">{item.name}</h3>
                      <p className='text-xs text-gray-500 font-medium uppercase tracking-wider cursor-pointer hover:text-purple-600 transition-colors'
                         onClick={() => openEditModal(item)}
                         title="Click to edit subcategory">{item.subCategory}</p>
                    </div>

                    {/* Product Attributes Table */}
                    <div className='mb-3'>
                      <table className='w-full text-xs border-collapse'>
                        <tbody>
                          <tr className='border-b border-gray-100'>
                            <td className='py-1 text-gray-500 font-medium w-20'>Fabric:</td>
                            <td className='py-1 text-gray-900 font-medium capitalize'>
                              <span className='px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-xs'>
                                {item.fabric || 'N/A'}
                              </span>
                            </td>
                          </tr>
                          <tr className='border-b border-gray-100'>
                            <td className='py-1 text-gray-500 font-medium w-20'>Suitable:</td>
                            <td className='py-1 text-gray-900 font-medium'>
                              {item.suitableFor && Array.isArray(item.suitableFor) ? (
                                <div className='flex flex-wrap gap-1'>
                                  {item.suitableFor.slice(0, 3).map((occasion, index) => (
                                    <span key={index} className='px-2 py-0.5 bg-green-100 text-green-800 rounded-md text-xs capitalize'>
                                      {occasion}
                                    </span>
                                  ))}
                                  {item.suitableFor.length > 3 && (
                                    <span className='px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs'>
                                      +{item.suitableFor.length - 3}
                                    </span>
                                  )}
                                </div>
                              ) : item.suitableFor ? (
                                <span className='px-2 py-0.5 bg-green-100 text-green-800 rounded-md text-xs capitalize'>
                                  {item.suitableFor}
                                </span>
                              ) : (
                                <span className='px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-xs'>
                                  Not Set
                                </span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className='flex items-center justify-between'>
                      <div>
                        <span className='text-lg font-black text-gray-900'>₹{item.price}</span>
                        {item.stock && (
                          <span className='text-xs text-gray-500 ml-2'>Stock: {item.stock}</span>
                        )}
                      </div>
                      <div className='flex items-center gap-1'>
                        {item.bestseller && (
                          <span className='px-2 py-1 bg-amber-100 text-amber-700 text-[8px] font-bold rounded-full uppercase'>Bestseller</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='col-span-full py-20 bg-white rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center'>
                <div className='w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4'>
                  <Package size={32} />
                </div>
                <h3 className='text-lg font-bold text-gray-900 mb-2'>No products found</h3>
                <p className='text-gray-500 text-sm mb-4'>Try adjusting your search terms or add new items.</p>
                <button 
                  onClick={() => navigate('/add')}
                  className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all text-sm'
                >
                  Add First Product
                </button>
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
              {/* Product Edit Section */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <Edit2 size={18} className='text-blue-600' />
                  <h3 className='font-bold text-gray-900'>Edit Product Details</h3>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-bold text-gray-500 uppercase mb-1.5'>Product Name</label>
                    <input 
                      type="text" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className='w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none'
                      placeholder='Product name...'
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-bold text-gray-500 uppercase mb-1.5'>Price (₹)</label>
                    <input 
                      type="number" 
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                      className='w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none'
                      placeholder='0.00'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-bold text-gray-500 uppercase mb-1.5'>Category</label>
                    <select 
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className='w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none capitalize'
                    >
                      <option value="">Select Category</option>
                      {allCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-xs font-bold text-gray-500 uppercase mb-1.5'>Subcategory</label>
                    <select 
                      value={editForm.subCategory}
                      onChange={(e) => setEditForm({...editForm, subCategory: e.target.value})}
                      className='w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none capitalize'
                    >
                      <option value="">Select Subcategory</option>
                      {allSubCategories.map(subCat => (
                        <option key={subCat} value={subCat}>{subCat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-bold text-gray-500 uppercase mb-1.5'>Stock Quantity</label>
                    <input 
                      type="number" 
                      value={editForm.stock}
                      onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                      className='w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none'
                      placeholder='0'
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-bold text-gray-500 uppercase mb-1.5'>Fabric Type</label>
                    <select 
                      value={editForm.fabric}
                      onChange={(e) => setEditForm({...editForm, fabric: e.target.value})}
                      className='w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none capitalize'
                    >
                      <option value="">Select Fabric</option>
                      {fabrics.map(fabric => (
                        <option key={fabric} value={fabric}>{fabric}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-bold text-gray-500 uppercase mb-1.5'>Suitable For</label>
                  <div className='flex flex-wrap gap-2'>
                    {suitableFors.map(occasion => (
                      <label key={occasion} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.suitableFor.includes(occasion)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditForm({...editForm, suitableFor: [...editForm.suitableFor, occasion]})
                            } else {
                              setEditForm({...editForm, suitableFor: editForm.suitableFor.filter(o => o !== occasion)})
                            }
                          }}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{occasion}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className='flex items-center gap-3 p-4 border rounded-2xl cursor-pointer group transition-all bg-blue-50/30 border-blue-100 hover:bg-blue-50'>
                  <input
                    type="checkbox"
                    className='w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500'
                    checked={editForm.bestseller}
                    onChange={(e) => setEditForm({...editForm, bestseller: e.target.checked})}
                  />
                  <div className='flex items-center gap-2'>
                    <Sparkles size={16} className='text-amber-500' />
                    <span className='text-sm font-bold text-gray-900'>Mark as Best Seller Collection</span>
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-bold text-gray-500 uppercase mb-1.5'>Description</label>
                  <textarea 
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className='w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none text-sm text-gray-700'
                    placeholder='Product description...'
                  ></textarea>
                </div>

                <div className='flex justify-end'>
                  <button 
                    onClick={handleUpdateProduct}
                    disabled={isUpdating}
                    className='px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm'
                  >
                    {isUpdating ? 'Saving...' : 'Save All Changes'}
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

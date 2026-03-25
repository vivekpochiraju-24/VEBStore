import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import { themeDataContext } from '../context/ThemeContext'
import Card from '../component/Card'
import { LuSettings2 } from "react-icons/lu"
import { CiSearch } from "react-icons/ci"
import { X, ChevronDown } from 'lucide-react'
import axios from 'axios'

function Products() {
  const { isDark } = useContext(themeDataContext)
  const { serverUrl } = useContext(authDataContext)
  const dk = isDark

  const [showFilter, setShowFilter] = useState(false)
  const { products = [], search, setSearch, showSearch } = useContext(shopDataContext)
  const [filterProduct, setFilterProduct] = useState([])
  const [category, setCaterory] = useState([])
  const [subCategory, setSubCaterory] = useState([])
  const [fabric, setFabric] = useState([])
  const [suitableFor, setSuitableFor] = useState([])
  const [sortType, SetSortType] = useState("relavent")
  const [filterOptions, setFilterOptions] = useState({ fabrics: [], suitableFor: [] })

  // Fetch filter options on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/product/filter-options`)
        setFilterOptions(response.data)
      } catch (error) {
        console.error('Error fetching filter options:', error)
        // Set default options if API fails
        setFilterOptions({
          fabrics: ['Cotton', 'Silk', 'Wool', 'Polyester', 'Linen'],
          suitableFor: ['Casual', 'Office', 'Party', 'School', 'Sports']
        })
      }
    }
    fetchFilterOptions()
  }, [serverUrl])

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCaterory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCaterory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCaterory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSubCaterory(prev => [...prev, e.target.value])
    }
  }

  const toggleFabric = (e) => {
    if (fabric.includes(e.target.value)) {
      setFabric(prev => prev.filter(item => item !== e.target.value))
    } else {
      setFabric(prev => [...prev, e.target.value])
    }
  }

  const toggleSuitableFor = (e) => {
    if (suitableFor.includes(e.target.value)) {
      setSuitableFor(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSuitableFor(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    if (!products) return;
    let productCopy = products.slice()
    if (search && search.trim() !== '') {
      productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase().trim()))
    }
    if (category.length > 0) {
      productCopy = productCopy.filter(item => category.includes(item.category))
    }
    if (subCategory.length > 0) {
      productCopy = productCopy.filter(item => subCategory.includes(item.subCategory))
    }
    if (fabric.length > 0) {
      productCopy = productCopy.filter(item => fabric.includes(item.fabric))
    }
    if (suitableFor.length > 0) {
      productCopy = productCopy.filter(item => {
        const itemSuitableFor = Array.isArray(item.suitableFor) ? item.suitableFor : [item.suitableFor];
        return suitableFor.some(selected => itemSuitableFor.includes(selected));
      })
    }
    setFilterProduct(productCopy)
  }

  const sortProducts = () => {
    let fbCopy = filterProduct.slice()
    switch (sortType) {
      case 'low-high':
        setFilterProduct(fbCopy.sort((a, b) => (a.price - b.price)))
        break
      case 'high-low':
        setFilterProduct(fbCopy.sort((a, b) => (b.price - a.price)))
        break
      default:
        applyFilter()
        break
    }
  }

  useEffect(() => { if (products) sortProducts() }, [sortType])
  useEffect(() => { if (products) setFilterProduct(products) }, [products])
  useEffect(() => { if (products) applyFilter() }, [category, subCategory, fabric, suitableFor, search, showSearch])

  if (!products || products.length === 0) {
    return (
      <div className={`w-full min-h-screen pt-[100px] flex items-center justify-center ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen pt-[100px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-32 flex flex-col sm:flex-row gap-6 sm:gap-10 transition-colors duration-300 ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>

      {/* Sidebar Filters */}
      <div className='w-full sm:min-w-[280px] sm:w-[280px]'>
        <div className={`rounded-2xl shadow-sm border p-6 sm:sticky sm:top-[100px] transition-colors duration-300 ${dk ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-gray-200'}`}>
          <div
            onClick={() => setShowFilter(!showFilter)}
            className='flex items-center justify-between cursor-pointer sm:cursor-default mb-6'
          >
            <p className={`text-lg font-bold flex items-center gap-2 ${dk ? 'text-white' : 'text-gray-900'}`}>
              <LuSettings2 className="text-blue-500" size={20} /> FILTERS
              {(category.length > 0 || subCategory.length > 0 || fabric.length > 0 || suitableFor.length > 0) && (
                <span className={`ml-2 px-2 py-1 text-xs font-bold rounded-full ${
                  dk ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                }`}>
                  {category.length + subCategory.length + fabric.length + suitableFor.length}
                </span>
              )}
            </p>
            <ChevronDown className={`h-4 w-4 sm:hidden transition-transform ${showFilter ? 'rotate-180' : ''} ${dk ? 'text-slate-400' : 'text-gray-500'}`} />
          </div>

          <div className={`transition-all duration-300 overflow-hidden ${showFilter ? 'max-h-[1000px] opacity-100' : 'max-h-0 sm:max-h-[1000px] opacity-0 sm:opacity-100'}`}>

            {/* Category Filter */}
            <div className={`pb-4 mb-4 border-b ${dk ? 'border-slate-700' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm font-semibold tracking-wide uppercase ${dk ? 'text-slate-300' : 'text-gray-900'}`}>Categories</p>
              </div>
              <div className='flex flex-col gap-2'>
                {['Men', 'Women', 'Kids'].map((cat) => (
                  <label key={cat} className='flex items-center gap-3 cursor-pointer group p-1 rounded-lg hover:bg-blue-50/50 transition-colors'>
                    <input
                      className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                      type="checkbox"
                      value={cat}
                      onChange={toggleCategory}
                    />
                    <span className={`text-[14px] transition-colors group-hover:text-blue-600 ${dk ? 'text-slate-400' : 'text-gray-600'}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SubCategory Filter */}
            <div className={`pb-4 mb-4 border-b ${dk ? 'border-slate-700' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm font-semibold tracking-wide uppercase ${dk ? 'text-slate-300' : 'text-gray-900'}`}>Product Type</p>
              </div>
              <div className='flex flex-col gap-2'>
                {['TopWear', 'BottomWear', 'WinterWear'].map((type) => (
                  <label key={type} className='flex items-center gap-3 cursor-pointer group p-1 rounded-lg hover:bg-blue-50/50 transition-colors'>
                    <input
                      className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                      type="checkbox"
                      value={type}
                      onChange={toggleSubCategory}
                    />
                    <span className={`text-[14px] transition-colors group-hover:text-blue-600 ${dk ? 'text-slate-400' : 'text-gray-600'}`}>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fabric Filter */}
            <div className={`pb-4 mb-4 border-b ${dk ? 'border-slate-700' : 'border-gray-100'}`}>
              <p className={`text-sm font-semibold tracking-wide uppercase mb-3 ${dk ? 'text-slate-300' : 'text-gray-900'}`}>Fabric Type</p>
              <div className='flex flex-col gap-2 max-h-40 overflow-y-auto pr-2'>
                {filterOptions.fabrics.map((fabricType) => (
                  <label key={fabricType} className='flex items-center gap-3 cursor-pointer group p-1 rounded-lg hover:bg-blue-50/50 transition-colors'>
                    <input
                      className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                      type="checkbox"
                      value={fabricType}
                      onChange={toggleFabric}
                    />
                    <span className={`text-[14px] transition-colors group-hover:text-blue-600 ${dk ? 'text-slate-400' : 'text-gray-600'}`}>{fabricType}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Suitable For Filter */}
            <div className={`pb-4 mb-4 border-b ${dk ? 'border-slate-700' : 'border-gray-100'}`}>
              <p className={`text-sm font-semibold tracking-wide uppercase mb-3 ${dk ? 'text-slate-300' : 'text-gray-900'}`}>Suitable For</p>
              <div className='flex flex-col gap-2 max-h-40 overflow-y-auto pr-2'>
                {filterOptions.suitableFor.map((occasion) => (
                  <label key={occasion} className='flex items-center gap-3 cursor-pointer group p-1 rounded-lg hover:bg-blue-50/50 transition-colors'>
                    <input
                      className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                      type="checkbox"
                      value={occasion}
                      onChange={toggleSuitableFor}
                    />
                    <span className={`text-[14px] transition-colors group-hover:text-blue-600 ${dk ? 'text-slate-400' : 'text-gray-600'}`}>{occasion}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            {(category.length > 0 || subCategory.length > 0 || fabric.length > 0 || suitableFor.length > 0) && (
              <button
                onClick={() => {
                  setCaterory([]);
                  setSubCaterory([]);
                  setFabric([]);
                  setSuitableFor([]);
                }}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  dk 
                    ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30 border border-red-800/30' 
                    : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                }`}
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 w-full'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6'>
            <div>
              <Title text1={'ELITE'} text2={'PRODUCTS'} />
              <p className={`text-sm mt-1 font-bold ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Premium collection for a realistic lifestyle</p>
            </div>

            {/* Search and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <p className={`hidden lg:block text-xs font-black uppercase tracking-widest ${dk ? 'text-slate-500' : 'text-gray-400'}`}>
                Showing <span className={dk ? 'text-white' : 'text-gray-900'}>{filterProduct.length}</span> Results
              </p>

              <div className="relative group flex-shrink-0">
                <input
                  type="text"
                  placeholder="Filter name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`pl-11 pr-11 py-3 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all w-full sm:w-72 border ${dk ? 'bg-[#1e293b] border-slate-700 text-slate-200 placeholder:text-slate-500 hover:border-slate-600' : 'bg-white border-gray-200 text-gray-700 placeholder:text-gray-400 hover:border-gray-300 shadow-sm shadow-gray-200/50'}`}
                />
                <CiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${dk ? 'text-slate-500' : 'text-gray-400'}`} />
                {search && (
                   <button onClick={() => setSearch('')} className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-200/20 transition-all ${dk ? 'text-slate-500 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}><X size={14} /></button>
                )}
              </div>

              <div className="relative flex-shrink-0">
                <select
                  onChange={(e) => SetSortType(e.target.value)}
                  className={`appearance-none font-black text-[11px] uppercase tracking-wider px-5 py-3.5 rounded-2xl shadow-sm border ${dk ? 'bg-[#1e293b] border-slate-700 text-slate-200 hover:border-slate-600' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  <option value="relavent">Relevant</option>
                  <option value="low-high">Price: Low-High</option>
                  <option value="high-low">Price: High-Low</option>
                </select>
                <ChevronDown className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 ${dk ? 'text-slate-400' : 'text-gray-500'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
          {filterProduct.length > 0 ? filterProduct.map((item, index) => (
            <Card key={index} id={item._id} name={item.name} image={item.image1} price={item.price} fabric={item.fabric} suitableFor={item.suitableFor} />
          )) : (
            <div className='col-span-full py-20 text-center opacity-50'>
                <p className='text-lg font-bold'>No products matched your criteria</p>
                <button onClick={() => { setSearch(''); setCaterory([]); setSubCaterory([]); setFabric([]); setSuitableFor([]); }} className='text-blue-500 underline mt-2'>Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products

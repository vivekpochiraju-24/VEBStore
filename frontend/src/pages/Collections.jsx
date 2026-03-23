import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import { themeDataContext } from '../context/ThemeContext'
import Card from '../component/Card'
import { LuSettings2 } from "react-icons/lu"
import axios from 'axios'

function Collections() {
  const { isDark } = useContext(themeDataContext)
  const { serverUrl } = useContext(authDataContext)
  const dk = isDark

  const [showFilter, setShowFilter] = useState(false)
  const { products, search, showSearch } = useContext(shopDataContext)
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
    let productCopy = products.slice()
    if (showSearch && search) {
      productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
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
        // Check if any of the item's suitableFor options match the selected ones
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

  useEffect(() => { sortProducts() }, [sortType])
  useEffect(() => { setFilterProduct(products) }, [products])
  useEffect(() => { applyFilter() }, [category, subCategory, fabric, suitableFor, search, showSearch])

  return (
    <div className={`w-full min-h-screen pt-[100px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-32 flex flex-col sm:flex-row gap-6 sm:gap-10 transition-colors duration-300 ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>

      {/* Sidebar Filters */}
      <div className='w-full sm:min-w-[260px] sm:w-[260px]'>
        <div className={`rounded-2xl shadow-sm border p-6 sm:sticky sm:top-[100px] transition-colors duration-300 ${dk ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-gray-200'}`}>
          <div
            onClick={() => setShowFilter(!showFilter)}
            className='flex items-center justify-between cursor-pointer sm:cursor-default mb-4'
          >
            <p className={`text-lg font-bold flex items-center gap-2 ${dk ? 'text-white' : 'text-gray-900'}`}>
              <LuSettings2 className="text-blue-500" size={20} /> FILTERS
            </p>
            <svg className={`h-4 sm:hidden transition-transform ${showFilter ? 'rotate-90' : ''} ${dk ? 'text-slate-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
          </div>

          <div className={`transition-all duration-300 overflow-hidden ${showFilter ? 'max-h-[1000px] opacity-100' : 'max-h-0 sm:max-h-[1000px] opacity-0 sm:opacity-100'}`}>

            {/* Category Filter */}
            <div className={`py-4 border-t ${dk ? 'border-slate-700' : 'border-gray-100'}`}>
              <p className={`mb-3 text-sm font-semibold tracking-wide uppercase ${dk ? 'text-slate-300' : 'text-gray-900'}`}>Categories</p>
              <div className='flex flex-col gap-3'>
                {['Men', 'Women', 'Kids'].map((cat) => (
                  <label key={cat} className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                      type="checkbox"
                      value={cat}
                      onChange={toggleCategory}
                    />
                    <span className={`text-[15px] transition-colors group-hover:text-blue-500 ${dk ? 'text-slate-400' : 'text-gray-600'}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SubCategory Filter */}
            <div className={`py-4 border-t ${dk ? 'border-slate-700' : 'border-gray-100'}`}>
              <p className={`mb-3 text-sm font-semibold tracking-wide uppercase ${dk ? 'text-slate-300' : 'text-gray-900'}`}>Product Type</p>
              <div className='flex flex-col gap-3'>
                {['TopWear', 'BottomWear', 'WinterWear'].map((type) => (
                  <label key={type} className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                      type="checkbox"
                      value={type}
                      onChange={toggleSubCategory}
                    />
                    <span className={`text-[15px] transition-colors group-hover:text-blue-500 ${dk ? 'text-slate-400' : 'text-gray-600'}`}>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fabric Filter */}
            <div className={`py-4 border-t ${dk ? 'border-slate-700' : 'border-gray-100'}`}>
              <p className={`mb-3 text-sm font-semibold tracking-wide uppercase ${dk ? 'text-slate-300' : 'text-gray-900'}`}>Fabric Type</p>
              <div className='flex flex-col gap-3 max-h-48 overflow-y-auto'>
                {filterOptions.fabrics.map((fabricType) => (
                  <label key={fabricType} className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                      type="checkbox"
                      value={fabricType}
                      onChange={toggleFabric}
                    />
                    <span className={`text-[15px] transition-colors group-hover:text-blue-500 ${dk ? 'text-slate-400' : 'text-gray-600'}`}>{fabricType}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Suitable For Filter */}
            <div className={`py-4 border-t ${dk ? 'border-slate-700' : 'border-gray-100'}`}>
              <p className={`mb-3 text-sm font-semibold tracking-wide uppercase ${dk ? 'text-slate-300' : 'text-gray-900'}`}>Suitable For</p>
              <div className='flex flex-col gap-3 max-h-48 overflow-y-auto'>
                {filterOptions.suitableFor.map((occasion) => (
                  <label key={occasion} className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                      type="checkbox"
                      value={occasion}
                      onChange={toggleSuitableFor}
                    />
                    <span className={`text-[15px] transition-colors group-hover:text-blue-500 ${dk ? 'text-slate-400' : 'text-gray-600'}`}>{occasion}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 w-full'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4'>
          <div className='mb-0'>
            <Title text1={'ALL'} text2={'PRODUCTS'} />
            <p className={`text-sm mt-1 ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Explore our carefully curated premium collections</p>
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              onChange={(e) => SetSortType(e.target.value)}
              className={`appearance-none font-medium text-sm px-5 py-3 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer pr-10 transition-colors w-full sm:w-auto border ${dk ? 'bg-[#1e293b] border-slate-600 text-slate-200 hover:border-slate-500' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}
            >
              <option value="relavent">Sort by: Relevant</option>
              <option value="low-high">Sort by: Price (Low to High)</option>
              <option value="high-low">Sort by: Price (High to Low)</option>
            </select>
            <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
          {filterProduct.map((item, index) => (
            <Card 
              key={index} 
              name={item.name} 
              id={item._id} 
              price={item.price} 
              image={item.image1} 
              fabric={item.fabric}
              suitableFor={item.suitableFor}
            />
          ))}
          {filterProduct.length === 0 && (
            <div className={`col-span-full flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed ${dk ? 'bg-[#1e293b] border-slate-700 text-slate-400' : 'bg-white border-gray-300 text-gray-500'}`}>
              <p className="text-lg">No products found matching your filters.</p>
              <button
                onClick={() => { 
                  setCaterory([]); 
                  setSubCaterory([]); 
                  setFabric([]); 
                  setSuitableFor([]); 
                  document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false) 
                }}
                className="mt-4 text-blue-500 font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Collections
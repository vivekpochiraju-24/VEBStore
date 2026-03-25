import React, { useContext, useState } from 'react'
import { authDataContext } from '../context/AuthContext'
import { themeDataContext } from '../context/ThemeContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaTrash } from 'react-icons/fa'

function AddProduct() {
  const { serverUrl } = useContext(authDataContext)
  const { isDark } = useContext(themeDataContext)
  const navigate = useNavigate()
  const dk = isDark

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    subCategory: 'TopWear',
    sizes: [],
    fabric: 'Cotton',
    suitableFor: 'Casual',
    bestseller: false
  })

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null
  })

  const [loading, setLoading] = useState(false)

  const categories = ['Men', 'Women', 'Kids']
  const subCategories = ['TopWear', 'BottomWear', 'WinterWear']
  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL']
  const fabricOptions = ['Cotton', 'Silk', 'Wool', 'Polyester', 'Linen', 'Rayon', 'Denim', 'Nylon', 'Velvet', 'Leather', 'Synthetic', 'Blend']
  const suitableForOptions = ['Casual', 'Office', 'Party', 'School', 'College', 'Sports', 'Formal', 'Traditional', 'Beach', 'Travel', 'Festive', 'Wedding']

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleImageChange = (e) => {
    const { name, files } = e.target
    if (files && files.length > 0) {
      setImages(prev => ({
        ...prev,
        [name]: files[0]
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.description || !formData.price || 
        formData.sizes.length === 0 || !images.image1 || !images.image2 || 
        !images.image3 || !images.image4) {
      return toast.error('Please fill all required fields and upload all images')
    }

    const data = new FormData()
    data.append('name', formData.name)
    data.append('description', formData.description)
    data.append('price', formData.price)
    data.append('category', formData.category)
    data.append('subCategory', formData.subCategory)
    data.append('sizes', JSON.stringify(formData.sizes))
    data.append('fabric', formData.fabric)
    data.append('suitableFor', formData.suitableFor)
    data.append('bestseller', formData.bestseller)
    data.append('image1', images.image1)
    data.append('image2', images.image2)
    data.append('image3', images.image3)
    data.append('image4', images.image4)

    setLoading(true)
    try {
      const response = await axios.post(`${serverUrl}/api/product/addproduct`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response.data) {
        toast.success('Product added successfully!')
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          category: 'Men',
          subCategory: 'TopWear',
          sizes: [],
          fabric: 'Cotton',
          suitableFor: 'Casual',
          bestseller: false
        })
        setImages({
          image1: null,
          image2: null,
          image3: null,
          image4: null
        })
        // Reset file inputs
        document.querySelectorAll('input[type="file"]').forEach(input => input.value = '')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen pt-[100px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-32 transition-colors duration-300 ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${dk ? 'text-white' : 'text-gray-900'}`}>
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className={`rounded-2xl shadow-sm border p-8 transition-colors duration-300 ${dk ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-gray-200'}`}>

          {/* Basic Information */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${dk ? 'text-white' : 'text-gray-900'}`}>Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${dk ? 'text-slate-300' : 'text-gray-700'}`}>
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${dk ? 'bg-[#0f172a] border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${dk ? 'text-slate-300' : 'text-gray-700'}`}>
                  Price (INR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${dk ? 'bg-[#0f172a] border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-medium mb-2 ${dk ? 'text-slate-300' : 'text-gray-700'}`}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${dk ? 'bg-[#0f172a] border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="Enter product description"
                required
              />
            </div>
          </div>

          {/* Category Information */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${dk ? 'text-white' : 'text-gray-900'}`}>Category Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${dk ? 'text-slate-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${dk ? 'bg-[#0f172a] border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${dk ? 'text-slate-300' : 'text-gray-700'}`}>
                  Sub Category
                </label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${dk ? 'bg-[#0f172a] border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  {subCategories.map(subCat => (
                    <option key={subCat} value={subCat}>{subCat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Attributes */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${dk ? 'text-white' : 'text-gray-900'}`}>Product Attributes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${dk ? 'text-slate-300' : 'text-gray-700'}`}>
                  Fabric Type *
                </label>
                <select
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${dk ? 'bg-[#0f172a] border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                >
                  {fabricOptions.map(fabric => (
                    <option key={fabric} value={fabric}>{fabric}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${dk ? 'text-slate-300' : 'text-gray-700'}`}>
                  Suitable For *
                </label>
                <select
                  name="suitableFor"
                  value={formData.suitableFor}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${dk ? 'bg-[#0f172a] border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                >
                  {suitableForOptions.map(occasion => (
                    <option key={occasion} value={occasion}>{occasion}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-6">
              <label className={`block text-sm font-medium mb-2 ${dk ? 'text-slate-300' : 'text-gray-700'}`}>
                Available Sizes *
              </label>
              <div className="flex flex-wrap gap-3">
                {sizeOptions.map(size => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${dk ? 'text-slate-300' : 'text-gray-700'}`}>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bestseller */}
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="bestseller"
                  checked={formData.bestseller}
                  onChange={handleInputChange}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${dk ? 'text-slate-300' : 'text-gray-700'}`}>Mark as Bestseller</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${dk ? 'text-white' : 'text-gray-900'}`}>Product Images *</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(images).map((imageName, index) => (
                <div key={imageName}>
                  <label className={`block text-sm font-medium mb-2 ${dk ? 'text-slate-300' : 'text-gray-700'}`}>
                    Image {index + 1} *
                  </label>
                  <input
                    type="file"
                    name={imageName}
                    onChange={handleImageChange}
                    accept="image/*"
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${dk ? 'bg-[#0f172a] border-slate-600 text-white file:bg-blue-900 file:text-blue-300' : 'bg-white border-gray-300 text-gray-900'}`}
                    required
                  />
                  {images[imageName] && (
                    <p className={`mt-2 text-xs ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
                      Selected: {images[imageName].name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct

import React, { useContext, useState, useEffect } from 'react'
import { authDataContext } from '../context/AuthContext'
import { themeDataContext } from '../context/ThemeContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaFilter, FaBox, FaShoppingCart, FaUsers, FaChartBar, FaArrowLeft } from 'react-icons/fa'
import { MdEdit, MdDelete } from 'react-icons/md'

function Admin() {
  const { serverUrl } = useContext(authDataContext)
  const { isDark } = useContext(themeDataContext)
  const navigate = useNavigate()
  const dk = isDark

  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFabric, setFilterFabric] = useState('')
  const [filterSuitableFor, setFilterSuitableFor] = useState('')
  const [filterOptions, setFilterOptions] = useState({ fabrics: [], suitableFor: [] })
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  })
  const [editingProduct, setEditingProduct] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Fetch products and stats
  useEffect(() => {
    fetchProducts()
    fetchStats()
    fetchFilterOptions()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/product/list`)
      setProducts(response.data)
      setFilteredProducts(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const productsResponse = await axios.get(`${serverUrl}/api/product/list`)
      const ordersResponse = await axios.get(`${serverUrl}/api/order/list`)
      
      setStats({
        totalProducts: productsResponse.data.length,
        totalOrders: ordersResponse.data.length,
        totalUsers: 0, // We'll need to implement user count endpoint
        totalRevenue: ordersResponse.data.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/product/filter-options`)
      setFilterOptions(response.data)
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }

  // Filter products
  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterFabric) {
      filtered = filtered.filter(product => product.fabric === filterFabric)
    }

    if (filterSuitableFor) {
      filtered = filtered.filter(product => product.suitableFor === filterSuitableFor)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, filterFabric, filterSuitableFor])

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    
    try {
      await axios.post(`${serverUrl}/api/product/remove/${productId}`, {}, { withCredentials: true })
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowEditModal(true)
  }

  const handleUpdateProduct = async (updatedData) => {
    try {
      const response = await axios.post(`${serverUrl}/api/product/edit/${editingProduct._id}`, updatedData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      
      toast.success('Product updated successfully')
      setShowEditModal(false)
      setEditingProduct(null)
      fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    }
  }

  const handleBackToMain = () => {
    navigate('/')
  }

  return (
    <div className={`min-h-screen pt-8 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-8 transition-colors duration-300 ${dk ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBackToMain}
            className={`p-3 rounded-lg transition-colors ${dk ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>
              Admin Dashboard
            </h1>
            <p className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your VEBStore products and settings
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-xl border transition-colors ${dk ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${dk ? 'text-gray-400' : 'text-gray-600'}`}>Total Products</p>
              <p className={`text-2xl font-bold mt-1 ${dk ? 'text-white' : 'text-gray-900'}`}>{stats.totalProducts}</p>
            </div>
            <FaBox className={`text-3xl ${dk ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-colors ${dk ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${dk ? 'text-gray-400' : 'text-gray-600'}`}>Total Orders</p>
              <p className={`text-2xl font-bold mt-1 ${dk ? 'text-white' : 'text-gray-900'}`}>{stats.totalOrders}</p>
            </div>
            <FaShoppingCart className={`text-3xl ${dk ? 'text-green-400' : 'text-green-600'}`} />
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-colors ${dk ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${dk ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
              <p className={`text-2xl font-bold mt-1 ${dk ? 'text-white' : 'text-gray-900'}`}>{stats.totalUsers}</p>
            </div>
            <FaUsers className={`text-3xl ${dk ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-colors ${dk ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${dk ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
              <p className={`text-2xl font-bold mt-1 ${dk ? 'text-white' : 'text-gray-900'}`}>₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <FaChartBar className={`text-3xl ${dk ? 'text-orange-400' : 'text-orange-600'}`} />
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className={`p-6 rounded-xl border mb-6 transition-colors ${dk ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${dk ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              />
              <FaFilter className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400`} />
            </div>

            {/* Fabric Filter */}
            <select
              value={filterFabric}
              onChange={(e) => setFilterFabric(e.target.value)}
              className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${dk ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option value="">All Fabrics</option>
              {filterOptions.fabrics.map(fabric => (
                <option key={fabric} value={fabric}>{fabric}</option>
              ))}
            </select>

            {/* Suitable For Filter */}
            <select
              value={filterSuitableFor}
              onChange={(e) => setFilterSuitableFor(e.target.value)}
              className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${dk ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option value="">All Occasions</option>
              {filterOptions.suitableFor.map(occasion => (
                <option key={occasion} value={occasion}>{occasion}</option>
              ))}
            </select>
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => navigate('/add-product')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${dk ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            <FaPlus />
            Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className={`rounded-xl border overflow-hidden transition-colors ${dk ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${dk ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                  Product
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                  Category
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                  Fabric
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                  Suitable For
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                  Price
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                  Sizes
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                  Bestseller
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dk ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {loading ? (
                <tr>
                  <td colSpan="8" className={`px-6 py-8 text-center ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className={`px-6 py-8 text-center ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className={`hover:${dk ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={product.image1}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <p className={`font-medium ${dk ? 'text-white' : 'text-gray-900'}`}>{product.name}</p>
                          <p className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{product.subCategory}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                      {product.category}
                    </td>
                    <td className={`px-6 py-4 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${dk ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                        {product.fabric}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${dk ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>
                        {product.suitableFor}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-medium ${dk ? 'text-white' : 'text-gray-900'}`}>
                      ₹{product.price}
                    </td>
                    <td className={`px-6 py-4 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((size, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 text-xs rounded ${dk ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={`px-6 py-4`}>
                      {product.bestseller ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${dk ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}`}>
                          Bestseller
                        </span>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${dk ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                          Regular
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-4`}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className={`p-2 rounded-lg hover:bg-blue-100 transition-colors ${dk ? 'hover:bg-blue-900' : ''}`}
                          title="Edit Product"
                        >
                          <MdEdit className={`text-sm ${dk ? 'text-blue-400' : 'text-blue-600'}`} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className={`p-2 rounded-lg hover:bg-red-100 transition-colors ${dk ? 'hover:bg-red-900' : ''}`}
                          title="Delete Product"
                        >
                          <MdDelete className={`text-sm ${dk ? 'text-red-400' : 'text-red-600'}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-xl p-6 ${dk ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-xl font-bold mb-4 ${dk ? 'text-white' : 'text-gray-900'}`}>Edit Product</h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${dk ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Fabric Type</label>
                <select
                  value={editingProduct.fabric}
                  onChange={(e) => setEditingProduct({...editingProduct, fabric: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${dk ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  {filterOptions.fabrics.map(fabric => (
                    <option key={fabric} value={fabric}>{fabric}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Suitable For</label>
                <select
                  value={editingProduct.suitableFor}
                  onChange={(e) => setEditingProduct({...editingProduct, suitableFor: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${dk ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  {filterOptions.suitableFor.map(occasion => (
                    <option key={occasion} value={occasion}>{occasion}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Price</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${dk ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border ${dk ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Bestseller</label>
                <select
                  value={editingProduct.bestseller}
                  onChange={(e) => setEditingProduct({...editingProduct, bestseller: e.target.value === 'true'})}
                  className={`w-full px-4 py-2 rounded-lg border ${dk ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${dk ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${dk ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin

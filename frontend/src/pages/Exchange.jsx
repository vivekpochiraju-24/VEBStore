import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext'
import { authDataContext } from '../context/AuthContext'
import { themeDataContext } from '../context/ThemeContext'
import { toast } from 'react-toastify'
import { Upload, Package, DollarSign, Info, Clock, Coins, Sparkles } from 'lucide-react'

const Exchange = () => {
    const [products, setProducts] = useState([])
    const [oldProductImages, setOldProductImages] = useState([null, null, null, null])
    const [formData, setFormData] = useState({
        oldProduct: '',
        newProduct: '', 
        oldProductCondition: 'Excellent',
        oldProductDescription: '',
        clothQuality: 'High',
        clothYearsUsed: '0-1',
        clothDamages: 'None'
    })
    const [loading, setLoading] = useState(false)
    const [previewImages, setPreviewImages] = useState([null, null, null, null])
    const [productsLoading, setProductsLoading] = useState(true)
    
    const { userData } = useContext(userDataContext)
    const { serverUrl } = useContext(authDataContext)
    const { isDark } = useContext(themeDataContext)
    const navigate = useNavigate()

    const dk = isDark

    // Fetch products for new product selection
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setProductsLoading(true)
                const response = await axios.get(`${serverUrl}/api/product/list`)
                setProducts(response.data)
            } catch (error) {
                console.error('Error fetching products:', error)
                toast.error('Failed to load products')
            } finally {
                setProductsLoading(false)
            }
        }
        fetchProducts()
    }, [serverUrl])

    const handleSingleImageUpload = (e, index) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            const newImages = [...oldProductImages]
            newImages[index] = file
            const newPreviews = [...previewImages]
            newPreviews[index] = URL.createObjectURL(file)
            setOldProductImages(newImages)
            setPreviewImages(newPreviews)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const calculateMaxDiscount = () => {
        return calculateSupercoins()
    }

    const calculateSupercoins = () => {
        // Base coins 10 to 50
        const qualityBase = {
            'High': 40,
            'Premium': 30,
            'Standard': 20,
            'Basic': 10
        }
        
        const yearMultiplier = {
            '0-1': 1.0,
            '1-2': 0.8,
            '2-3': 0.6,
            '3+': 0.4
        }

        const damagePenalty = {
            'None': 0,
            'Minor (Stain/Loose Thread)': -5,
            'Moderate (Small Tear)': -10,
            'Major (Needs Repair)': -20
        }

        const base = qualityBase[formData.clothQuality] || 20
        const mult = yearMultiplier[formData.clothYearsUsed] || 1.0
        const penalty = damagePenalty[formData.clothDamages] || 0
        
        let final = Math.floor(base * mult + penalty)
        return Math.min(50, Math.max(10, final))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!formData.oldProduct || !formData.oldProductCondition || !formData.oldProductDescription) {
            toast.error('Please complete all garment details')
            return
        }

        const validImages = oldProductImages.filter(img => img);
        if (validImages.length !== 4) {
            toast.error('Please upload exactly 4 images (Front, Back, Left, Right)')
            return
        }

        setLoading(true)

        try {
            // Convert images to base64 strings for backend
            const imagePromises = oldProductImages.filter(img => img).map(async (image) => {
                if (image instanceof File) {
                    return new Promise((resolve) => {
                        const reader = new FileReader()
                        reader.onloadend = () => resolve(reader.result)
                        reader.readAsDataURL(image)
                    })
                }
                return image // If already a string, return as-is
            })
            
            const convertedImages = await Promise.all(imagePromises)
            
            const coins = calculateSupercoins()
            const exchangeData = {
                ...formData,
                oldProductImages: convertedImages,
                requestedCoins: coins 
            }

            await axios.post(`${serverUrl}/api/exchange/request`, exchangeData, {
                withCredentials: true
            })
            
            toast.success('Exchange request submitted successfully!')
            navigate('/my-exchanges')
            
        } catch (error) {
            console.error('Error submitting exchange:', error)
            toast.error(error.response?.data?.message || 'Failed to submit exchange request')
        } finally {
            setLoading(false)
        }
    }

    const selectedProduct = Array.isArray(products) ? products.find(p => p._id === formData.newProduct) : null
    const maxDiscount = calculateMaxDiscount()
    const finalPrice = selectedProduct ? selectedProduct.price - maxDiscount : 0

    return (
        <div className={`min-h-screen ${dk ? 'bg-[#0f172a] text-slate-100' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'}`}>
             <div className='max-w-5xl mx-auto px-4 pt-28 pb-12'>
                <div className='text-center mb-12'>
                    <h1 className={`text-4xl sm:text-5xl font-black mb-4 tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>Dress Exchange Program</h1>
                    <p className={`text-lg font-medium max-w-2xl mx-auto ${dk ? 'text-slate-400' : 'text-gray-600'}`}>Experience the new age of sustainable fashion. Trade your gently used garments for exclusive premium discounts.</p>
                </div>

                {/* Process Steps */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
                    {[
                        { step: '01', title: 'Submit Details', desc: 'Fill the form with garment condition and 4 photos.', icon: <Package size={20} /> },
                        { step: '02', title: 'Fast Review', desc: 'Our elite stylists will check the product within 2-3 business days.', icon: <Clock size={20} /> },
                        { step: '03', title: 'Get Coins', desc: 'Approved items earn Supercoins for immediate shop credit.', icon: <Coins size={20} /> },
                    ].map((item, idx) => (
                        <div key={idx} className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] ${dk ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-gray-100 shadow-sm shadow-gray-200/50'}`}>
                            <div className='flex items-center justify-between mb-4'>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${dk ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                    {item.icon}
                                </div>
                                <span className={`text-xs font-black px-2 py-1 rounded-lg ${dk ? 'bg-slate-700 text-slate-500' : 'bg-gray-100 text-gray-400'}`}>STEP {item.step}</span>
                            </div>
                            <h3 className={`font-bold text-base mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                            <p className={`text-sm leading-relaxed ${dk ? 'text-slate-500' : 'text-gray-500'}`}>{item.desc}</p>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className='space-y-8'>
                    {/* Old Product Information */}
                    <div className={`rounded-2xl shadow-xl p-8 ${dk ? 'bg-[#1e293b] border border-slate-700' : 'bg-white border border-gray-200'}`}>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className={`p-2 rounded-lg ${dk ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                                <Package className={`w-6 h-6 ${dk ? 'text-blue-400' : 'text-blue-600'}`} />
                            </div>
                            <h2 className={`text-2xl font-semibold ${dk ? 'text-slate-100' : 'text-gray-900'}`}>Old Dress Information</h2>
                        </div>
                        
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                            {/* Left Side: Garment Details */}
                            <div className='space-y-6'>
                                <div className='grid grid-cols-2 gap-6'>
                                    <div>
                                        <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
                                            Garment Category
                                        </label>
                                        <select
                                            name='oldProduct'
                                            value={formData.oldProduct}
                                            onChange={handleInputChange}
                                            className={`w-full h-14 px-5 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold ${dk ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100 text-gray-900'}`}
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="Premium Shirt">Shirt/Top</option>
                                            <option value="Designer Dress">Dress/Gown</option>
                                            <option value="Luxury Blazer">Blazer/Jacket</option>
                                            <option value="Elite Trousers">Trousers</option>
                                            <option value="Custom Denim">Denim</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
                                            Cloth Quality
                                        </label>
                                        <select
                                            name='clothQuality'
                                            value={formData.clothQuality}
                                            onChange={handleInputChange}
                                            className={`w-full h-14 px-5 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold ${dk ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100 text-gray-900'}`}
                                            required
                                        >
                                            <option value='High'>High (Organic/Silk)</option>
                                            <option value='Premium'>Premium (Cotton/Linen)</option>
                                            <option value='Standard'>Standard (Blended)</option>
                                            <option value='Basic'>Basic (Synthetic)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-6'>
                                    <div>
                                        <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
                                            Years Used
                                        </label>
                                        <select
                                            name='clothYearsUsed'
                                            value={formData.clothYearsUsed}
                                            onChange={handleInputChange}
                                            className={`w-full h-14 px-5 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold ${dk ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100 text-gray-900'}`}
                                            required
                                        >
                                            <option value='0-1'>Less than 1 Year</option>
                                            <option value='1-2'>1-2 Years</option>
                                            <option value='2-3'>2-3 Years</option>
                                            <option value='3+'>More than 3 Years</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
                                            Any Damages?
                                        </label>
                                        <select
                                            name='clothDamages'
                                            value={formData.clothDamages}
                                            onChange={handleInputChange}
                                            className={`w-full h-14 px-5 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold ${dk ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100 text-gray-900'}`}
                                            required
                                        >
                                            <option value='None'>No Visible Damages</option>
                                            <option value='Minor (Stain/Loose Thread)'>Minor Defects</option>
                                            <option value='Moderate (Small Tear)'>Moderate Damage</option>
                                            <option value='Major (Needs Repair)'>Major Damage</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Supercoins Estimator */}
                            <div className={`p-8 rounded-[2rem] border-2 flex flex-col justify-center relative overflow-hidden transition-all duration-700 ${dk ? 'bg-blue-600/10 border-blue-500/30' : 'bg-blue-50/50 border-blue-100'}`}>
                                <div className='absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl'></div>
                                <div className='relative z-10'>
                                    <div className='flex items-center gap-2 mb-4'>
                                        <Coins className='text-amber-500' size={20} />
                                        <span className={`text-xs font-black uppercase tracking-widest ${dk ? 'text-blue-400' : 'text-blue-600'}`}>Supercoin Estimation</span>
                                    </div>
                                    <h3 className={`text-sm font-bold opacity-60 mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>Estimated Reward Coins</h3>
                                    <div className='flex items-baseline gap-2 mb-4'>
                                        <span className={`text-5xl font-black ${dk ? 'text-white' : 'text-gray-900'}`}>{calculateSupercoins()}</span>
                                        <div className='flex flex-col'>
                                            <span className='text-amber-500 font-black text-xs uppercase'>Supercoins</span>
                                            <span className='text-green-500 font-black text-[10px] uppercase animate-pulse'>Live Assessment</span>
                                        </div>
                                    </div>
                                    
                                    <div className='space-y-4'>
                                        <div className='flex items-center gap-3'>
                                            <div className={`w-1.5 h-1.5 rounded-full ${dk ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                                            <p className={`text-[10px] font-black uppercase leading-relaxed ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Quality: <b>{formData.clothQuality}</b></p>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <div className={`w-1.5 h-1.5 rounded-full ${dk ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                                            <p className={`text-[10px] font-black uppercase leading-relaxed ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Usage: <b>{formData.clothYearsUsed} Years</b></p>
                                        </div>
                                    </div>

                                    <div className={`mt-6 pt-4 border-t font-black text-[10px] uppercase tracking-[0.2em] ${dk ? 'border-blue-500/20 text-blue-400/60' : 'border-blue-100 text-blue-500/60'}`}>
                                        Range: 10 - 50 Coins Based on Quality
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-8'>
                            <label className={`block text-sm font-black uppercase tracking-widest mb-3 ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
                                Descriptive Narrative
                            </label>
                            <textarea
                                name='oldProductDescription'
                                value={formData.oldProductDescription}
                                onChange={handleInputChange}
                                className={`w-full px-6 py-5 border-2 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm min-h-[160px] resize-none ${dk ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600' : 'bg-gray-50 border-gray-100 text-gray-900 placeholder-gray-400'}`}
                                placeholder='Tell us the story of this garment—its brand, how it was cared for, and any unique features...'
                                required
                            />
                        </div>

                        <div className='mt-6'>
                            <label className={`block text-sm font-semibold mb-4 ${dk ? 'text-slate-300' : 'text-gray-700'}`}>
                                <Upload className='inline w-4 h-4 mr-2' />
                                Upload Dress Images (4 required)
                            </label>
                            <div className={`text-xs mb-3 ${dk ? 'text-slate-500' : 'text-gray-500'}`}>
                                Please upload clear images showing the Front, Back, Left, and Right side of your dress.
                            </div>
                            
                            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4'>
                                {['Front', 'Back', 'Left', 'Right'].map((label, index) => (
                                    <div key={label} className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center relative cursor-pointer hover:bg-blue-50/10 transition-colors ${dk ? 'border-slate-600' : 'border-gray-300'}`}>
                                        {previewImages[index] ? (
                                            <>
                                                <img src={previewImages[index]} alt={label} className="w-full h-24 object-cover rounded-lg mb-2" />
                                                <span className={`text-xs font-semibold ${dk ? 'text-slate-300' : 'text-gray-600'}`}>{label}</span>
                                                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleSingleImageUpload(e, index)} />
                                            </>
                                        ) : (
                                            <>
                                                <Upload className={`w-6 h-6 mb-2 ${dk ? 'text-slate-400' : 'text-gray-400'}`} />
                                                <span className={`text-xs font-semibold text-center ${dk ? 'text-slate-400' : 'text-gray-500'}`}>Upload {label}</span>
                                                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleSingleImageUpload(e, index)} />
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-all flex items-center justify-center gap-3 shadow-lg'
                        >
                            {loading ? (
                                <>
                                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <DollarSign className='w-5 h-5' />
                                    Submit Exchange Request
                                </>
                            )}
                        </button>
                    </form>
            </div>
        </div>
    )
}

export default Exchange

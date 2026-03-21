import React, { useContext } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { shopDataContext } from '../context/ShopContext'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const STORE_NUMBER = '919603673436' // Store WhatsApp number

function Ai() {
  const { cartItem, products, currency } = useContext(shopDataContext)
  const { userData } = useContext(userDataContext)
  const navigate = useNavigate()

  const buildWhatsAppMessage = () => {
    const cartProductIds = Object.keys(cartItem || {})

    if (cartProductIds.length === 0) {
      return `👋 Hi VEBStore!\n\nI came across your store and I'm interested in your products. Could you please send me your latest collection and available offers?\n\nThank you! 🛍️`
    }

    let lines = []
    lines.push(`👋 Hi VEBStore! I'd like to order the following items:\n`)
    lines.push(`👤 Customer: ${userData?.name || 'Customer'}`)
    lines.push(`📧 Email: ${userData?.email || ''}`)
    if (userData?.phone) lines.push(`📱 Phone: +91${userData.phone}`)
    lines.push(``)

    let grandTotal = 0

    cartProductIds.forEach((productId) => {
      const product = products.find(p => p._id === productId)
      if (!product) return

      const sizes = cartItem[productId]
      Object.keys(sizes).forEach((size) => {
        const qty = sizes[size]
        if (qty <= 0) return

        const subtotal = product.price * qty
        grandTotal += subtotal

        lines.push(`🛍️ *${product.name}*`)
        lines.push(`   • Size: ${size}`)
        lines.push(`   • Qty: ${qty}`)
        lines.push(`   • Price: ${currency}${product.price} × ${qty} = ${currency}${subtotal}`)
        if (product.image1) {
          lines.push(`   • Product Link: ${product.image1}`)
        }
        lines.push(``)
      })
    })

    lines.push(`─────────────────────────`)
    lines.push(`💰 *Subtotal: ${currency}${grandTotal}*`)
    lines.push(`🚚 *Delivery: ${currency}40*`)
    lines.push(`✅ *Grand Total: ${currency}${grandTotal + 40}*`)
    lines.push(``)
    lines.push(`Please confirm product availability and share payment details. Thank you! 🙏`)

    return lines.join('\n')
  }

  const handleWhatsAppClick = () => {
    // Check if user has saved their phone number — show reminder if not
    if (!userData?.phone) {
      toast.warn('Please add your mobile number in Edit Profile first! 📱', { autoClose: 4000 })
      navigate('/profile')
      return
    }

    const message = buildWhatsAppMessage()
    // Send the order details to the STORE's WhatsApp
    const url = `https://wa.me/${STORE_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const cartCount = Object.keys(cartItem || {}).reduce((acc, id) => {
    return acc + Object.values(cartItem[id] || {}).reduce((s, q) => s + q, 0)
  }, 0)

  return (
    <div
      className='fixed lg:bottom-6 md:bottom-10 bottom-20 left-4 z-50 group cursor-pointer'
      onClick={handleWhatsAppClick}
      title='Order via WhatsApp'
    >
      {/* Pulse ring */}
      <span className='absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping'></span>

      {/* Cart count badge */}
      {cartCount > 0 && (
        <div className='absolute -top-1 -right-1 z-10 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow'>
          {cartCount}
        </div>
      )}

      {/* WhatsApp icon button */}
      <div className='relative flex items-center justify-center w-[60px] h-[60px] bg-green-500 hover:bg-green-600 rounded-full shadow-xl shadow-green-400/50 transition-all duration-300 group-hover:scale-110 active:scale-95'>
        <FaWhatsapp className='text-white text-4xl' />
      </div>

      {/* Hover tooltip */}
      <div className='absolute left-[72px] top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md leading-relaxed'>
        {cartCount > 0
          ? `Order ${cartCount} item${cartCount > 1 ? 's' : ''} via WhatsApp`
          : 'Chat with us on WhatsApp'
        }
        <span className='absolute left-[-6px] top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900'></span>
      </div>
    </div>
  )
}

export default Ai

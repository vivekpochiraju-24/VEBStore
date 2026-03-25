import React, { useContext, useState } from 'react'
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
  const [hovered, setHovered] = useState(false)

  const buildWhatsAppMessage = () => {
    const cartProductIds = Object.keys(cartItem || {})
    const userPhone = userData?.phone ? `+91${userData.phone}` : 'Not provided'
    const userName = userData?.name || 'Valued Customer'
    const userEmail = userData?.email || ''
    const supercoins = userData?.supercoins || 0

    const divider = `━━━━━━━━━━━━━━━━━━━━━━━━`

    if (cartProductIds.length === 0) {
      // No cart — general inquiry message
      const featured = products.slice(0, 3)
      const lines = []
      lines.push(`╔═══════════════════════════╗`)
      lines.push(`  💎 *VEBStore — Premium Fashion*`)
      lines.push(`╚═══════════════════════════╝`)
      lines.push(``)
      lines.push(`👋 *Hi VEBStore Team!*`)
      lines.push(``)
      lines.push(`I'm browsing your store and would love to know more!`)
      lines.push(``)
      lines.push(divider)
      lines.push(`👤 *My Details:*`)
      lines.push(`   • Name: *${userName}*`)
      if (userEmail) lines.push(`   • Email: ${userEmail}`)
      lines.push(`   • Contact: *${userPhone}*`)
      lines.push(`   • 💛 Supercoins: ${supercoins}`)
      lines.push(``)
      lines.push(divider)
      lines.push(`🛍️ *I'm interested in your trending picks:*`)
      lines.push(``)
      featured.forEach((p, i) => {
        const icons = ['👗', '👔', '👘']
        lines.push(`${icons[i] || '🧥'} *${p.name}*`)
        lines.push(`   💰 ${currency}${p.price}`)
        if (p.category) lines.push(`   🏷️ ${p.category}`)
        if (p.image?.[0]) lines.push(`   🖼️ Product Image: ${p.image[0]}`)
        lines.push(``)
      })
      lines.push(divider)
      lines.push(``)
      lines.push(`Could you share more details, available sizes, and ongoing offers? 🙏`)
      lines.push(``)
      lines.push(`💜 *Looking forward to shopping with VEBStore!*`)
      return lines.join('\n')
    }

    // Cart order message
    const lines = []
    lines.push(`╔═══════════════════════════╗`)
    lines.push(`  🛒 *VEBStore — New Order Request*`)
    lines.push(`╚═══════════════════════════╝`)
    lines.push(``)
    lines.push(divider)
    lines.push(`👤 *Customer Details:*`)
    lines.push(`   • Name: *${userName}*`)
    if (userEmail) lines.push(`   • Email: ${userEmail}`)
    lines.push(`   • Phone: *${userPhone}*`)
    lines.push(`   • 💛 Supercoins: ${supercoins}`)
    lines.push(``)
    lines.push(divider)
    lines.push(`📦 *Items I Want to Order:*`)
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
        const conditionIcons = ['👗', '👔', '👖', '👘', '🧥']
        const icon = conditionIcons[Math.floor(Math.random() * conditionIcons.length)]
        lines.push(`${icon} *${product.name}*`)
        lines.push(`   📐 Size: *${size}*`)
        lines.push(`   🔢 Qty: *${qty}*`)
        lines.push(`   💰 ${currency}${product.price} × ${qty} = *${currency}${subtotal}*`)
        if (product.category) lines.push(`   🏷️ Category: ${product.category}`)
        if (product.image?.[0]) lines.push(`   🖼️ Product Image: ${product.image[0]}`)
        lines.push(``)
      })
    })

    lines.push(divider)
    lines.push(`💰 *Order Summary:*`)
    lines.push(`   Subtotal: ${currency}${grandTotal}`)
    lines.push(`   🚚 Delivery: ${currency}40`)
    if (supercoins > 0) {
      lines.push(`   💛 Supercoins Available: ${supercoins} (₹${supercoins} discount eligible)`)
    }
    lines.push(`   ✅ *Grand Total: ${currency}${grandTotal + 40}*`)
    lines.push(``)
    lines.push(divider)
    lines.push(``)
    lines.push(`Please confirm stock availability, share payment details, and update me on the delivery timeline.`)
    lines.push(``)
    lines.push(`🙏 *Thank you! Excited to shop with VEBStore* 💜`)

    return lines.join('\n')
  }

  const handleWhatsAppClick = () => {
    if (!userData) {
      toast.warn('Please login to chat with us on WhatsApp! 👤', { autoClose: 3000 })
      navigate('/login')
      return
    }
    if (!userData?.phone) {
      toast.warn('Add your mobile number in Edit Profile first! 📱', { autoClose: 4000 })
      navigate('/profile')
      return
    }

    const message = buildWhatsAppMessage()
    const url = `https://wa.me/${STORE_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const cartCount = Object.keys(cartItem || {}).reduce((acc, id) => {
    return acc + Object.values(cartItem[id] || {}).reduce((s, q) => s + q, 0)
  }, 0)

  return (
    <div
      className='fixed lg:bottom-6 md:bottom-10 bottom-20 left-4 z-50 group cursor-pointer'
      onClick={handleWhatsAppClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={cartCount > 0 ? `Order ${cartCount} item(s) via WhatsApp` : 'Chat with us on WhatsApp'}
    >
      {/* Pulse ring */}
      <span className='absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping'></span>

      {/* Cart count badge */}
      {cartCount > 0 && (
        <div className='absolute -top-1 -right-1 z-10 bg-red-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce'>
          {cartCount}
        </div>
      )}

      {/* WhatsApp button */}
      <div className={`relative flex items-center justify-center w-[60px] h-[60px] bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-xl shadow-green-400/40 transition-all duration-300 ${hovered ? 'scale-110' : 'scale-100'} active:scale-95`}>
        <FaWhatsapp className='text-white text-3xl' />
      </div>

      {/* Hover tooltip */}
      <div className={`absolute left-[72px] top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 pointer-events-none shadow-xl leading-relaxed ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
        <div className='flex items-center gap-2'>
          <FaWhatsapp className='text-green-400' />
          {cartCount > 0
            ? <span>Order <strong>{cartCount} item{cartCount > 1 ? 's' : ''}</strong> via WhatsApp</span>
            : <span>Chat with us · Get fashion advice</span>
          }
        </div>
        <div className='text-gray-400 text-[10px] mt-0.5'>
          {cartCount > 0 ? '📸 Product images included' : '💛 Share your Supercoins too'}
        </div>
        <span className='absolute left-[-6px] top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900'></span>
      </div>
    </div>
  )
}

export default Ai

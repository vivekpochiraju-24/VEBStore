import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/authContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { themeDataContext } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

const ORDER_STEPS = [
  { key: 'Order Placed', label: 'Order Placed', icon: '📦' },
  { key: 'Packing', label: 'Packing', icon: '📋' },
  { key: 'Shipped', label: 'Shipped', icon: '🚚' },
  { key: 'Out for delivery', label: 'Out for Delivery', icon: '🏍️' },
  { key: 'Delivered', label: 'Delivered', icon: '✅' },
]

function TrackingModal({ item, onClose }) {
  const currentIndex = ORDER_STEPS.findIndex(s => s.key === item.status)
  const activeStep = currentIndex === -1 ? 0 : currentIndex

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm' onClick={onClose}>
      <div
        className='w-[95%] max-w-[500px] bg-white rounded-2xl p-6 shadow-2xl border border-gray-100'
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-[22px] text-gray-900 font-bold tracking-tight'>Track Order</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-900 text-[24px] cursor-pointer transition-colors'>✕</button>
        </div>

        {/* Product Info */}
        <div className='flex items-center gap-4 mb-8 bg-gray-50 border border-gray-100 rounded-xl p-3'>
          <img src={item.image1} alt="" className='w-[60px] h-[60px] rounded-lg object-cover' />
          <div>
            <p className='text-gray-800 text-[16px] font-semibold'>{item.name}</p>
            <p className='text-gray-500 text-[13px]'>Size: {item.size} · Qty: {item.quantity}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className='relative pl-4'>
          {ORDER_STEPS.map((step, index) => {
            const isCompleted = index <= activeStep
            const isActive = index === activeStep
            return (
              <div key={step.key} className='flex items-start gap-4 relative'>
                {/* Vertical line */}
                {index < ORDER_STEPS.length - 1 && (
                  <div
                    className='absolute left-[14px] top-[32px] w-[3px] h-[calc(100%-8px)]'
                    style={{
                      background: index < activeStep
                        ? 'linear-gradient(to bottom, #3b82f6, #3b82f6)'
                        : '#e5e7eb'
                    }}
                  />
                )}
                {/* Circle */}
                <div className={`
                  relative z-10 w-[32px] h-[32px] rounded-full flex items-center justify-center text-[14px] shrink-0 transition-all duration-300
                  ${isActive
                    ? 'bg-blue-600 shadow-md shadow-blue-600/30 scale-110 text-white'
                    : isCompleted
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                  }
                `}>
                  {step.icon}
                </div>
                {/* Label */}
                <div className={`pb-8 ${index === ORDER_STEPS.length - 1 ? 'pb-0' : ''}`}>
                  <p className={`text-[15px] font-medium transition-colors ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <p className='text-[12px] text-blue-600 font-semibold mt-1 animate-pulse'>Current Status</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer info */}
        <div className='mt-6 pt-4 border-t border-gray-100 flex items-center justify-between'>
          <p className='text-gray-500 text-[12px] font-medium'>
            Payment: <span className='text-gray-800'>{item.paymentMethod}</span>
          </p>
          <p className='text-gray-500 text-[12px] font-medium'>
            {new Date(item.date).toDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

function ActionModal({ title, placeholder, onSubmit, onClose }) {
  const [reason, setReason] = useState('')
  return (
    <div className='fixed inset-0 z-[10000] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm'>
      <div className='w-[90%] max-w-[400px] bg-white shadow-xl border border-gray-200 rounded-2xl p-6'>
        <h3 className='text-xl text-gray-900 font-bold mb-4'>{title}</h3>
        <textarea
          className='w-full h-[100px] bg-gray-50 border border-gray-300 rounded-xl p-3 text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all'
          placeholder={placeholder}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className='flex items-center justify-end gap-3 mt-6'>
          <button onClick={onClose} className='px-4 py-2 text-gray-500 font-medium hover:text-gray-900 transition-colors'>Cancel</button>
          <button
            onClick={() => onSubmit(reason)}
            disabled={!reason.trim()}
            className='px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all shadow-sm'
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

function Order() {
  const navigate = useNavigate()
  const { isDark } = useContext(themeDataContext)
  const dk = isDark
  const [orderData, setOrderData] = useState([])
  const [trackingItem, setTrackingItem] = useState(null)
  const [actionModal, setActionModal] = useState(null)
  const { currency } = useContext(shopDataContext)
  const { serverUrl } = useContext(authDataContext)

  const loadOrderData = async () => {
    try {
      const result = await axios.post(serverUrl + '/api/order/userorder', {}, { withCredentials: true })
      if (result.data) {
        let allOrdersItem = []
        result.data.forEach((order) => {
          order.items.forEach((item) => {
            item['orderId'] = order._id
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            item['isCancelled'] = order.isCancelled
            item['returnRequest'] = order.returnRequest
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancelOrder = async (reason) => {
    try {
      const result = await axios.post(serverUrl + '/api/order/cancel', { orderId: actionModal.orderId, reason }, { withCredentials: true })
      if (result.status === 200) {
        toast.success("Order Cancelled Successfully")
        setActionModal(null)
        loadOrderData()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancellation Failed")
    }
  }

  const handleReturnExchange = async (reason) => {
    try {
      const result = await axios.post(serverUrl + '/api/order/return-exchange', {
        orderId: actionModal.orderId,
        reason,
        type: actionModal.type
      }, { withCredentials: true })
      if (result.status === 200) {
        toast.success(`${actionModal.type} Requested Successfully`)
        setActionModal(null)
        loadOrderData()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Request Failed")
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [])

  return (
    <div className={`w-full min-h-screen pt-[100px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-32 transition-colors duration-500 ${dk ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      
      {/* Back Button */}
      <div className='w-full pb-6'>
          <button 
            onClick={() => navigate('/profile')}
            className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all p-2 rounded-xl border ${dk ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-gray-100 text-gray-500 hover:text-gray-900 shadow-sm'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path>
            </svg>
            Return to Profile
          </button>
      </div>

      <div className='mb-8'>
        <Title text1={'MY'} text2={'ORDERS'} />
        <p className='text-gray-500 text-sm mt-1'>View and track your previous purchases</p>
      </div>

      <div className='w-full flex flex-col gap-6'>
        {orderData.length === 0 && (
          <div className='text-center py-20 bg-white rounded-2xl border border-gray-200'>
            <p className='text-gray-500 text-lg'>You haven't placed any orders yet.</p>
          </div>
        )}

        {orderData.map((item, index) => {
          const isPending = item.status === 'Order Placed' || item.status === 'Packing'
          const isDelivered = item.status === 'Delivered'
          const isReturnable = isDelivered && (Date.now() - item.date < 7 * 24 * 60 * 60 * 1000)
          const hasReturnRequest = item.returnRequest?.status !== 'None'

          return (
            <div key={index} className='w-full bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow'>
              <div className='flex flex-col md:flex-row items-start gap-6 p-6 relative group'>
                <img src={item.image1} alt="" className='w-24 h-24 sm:w-[130px] sm:h-[130px] rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100' />

                <div className='flex-1 w-full flex flex-col gap-3'>
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                    <p className='text-xl sm:text-2xl text-gray-900 font-bold truncate pr-4'>{item.name}</p>
                    <div className='flex flex-col items-start sm:items-end shrink-0'>
                      <div className='flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100'>
                        <p className={`w-2 h-2 rounded-full ${item.status === 'Cancelled' ? 'bg-red-500' : item.status === 'Delivered' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></p>
                        <p className='text-sm text-gray-700 font-medium'>{item.status}</p>
                      </div>
                      {isReturnable && !hasReturnRequest && (
                        <span className='text-[10px] text-green-700 border border-green-200 px-2 py-0.5 rounded-full mt-2 bg-green-50 font-bold'>✅ Exchange / Return Available</span>
                      )}
                      {isDelivered && !isReturnable && !hasReturnRequest && (
                        <span className='text-[10px] text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full mt-2 bg-gray-50 font-medium'>Return window expired</span>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-4 sm:gap-8 flex-wrap py-2'>
                    <p className='text-xl text-gray-900 font-bold'>{currency}{item.price}</p>
                    <div className='h-4 w-px bg-gray-300 hidden sm:block'></div>
                    <p className='text-gray-500 text-sm'>Quantity: <span className='text-gray-900 font-semibold'>{item.quantity}</span></p>
                    <div className='h-4 w-px bg-gray-300 hidden sm:block'></div>
                    <p className='text-gray-500 text-sm'>Size: <span className='text-gray-900 font-semibold'>{item.size}</span></p>
                  </div>

                  <div className='flex flex-wrap items-center gap-4 sm:gap-6 pb-4 border-b border-gray-100'>
                    <p className='text-sm text-gray-500'>Order Date: <span className='text-gray-900 font-medium'>{new Date(item.date).toDateString()}</span></p>
                    <p className='text-sm text-gray-500'>Payment Method: <span className='text-gray-900 font-medium uppercase'>{item.paymentMethod}</span></p>
                  </div>

                  {/* Return/Exchange Request Status Banner */}
                  {hasReturnRequest && item.returnRequest?.status !== 'None' && (
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                      item.returnRequest.status === 'Requested' ? 'bg-amber-50 border border-amber-200 text-amber-700' :
                      item.returnRequest.status === 'Approved' ? 'bg-green-50 border border-green-200 text-green-700' :
                      'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                      <span>{item.returnRequest.status === 'Requested' ? '⏳' : item.returnRequest.status === 'Approved' ? '✅' : '❌'}</span>
                      <span>{item.returnRequest.type} Request: <strong>{item.returnRequest.status}</strong></span>
                    </div>
                  )}

                  <div className='flex flex-wrap items-center gap-3 pt-2'>
                    <button
                      className='px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm'
                      onClick={() => setTrackingItem(item)}
                    >
                      📦 Track Order
                    </button>

                    {/* Exchange button — always visible for non-cancelled orders */}
                    {item.status !== 'Cancelled' && !hasReturnRequest && (
                      <button
                        className='px-5 py-2.5 rounded-xl bg-purple-600 border border-purple-600 text-white text-sm font-semibold hover:bg-purple-700 active:scale-95 transition-all shadow-md shadow-purple-200'
                        onClick={() => setActionModal({ type: 'Exchange', orderId: item.orderId })}
                      >
                        🔄 Exchange Item
                      </button>
                    )}

                    {isPending && (
                      <button
                        className='px-5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-100 transition-all'
                        onClick={() => setActionModal({ type: 'Cancel', orderId: item.orderId })}
                      >
                        ✕ Cancel Order
                      </button>
                    )}

                    {isReturnable && !hasReturnRequest && (
                      <button
                        className='px-5 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-all'
                        onClick={() => setActionModal({ type: 'Return', orderId: item.orderId })}
                      >
                        ↩ Return Order
                      </button>
                    )}

                    {/* Show request status if already submitted */}
                    {hasReturnRequest && item.returnRequest?.status !== 'None' && (
                      <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                        item.returnRequest.status === 'Requested' ? 'bg-amber-50 border border-amber-200 text-amber-700' :
                        item.returnRequest.status === 'Approved' ? 'bg-green-50 border border-green-200 text-green-700' :
                        'bg-red-50 border border-red-200 text-red-700'
                      }`}>
                        {item.returnRequest.status === 'Requested' ? '⏳' : item.returnRequest.status === 'Approved' ? '✅' : '❌'} {item.returnRequest.type}: {item.returnRequest.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {trackingItem && <TrackingModal item={trackingItem} onClose={() => setTrackingItem(null)} />}

      {actionModal && (
        <ActionModal
          title={actionModal.type === 'Cancel' ? 'Cancel Order' : `Request ${actionModal.type}`}
          placeholder={actionModal.type === 'Cancel' ? 'Reason for cancellation...' : `Reason for ${actionModal.type.toLowerCase()}...`}
          onClose={() => setActionModal(null)}
          onSubmit={actionModal.type === 'Cancel' ? handleCancelOrder : handleReturnExchange}
        />
      )}
    </div>
  )
}

export default Order

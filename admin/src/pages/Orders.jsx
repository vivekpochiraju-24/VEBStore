import React, { useState, useContext, useEffect } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import { themeDataContext } from '../context/ThemeContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Package, Truck, CheckCircle2, XCircle, AlertCircle, Phone, MapPin, Calendar, CreditCard, ChevronRight, Mail, RefreshCw } from 'lucide-react'

function Orders() {
  const [orders, setOrders] = useState([])
  const { serverUrl } = useContext(authDataContext)
  const { isDark } = useContext(themeDataContext)
  const dk = isDark

  const fetchAllOrders = async () => {
    try {
      const result = await axios.post(serverUrl + '/api/order/list', {}, { withCredentials: true })
      setOrders(result.data.reverse())
    } catch (error) {
      console.error("Fetch orders error", error)
      toast.error("Failed to load orders")
    }
  }

  const statusHandler = async (e, orderId) => {
    try {
      const result = await axios.post(serverUrl + '/api/order/status', { orderId, status: e.target.value }, { withCredentials: true })
      if (result.data) {
        toast.success(`Order status updated to ${e.target.value}`)
        await fetchAllOrders()
      }
    } catch (error) {
      console.error("Status update error", error)
      toast.error("Failed to update status")
    }
  }

  const handleReturnRequest = async (orderId, status) => {
    try {
      const result = await axios.post(serverUrl + '/api/order/handle-return', { orderId, status }, { withCredentials: true })
      if (result.data) {
        toast.success(`Return request ${status.toLowerCase()}`)
        await fetchAllOrders()
      }
    } catch (error) {
      console.error("Handle return error", error)
      toast.error("Failed to handle request")
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  return (
    <div className={`w-full min-h-screen flex flex-col transition-colors duration-500 ${dk ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <Nav />
      <div className='flex flex-1'>
        <Sidebar />

        <main className={`flex-1 p-6 lg:ml-[280px] mt-20 pb-20 transition-all duration-500`}>

          {/* Header */}
          <div className='mb-10'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='p-2 bg-blue-600 shadow-lg shadow-blue-600/20 text-white rounded-lg'>
                <Truck size={20} />
              </div>
              <h1 className={`text-3xl font-black tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>Order Management</h1>
            </div>
            <p className={`text-sm font-medium ${dk ? 'text-slate-500' : 'text-gray-500'}`}>Fulfill requests, track shipments, and manage returns.</p>
          </div>

          <div className='flex flex-col gap-6 animate-fade-in-up'>
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order._id} className={`rounded-[32px] border overflow-hidden transition-all duration-300 hover:shadow-2xl ${dk ? 'bg-[#1e293b] border-slate-800 shadow-black/20 hover:shadow-black/40' : 'bg-white border-gray-100 shadow-gray-200/20 hover:shadow-gray-300/30'} ${order.status === 'Cancelled' ? 'opacity-75 grayscale-[0.2]' : ''}`}>

                  {/* Card Top: Header Info */}
                  <div className='p-6 sm:p-8 flex flex-col lg:flex-row gap-8'>

                    {/* Icon & ID */}
                    <div className='flex items-start gap-4 shrink-0'>
                      <div className={`p-4 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${getStatusIconBg(order.status, dk)}`}>
                        {getStatusIcon(order.status, dk)}
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${dk ? 'text-blue-400' : 'text-blue-600'}`}>Order Reference</p>
                        <h3 className={`text-sm font-black font-mono tracking-tighter ${dk ? 'text-white' : 'text-gray-900'}`}>#{order._id.slice(-10).toUpperCase()}</h3>
                        <p className={`text-xs mt-1 flex items-center gap-1.5 font-bold ${dk ? 'text-slate-500' : 'text-gray-400'}`}>
                          <Calendar size={12} />
                          {new Date(order.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </p>
                      </div>
                    </div>

                    {/* Customer & Address */}
                    <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-8'>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Recipient Information</p>
                        <div className='flex items-start gap-3'>
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-xs shrink-0 uppercase border transition-all ${dk ? 'bg-slate-800 border-slate-700 text-blue-400' : 'bg-gray-50 border-gray-100 text-blue-600'}`}>
                            {order.address.firstName[0]}{order.address.lastName[0]}
                          </div>
                          <div className='min-w-0'>
                            <p className={`text-[15px] font-black leading-tight mb-1 truncate ${dk ? 'text-slate-100' : 'text-gray-900'}`}>{order.address.firstName} {order.address.lastName}</p>
                            <div className='flex flex-col gap-1 mt-1'>
                              <p className={`text-[11px] flex items-center gap-1.5 font-black truncate ${dk ? 'text-slate-400' : 'text-gray-500'}`}>
                                <Mail size={12} className={dk ? 'text-slate-600' : 'text-gray-400'} /> {order.address.email || "No Email"}
                              </p>
                              <p className='text-[11px] text-blue-500 flex items-center gap-1.5 font-black'>
                                <Phone size={12} /> {order.address.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Shipping Destination</p>
                        <div className='flex items-start gap-3'>
                          <MapPin size={18} className={`mt-0.5 shrink-0 ${dk ? 'text-slate-600' : 'text-gray-300'}`} />
                          <p className={`text-xs leading-relaxed font-bold ${dk ? 'text-slate-400' : 'text-gray-600'}`}>
                            {order.address.street}, {order.address.city},<br />
                            {order.address.state}, {order.address.country} - {order.address.pinCode}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className={`shrink-0 lg:border-l lg:pl-8 flex flex-col justify-between ${dk ? 'border-slate-800' : 'border-gray-50'}`}>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Financial Status</p>
                        <div className='flex items-center gap-2 mb-2'>
                          <CreditCard size={14} className={dk ? 'text-slate-600' : 'text-gray-400'} />
                          <span className={`text-[11px] font-black uppercase tracking-tight ${dk ? 'text-slate-300' : 'text-gray-700'}`}>{order.paymentMethod}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className={`w-2 h-2 rounded-full ${order.payment ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'}`}></div>
                          <span className={`text-[10px] font-black uppercase ${order.payment ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {order.payment ? 'Verified' : 'Pending Capture'}
                          </span>
                        </div>
                      </div>
                      <div className='mt-4'>
                        <p className={`text-3xl font-black tracking-tighter ${dk ? 'text-blue-400' : 'text-blue-600'}`}>₹{order.amount}</p>
                      </div>
                    </div>

                  </div>

                  {/* Card Bottom: Line Items & Actions */}
                  <div className={`border-t p-6 sm:px-8 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-500 ${dk ? 'bg-slate-900/40 border-slate-800' : 'bg-gray-50/50 border-gray-50'}`}>
                    <div className='flex-1 flex flex-wrap items-center gap-3'>
                      <p className={`text-[10px] font-black uppercase tracking-widest hidden sm:block mr-2 ${dk ? 'text-slate-600' : 'text-gray-400'}`}>Items ({order.items.length})</p>
                      {order.items.map((item, i) => (
                        <div key={i} className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 transition-all ${dk ? 'bg-slate-800 border-slate-700 shadow-black/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                          <div className={`w-6 h-6 flex items-center justify-center rounded-md font-black text-[10px] ${dk ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            {item.quantity}
                          </div>
                          <div className='flex flex-col'>
                            <span className={`text-[11px] font-black truncate max-w-[150px] leading-none mb-0.5 ${dk ? 'text-slate-200' : 'text-gray-900'}`}>{item.name}</span>
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${dk ? 'text-slate-500' : 'text-gray-400'}`}>Size: {item.size}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className='flex items-center gap-4 w-full md:w-auto shrink-0'>
                      <div className='relative flex-1 md:flex-none'>
                        <select
                          value={order.status}
                          className={`w-full h-12 px-5 pr-12 rounded-2xl text-[11px] font-black uppercase tracking-widest appearance-none cursor-pointer focus:ring-4 outline-none transition-all shadow-xl hover:scale-105 active:scale-95 ${dk ? 'bg-slate-800 border-slate-700/50 text-white focus:ring-blue-500/10' : 'bg-white border-gray-100 text-gray-900 focus:ring-blue-500/10'} ${getStatusColorClass(order.status, dk)}`}
                          onChange={(e) => statusHandler(e, order._id)}
                        >
                          {['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled', 'Return Requested', 'Exchange Requested', 'Refunded', 'Exchange Processed', 'Return/Exchange Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronRight size={14} className='absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-blue-500 pointer-events-none' />
                      </div>
                    </div>
                  </div>

                  {/* Special Status Banners */}
                  {order.status === 'Cancelled' && (
                    <div className={`border-t p-4 flex items-center gap-3 ${dk ? 'bg-rose-950/20 border-rose-900/30 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                      <XCircle size={18} className='shrink-0' />
                      <p className='text-xs font-bold'>
                        <span className='uppercase mr-2 tracking-tight opacity-50'>Cancellation Reason:</span>
                        {order.cancellationReason || "Standard cancellation applied."}
                      </p>
                    </div>
                  )}

                  {order.returnRequest?.status === 'Requested' && (
                    <div className={`border-t p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${dk ? 'bg-blue-950/20 border-blue-900/30' : 'bg-blue-50 border-blue-100'}`}>
                      <div className='flex items-center gap-4'>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${dk ? 'bg-blue-900/40' : 'bg-white shadow-sm'}`}>
                          <RefreshCw size={24} className='text-blue-500 animate-spin-slow' />
                        </div>
                        <div>
                          <p className={`text-xs font-black uppercase tracking-[0.2em] mb-1 ${dk ? 'text-blue-400' : 'text-blue-800'}`}>{order.returnRequest.type} REQUESTED</p>
                          <p className={`text-xs font-bold ${dk ? 'text-slate-400' : 'text-blue-600/80'}`}>Reason: {order.returnRequest.reason}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <button
                          onClick={() => handleReturnRequest(order._id, 'Approved')}
                          className={`flex-1 sm:flex-none h-12 px-8 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg ${dk ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'}`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReturnRequest(order._id, 'Rejected')}
                          className={`flex-1 sm:flex-none h-12 px-8 font-black text-[10px] uppercase tracking-widest rounded-xl border transition-all active:scale-95 ${dk ? 'bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800' : 'bg-white border-rose-100 text-rose-600 hover:bg-rose-50'}`}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))
            ) : (
              <div className={`py-32 rounded-[32px] border border-dashed flex flex-col items-center justify-center text-center transition-all ${dk ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${dk ? 'bg-slate-800/50 text-slate-600' : 'bg-gray-50 text-gray-300'}`}>
                  <Package size={48} />
                </div>
                <h3 className={`text-2xl font-black mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>No orders logged yet</h3>
                <p className={`text-sm font-medium ${dk ? 'text-slate-500' : 'text-gray-500'}`}>When customers start checkout, their orders will appear here.</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

function getStatusIcon(status, dk) {
  const iconProps = { size: 24, className: 'transition-colors' }
  switch (status) {
    case 'Delivered': return <CheckCircle2 {...iconProps} className={dk ? 'text-emerald-400' : 'text-emerald-600'} />;
    case 'Cancelled': return <XCircle {...iconProps} className={dk ? 'text-rose-400' : 'text-rose-600'} />;
    case 'Shipped': return <Truck {...iconProps} className={dk ? 'text-purple-400' : 'text-purple-600'} />;
    case 'Out for delivery': return <Package {...iconProps} className={dk ? 'text-blue-400' : 'text-blue-600'} />;
    default: return <Package {...iconProps} className={dk ? 'text-amber-400' : 'text-amber-600'} />;
  }
}

function getStatusIconBg(status, dk) {
  switch (status) {
    case 'Delivered': return dk ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50';
    case 'Cancelled': return dk ? 'bg-rose-950/40 text-rose-400' : 'bg-rose-50';
    case 'Shipped': return dk ? 'bg-purple-950/40 text-purple-400' : 'bg-purple-50';
    case 'Out for delivery': return dk ? 'bg-blue-950/40 text-blue-400' : 'bg-blue-50';
    default: return dk ? 'bg-amber-950/40 text-amber-400' : 'bg-amber-50';
  }
}

function getStatusColorClass(status, dk) {
  switch (status) {
    case 'Delivered': return dk ? 'text-emerald-400' : 'text-emerald-600';
    case 'Cancelled': return dk ? 'text-rose-400' : 'text-rose-600';
    case 'Shipped': return dk ? 'text-purple-400' : 'text-purple-600';
    case 'Out for delivery': return dk ? 'text-blue-400' : 'text-blue-600';
    case 'Return Requested':
    case 'Exchange Requested': return dk ? 'text-amber-400 bg-amber-950/30 animate-pulse' : 'text-amber-600 bg-amber-50 animate-pulse';
    default: return dk ? 'text-amber-400' : 'text-amber-600';
  }
}

export default Orders

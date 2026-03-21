import React, { useState, useEffect, useContext } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { ShoppingBag, Users, Package, RefreshCcw, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

function Home() {
  const [stats, setStats] = useState({
    totals: { totalProducts: 0, totalCustomers: 0, totalOrders: 0, returnsCancellations: 0 },
    recentOrders: [],
    chartData: []
  })
  const { serverUrl } = useContext(authDataContext)

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/order/dashboard-stats`, { withCredentials: true })
      setStats(response.data)
    } catch (err) {
      console.error("Dashboard data error", err)
    }
  }

  useEffect(() => {
    if (serverUrl) {
      fetchDashboardData()
    }
  }, [serverUrl])

  return (
    <div className='w-full min-h-screen bg-[#f8fafc] flex flex-col'>
      <Nav />
      <div className='flex flex-1'>
        <Sidebar />

        <main className='flex-1 p-6 lg:ml-[280px] mt-20 pb-20'>

          {/* Header Section */}
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10'>
            <div className='flex items-center gap-3'>
              <div className='p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 text-white'>
                <TrendingUp size={24} />
              </div>
              <div>
                <h1 className='text-3xl font-extrabold text-gray-900 leading-tight'>Business Overview</h1>
                <p className='text-gray-500 text-sm font-medium flex items-center gap-1.5'>
                  <Calendar size={14} />
                  Insights for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <button
              onClick={fetchDashboardData}
              className='flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm'
            >
              Refresh Data
            </button>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10 animate-fade-in-up'>
            <StatCard title="Total Products" value={stats.totals.totalProducts} icon={<Package size={22} />} color="text-blue-600" bg="bg-blue-50" />
            <StatCard title="Total Customers" value={stats.totals.totalCustomers} icon={<Users size={22} />} color="text-purple-600" bg="bg-purple-50" />
            <StatCard title="Total Orders" value={stats.totals.totalOrders} icon={<ShoppingBag size={22} />} color="text-emerald-600" bg="bg-emerald-50" />
            <StatCard title="Returns/Cancels" value={stats.totals.returnsCancellations} icon={<RefreshCcw size={22} />} color="text-rose-600" bg="bg-rose-50" />
          </div>

          {/* Charts Row */}
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10'>
            <div className='bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 animate-fade-in-up delay-100'>
              <div className='flex items-center justify-between mb-8'>
                <h3 className='text-lg font-bold text-gray-900'>Sales Performance</h3>
                <span className='px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-wider'>Revenue (INR)</span>
              </div>
              <div className='h-[350px]'>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontWeight={600} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className='bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 animate-fade-in-up delay-100'>
              <div className='flex items-center justify-between mb-8'>
                <h3 className='text-lg font-bold text-gray-900'>Order Volumes</h3>
                <span className='px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider'>Transactions</span>
              </div>
              <div className='h-[350px]'>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontWeight={600} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className='bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden animate-fade-in-up delay-200'>
            <div className='p-6 border-b border-gray-50 flex justify-between items-center'>
              <h3 className='text-lg font-bold text-gray-900'>Recent Submissions</h3>
              <button
                onClick={() => window.location.href = '/orders'}
                className='text-blue-600 text-xs font-bold hover:underline flex items-center gap-1'
              >
                View Full Log <ArrowUpRight size={14} />
              </button>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-left'>
                <thead>
                  <tr className='bg-gray-50 text-gray-400 text-[10px] font-extrabold uppercase tracking-widest'>
                    <th className='px-8 py-4'>Product / Order ID</th>
                    <th className='px-8 py-4'>Customer Name</th>
                    <th className='px-8 py-4'>Value</th>
                    <th className='px-8 py-4 text-center'>Fulfillment Status</th>
                    <th className='px-8 py-4 text-right'>Timeline</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-50'>
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className='hover:bg-gray-50 transition-colors group'>
                      <td className='px-8 py-5'>
                        <div className='flex flex-col'>
                          <span className='text-xs font-bold text-gray-900 mb-0.5 line-clamp-1 truncate'>
                            {order.items?.[0]?.name || 'Fashion Item'}
                          </span>
                          <span className='text-[10px] font-medium text-gray-400 font-mono tracking-tight'>
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className='px-8 py-5'>
                        <div className='flex items-center gap-2'>
                          <div className='w-7 h-7 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold'>
                            {order.address.firstName[0]}
                          </div>
                          <span className='text-xs font-bold text-gray-700 whitespace-nowrap'>
                            {order.address.firstName} {order.address.lastName}
                          </span>
                        </div>
                      </td>
                      <td className='px-8 py-5'>
                        <span className='text-sm font-extrabold text-blue-600'>₹{order.amount}</span>
                      </td>
                      <td className='px-8 py-5 text-center px-4'>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-tighter ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className='px-8 py-5 text-right'>
                        <span className='text-xs font-semibold text-gray-400'>{new Date(order.date).toLocaleDateString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color, bg }) {
  return (
    <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/20 hover:shadow-xl hover:shadow-gray-200/40 transition-all group cursor-default'>
      <div className='flex items-center gap-5'>
        <div className={`${bg} ${color} w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
          {icon}
        </div>
        <div>
          <p className='text-gray-400 text-xs font-bold uppercase tracking-wider mb-1'>{title}</p>
          <div className='flex items-baseline gap-2'>
            <p className='text-2xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight'>{value}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function getStatusColor(status) {
  switch (status) {
    case 'Delivered': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    case 'Cancelled': return 'bg-rose-50 text-rose-600 border border-rose-100';
    case 'Processing': return 'bg-blue-50 text-blue-600 border border-blue-100';
    case 'Shipped': return 'bg-purple-50 text-purple-600 border border-purple-100';
    default: return 'bg-amber-50 text-amber-600 border border-amber-100';
  }
}

export default Home

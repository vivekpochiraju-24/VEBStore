import React, { useContext } from 'react'
import { ShieldCheck, Truck, Headphones, RefreshCw } from 'lucide-react'
import { themeDataContext } from '../context/ThemeContext'

function OurPolicy() {
  const { isDark } = useContext(themeDataContext)
  const dk = isDark

  const policies = [
    { icon: <RefreshCw size={32} strokeWidth={1.5} />, title: "Easy Exchange", desc: "Hassle-free size & style swaps within 15 days." },
    { icon: <ShieldCheck size={32} strokeWidth={1.5} />, title: "7 Days Return", desc: "No-questions-asked quick return & refund process." },
    { icon: <Headphones size={32} strokeWidth={1.5} />, title: "24/7 Support", desc: "Dedicated concierge for all your styling queries." },
    { icon: <Truck size={32} strokeWidth={1.5} />, title: "Fast Shipping", desc: "Premium packaging delivered right to your doorstep." }
  ]

  return (
    <div className={`py-24 px-4 sm:px-10 transition-colors duration-300 ${dk ? 'bg-[#0f172a]' : 'bg-white'}`}>
      <div className='max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4'>
        {policies.map((policy, index) => (
          <div key={index} className='flex flex-col items-center text-center group cursor-default'>
            <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center mb-6 border group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-600/30 group-hover:border-transparent transition-all duration-500 group-hover:-translate-y-2 ${dk ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
              {policy.icon}
            </div>
            <h3 className={`text-[15px] font-bold mb-2 uppercase tracking-widest ${dk ? 'text-slate-100' : 'text-gray-900'}`}>{policy.title}</h3>
            <p className={`text-[13px] font-medium leading-relaxed max-w-[200px] ${dk ? 'text-slate-400' : 'text-gray-400'}`}>{policy.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OurPolicy

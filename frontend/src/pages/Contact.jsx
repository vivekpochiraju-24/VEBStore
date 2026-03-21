import React, { useContext } from 'react'
import Title from '../component/Title'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { themeDataContext } from '../context/ThemeContext'

function Contact() {
  const { isDark } = useContext(themeDataContext)
  const dk = isDark

  const contactInfo = [
    { icon: <Mail className='text-blue-500' />, label: 'Email Support', value: 'support@vebstore.com' },
    { icon: <Phone className='text-blue-500' />, label: 'Call Directly', value: '+91 9603673436' },
    { icon: <MapPin className='text-blue-500' />, label: 'Our HQ', value: 'B-Hub, Mumbai, India' }
  ]

  return (
    <div className={`w-full min-h-screen pt-[120px] pb-24 px-6 sm:px-[10vw] transition-colors duration-300 ${dk ? 'bg-[#0f172a]' : 'bg-white'}`}>
      
      <div className='max-w-6xl mx-auto'>
        <div className='text-3xl text-center mb-16'>
          <Title text1={'CONTACT'} text2={'THE HUB'} />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
          <div className='space-y-12'>
            <div className='space-y-6'>
              <h2 className={`text-4xl font-black leading-tight ${dk ? 'text-white' : 'text-gray-900'}`}>Get in touch with our concierge.</h2>
              <p className={`text-lg font-medium leading-relaxed ${dk ? 'text-slate-400' : 'text-gray-600'}`}>
                Have a question or need assistance? Our team is dedicated to providing you with the best support possible.
              </p>
            </div>

            <div className='space-y-6'>
              {contactInfo.map((info, index) => (
                <div key={index} className={`flex items-center gap-6 p-6 rounded-[28px] border transition-all ${dk ? 'bg-[#1e293b] border-slate-700/50 hover:bg-[#202c41]' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-xl'}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dk ? 'bg-slate-800' : 'bg-white'}`}>
                    {info.icon}
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase font-black tracking-widest leading-none mb-1.5 ${dk ? 'text-slate-500' : 'text-gray-400'}`}>{info.label}</p>
                    <p className={`text-lg font-extrabold ${dk ? 'text-white' : 'text-gray-900'}`}>{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-10 rounded-[40px] border shadow-2xl ${dk ? 'bg-[#1e293b] border-slate-700/50 shadow-black/20' : 'bg-white border-gray-100 shadow-gray-200/40'}`}>
            <h3 className={`text-2xl font-black mb-8 ${dk ? 'text-white' : 'text-gray-900'}`}>Drop us a message.</h3>
            <form className='space-y-6'>
              <div className='space-y-2'>
                <label className={`text-sm font-bold block ${dk ? 'text-slate-400' : 'text-gray-700'}`}>Your Name</label>
                <input 
                  type="text" 
                  className={`w-full h-14 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/30 border transition-all ${dk ? 'bg-[#0f172a] border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'}`} 
                  placeholder='Enter your name'
                />
              </div>
              <div className='space-y-2'>
                <label className={`text-sm font-bold block ${dk ? 'text-slate-400' : 'text-gray-700'}`}>Email Address</label>
                <input 
                  type="email" 
                  className={`w-full h-14 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/30 border transition-all ${dk ? 'bg-[#0f172a] border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'}`} 
                  placeholder='Enter your email address'
                />
              </div>
              <div className='space-y-2'>
                <label className={`text-sm font-bold block ${dk ? 'text-slate-400' : 'text-gray-700'}`}>Your Message</label>
                <textarea 
                  className={`w-full h-32 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/30 border transition-all resize-none ${dk ? 'bg-[#0f172a] border-slate-700 text-white placeholder:text-slate-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'}`} 
                  placeholder='Tell us how we can help you today...'
                ></textarea>
              </div>
              <button 
                type="submit" 
                className={`w-full h-14 font-black text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${dk ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30' : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/30'}`}
              >
                Send Message <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

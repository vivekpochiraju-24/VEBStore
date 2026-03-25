import React from 'react'
import logo from "../assets/logo.png"
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

function Footer() {
  return (
    <footer className='bg-[#0f172a] text-white pt-24 pb-12 overflow-hidden relative'>

      {/* Background Glow */}
      <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64'></div>

      <div className='max-w-7xl mx-auto px-6 lg:px-12 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20'>

          {/* Brand & Mission */}
          <div className='space-y-8'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-white rounded-2xl shadow-xl'>
                <img src={logo} alt="VEBStore Logo" className='w-10 h-10 object-contain' />
              </div>
              <div>
                <h1 className='text-2xl font-black tracking-tighter'>VEBStore</h1>
                <p className='text-[10px] font-extrabold text-blue-400 uppercase tracking-[0.2em]'>Premium Fashion Platform</p>
              </div>
            </div>
            <p className='text-gray-400 text-sm leading-7 font-medium'>
              Elevating your daily style with curated collections that bridge the gap between timeless elegance and modern trends. Join the fashion revolution.
            </p>
            <div className='flex gap-4'>
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <div key={i} className='w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-all cursor-pointer group'>
                  <Icon size={18} className='text-gray-400 group-hover:text-white transition-colors' />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className='lg:col-span-2 grid grid-cols-2 gap-8'>
              <div className='space-y-6'>
                <h3 className='text-sm font-black uppercase tracking-widest text-white/50'>Collections</h3>
                <ul className='space-y-4'>
                  {['Men Edition', 'Women Luxe', 'Kids Play'].map(link => (
                    <li key={link}>
                      <a href="/products" className='text-sm text-gray-400 hover:text-white font-semibold transition-all flex items-center gap-2 group'>
                        <span className='w-0 group-hover:w-4 h-[1.5px] bg-blue-600 transition-all duration-300'></span>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='space-y-6'>
                <h3 className='text-sm font-black uppercase tracking-widest text-white/50'>Company</h3>
                <ul className='space-y-4'>
                  {['About Story', 'Contact Hub'].map(link => (
                    <li key={link}>
                      <a href={`/${link.split(' ')[0].toLowerCase()}`} className='text-sm text-gray-400 hover:text-white font-semibold transition-all flex items-center gap-2 group'>
                        <span className='w-0 group-hover:w-4 h-[1.5px] bg-blue-600 transition-all duration-300'></span>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
          </div>

          {/* Contact Details */}
          <div className='space-y-8'>
            <h3 className='text-sm font-black uppercase tracking-widest text-white/50'>Our HQ Portal</h3>
            <div className='space-y-6'>
              <div className='flex items-center gap-4'>
                  <Phone size={16} className='text-blue-500' />
                  <p className='text-sm font-extrabold text-white'>+91 9603673436</p>
              </div>
              <div className='flex items-center gap-4'>
                  <Mail size={16} className='text-blue-500' />
                  <p className='text-sm font-extrabold text-white'>support@vebstore.com</p>
              </div>
              <div className='flex items-center gap-4'>
                  <MapPin size={16} className='text-blue-500' />
                  <p className='text-sm font-extrabold text-white'>B-Hub, Mumbai, India</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className='pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8'>
          <div className='flex items-center gap-6'>
            <p className='text-xs font-bold text-gray-500'>&copy; 2026 VEBStore. All rights reserved.</p>
            <div className='hidden sm:flex gap-6'>
              <span className='text-[10px] font-bold text-gray-600 hover:text-white cursor-pointer uppercase tracking-widest'>Security</span>
              <span className='text-[10px] font-bold text-gray-600 hover:text-white cursor-pointer uppercase tracking-widest'>Privacy</span>
            </div>
          </div>
          <div className='flex items-center gap-2 group cursor-pointer'>
            <span className='text-xs font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-blue-500 transition-colors'>Back to top</span>
            <div className='w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-blue-500 transition-colors'>
              <ArrowRight size={14} className='-rotate-90 group-hover:text-blue-500' />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

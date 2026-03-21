import React, { useContext } from 'react'
import Title from '../component/Title'
import logo from '../assets/logo.png'
import { themeDataContext } from '../context/ThemeContext'

function About() {
  const { isDark } = useContext(themeDataContext)
  const dk = isDark

  return (
    <div className={`w-full min-h-screen pt-[120px] pb-24 px-6 sm:px-[10vw] transition-colors duration-300 ${dk ? 'bg-[#0f172a]' : 'bg-white'}`}>
      
      <div className='max-w-6xl mx-auto'>
        <div className='text-2xl text-center mb-12'>
          <Title text1={'ABOUT'} text2={'US'} />
        </div>

        <div className='flex flex-col md:flex-row gap-16 items-center'>
          <div className='w-full md:w-1/2 relative group'>
            <div className={`absolute inset-0 rounded-[40px] blur-3xl opacity-20 transition-all duration-500 group-hover:opacity-30 ${dk ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
            <img 
              className='w-full rounded-[40px] shadow-2xl relative z-10 border border-white/10' 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
              alt="About VEBStore" 
            />
          </div>

          <div className='w-full md:w-1/2 flex flex-col gap-8'>
            <div className='space-y-4'>
              <h2 className={`text-3xl font-black tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>Our Signature Story</h2>
              <div className='w-20 h-1.5 bg-blue-600 rounded-full'></div>
            </div>
            
            <p className={`text-lg leading-relaxed font-medium ${dk ? 'text-slate-400' : 'text-gray-600'}`}>
              VEBStore was born out of a passion for innovation and a relentless desire to redefine the modern shopping experience. We started with a simple idea: to provide a platform where style meets substance, and where every customer feels like a priority.
            </p>
            <p className={`text-lg leading-relaxed font-medium ${dk ? 'text-slate-400' : 'text-gray-600'}`}>
              Since our inception, we’ve worked tirelessly to curate a selection of high-quality products that cater to diverse tastes and preferences. From fashion and electronics to home essentials, we bring the best of the world to your fingertips.
            </p>
          </div>
        </div>

        <div className='mt-32 text-2xl text-center mb-16'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            { title: "Quality Assurance", desc: "We meticulously select and vet each product to ensure it meets our stringent quality standards." },
            { title: "Convenience", desc: "With our user-friendly interface and hassle-free ordering process, shopping has never been easier." },
            { title: "Exceptional Support", desc: "Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority." }
          ].map((item, index) => (
            <div key={index} className={`p-10 rounded-[32px] border transition-all duration-300 hover:-translate-y-2 ${dk ? 'bg-[#1e293b] border-slate-700/50 hover:border-blue-500/50' : 'bg-gray-50 border-gray-100 hover:border-blue-200'}`}>
              <h4 className={`text-lg font-black mb-4 ${dk ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
              <p className={`text-sm leading-7 font-medium ${dk ? 'text-slate-400' : 'text-gray-500'}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About

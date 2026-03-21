import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaCircle } from "react-icons/fa";
import { themeDataContext } from '../context/ThemeContext'

function Hero({ heroData, heroCount, setHeroCount }) {
  const { isDark } = useContext(themeDataContext)
  const dk = isDark

  return (
    <div className='w-full max-w-xl flex flex-col gap-6'>

      {/* Dynamic Text Box */}
      <div className='flex flex-col gap-6 animate-fade-in'>
        <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>
          {heroData.text1}
        </h1>
        <p className={`text-xl sm:text-2xl font-medium border-l-[6px] border-blue-500 pl-4 py-1 ${dk ? 'text-slate-300' : 'text-gray-600'}`}>
          {heroData.text2}
        </p>
      </div>

      {/* Call to Action */}
      <div className='mt-8'>
        <Link to='/collections'>
          <button className={`px-10 py-5 font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-xl active:scale-95 text-base sm:text-lg tracking-wide ${dk ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30' : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/20'}`}>
            SHOP COLLECTION
          </button>
        </Link>
      </div>

      {/* Slider Navigation Dots */}
      <div className='flex items-center gap-3 mt-10'>
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            onClick={() => setHeroCount(index)}
            className='py-2 cursor-pointer group flex items-center justify-center'
          >
            <div className={`transition-all duration-300 rounded-full ${heroCount === index ? "w-8 h-2.5 bg-blue-500 shadow-md" : `w-3 h-3 ${dk ? 'bg-slate-600 group-hover:bg-slate-400' : 'bg-gray-300 group-hover:bg-gray-500'}`}`} />
          </button>
        ))}
      </div>

    </div>
  )
}

export default Hero

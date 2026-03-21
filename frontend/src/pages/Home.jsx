import React, { useContext, useEffect, useState } from 'react'
import Backgound from '../component/Backgound'
import Hero from '../component/Hero'
import Product from './Product'
import OurPolicy from '../component/OurPolicy'
import NewLetterBox from '../component/NewLetterBox'
import Footer from '../component/Footer'
import { themeDataContext } from '../context/ThemeContext'

function Home() {
  const { isDark } = useContext(themeDataContext)
  const heroData = [
    { text1: "30% OFF Limited Offer", text2: "Style that speaks for itself." },
    { text1: "Discover the Best of Bold Fashion", text2: "Limited Time Only!" },
    { text1: "Explore Our Best Collection", text2: "Shop the latest trends now!" },
    { text1: "Choose your Perfect Fashion Fit", text2: "Now on Sale!" }
  ]

  const [heroCount, setHeroCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount(prev => (prev === 3 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`w-full overflow-x-hidden flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#0f172a]' : 'bg-white'}`}>

      {/* Hero Section */}
      <div className={`w-full min-h-screen flex flex-col lg:flex-row items-center justify-between gap-8 pt-[80px] pb-10 lg:py-0 px-6 sm:px-12 lg:px-[8vw] transition-all duration-300 ${isDark ? 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>

        {/* Left — Copy */}
        <div className='w-full lg:w-1/2 flex items-center justify-center lg:justify-start py-10 lg:py-24'>
          <Hero
            heroCount={heroCount}
            setHeroCount={setHeroCount}
            heroData={heroData[heroCount]}
          />
        </div>

        {/* Right — Image Showcase */}
        <div className='w-full lg:w-1/2 flex items-center justify-center lg:justify-end py-6 lg:py-24'>
          <Backgound heroCount={heroCount} />
        </div>

      </div>

      {/* Remaining Page Sections */}
      <div className='w-full'>
        <Product />
        <OurPolicy />
        <NewLetterBox />
        <Footer />
      </div>

    </div>
  )
}

export default Home

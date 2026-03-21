import React from 'react'
import back1 from "../assets/back1.jpg"
import back2 from "../assets/back2.jpg"
import back3 from "../assets/back3.jpg"
import back4 from "../assets/back4.jpg"

function Backgound({ heroCount }) {
   const images = [back2, back1, back3, back4]

   return (
      <div className='relative flex items-center justify-center w-full h-full'>
         {/* Decorative background circles */}
         <div className='absolute w-[380px] h-[380px] bg-blue-100 rounded-full opacity-50 top-[10%] right-[5%]'></div>
         <div className='absolute w-[200px] h-[200px] bg-blue-50 rounded-full opacity-80 bottom-[8%] right-[25%]'></div>

         {/* Image Card */}
         <div className='relative z-10 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] h-[420px] sm:h-[460px] md:h-[500px] lg:h-[520px] rounded-[32px] overflow-hidden shadow-2xl shadow-blue-200/60 border-4 border-white'>
            <img
               src={images[heroCount]}
               alt="Fashion Collection"
               key={heroCount}
               className='w-full h-full object-cover object-top'
            />
            {/* Subtle Badge */}
            <div className='absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center justify-between shadow'>
               <span className='text-gray-900 font-bold text-sm'>New Arrivals</span>
               <span className='bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full'>Shop Now</span>
            </div>
         </div>
      </div>
   )
}

export default Backgound

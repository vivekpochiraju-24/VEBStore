import React from 'react'

function Title({ text1, text2 }) {
  return (
    <div className='inline-flex flex-col mb-8 group'>
      <div className='flex gap-3 items-center text-[28px] sm:text-[35px] md:text-[42px] font-heading leading-tight'>
        <p className='text-gray-900 font-extrabold uppercase tracking-tighter transition-colors group-hover:text-blue-600 duration-500'>
          {text1} <span className='text-gray-300 font-light'>{text2}</span>
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <div className='h-[3px] w-12 bg-blue-600 rounded-full transition-all duration-700 group-hover:w-20'></div>
        <div className='h-[3px] w-2 bg-gray-200 rounded-full'></div>
      </div>
    </div>
  )
}

export default Title

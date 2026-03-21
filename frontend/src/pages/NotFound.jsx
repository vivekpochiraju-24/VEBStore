import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className='w-full min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-6 text-center px-4'>
      <h1 className='text-6xl md:text-9xl font-extrabold text-gray-900 tracking-tighter'>404</h1>
      <p className='text-xl md:text-2xl text-gray-500 font-medium'>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className='mt-4 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm'>
        Return Home
      </Link>
    </div>
  )
}

export default NotFound

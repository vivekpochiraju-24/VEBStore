import React from 'react'

function Loading() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-[#00d4aa]/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(0,212,170,0.5)]"></div>
      </div>
    </div>
  )
}

export default Loading

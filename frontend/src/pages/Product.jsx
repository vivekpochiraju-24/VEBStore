import React from 'react'
import LatestCollection from '../component/LatestCollection'
import BestSeller from '../component/BestSeller'

function Product() {
  return (
    <div className='w-full min-h-screen bg-white flex items-center justify-start flex-col py-10 gap-16'>

      <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[10px]  flex-col '>
        <LatestCollection />
      </div>
      <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[10px]  flex-col '>
        <BestSeller />
      </div>

    </div>
  )
}

export default Product

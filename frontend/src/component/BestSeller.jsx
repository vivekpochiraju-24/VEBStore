import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function BestSeller() {
  let { products } = useContext(shopDataContext)
  let [bestSeller, setBestSeller] = useState([])

  useEffect(() => {
    let filterProduct = products.filter((item) => item.bestseller)
    setBestSeller(filterProduct.slice(0, 4));
  }, [products])

  return (
    <div className='w-full px-4 sm:px-[5vw] md:px-[7vw] py-16 bg-gray-50 border-y border-gray-100'>
      <div className='text-center mb-10'>
        <Title text1={"BEST"} text2={"SELLER"} />
        <p className='w-full max-w-2xl m-auto text-sm sm:text-base text-gray-500 mt-2'>
          Tried, Tested, Loved – Discover Our All-Time Best Sellers.
        </p>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
        {
          bestSeller.map((item, index) => (
            <Card key={index} name={item.name} id={item._id} price={item.price} image={item.image1} />
          ))
        }
      </div>
    </div>
  )
}

export default BestSeller

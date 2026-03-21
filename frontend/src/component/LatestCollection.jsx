import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function LatestCollection() {
  let { products } = useContext(shopDataContext)
  let [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    setLatestProducts(products.slice(0, 8));
  }, [products])

  return (
    <div className='w-full px-4 sm:px-[5vw] md:px-[7vw] py-16 bg-white'>
      <div className='text-center mb-10'>
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className='w-full max-w-2xl m-auto text-sm sm:text-base text-gray-500 mt-2'>
          Explore the best collection at VEBStore—where quality meets the latest trends for a perfect shopping experience.
        </p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
        {
          latestProducts.map((item, index) => (
            <Card key={index} name={item.name} image={item.image1} id={item._id} price={item.price} />
          ))
        }
      </div>
    </div>
  )
}

export default LatestCollection

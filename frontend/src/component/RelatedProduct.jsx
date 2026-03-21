import React, { useContext, useEffect, useState } from 'react'
import { shopDataContext } from '../context/ShopContext'
import Title from './Title'
import Card from './Card'

function RelatedProduct({category,subCategory,currentProductId }) {

    let {products} = useContext(shopDataContext)
    let [related,setRelated] = useState([])

    useEffect(()=>{
     if(products.length > 0){

        let productsCopy = products.slice()
        productsCopy = productsCopy.filter((item) => category === item.category)
        productsCopy = productsCopy.filter((item) => subCategory === item.subCategory)
        productsCopy = productsCopy.filter((item) => currentProductId  !== item._id)
        setRelated(productsCopy.slice(0,4))

     }
    },[products,category,subCategory,currentProductId])
  return (
    <div className='my-12 md:my-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
        <div className='mb-8 md:mb-12'>
            <Title text1={'RELATED'} text2={'PRODUCTS'}/>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8'>
            {
                related.map((item,index)=>(
                    <Card key={index} id={item._id} name={item.name } price={item.price} image={item.image1} />
                ))
            }
        </div>
      
    </div>
  )
}

export default RelatedProduct

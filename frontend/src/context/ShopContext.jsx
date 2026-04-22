import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'
import { userDataContext } from './UserContext'
import { toast } from 'react-toastify'

 export const shopDataContext = createContext()
function ShopContext({children}) {

    let [products,setProducts] = useState([])
    let [search,setSearch] = useState('')
    let {userData} = useContext(userDataContext)
    let [showSearch,setShowSearch] = useState(false)
    let {serverUrl} = useContext(authDataContext)
    let [cartItem, setCartItem] = useState({});
      let [loading,setLoading] = useState(false)
    let [showWhatsapp, setShowWhatsapp] = useState(false)
    let [wishlist, setWishlist] = useState([])
    let currency = '₹';
    let delivery_fee = 40;

    const getProducts = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/product/list")
            setProducts(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const addToWishlist = async (productId) => {
        if (!userData) {
            toast.error("Please login to use wishlist");
            return;
        }
        try {
            const result = await axios.post(serverUrl + "/api/wishlist/add", { productId }, { withCredentials: true });
            if (result.data.success) {
                setWishlist(result.data.wishlist);
                toast.success("Added to wishlist");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error adding to wishlist");
        }
    }

    const removeFromWishlist = async (productId) => {
        if (!userData) return;
        try {
            const result = await axios.post(serverUrl + "/api/wishlist/remove", { productId }, { withCredentials: true });
            if (result.data.success) {
                setWishlist(result.data.wishlist);
                toast.success("Removed from wishlist");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error removing from wishlist");
        }
    }

    const getWishlist = async () => {
        if (!userData) return;
        try {
            const result = await axios.get(serverUrl + "/api/wishlist/get", { withCredentials: true });
            if (result.data.success) {
                setWishlist(result.data.wishlist);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const toggleWishlist = async (productId) => {
        if (wishlist.includes(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    }

    const addtoCart = async (itemId , size) => {
       if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItem);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
  
    setCartItem(cartData);
  
    if (userData) {
      setLoading(true)
      try {
        await axios.post(serverUrl + "/api/cart/add" , {itemId,size} , {withCredentials: true})
        toast.success("Product Added")
        setLoading(false)
      }
      catch (error) {
        console.log(error)
        setLoading(false)
        toast.error("Add Cart Error")
      }
    } 
    }

    const getUserCart = async () => {
      try {
        const result = await axios.post(serverUrl + '/api/cart/get',{},{ withCredentials: true })
        setCartItem(result.data)
      } catch (error) {
        console.log(error)
      }
    }

    const updateQuantity = async (itemId , size , quantity) => {
      let cartData = structuredClone(cartItem);
      cartData[itemId][size] = quantity
      setCartItem(cartData)

      if (userData) {
        try {
          await axios.post(serverUrl + "/api/cart/update", { itemId, size, quantity }, { withCredentials: true })
        } catch (error) {
          console.log(error)
        }
      }
    }

     const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalCount += cartItem[items][item]
          }
        } catch (error) {
        }
      }
    }
    return totalCount
  }

  const getCartAmount = () => {
  let totalAmount = 0;
    for (const items in cartItem) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalAmount += itemInfo.price * cartItem[items][item];
          }
        } catch (error) {
        }
      }
    }
    return totalAmount
  }

    useEffect(()=>{
     getProducts()
    },[])

    useEffect(() => {
     if (userData) {
        getUserCart()
        getWishlist()
     } else {
        setCartItem({})
        setWishlist([])
     }
  },[userData])

    let [appliedCoins, setAppliedCoins] = useState(0);
    
    let value = {
      products, currency , delivery_fee,getProducts,search,setSearch,showSearch,setShowSearch,cartItem, addtoCart, getCartCount, setCartItem ,updateQuantity,getCartAmount,loading, appliedCoins, setAppliedCoins, showWhatsapp, setShowWhatsapp, wishlist, toggleWishlist, getWishlist
    }
  return (
    <div>
    <shopDataContext.Provider value={value}>
      {children}
      </shopDataContext.Provider>
    </div>
  )
}

export default ShopContext

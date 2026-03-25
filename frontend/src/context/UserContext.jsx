import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()
function UserContext({children}) {
    let [userData,setUserData] = useState(null)
    let [loading, setLoading] = useState(true)
    let {serverUrl} = useContext(authDataContext)


   const getCurrentUser = async () => {
        try {
            setLoading(true)
            let result = await axios.get(serverUrl + "/api/user/getcurrentuser",{withCredentials:true})

            setUserData(result.data)
            console.log("User data loaded:", result.data)

        } catch (error) {
            setUserData(null)
            console.log("No user logged in:", error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
     getCurrentUser()
    },[])

    let value = {
     userData,setUserData,getCurrentUser,loading
    }
    
   
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext

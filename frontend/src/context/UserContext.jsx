import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()
function UserContext({children}) {
    let [userData,setUserData] = useState(null)
    let [loading, setLoading] = useState(true)
    let [refreshKey, setRefreshKey] = useState(0)
    let {serverUrl} = useContext(authDataContext)

   const getCurrentUser = async (forceRefresh = false) => {
        try {
            setLoading(true)
            
            // If force refresh, clear current data first
            if (forceRefresh) {
                setUserData(null)
            }
            
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

    const forceRefreshUser = () => {
        setRefreshKey(prev => prev + 1)
    }

    const logoutUser = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
            setUserData(null)
            console.log("User logged out successfully")
            
            // Force refresh after a short delay to ensure state is cleared
            setTimeout(() => {
                forceRefreshUser()
            }, 100)
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    useEffect(()=>{
     getCurrentUser()
    },[refreshKey])

    let value = {
     userData,setUserData,getCurrentUser,loading,logoutUser,forceRefreshUser
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

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()
function UserContext({children}) {
    let [userData,setUserData] = useState(null)
    let [userLoading, setUserLoading] = useState(true)
    let [refreshKey, setRefreshKey] = useState(0)
    let [lastFetchTime, setLastFetchTime] = useState(0)
    let {serverUrl} = useContext(authDataContext)

   const getCurrentUser = async (forceRefresh = false) => {
        try {
            if (!serverUrl) return;
            
            setUserLoading(true)
            
            // Add timestamp to prevent caching
            const timestamp = Date.now()
            let result = await axios.get(serverUrl + `/api/user/getcurrentuser?t=${timestamp}`,{withCredentials:true})

            setUserData(result.data)
            setLastFetchTime(timestamp)
            
            console.log("User data loaded:", result.data)

        } catch (error) {
            setUserData(null)
            console.log("No user logged in:", error.message)
        } finally {
            setUserLoading(false)
        }
    }

    const forceRefreshUser = () => {
        setRefreshKey(prev => prev + 1)
    }

    const logoutUser = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
            
            // Clear all user data
            setUserData(null)
            localStorage.clear()
            sessionStorage.clear()
            setLastFetchTime(0)
            
            console.log("User logged out successfully")
            
            // Force refresh after a short delay to ensure state is cleared
            setTimeout(() => {
                forceRefreshUser()
            }, 100)
        } catch (error) {
            console.error("Logout error:", error)
            // Clear all data even if API fails
            setUserData(null)
            localStorage.clear()
            sessionStorage.clear()
            setLastFetchTime(0)
        }
    }

    useEffect(()=>{
        // Always fetch fresh user data on mount and refresh
        getCurrentUser(true)
    },[refreshKey])

    let value = {
     userData,setUserData,getCurrentUser,userLoading,logoutUser,forceRefreshUser
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

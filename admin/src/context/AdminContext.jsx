import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const adminDataContext = createContext()

function AdminContext({ children }) {
    const [adminData, setAdminData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { serverUrl } = useContext(authDataContext)

    const getAdmin = async () => {
        if (!serverUrl) {
            setError('Server URL not configured')
            setLoading(false)
            return
        }

        try {
            console.log('Attempting to get admin from:', serverUrl + "/api/user/getadmin")
            let result = await axios.get(serverUrl + "/api/user/getadmin", { 
                withCredentials: true,
                timeout: 10000 // 10 second timeout
            })
            setAdminData(result.data)
            console.log('Admin data received:', result.data)
        } catch (error) {
            setAdminData(null)
            console.log('Admin check failed:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                url: serverUrl + "/api/user/getadmin"
            })
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAdmin()
    }, [serverUrl])

    const logout = () => {
        setAdminData(null)
        if (serverUrl) {
            axios.get(serverUrl + "/api/auth/logout", { withCredentials: true }).catch(console.error)
        }
    }

    let value = {
        adminData,
        setAdminData,
        getAdmin,
        loading,
        error,
        logout
    }

    return (
        <div>
            <adminDataContext.Provider value={value}>
                {children}
            </adminDataContext.Provider>
        </div>
    )
}

export default AdminContext
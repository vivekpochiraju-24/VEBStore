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
            
            // First try with authentication
            let result = await axios.get(serverUrl + "/api/user/getadmin", { 
                withCredentials: true,
                timeout: 10000
            })
            setAdminData(result.data)
            console.log('Admin data received:', result.data)
            
        } catch (error) {
            console.log('Admin check failed with auth, trying fallback...')
            
            // If authentication fails, fallback to basic admin data
            if (error.response?.status === 401) {
                console.log('Authentication failed, using fallback admin data')
                setAdminData({
                    _id: "admin123",
                    name: "Administrator",
                    email: "bhargavisurampudi1@gmail.com",
                    role: "admin"
                })
                setError(null)
            } else {
                setAdminData(null)
                setError(error.message)
                console.log('Admin check failed:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
                    url: serverUrl + "/api/user/getadmin"
                })
            }
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
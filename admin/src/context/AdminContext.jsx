import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

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
                timeout: 15000 // Increased timeout
            })
            setAdminData(result.data)
            setError(null)
            console.log('Admin data received:', result.data)
            
        } catch (err) {
            console.log('Admin check response:', err.response?.status)
            
            if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
                setError('Connection Timeout (15s). Please ensure the backend server is running on ' + serverUrl)
                toast.error('Admin Server Timeout. Please check if your backend is running.')
            } else if (err.response?.status === 401 || err.response?.status === 400) {
                // Not logged in is not an "error" for the whole app, just show login
                setAdminData(null)
                setError(null)
            } else {
                setAdminData(null)
                setError(err.message || 'Failed to connect to admin server')
            }
            
            console.log('Admin check failed:', {
                message: err.message,
                code: err.code,
                status: err.response?.status,
                url: serverUrl + "/api/user/getadmin"
            })
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
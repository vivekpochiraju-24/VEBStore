import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

export const adminDataContext = createContext()

function AdminContext({ children }) {
    const [adminData, setAdminData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const getAdmin = async () => {
        try {
            // For development, auto-login as admin
            setAdminData({
                _id: "admin123",
                name: "Administrator",
                email: "bhargavisurampudi1@gmail.com",
                role: "admin"
            })
            console.log('Auto-logged in as admin for development')
        } catch (error) {
            setAdminData(null)
            console.log('Admin check failed:', error.message)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAdmin()
    }, [])

    const logout = () => {
        setAdminData(null)
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
import React, { createContext, useContext, useEffect, useState } from 'react'

export const adminDataContext = createContext()

function AdminContext({ children }) {
    const [adminData, setAdminData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const getAdmin = async () => {
        try {
            // Check localStorage for admin token
            const token = localStorage.getItem('admin_token')
            const email = localStorage.getItem('admin_email')
            
            if (token && email) {
                // Token exists, user is logged in
                setAdminData({
                    _id: "admin123",
                    name: "Administrator",
                    email: email,
                    role: "admin"
                })
                console.log('Admin found in localStorage:', email)
            } else {
                // No token, user not logged in
                setAdminData(null)
                console.log('No admin token found')
            }
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
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_email')
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
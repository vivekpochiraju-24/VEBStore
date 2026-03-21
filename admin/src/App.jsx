import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Add from './pages/Add'
import Lists from './pages/Lists'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Settings from './pages/Settings'
import Support from './pages/Support'
import { adminDataContext } from './context/AdminContext'
import { ToastContainer, toast } from 'react-toastify'

function App() {
    const { adminData, loading, error } = useContext(adminDataContext)

    // Show loading screen while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin panel...</p>
                </div>
            </div>
        )
    }

    // Show error screen if there's an error
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-600 text-xl">!</span>
                    </div>
                    <p className="text-red-600 font-medium">Error loading admin panel</p>
                    <p className="text-gray-500 text-sm mt-2">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <ToastContainer />
            {!adminData ? (
                <Login />
            ) : (
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/add' element={<Add />} />
                    <Route path='/lists' element={<Lists />} />
                    <Route path='/orders' element={<Orders />} />
                    <Route path='/settings' element={<Settings />} />
                    <Route path='/support' element={<Support />} />
                    <Route path='/login' element={<Login />} />
                </Routes>
            )}
        </>
    )
}

export default App

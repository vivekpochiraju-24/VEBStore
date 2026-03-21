import React, { createContext, useContext, useEffect, useState } from 'react'

export const themeDataContext = createContext()

function ThemeContextProvider({ children }) {
    const [isDark, setIsDark] = useState(false)
    const [settings, setSettings] = useState({
        orderNotifications: true,
        twoFactorAuth: false,
        autoBackup: true,
        emailAlerts: true,
        compactMode: false,
        soundAlerts: false,
    })

    useEffect(() => {
        // Only access localStorage after component mounts
        try {
            const savedDarkMode = localStorage.getItem('admin_dark_mode') === 'true'
            setIsDark(savedDarkMode)
            
            const savedSettings = localStorage.getItem('admin_settings')
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings))
            }
        } catch (error) {
            console.error('Error accessing localStorage:', error)
        }
    }, [])

    useEffect(() => {
        try {
            const root = document.documentElement
            if (isDark) {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
            localStorage.setItem('admin_dark_mode', isDark)
        } catch (error) {
            console.error('Error setting theme:', error)
        }
    }, [isDark])

    const toggleTheme = () => setIsDark(prev => !prev)

    const toggleSetting = (key) => {
        setSettings(prev => {
            const updated = { ...prev, [key]: !prev[key] }
            try {
                localStorage.setItem('admin_settings', JSON.stringify(updated))
            } catch (error) {
                console.error('Error saving settings:', error)
            }
            return updated
        })
    }

    const value = { 
        isDark, 
        setIsDark, 
        toggleTheme, 
        settings, 
        setSettings, 
        toggleSetting 
    }

    return (
        <themeDataContext.Provider value={value}>
            {children}
        </themeDataContext.Provider>
    )
}

export default ThemeContextProvider

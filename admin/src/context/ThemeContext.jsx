import React, { createContext, useContext, useEffect, useState } from 'react'

export const themeDataContext = createContext()

function ThemeContextProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('admin_dark_mode') === 'true'
    })

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('admin_settings')
        return saved ? JSON.parse(saved) : {
            orderNotifications: true,
            twoFactorAuth: false,
            autoBackup: true,
            emailAlerts: true,
            compactMode: false,
            soundAlerts: false,
        }
    })

    useEffect(() => {
        const root = document.documentElement
        if (isDark) {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
        localStorage.setItem('admin_dark_mode', isDark)
    }, [isDark])

    const toggleTheme = () => setIsDark(prev => !prev)

    const toggleSetting = (key) => {
        setSettings(prev => {
            const updated = { ...prev, [key]: !prev[key] }
            localStorage.setItem('admin_settings', JSON.stringify(updated))
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

import React, { createContext, useContext, useEffect, useState } from 'react'

export const themeDataContext = createContext()

function ThemeContext({ children }) {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('vebstore_dark_mode') === 'true'
    })

    useEffect(() => {
        const root = document.documentElement
        if (isDark) {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
        localStorage.setItem('vebstore_dark_mode', isDark)
    }, [isDark])

    const toggleTheme = () => setIsDark(prev => !prev)

    return (
        <themeDataContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </themeDataContext.Provider>
    )
}

export default ThemeContext

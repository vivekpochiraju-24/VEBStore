import React from 'react'
import { createContext } from 'react'
export const authDataContext = createContext()
function AuthContext({ children }) {
  let serverUrl = import.meta.env.VITE_BACKEND_URL || "https://vebstore-backend.onrender.com"
  
  // Debug logging to check which URL is being used
  console.log('🔗 Backend URL:', serverUrl)

  let value = {
    serverUrl
  }
  return (
    <div>
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
    </div>
  )
}

export default AuthContext

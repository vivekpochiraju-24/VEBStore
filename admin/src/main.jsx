import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './context/AuthContext.jsx'
import AdminContext from './context/AdminContext.jsx'
import ThemeContextProvider from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContext>
      <AdminContext>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </AdminContext>
    </AuthContext>
  </BrowserRouter>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Context Providers
import AuthContext from "./context/AuthContext.jsx"
import UserContext from './context/UserContext.jsx'
import ShopContext from './context/ShopContext.jsx'
import ThemeContext from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContext>
        <ThemeContext>
          <UserContext>
            <ShopContext>
              <App />
            </ShopContext>
          </UserContext>
        </ThemeContext>
      </AuthContext>
    </BrowserRouter>
  </StrictMode>
)

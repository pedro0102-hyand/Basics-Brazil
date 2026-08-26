import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { CartProvider } from './context/CartContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { LoadingProvider } from './context/LoadingContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LoadingProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  </StrictMode>,
)

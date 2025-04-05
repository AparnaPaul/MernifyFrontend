import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/theme-provider'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ProductProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ProductProvider>
    </ThemeProvider>

  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BrandDeck from './BrandDeck.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrandDeck />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DentistApp from './pages/DentistApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DentistApp />
  </StrictMode>,
)

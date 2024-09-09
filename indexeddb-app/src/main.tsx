import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import IndexedDBApp from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IndexedDBApp />
  </StrictMode>,
)

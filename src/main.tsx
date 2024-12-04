import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StarknetProvider } from './starknet-provider.tsx'
import { NewStudentProvider } from './context/NewStudentContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StarknetProvider>
      <NewStudentProvider>
        <App />
      </NewStudentProvider>
    </StarknetProvider>
  </StrictMode>,
)

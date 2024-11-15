import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StarknetProvider } from './starknet-provider.tsx'
// import ConnectWallet from './components/ConnectWallet.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StarknetProvider>
      <App />
      {/* <ConnectWallet /> */}
    </StarknetProvider>
  </StrictMode>,
)

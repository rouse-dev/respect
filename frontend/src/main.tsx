import { createRoot } from 'react-dom/client'
import './assets/fonts/font-awesome/css/font-awesome.min.css'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
)
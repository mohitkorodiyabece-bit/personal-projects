import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Prevent pinch-zoom over the 3D canvas (Safari)
document.addEventListener('gesturestart', (e) => e.preventDefault())

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

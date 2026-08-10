import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#171D2D',
                color: '#F8FAFC',
                border: '1px solid #273044',
              },
              success: {
                iconTheme: {
                  primary: '#22C55E',
                  secondary: '#171D2D',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#171D2D',
                },
              },
            }}
          />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
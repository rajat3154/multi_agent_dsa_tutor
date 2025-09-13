import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import { AuthProvider } from './context/AuthContext'
// import { Provider } from 'react-redux';
// import store, { persistor } from './redux/store';
// import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <AuthProvider> */}
      {/* <Provider store={store}> */}
        {/* <PersistGate loading={null} persistor={persistor}> */}
          <App />
        {/* </PersistGate> */}
      {/* </Provider> */}
    {/* </AuthProvider> */}
    <Toaster 
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#000000',
          color: '#ffffff',
          border: '1px solid #333333',
        },
        className: 'toast-message',
        duration: 3000,
      }}
    />
  </React.StrictMode>,
)

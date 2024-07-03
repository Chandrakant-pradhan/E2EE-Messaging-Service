import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import ChatProvider from './context/ChatContext.jsx'
import axios from 'axios'

axios.defaults.baseURL = "https://e2ee-messaging-service.onrender.com"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
       <ChatProvider>
           <App />
        </ChatProvider>  
    </BrowserRouter>
  </React.StrictMode>,
)

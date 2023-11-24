import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { NextUIProvider } from "@nextui-org/react";
import './index.css'
import { AliveScope } from 'react-activation';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <AliveScope>
        <App />
      </AliveScope>
    </NextUIProvider>
  </React.StrictMode>,
)

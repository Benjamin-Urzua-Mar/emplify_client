import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { NextUIProvider } from "@nextui-org/react";
import './index.css'
import { AliveScope } from 'react-activation';
import { cargarConfiguracion } from './lib/config';

const root = ReactDOM.createRoot(document.getElementById('root'))

// Las URLs de la API se obtienen del servidor antes de renderizar la app
cargarConfiguracion()
  .then(() => root.render(
    <React.StrictMode>
      <NextUIProvider>
        <AliveScope>
          <App />
        </AliveScope>
      </NextUIProvider>
    </React.StrictMode>,
  ))
  .catch((error) => {
    console.error("No se pudo cargar la configuración:", error)
    root.render(
      <div className="flex min-h-screen items-center justify-center p-6 text-center text-ink">
        No pudimos conectarnos con el servidor. Intenta nuevamente en unos minutos.
      </div>
    )
  })

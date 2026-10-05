import { HistorialTrabajos } from "./components/Clientes/HistorialTrabajos"
import { LoginCliente } from "./components/Clientes/LoginCliente"
import { RegisterCliente } from "./components/Clientes/RegisterCliente"
import { LoginEspecialista } from "./components/Especialistas/LoginEspecialista"
import { RegisterEspecialista } from "./components/Especialistas/RegisterEspecialista"
import { Home } from "./components/Home/Home"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ResultadosBusqueda } from "./components/Home/ResultadosBusqueda"
import { ConfiguracionCliente } from "./components/Clientes/ConfiguracionCliente"
import { NotFoundPage } from "./components/Global/NotFoundPage"
import { SesionExpirada } from "./components/Global/SesionExpirada"
import { Admin } from "./components/Admin/Admin"
import { PerfilInicial } from "./components/Especialistas/PerfilInicial"
import { PerfilEspecialista } from "./components/Especialistas/PerfilEspecialista"
import { useMemo } from "react"
import { io } from "socket.io-client"
import { SolicitudesTrabajo } from "./components/Especialistas/SolicitudesTrabajo"
import { EditarPerfil } from "./components/Especialistas/EditarPerfil"
import { socketUrl } from "./lib/config"

const App = () => {
  // Una sola conexión de socket para toda la sesión
  const socket = useMemo(() => io(socketUrl(), {
    auth: {
      _id: localStorage.getItem("user_id")
    }
  }), [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/clientes/login" element={<LoginCliente />} />
        <Route path="/clientes/register" element={<RegisterCliente />} />
        <Route path="/especialistas/login" element={<LoginEspecialista />} />
        <Route path="/especialistas/register" element={<RegisterEspecialista />} />
        <Route path="/especialistas/register/perfilInicial" element={<PerfilInicial />} />
        <Route path="/especialistas/cuenta" element={<EditarPerfil />} />
        <Route path="/especialistas/solicitudesTrabajo" element={<SolicitudesTrabajo />} />
        <Route path="/clientes/historialTrabajos" element={<HistorialTrabajos />} />
        <Route path="/buscar" element={<ResultadosBusqueda />} />
        <Route path="/buscar/perfilEspecialista" element={<PerfilEspecialista socket={socket} />} />
        <Route path="/error" element={<NotFoundPage />} />
        <Route path="/editarperfil" element={<EditarPerfil />} />
        <Route path="/sesionexpirada" element={<SesionExpirada />} />
        <Route path="/clientes/cuenta" element={<ConfiguracionCliente />} />
        <Route path="/especialistas/perfil" element={<PerfilEspecialista />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

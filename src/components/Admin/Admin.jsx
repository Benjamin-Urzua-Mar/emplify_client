import { NavBar } from "./NavBar"
import { useGlobalState } from "../../../global_states"
import { AdminProfesionales } from "./AdminProfesionales"
import { AdminClientes } from "./AdminClientes"
import { AdminReportes } from "./AdminReportes"
import { AdminLogin } from "./AdminLogin"
import { AdminSolicitudes } from "./AdminSolicitudes"

const vistas = {
    cliente: AdminClientes,
    profesionales: AdminProfesionales,
    reportes: AdminReportes,
    solicitudes: AdminSolicitudes,
}

export const Admin = () => {
    const [vista] = useGlobalState("vistaAdmin")
    if (vista == "inicial") return <AdminLogin />

    const Vista = vistas[vista] ?? AdminSolicitudes
    return (
        <div className="min-h-screen bg-surface-muted">
            <NavBar />
            <Vista />
        </div>
    )
}

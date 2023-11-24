import { NavBar } from "./NavBar"
import { useGlobalState } from "../../../global_states"
import { AdminProfesionales } from "./AdminProfesionales"
import { AdminClientes } from "./AdminClientes"
import { AdminReportes } from "./AdminReportes"
import { AdminLogin } from "./AdminLogin"
import { AdminSolicitudes } from "./AdminSolicitudes"
export const Admin = () => {
    const [vista] = useGlobalState("vistaAdmin")
    return (
        <>
            {
                (vista == "inicial")
                    ? <AdminLogin></AdminLogin>
                    : (vista == "cliente")
                        ? <><NavBar></NavBar> <AdminClientes ></AdminClientes></>
                        : (vista == "profesionales")
                            ? <><NavBar></NavBar> <AdminProfesionales ></AdminProfesionales></>
                            : (vista == "reportes")
                                ? <><NavBar></NavBar> <AdminReportes></AdminReportes></>
                                : <><NavBar></NavBar> <AdminSolicitudes></AdminSolicitudes></>
            }

        </>
    )
}

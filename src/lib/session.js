import { alertError, alertNetworkError, toast } from "./alerts"
import { apiUrl } from "./config"

/** Datos de la sesión guardados en localStorage. */
export const getSession = () => ({
    userId: localStorage.getItem("user_id"),
    userName: localStorage.getItem("userName"),
    tipoUsuario: localStorage.getItem("tipoUsuario"),
    fotoPerfil: localStorage.getItem("fotoPerfil"),
})

export const isLoggedIn = () => localStorage.getItem("userName") !== null

/** Cierra la sesión del cliente o especialista y vuelve al inicio. */
export const logout = async (navigate) => {
    const tipo = localStorage.getItem("tipoUsuario") == "Cliente" ? "clientes" : "especialistas"
    try {
        const res = await fetch(apiUrl(`/${tipo}/logout`), { method: "POST" })
        const msg = await res.json()
        switch (msg["codigo"]) {
            case 1:
                localStorage.clear()
                navigate("/")
                toast.fire({ icon: "success", title: msg["msg"] || "Sesión cerrada" })
                break
            case 10:
                alertError(msg["msg"])
                break
        }
    } catch {
        alertNetworkError()
    }
}

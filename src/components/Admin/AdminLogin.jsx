import { Input, Button } from "@nextui-org/react"
import { useState } from "react"
import { setGlobalState } from "../../../global_states/index"
import { Logo } from "../ui/Logo"
import { PasswordInput } from "../ui/PasswordInput"
import { alertError, alertNetworkError, toast } from "../../lib/alerts"
import { apiUrl } from "../../lib/config"

export const AdminLogin = () => {
    const [user, setUser] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const loginAdmin = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch(apiUrl("/admin/login"), {
                method: 'POST',
                body: JSON.stringify({ user, contrasena }),
                headers: { "Content-Type": "application/json" }
            })
            const msg = await res.json()
            switch (msg["codigo"]) {
                case 1:
                    sessionStorage.setItem("user_id", msg['sessionId'])
                    sessionStorage.setItem("tipoUsuario", msg['tipoUsuario'])
                    setGlobalState("vistaAdmin", "cliente")
                    toast.fire({ icon: 'success', title: `Bienvenido, ${msg['tipoUsuario']}` })
                    break;
                case 2:
                case 3:
                case 10:
                    alertError(msg["msg"])
                    break;
            }
        } catch {
            alertNetworkError()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
            <form className="card flex w-full max-w-sm flex-col gap-5 p-8" onSubmit={loginAdmin}>
                <div className="text-center">
                    <Logo suffix="Admin" />
                    <p className="mt-2 text-sm text-ink-muted">Inicia sesión como administrador</p>
                </div>
                <Input isRequired label="Usuario" labelPlacement="outside" placeholder="Usuario" variant="bordered" autoComplete="username" value={user} onValueChange={setUser} />
                <PasswordInput isRequired label="Contraseña" labelPlacement="outside" placeholder="Contraseña" variant="bordered" value={contrasena} onValueChange={setContrasena} />
                <Button color="primary" type="submit" size="lg" isLoading={isLoading}>Iniciar sesión</Button>
            </form>
        </div>
    )
}

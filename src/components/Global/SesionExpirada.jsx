import { Button } from "@nextui-org/react"
import { Link } from "react-router-dom"
import { Logo } from "../ui/Logo"

export const SesionExpirada = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
            <div className="card w-full max-w-md p-8 text-center">
                <Logo size="sm" className="mb-6 inline-block" />
                <img src="/warning1.png" alt="" className="mx-auto mb-4 h-20 w-20" />
                <h1 className="text-2xl font-bold">Tu sesión ha expirado</h1>
                <p className="mt-2 text-ink-muted">Por tu seguridad cerramos la sesión debido a inactividad. Vuelve a iniciar sesión para continuar.</p>
                <div className="mt-6 flex flex-col gap-3">
                    <Button as={Link} to="/clientes/login" color="primary" size="lg">Iniciar sesión como cliente</Button>
                    <Button as={Link} to="/especialistas/login" variant="bordered" size="lg">Iniciar sesión como especialista</Button>
                </div>
            </div>
        </div>
    )
}

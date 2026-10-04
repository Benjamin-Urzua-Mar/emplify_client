/* eslint-disable react/prop-types */
import { Input, Button } from "@nextui-org/react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthLayout } from "../ui/AuthLayout"
import { PasswordInput } from "../ui/PasswordInput"
import { SocialAuthButtons } from "../ui/SocialAuthButtons"
import { alertError, alertNetworkError, toast } from "../../lib/alerts"

/**
 * Formulario de inicio de sesión compartido por clientes y especialistas.
 * `tipo`: "clientes" | "especialistas"
 */
export const LoginForm = ({ tipo, subtitle }) => {
    const [email, setEmail] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const redirect = useNavigate()
    const esCliente = tipo == "clientes"

    const login = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch(`https://emplifyapi.burzuam.dpdns.org/${tipo}/login`, {
                method: 'POST',
                body: JSON.stringify({ email, contrasena }),
                headers: { "Content-Type": "application/json" }
            })
            const msg = await res.json()
            switch (msg["codigo"]) {
                case 1:
                    localStorage.setItem("user_id", msg['sessionId'])
                    localStorage.setItem("userName", msg['userName'])
                    localStorage.setItem("tipoUsuario", msg['tipoUsuario'])
                    if (!esCliente) localStorage.setItem("fotoPerfil", msg['fotoPerfil'])
                    redirect("/")
                    toast.fire({ icon: 'success', title: `Bienvenido, ${msg['userName']}` })
                    break;
                case 2:
                    alertError(msg["msg"], { footer: '<a href="/">Recuperar contraseña</a>' })
                    break;
                case 3:
                    alertError(msg["msg"], { footer: '<a href="/">Reestablecer cuenta</a>' })
                    break;
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
        <AuthLayout subtitle={subtitle}>
            <form className="flex flex-col gap-4" onSubmit={login}>
                <Input
                    isRequired
                    type="email"
                    label="Correo electrónico"
                    labelPlacement="outside"
                    placeholder="tu@correo.cl"
                    variant="bordered"
                    autoComplete="email"
                    value={email}
                    onValueChange={setEmail}
                />
                <PasswordInput
                    isRequired
                    label="Contraseña"
                    labelPlacement="outside"
                    placeholder="Ingresa tu contraseña"
                    variant="bordered"
                    value={contrasena}
                    onValueChange={setContrasena}
                />
                <a href="#" className="link self-end text-sm">¿Olvidaste tu contraseña?</a>
                <Button color="primary" type="submit" size="lg" isLoading={isLoading} className="font-medium">Iniciar sesión</Button>
                <p className="text-center text-sm text-ink-muted">
                    ¿No tienes cuenta? <Link to={`/${tipo}/register`} className="link">Regístrate</Link>
                </p>
                <SocialAuthButtons />
                <p className="border-t border-default-100 pt-4 text-center text-sm text-ink-muted">
                    {esCliente
                        ? <>¿Eres profesional? <Link to="/especialistas/login" className="link">Ingresa como especialista</Link></>
                        : <>¿Buscas un profesional? <Link to="/clientes/login" className="link">Ingresa como cliente</Link></>}
                </p>
            </form>
        </AuthLayout>
    )
}

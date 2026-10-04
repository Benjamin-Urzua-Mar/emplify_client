import { Button } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../ui/AuthLayout";
import { SocialAuthButtons } from "../ui/SocialAuthButtons";
import { DatosPersonalesFields } from "../Global/DatosPersonalesFields";
import { validarDatosPersonales, datosPersonalesIniciales, nombresUbicacion } from "../Global/validaciones";
import { alertError, alertNetworkError, alertSuccess } from "../../lib/alerts";

const beneficios = [
    "Ofrecerte una experiencia personalizada dentro de Emplify.",
    "Entregarte seguridad dentro de Emplify.",
    "Cubrirte a nivel legal con el uso de Emplify.",
]

export const RegisterCliente = () => {
    const [form, setForm] = useState(datosPersonalesIniciales)
    const [errores, setErrores] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const redirect = useNavigate()

    const setCampo = (campo, valor) => {
        setForm(f => ({ ...f, [campo]: valor }))
        setErrores(err => ({ ...err, [campo]: null, ...(campo == "ubicacion" && { region: null, provincia: null, comuna: null }) }))
    }

    const register = async (e) => {
        e.preventDefault()
        const nuevosErrores = validarDatosPersonales(form, ["fechaNacto"])
        setErrores(nuevosErrores)
        if (Object.keys(nuevosErrores).length) return

        const { region, provincia, comuna } = nombresUbicacion(form.ubicacion)
        const body = JSON.stringify({
            nombres: form.nombres.trim(),
            apellidos: form.apellidos.trim(),
            email: form.email.trim(),
            contrasena: form.contrasena,
            telefono: form.telefono,
            run: form.run,
            fechaNacto: form.fechaNacto,
            region,
            provincia,
            comuna,
            direccion: form.direccion.trim(),
            estado: true
        })

        setIsLoading(true)
        try {
            const res = await fetch('https://emplifyapi.burzuam.dpdns.org/clientes/register', { method: 'POST', body: body, headers: { "Content-Type": "application/json" } })
            const msg = await res.json()
            switch (msg["codigo"]) {
                case 1:
                    alertSuccess(msg["msg"], "¡Cuenta creada!").then((result) => {
                        if (result['isConfirmed']) redirect("/clientes/login")
                    })
                    break;
                case 2:
                    alertError(msg["msg"], { footer: '<a href="/">Recuperar contraseña</a>' })
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
        <AuthLayout
            title="Crea tu cuenta de cliente"
            subtitle="¡Regístrate con nosotros para obtener al profesional que necesitas!"
            aside={
                <div className="mt-2">
                    <p className="font-semibold text-ink">Tus datos nos permiten:</p>
                    <ul className="mt-3 flex flex-col gap-2">
                        {beneficios.map(b => (
                            <li key={b} className="flex items-start gap-2 text-ink-body">
                                <FontAwesomeIcon icon={faCircleCheck} className="mt-1 text-brand-500" />{b}
                            </li>
                        ))}
                    </ul>
                </div>
            }
        >
            <form className="flex flex-col gap-6" onSubmit={register} noValidate>
                <DatosPersonalesFields form={form} setCampo={setCampo} errores={errores} conFechaNacimiento />
                <Button color="primary" type="submit" size="lg" isLoading={isLoading} className="font-medium">Crear cuenta</Button>
                <p className="text-center text-sm text-ink-muted">¿Ya estás registrado? <Link to="/clientes/login" className="link">Inicia sesión</Link></p>
                <SocialAuthButtons />
            </form>
        </AuthLayout>
    )
}

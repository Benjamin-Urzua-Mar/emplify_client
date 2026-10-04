import { Input, Button, Skeleton, Chip } from "@nextui-org/react"
import { useEffect, useState } from "react";
import { AccountLayout } from "../ui/AccountLayout";
import { SectionCard } from "../ui/SectionCard";
import { PageHeader } from "../ui/PageHeader";
import { navCliente } from "../../data/navegacion";
import { ReactSwal, alertError, alertInfo, alertNetworkError, alertSuccess, toast } from "../../lib/alerts";

const soloTelefono = (valor) => String(valor ?? "").replace(/\D/g, "").slice(-8)

export const ConfiguracionCliente = () => {
    const [cuenta, setCuenta] = useState({})
    const [nuevaContrasena, setNuevaContrasena] = useState("")
    const [nuevoCorreo, setNuevoCorreo] = useState("")
    const [cambiosPendientes, setCambiosPendientes] = useState({ contrasena: false, email: false })
    const [isLoadingCuenta, setIsLoadingCuenta] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const editarCuenta = async (e) => {
        e.preventDefault()
        const body = JSON.stringify({
            _id: localStorage.getItem("user_id"),
            nombres: cuenta.nombres,
            apellidos: cuenta.apellidos,
            email: nuevoCorreo,
            contrasena: nuevaContrasena,
            telefono: parseInt(soloTelefono(cuenta.telefono)),
            username: cuenta.username
        })

        setIsSaving(true)
        try {
            const res = await fetch('https://emplifyapi.burzuam.dpdns.org/clientes/editarCuenta', { method: "POST", body: body, headers: { "Content-Type": "application/json" } })
            const msg = await res.json()
            switch (msg["codigo"]) {
                case 1:
                    setCambiosPendientes({ contrasena: false, email: false })
                    alertSuccess(msg["msg"])
                    break;
                case 2:
                case 10:
                    alertError(msg["msg"])
                    break;
            }
        } catch {
            alertNetworkError()
        } finally {
            setIsSaving(false)
        }
    }

    const handleChange = (campo) => (valor) => setCuenta(c => ({ ...c, [campo]: valor }))

    const solicitarCambio = async ({ titulo, input, placeholder, validar, onConfirm }) => {
        const result = await ReactSwal.fire({
            title: titulo,
            input,
            inputPlaceholder: placeholder,
            showCancelButton: true,
            confirmButtonText: "Aplicar",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
            inputValidator: validar,
        })
        if (result.isConfirmed) {
            onConfirm(result.value)
            toast.fire({ icon: "info", title: "Presiona «Guardar cambios» para confirmar" })
        }
    }

    const handlePassword = () => solicitarCambio({
        titulo: "Cambiar contraseña",
        input: "password",
        placeholder: "Nueva contraseña",
        validar: (valor) => !valor && "Ingresa una contraseña",
        onConfirm: (valor) => { setNuevaContrasena(valor); setCambiosPendientes(p => ({ ...p, contrasena: true })) },
    })

    const handleEmail = () => solicitarCambio({
        titulo: "Cambiar correo electrónico",
        input: "email",
        placeholder: "nuevo@correo.cl",
        validar: (valor) => !valor && "Ingresa un correo",
        onConfirm: (valor) => { setNuevoCorreo(valor); setCambiosPendientes(p => ({ ...p, email: true })) },
    })

    const handleEliminar = () => alertInfo(`Para eliminar tu cuenta escríbenos a soporte@emplify.cl desde ${nuevoCorreo || "tu correo registrado"}.`, "Eliminar cuenta")

    useEffect(() => {
        const body = JSON.stringify({ _id: localStorage.getItem("user_id") })
        fetch('https://emplifyapi.burzuam.dpdns.org/clientes/getCuenta', { method: "POST", body: body, headers: { "Content-Type": "application/json" } })
            .then(res => res.json().then(msg => {
                switch (msg["codigo"]) {
                    case 1:
                        setCuenta({ ...msg["data"], telefono: soloTelefono(msg["data"].telefono) })
                        setNuevaContrasena(msg["data"].contrasena)
                        setNuevoCorreo(msg["data"].email)
                        break;
                    case 2:
                    case 10:
                        alertError(msg["msg"])
                        break;
                }
            }))
            .catch(() => alertNetworkError())
            .finally(() => setIsLoadingCuenta(false))
    }, [])

    const comunes = { variant: "bordered", labelPlacement: "outside" }

    return (
        <AccountLayout navTitle="Mi cuenta" nav={navCliente}>
            <PageHeader title="Configuración de la cuenta" description="Actualiza tus datos personales y de acceso." />
            <form className="flex flex-col gap-6" onSubmit={editarCuenta}>
                <SectionCard title="Datos personales">
                    {isLoadingCuenta ? (
                        <div className="grid gap-5 sm:grid-cols-2">
                            {[1, 2, 3, 4].map(n => <Skeleton key={n} className="h-12 rounded-xl" />)}
                        </div>
                    ) : (
                        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
                            <Input {...comunes} isRequired label="Nombres" value={cuenta.nombres ?? ""} onValueChange={handleChange("nombres")} placeholder="Tus nombres" />
                            <Input {...comunes} label="Apellidos" value={cuenta.apellidos ?? ""} onValueChange={handleChange("apellidos")} placeholder="Tus apellidos" />
                            <Input {...comunes} type="tel" inputMode="numeric" label="Teléfono" value={cuenta.telefono ?? ""}
                                onValueChange={(v) => handleChange("telefono")(v.replace(/\D/g, "").slice(0, 8))}
                                startContent={<span className="pointer-events-none text-sm text-default-500">+56 9</span>} placeholder="12345678" />
                            <Input {...comunes} label="Nombre de usuario" value={cuenta.username ?? ""} onValueChange={handleChange("username")} placeholder="Ej: camila.rojas" />
                        </div>
                    )}
                </SectionCard>

                <SectionCard title="Acceso" description="Los cambios se aplican al presionar «Guardar cambios».">
                    <dl className="divide-y divide-default-100">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
                            <div>
                                <dt className="text-sm font-medium text-ink">Correo electrónico</dt>
                                <dd className="text-sm text-ink-muted">{nuevoCorreo || "—"}</dd>
                            </div>
                            <div className="flex items-center gap-2">
                                {cambiosPendientes.email && <Chip size="sm" color="warning" variant="flat">Sin guardar</Chip>}
                                <Button size="sm" variant="bordered" onPress={handleEmail}>Cambiar correo</Button>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                            <div>
                                <dt className="text-sm font-medium text-ink">Contraseña</dt>
                                <dd className="text-sm text-ink-muted">••••••••</dd>
                            </div>
                            <div className="flex items-center gap-2">
                                {cambiosPendientes.contrasena && <Chip size="sm" color="warning" variant="flat">Sin guardar</Chip>}
                                <Button size="sm" variant="bordered" onPress={handlePassword}>Cambiar contraseña</Button>
                            </div>
                        </div>
                    </dl>
                </SectionCard>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button color="danger" variant="light" type="button" onPress={handleEliminar}>Eliminar cuenta</Button>
                    <Button color="primary" type="submit" isLoading={isSaving} isDisabled={isLoadingCuenta}>Guardar cambios</Button>
                </div>
            </form>
        </AccountLayout>
    )
}

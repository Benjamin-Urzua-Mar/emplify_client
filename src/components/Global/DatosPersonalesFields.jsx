/* eslint-disable react/prop-types */
import { Input } from "@nextui-org/react"
import { formatRut } from "rutlib"
import { useState } from "react"
import { PasswordInput } from "../ui/PasswordInput"
import { UbicacionFields } from "./UbicacionFields"

/** Campos de datos personales compartidos por los registros de cliente y especialista. */
export const DatosPersonalesFields = ({ form, setCampo, errores, conFechaNacimiento = false }) => {
    const [verContrasena, setVerContrasena] = useState(false)
    const comunes = { variant: "bordered", labelPlacement: "outside", isRequired: true }
    const campo = (nombre) => ({
        value: form[nombre],
        onValueChange: (v) => setCampo(nombre, v),
        isInvalid: !!errores[nombre],
        errorMessage: errores[nombre],
    })

    return (
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
            <Input {...comunes} {...campo("nombres")} label="Nombres" placeholder="Ej: Camila Andrea" autoComplete="given-name" />
            <Input {...comunes} {...campo("apellidos")} label="Apellidos" placeholder="Ej: Rojas Muñoz" autoComplete="family-name" />
            <Input {...comunes} {...campo("email")} type="email" label="Correo electrónico" placeholder="tu@correo.cl" autoComplete="email" />
            <Input {...comunes} {...campo("telefono")} onValueChange={(v) => setCampo("telefono", v.replace(/\D/g, "").slice(0, 8))}
                type="tel" inputMode="numeric" label="Teléfono" placeholder="12345678" autoComplete="tel-national"
                startContent={<span className="pointer-events-none text-sm text-default-500">+56 9</span>} />
            <Input {...comunes} {...campo("run")} onValueChange={(v) => setCampo("run", formatRut(v))}
                label="RUN" placeholder="12.345.678-K" maxLength={12} />
            {conFechaNacimiento && (
                <Input {...comunes} {...campo("fechaNacto")} type="date" label="Fecha de nacimiento" placeholder="dd-mm-aaaa" />
            )}
            <PasswordInput {...comunes} {...campo("contrasena")} label="Contraseña" placeholder="Crea una contraseña" autoComplete="new-password"
                isVisible={verContrasena} onToggleVisibility={() => setVerContrasena(v => !v)} />
            <PasswordInput {...comunes} {...campo("confirmarContrasena")} label="Confirma tu contraseña" placeholder="Repite la contraseña" autoComplete="new-password"
                isVisible={verContrasena} onToggleVisibility={() => setVerContrasena(v => !v)} />
            <UbicacionFields value={form.ubicacion} onChange={(v) => setCampo("ubicacion", v)} errores={errores} />
            <Input {...comunes} {...campo("direccion")} label="Calle y número" placeholder="Ej: Av. Alemania 123" autoComplete="street-address" />
        </div>
    )
}

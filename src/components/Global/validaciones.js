import { validateRut } from "rutlib"
import { regiones, provincias, comunas } from "../../data/regiones"

/** Validaciones comunes para los formularios de registro. Devuelve { campo: mensaje }. */
export const validarDatosPersonales = (form, campos) => {
    const errores = {}
    const requerido = (campo, mensaje) => { if (!String(form[campo] ?? "").trim()) errores[campo] = mensaje }

    requerido("nombres", "Ingresa tus nombres")
    requerido("apellidos", "Ingresa tus apellidos")
    requerido("direccion", "Ingresa tu calle y número")
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errores.email = "Ingresa un correo válido"
    if (!/^\d{8}$/.test(form.telefono)) errores.telefono = "Ingresa los 8 dígitos de tu teléfono"
    if (!form.run || !validateRut(form.run)) errores.run = "Ingresa un RUN válido"
    if (!form.contrasena) errores.contrasena = "Ingresa una contraseña"
    if (form.contrasena != form.confirmarContrasena) errores.confirmarContrasena = "Las contraseñas no coinciden"
    if (!form.ubicacion.region) errores.region = "Selecciona una región"
    if (!form.ubicacion.provincia) errores.provincia = "Selecciona una provincia"
    if (!form.ubicacion.comuna) errores.comuna = "Selecciona una comuna"
    if (campos?.includes("fechaNacto")) requerido("fechaNacto", "Ingresa tu fecha de nacimiento")

    return errores
}

export const datosPersonalesIniciales = {
    nombres: "", apellidos: "", email: "", telefono: "", run: "", fechaNacto: "",
    contrasena: "", confirmarContrasena: "", direccion: "",
    ubicacion: { region: "", provincia: "", comuna: "" },
}

/** Devuelve los nombres de región, provincia y comuna a partir de sus códigos. */
export const nombresUbicacion = ({ region, provincia, comuna }) => ({
    region: regiones.find(r => r.codigo == region)?.nombre ?? "",
    provincia: provincias.find(p => p.codigo == provincia)?.nombre ?? "",
    comuna: comunas.find(c => c.codigo == comuna)?.nombre ?? "",
})

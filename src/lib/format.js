export const API_IMAGES_URL = "https://emplifyapi.burzuam.dpdns.org/resources/images"

/** URL pública de una imagen subida al servidor. */
export const imageUrl = (fileName) => (fileName ? `${API_IMAGES_URL}/${fileName}` : undefined)

/** Convierte "$ 1.000.000", "1000000" o 1000000 en número. */
export const parsePrecio = (valor) => {
    const numero = parseInt(String(valor ?? "").replace(/\D/g, ""), 10)
    return Number.isNaN(numero) ? null : numero
}

/** Formatea un precio en pesos chilenos: 1000000 → "$1.000.000". */
export const formatPrecio = (valor) => {
    const numero = parsePrecio(valor)
    if (numero === null) return valor ?? ""
    return `$${numero.toLocaleString("es-CL")}`
}

/** Formatea fechas ISO o "aaaa-mm-dd" como "12 sept 2023". */
export const formatFecha = (valor) => {
    if (!valor) return "—"
    const iso = String(valor).slice(0, 10)
    const fecha = new Date(`${iso}T00:00:00`)
    if (Number.isNaN(fecha.getTime())) return valor
    return fecha.toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
}

/** Fecha de hoy en formato aaaa-mm-dd (para atributos min de inputs date). */
export const hoyISO = () => new Date().toISOString().slice(0, 10)

/** Iniciales para avatares sin foto. */
export const iniciales = (nombre = "") =>
    nombre.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("")

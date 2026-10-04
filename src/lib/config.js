/*
 * Configuración cargada desde las propiedades públicas del servidor (GET /propiedades).
 * VITE_API_URL solo se usa para descargar esa configuración; el resto de URLs viene de las propiedades.
 */
const URL_PROPIEDADES = `${import.meta.env.VITE_API_URL}/propiedades`

const PROPIEDADES_REQUERIDAS = ["API_URL", "SOCKET_URL", "IMAGENES_URL"]

const propiedades = {}

/** Descarga las propiedades públicas. Debe completarse antes de renderizar la app. */
export const cargarConfiguracion = async () => {
    const res = await fetch(URL_PROPIEDADES)
    const msg = await res.json()
    if (msg.codigo !== 1) throw new Error(msg.msg)

    msg.data.forEach(({ id, value }) => { propiedades[id] = value })

    const faltantes = PROPIEDADES_REQUERIDAS.filter(clave => !propiedades[clave])
    if (faltantes.length > 0) throw new Error(`Faltan propiedades: ${faltantes.join(", ")}`)
}

/** URL completa de un endpoint de la API: apiUrl("/buscar"). */
export const apiUrl = (ruta) => `${propiedades.API_URL}${ruta}`

export const socketUrl = () => propiedades.SOCKET_URL

export const imagenesUrl = () => propiedades.IMAGENES_URL

import { useEffect, useState } from "react"
import { apiUrl } from "./config"

// Cache en memoria: los catálogos se piden una sola vez por sesión de navegador
const cache = {}

const cargarCatalogo = (ruta) => {
    cache[ruta] ??= fetch(apiUrl(`/${ruta}`))
        .then(res => res.json())
        .then(msg => {
            switch (msg["codigo"]) {
                case 1:
                    return msg["data"]
                case 2:
                    return []
                default:
                    throw new Error(msg["msg"])
            }
        })
        .catch(error => {
            delete cache[ruta] // permite reintentar
            throw error
        })
    return cache[ruta]
}

/**
 * Carga un catálogo del backend (`comunas`, `rubros`).
 * Devuelve { items, isLoading, error, reintentar }.
 */
export const useCatalogo = (ruta) => {
    const [estado, setEstado] = useState({ items: [], isLoading: true, error: null })
    const [intento, setIntento] = useState(0)

    useEffect(() => {
        let activo = true
        setEstado(e => ({ ...e, isLoading: true, error: null }))
        cargarCatalogo(ruta)
            .then(items => activo && setEstado({ items, isLoading: false, error: null }))
            .catch(error => activo && setEstado({ items: [], isLoading: false, error }))
        return () => { activo = false }
    }, [ruta, intento])

    return { ...estado, reintentar: () => setIntento(i => i + 1) }
}

/** Nombre legible de una referencia poblada ({ _id, nombre }) o de un texto plano. */
export const nombreDe = (valor) => (valor && typeof valor === "object" ? valor.nombre : valor) ?? ""

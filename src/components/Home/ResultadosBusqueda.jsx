import { Header } from "../Global/Header"
import { Footer } from "../Global/Footer"
import { SearchBar } from "../Global/SearchBar"
import { Button, Avatar, Select, SelectItem, Chip } from "@nextui-org/react"
import { faLocationDot, faBriefcase, faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { EmptyState } from "../ui/EmptyState"
import { formatPrecio, imageUrl, parsePrecio } from "../../lib/format"

const opcionesOrden = [
    { key: "relevancia", label: "Más relevantes" },
    { key: "nombre", label: "Nombre (A-Z)" },
    { key: "precio", label: "Menor precio" },
]

const opcionesDisponibilidad = [
    { key: "todos", label: "Todos" },
    { key: "Disponible", label: "Disponible" },
    { key: "Contratado", label: "Contratado" },
]

const opcionesPrecio = [
    { key: "0", label: "Cualquier precio" },
    { key: "100000", label: "Hasta $100.000" },
    { key: "200000", label: "Hasta $200.000" },
    { key: "500000", label: "Hasta $500.000" },
    { key: "1000000", label: "Hasta $1.000.000" },
]

const precioMinimo = (especialista) => {
    const precios = (especialista.perfil?.servicios ?? [])
        .map(servicio => parsePrecio(Object.values(servicio)[0]))
        .filter(precio => precio !== null)
    return precios.length ? Math.min(...precios) : null
}

export const ResultadosBusqueda = () => {
    const [searchResults, setSearchResults] = useState([])
    const [orden, setOrden] = useState("relevancia")
    const [disponibilidad, setDisponibilidad] = useState("todos")
    const [precioMax, setPrecioMax] = useState("0")
    const [mostrarFiltros, setMostrarFiltros] = useState(false)
    const redirect = useNavigate()
    const location = useLocation()

    useEffect(() => {
        try {
            setSearchResults(JSON.parse(localStorage.getItem("searchResults")) ?? [])
        } catch {
            setSearchResults([])
        }
    }, [location.state])

    const resultados = useMemo(() => {
        let lista = [...searchResults]
        if (disponibilidad != "todos") lista = lista.filter(e => e.disponibilidad == disponibilidad)
        if (precioMax != "0") lista = lista.filter(e => {
            const precio = precioMinimo(e)
            return precio !== null && precio <= Number(precioMax)
        })
        if (orden == "nombre") lista.sort((a, b) => `${a.nombres} ${a.apellidos}`.localeCompare(`${b.nombres} ${b.apellidos}`, "es"))
        if (orden == "precio") lista.sort((a, b) => (precioMinimo(a) ?? Infinity) - (precioMinimo(b) ?? Infinity))
        return lista
    }, [searchResults, orden, disponibilidad, precioMax])

    const hayFiltros = disponibilidad != "todos" || precioMax != "0"
    const limpiarFiltros = () => { setDisponibilidad("todos"); setPrecioMax("0") }

    const visitarPerfil = (especialista) => {
        localStorage.setItem("perfilEspecialista", JSON.stringify(especialista))
        redirect("/buscar/perfilEspecialista")
    }

    const rubro = localStorage.getItem("rubro")
    const comuna = localStorage.getItem("comuna")

    return (
        <div className="flex min-h-screen flex-col bg-surface-muted">
            <Header />

            <section className="border-b border-default-100 bg-white">
                <div className="page-container py-4">
                    <SearchBar size="md" defaultComuna={comuna ?? ""} />
                </div>
            </section>

            <main className="page-container flex-1 py-8">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Resultados de la búsqueda</h1>
                        {rubro && comuna && (
                            <p className="mt-1 text-ink-muted">
                                {resultados.length} {resultados.length == 1 ? "profesional" : "profesionales"} de <strong className="text-ink">{rubro}</strong> en <strong className="text-ink">{comuna}</strong>
                            </p>
                        )}
                    </div>
                    <Button className="md:hidden" variant="bordered" startContent={<FontAwesomeIcon icon={faSliders} />} onPress={() => setMostrarFiltros(v => !v)} aria-expanded={mostrarFiltros}>
                        Filtros{hayFiltros && " •"}
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
                    <aside className={`${mostrarFiltros ? "flex" : "hidden"} card h-fit flex-col gap-4 p-5 md:sticky md:top-20 md:flex`} aria-label="Filtros">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">Filtrar y ordenar</h2>
                        <Select label="Ordenar por" size="sm" variant="bordered" disallowEmptySelection selectedKeys={[orden]} onSelectionChange={k => setOrden(Array.from(k)[0])}>
                            {opcionesOrden.map(o => <SelectItem key={o.key} value={o.key}>{o.label}</SelectItem>)}
                        </Select>
                        <Select label="Disponibilidad" size="sm" variant="bordered" disallowEmptySelection selectedKeys={[disponibilidad]} onSelectionChange={k => setDisponibilidad(Array.from(k)[0])}>
                            {opcionesDisponibilidad.map(o => <SelectItem key={o.key} value={o.key}>{o.label}</SelectItem>)}
                        </Select>
                        <Select label="Precio" size="sm" variant="bordered" disallowEmptySelection selectedKeys={[precioMax]} onSelectionChange={k => setPrecioMax(Array.from(k)[0])}>
                            {opcionesPrecio.map(o => <SelectItem key={o.key} value={o.key}>{o.label}</SelectItem>)}
                        </Select>
                        {hayFiltros && <Button size="sm" variant="light" color="primary" onPress={limpiarFiltros}>Limpiar filtros</Button>}
                    </aside>

                    <section className="flex flex-col gap-4" aria-live="polite">
                        {resultados.length == 0 ? (
                            <div className="card">
                                {searchResults.length == 0 ? (
                                    <EmptyState icon={faMagnifyingGlass} title="Aún no hay resultados" description="Ingresa tu comuna y el rubro que necesitas para encontrar profesionales cerca de ti." />
                                ) : (
                                    <EmptyState icon={faSliders} title="Ningún profesional coincide con los filtros" description="Prueba ampliando el rango de precio o cambiando la disponibilidad." action={<Button color="primary" variant="flat" onPress={limpiarFiltros}>Limpiar filtros</Button>} />
                                )}
                            </div>
                        ) : resultados.map((especialista) => {
                            const nombre = `${especialista.nombres} ${especialista.apellidos}`
                            const disponible = especialista.disponibilidad == "Disponible"
                            return (
                                <article key={especialista._id} className="card flex flex-col gap-4 p-5 sm:flex-row">
                                    <Avatar color="primary" isBordered radius="full" className="h-16 w-16 shrink-0" showFallback name={nombre} src={imageUrl(especialista.perfil?.foto)} />
                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div>
                                                <h2 className="text-lg font-semibold">{nombre}</h2>
                                                <p className="text-sm text-ink-muted">{especialista.profesion}</p>
                                            </div>
                                            {especialista.disponibilidad && (
                                                <Chip size="sm" variant="flat" color={disponible ? "success" : "default"}>{especialista.disponibilidad}</Chip>
                                            )}
                                        </div>
                                        {especialista.perfil?.experiencia && <p className="line-clamp-2 text-sm text-ink-body">{especialista.perfil.experiencia}</p>}
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
                                            <span><FontAwesomeIcon className="mr-1.5" icon={faLocationDot} />{especialista.comuna?.nombre ?? especialista.comuna}</span>
                                            {especialista.perfil?.antiguedad !== undefined && (
                                                <span><FontAwesomeIcon className="mr-1.5" icon={faBriefcase} />{especialista.perfil.antiguedad} años en Emplify</span>
                                            )}
                                        </div>
                                        {especialista.perfil?.servicios?.length > 0 && (
                                            <ul className="mt-1 flex flex-wrap gap-2" aria-label="Servicios">
                                                {especialista.perfil.servicios.map(servicio => (
                                                    <li key={Object.keys(servicio)[0]} className="rounded-lg bg-default-100 px-2.5 py-1 text-xs text-ink-body">
                                                        {Object.keys(servicio)[0]} · <strong className="text-ink">{formatPrecio(Object.values(servicio)[0])}</strong>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="flex items-end sm:items-center">
                                        <Button color="primary" className="w-full sm:w-auto" onPress={() => visitarPerfil(especialista)}>Ver perfil</Button>
                                    </div>
                                </article>
                            )
                        })}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}

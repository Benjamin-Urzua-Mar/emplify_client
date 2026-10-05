/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Chip, Input, Spinner } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo, faCopy, faCheck, faMagnifyingGlass, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { Logo } from "../ui/Logo"
import { PageHeader } from "../ui/PageHeader"
import { SectionCard } from "../ui/SectionCard"
import { apiUrl } from "../../lib/config"
import { CLAVE_DEMO, cuentasDemo, recorridosDemo, funcionesVisuales } from "../../data/demo"

const CODIGO_REGION_METROPOLITANA = "13"

const nombreDe = (referencia) => referencia?.nombre ?? referencia ?? ""

/** Botón que copia un texto al portapapeles y confirma visualmente. */
const BotonCopiar = ({ texto, etiqueta }) => {
    const [copiado, setCopiado] = useState(false)
    const copiar = async () => {
        try {
            await navigator.clipboard.writeText(texto)
            setCopiado(true)
            setTimeout(() => setCopiado(false), 1500)
        } catch {
            setCopiado(false)
        }
    }
    return (
        <Button isIconOnly size="sm" variant="light" aria-label={`Copiar ${etiqueta}`} onPress={copiar}>
            <FontAwesomeIcon icon={copiado ? faCheck : faCopy} className={copiado ? "text-success" : "text-ink-muted"} />
        </Button>
    )
}

/** Lista en vivo de los profesionales registrados (POST /buscar sin filtros). */
const useProfesionales = () => {
    const [estado, setEstado] = useState({ items: [], isLoading: true, error: false })

    useEffect(() => {
        fetch(apiUrl("/buscar"), { method: "POST", body: "{}", headers: { "Content-Type": "application/json" } })
            .then(res => res.json())
            .then(msg => setEstado({ items: msg["data"] ?? [], isLoading: false, error: msg["codigo"] === 10 }))
            .catch(() => setEstado({ items: [], isLoading: false, error: true }))
    }, [])

    return estado
}

// Región Metropolitana primero, luego por comuna, rubro y nombre
const ordenarProfesionales = (lista) => [...lista].sort((a, b) =>
    Number(b.comuna?.codigoRegion === CODIGO_REGION_METROPOLITANA) - Number(a.comuna?.codigoRegion === CODIGO_REGION_METROPOLITANA)
    || nombreDe(a.comuna).localeCompare(nombreDe(b.comuna), "es")
    || nombreDe(a.rubro).localeCompare(nombreDe(b.rubro), "es")
    || a.nombres.localeCompare(b.nombres, "es"))

const TablaProfesionales = () => {
    const { items, isLoading, error } = useProfesionales()
    const [filtro, setFiltro] = useState("")

    const visibles = useMemo(() => {
        const texto = filtro.trim().toLocaleLowerCase("es")
        const coincide = (p) => [p.nombres, p.apellidos, p.profesion, nombreDe(p.comuna), nombreDe(p.rubro)]
            .some(valor => (valor ?? "").toLocaleLowerCase("es").includes(texto))
        return ordenarProfesionales(texto ? items.filter(coincide) : items)
    }, [items, filtro])

    if (isLoading) return <div className="flex justify-center py-10"><Spinner label="Cargando profesionales..." /></div>
    if (error) return <p className="text-ink-muted">No pudimos cargar la lista. Intenta recargar la página.</p>

    return (
        <>
            <Input
                className="mb-4 max-w-sm"
                variant="bordered"
                placeholder="Filtrar por comuna, rubro o nombre"
                startContent={<FontAwesomeIcon icon={faMagnifyingGlass} className="text-ink-muted" />}
                value={filtro}
                onValueChange={setFiltro}
                isClearable
                onClear={() => setFiltro("")}
            />
            <p className="mb-3 text-sm text-ink-muted">{visibles.length} de {items.length} profesionales</p>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="border-b border-default-200 text-ink-muted">
                        <tr>
                            <th className="py-2 pr-4 font-medium">Comuna</th>
                            <th className="py-2 pr-4 font-medium">Rubro</th>
                            <th className="py-2 pr-4 font-medium">Profesional</th>
                            <th className="py-2 pr-4 font-medium">Usuario</th>
                            <th className="py-2 font-medium">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibles.map(p => (
                            <tr key={p._id} className="border-b border-default-100 last:border-0">
                                <td className="py-2.5 pr-4">{nombreDe(p.comuna)}</td>
                                <td className="py-2.5 pr-4">{nombreDe(p.rubro)}</td>
                                <td className="py-2.5 pr-4">
                                    <span className="font-medium text-ink">{p.nombres} {p.apellidos}</span>
                                    <span className="block text-ink-muted">{p.profesion}</span>
                                </td>
                                <td className="py-2.5 pr-4 font-mono text-xs">{p.email}</td>
                                <td className="py-2.5">
                                    <Chip size="sm" variant="flat" color={p.disponibilidad == "Disponible" ? "success" : "default"}>
                                        {p.disponibilidad ?? "—"}
                                    </Chip>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

/**
 * Guía de uso de la demo para reclutadores (/demo).
 * No está enlazada desde la navegación: se comparte directamente.
 */
export const GuiaDemo = () => {
    return (
        <div className="min-h-screen bg-surface-muted">
            <header className="border-b border-default-100 bg-white">
                <div className="page-container flex h-16 items-center justify-between">
                    <Logo size="sm" suffix="Demo" />
                    <Button as={Link} to="/" color="primary" size="sm">Ir a la aplicación</Button>
                </div>
            </header>

            <main className="page-container space-y-6 py-8">
                <PageHeader
                    title="Guía de la demo"
                    description="Emplify conecta a clientes con profesionales de oficios. Esta guía reúne las cuentas de prueba y los recorridos recomendados."
                />

                <div className="flex gap-3 rounded-2xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-800 sm:p-5">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 shrink-0" />
                    <div>
                        <p className="font-semibold">Esto es una demo: muchos botones y funcionalidades son solo visuales.</p>
                        <p className="mt-1">
                            El buscador, los inicios de sesión, las solicitudes de trabajo y el panel de administración funcionan.
                            Otras secciones muestran datos de ejemplo o todavía no hacen nada (detalle más abajo).
                            Todos los datos son ficticios y pueden restablecerse en cualquier momento.
                        </p>
                    </div>
                </div>

                <SectionCard
                    title="Cuentas de prueba"
                    description={`Todas las cuentas usan la clave ${CLAVE_DEMO}.`}
                    actions={<BotonCopiar texto={CLAVE_DEMO} etiqueta="clave" />}
                >
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {cuentasDemo.map(cuenta => (
                            <article key={cuenta.usuario} className="flex flex-col gap-3 rounded-xl border border-default-200 p-4">
                                <div className="flex items-center justify-between gap-2">
                                    <Chip size="sm" color="primary" variant="flat">{cuenta.rol}</Chip>
                                    <span className="text-sm font-medium text-ink">{cuenta.perfil}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-muted px-3 py-2">
                                    <div className="min-w-0">
                                        <p className="text-xs text-ink-muted">Usuario</p>
                                        <p className="truncate font-mono text-sm text-ink">{cuenta.usuario}</p>
                                    </div>
                                    <BotonCopiar texto={cuenta.usuario} etiqueta="usuario" />
                                </div>
                                <div className="rounded-lg bg-surface-muted px-3 py-2">
                                    <p className="text-xs text-ink-muted">Clave</p>
                                    <p className="font-mono text-sm text-ink">{CLAVE_DEMO}</p>
                                </div>
                                <p className="flex-1 text-sm text-ink-body">{cuenta.detalle}</p>
                                <Button as={Link} to={cuenta.login} variant="bordered" size="sm">Iniciar sesión como {cuenta.rol.toLowerCase()}</Button>
                            </article>
                        ))}
                    </div>
                    <p className="mt-4 text-sm text-ink-muted">
                        Cualquier profesional de la lista de abajo también puede iniciar sesión con su usuario y la misma clave.
                    </p>
                </SectionCard>

                <SectionCard title="Recorridos sugeridos">
                    <div className="grid gap-6 md:grid-cols-3">
                        {recorridosDemo.map(recorrido => (
                            <div key={recorrido.titulo}>
                                <h3 className="mb-2 font-semibold text-ink">{recorrido.titulo}</h3>
                                <ol className="list-decimal space-y-1.5 pl-5 text-sm text-ink-body">
                                    {recorrido.pasos.map(paso => <li key={paso}>{paso}</li>)}
                                </ol>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard title="Funciones solo visuales" description="Se ven en la interfaz, pero en esta demo no guardan datos o muestran información de ejemplo.">
                    <ul className="grid gap-2 text-sm text-ink-body md:grid-cols-2">
                        {funcionesVisuales.map(funcion => (
                            <li key={funcion} className="flex gap-2">
                                <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5 text-ink-muted" />
                                <span>{funcion}</span>
                            </li>
                        ))}
                    </ul>
                </SectionCard>

                <SectionCard
                    title="Profesionales disponibles"
                    description="Lista en vivo, con la Región Metropolitana primero. Usa estas comunas y rubros en el buscador para obtener resultados."
                >
                    <TablaProfesionales />
                </SectionCard>
            </main>
        </div>
    )
}

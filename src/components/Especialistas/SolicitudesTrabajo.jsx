/* eslint-disable react/prop-types */
import { Button, Input, Textarea, Tabs, Tab, Spinner, Chip } from "@nextui-org/react"
import { faInbox, faHammer, faFlagCheckered } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import { AccountLayout } from "../ui/AccountLayout"
import { PageHeader } from "../ui/PageHeader"
import { EmptyState } from "../ui/EmptyState"
import { navEspecialista } from "../../data/navegacion"
import { alertError, alertNetworkError, confirmDialog, toast } from "../../lib/alerts"
import { formatFecha } from "../../lib/format"

const API = 'https://emplifyapi.burzuam.dpdns.org/especialistas'

const post = (ruta, data) => fetch(`${API}/${ruta}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
}).then(res => res.json())

/** Tarjeta estándar de trabajo/solicitud */
const TrabajoCard = ({ titulo, servicio, estado, children, footer }) => (
    <article className="card overflow-hidden">
        <header className="flex flex-wrap items-start justify-between gap-2 border-b border-default-100 px-5 py-4">
            <div>
                <h3 className="font-semibold">{titulo}</h3>
                <p className="text-sm text-ink-muted">Servicio: {servicio}</p>
            </div>
            {estado}
        </header>
        <div className="flex flex-col gap-4 px-5 py-4 text-sm">{children}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-default-100 bg-surface-muted px-5 py-3">{footer}</footer>}
    </article>
)

const Dato = ({ label, children }) => (
    <div>
        <dt className="text-xs font-medium uppercase tracking-wider text-ink-muted">{label}</dt>
        <dd className="mt-0.5 text-ink">{children}</dd>
    </div>
)

export const SolicitudesTrabajo = () => {
    const [solicitudes, setSolicitudes] = useState([])
    const [vista, setVista] = useState("solicitudes")
    const [trabajosEnCurso, setTrabajosEnCurso] = useState([])
    const [trabajosTerminados, setTrabajosTerminados] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [procesando, setProcesando] = useState(null)
    const _id = localStorage.getItem("user_id")

    const cargar = async (ruta, setter, avisarSiVacio) => {
        setIsLoading(true)
        try {
            const msg = await post(ruta, { _id })
            switch (msg["codigo"]) {
                case 1:
                    setter(msg["data"])
                    break;
                case 2:
                    setter([])
                    if (avisarSiVacio) toast.fire({ icon: 'info', title: msg["msg"] })
                    else alertError(msg["msg"])
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

    useEffect(() => {
        if (vista == "solicitudes") cargar("getSolicitudesTrabajos", setSolicitudes, false)
        if (vista == "en_curso") cargar("trabajosEnCurso", setTrabajosEnCurso, true)
        if (vista == "terminados") cargar("trabajosTerminados", setTrabajosTerminados, true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vista])

    const actualizarSolicitud = (index, campo, valor) =>
        setSolicitudes(lista => lista.map((s, i) => i == index ? { ...s, [campo]: valor } : s))

    const aceptarTrabajo = async (e, solicitud, index) => {
        e.preventDefault()
        const solis = solicitudes.filter((_, i) => i != index)
        const trabajo = { ...solicitud, estado: "Activo" }
        delete trabajo.nombreCliente

        setProcesando(index)
        try {
            const msg = await post("aceptarTrabajo", { trabajo, solicitudes: solis })
            switch (msg["codigo"]) {
                case 1:
                    setSolicitudes(solis)
                    toast.fire({ icon: 'success', title: msg["msg"] })
                    break;
                case 2:
                case 10:
                    alertError(msg["msg"])
                    break;
            }
        } catch {
            alertNetworkError()
        } finally {
            setProcesando(null)
        }
    }

    const finalizarTrabajo = async (trabajo, index) => {
        const confirmado = await confirmDialog({
            title: "¿Terminar trabajo?",
            text: `Marcarás como terminado el trabajo para ${trabajo.nombreCliente}.`,
            confirmText: "Sí, terminar",
        })
        if (!confirmado) return

        setProcesando(index)
        try {
            const msg = await post("finalizarTrabajo", { _id: trabajo._id })
            switch (msg["codigo"]) {
                case 1:
                    setTrabajosEnCurso(lista => lista.filter((_, i) => i != index))
                    toast.fire({ icon: 'success', title: msg["msg"] })
                    break;
                case 10:
                    alertError(msg["msg"])
                    break;
            }
        } catch {
            alertNetworkError()
        } finally {
            setProcesando(null)
        }
    }

    const renderContenido = () => {
        if (isLoading) return <div className="flex justify-center py-16"><Spinner label="Cargando…" /></div>

        switch (vista) {
            case "solicitudes":
                return solicitudes.length == 0
                    ? <div className="card"><EmptyState icon={faInbox} title="No tienes solicitudes nuevas" description="Cuando un cliente te solicite un servicio, aparecerá aquí." /></div>
                    : solicitudes.map((solicitud, index) => (
                        <form key={solicitud._id ?? index} onSubmit={(e) => aceptarTrabajo(e, solicitud, index)}>
                            <TrabajoCard
                                titulo={`Solicitud de ${solicitud.nombreCliente}`}
                                servicio={solicitud.servicio}
                                estado={<Chip size="sm" variant="flat" color="warning">Pendiente</Chip>}
                                footer={
                                    <>
                                        <Button color="danger" variant="light" type="button" isDisabled title="Disponible próximamente">Rechazar</Button>
                                        <Button color="primary" type="submit" isLoading={procesando == index}>Aceptar trabajo</Button>
                                    </>
                                }
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Input type="date" label="Fecha de inicio" labelPlacement="outside" variant="bordered" value={solicitud.fechaInicio?.slice(0, 10) ?? ""} onValueChange={(v) => actualizarSolicitud(index, "fechaInicio", v)} />
                                    <Input type="date" label="Fecha de término" labelPlacement="outside" variant="bordered" value={solicitud.fechaFin ?? ""} min={solicitud.fechaInicio?.slice(0, 10)} onValueChange={(v) => actualizarSolicitud(index, "fechaFin", v)} />
                                </div>
                                <Textarea
                                    label="Descripción"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    placeholder="Detalles del trabajo acordado"
                                    value={solicitud.descripcion}
                                    onValueChange={(v) => actualizarSolicitud(index, "descripcion", v)}
                                />
                            </TrabajoCard>
                        </form>
                    ))
            case "en_curso":
            case "terminados": {
                const lista = vista == "en_curso" ? trabajosEnCurso : trabajosTerminados
                const enCurso = vista == "en_curso"
                return lista.length == 0
                    ? <div className="card"><EmptyState icon={enCurso ? faHammer : faFlagCheckered} title={enCurso ? "No tienes trabajos en curso" : "Aún no tienes trabajos terminados"} /></div>
                    : lista.map((trabajo, index) => (
                        <TrabajoCard
                            key={trabajo._id ?? index}
                            titulo={`Trabajo para ${trabajo.nombreCliente}`}
                            servicio={trabajo.servicio}
                            estado={<Chip size="sm" variant="flat" color={enCurso ? "primary" : "success"}>{enCurso ? "En curso" : "Terminado"}</Chip>}
                            footer={enCurso && <Button color="primary" isLoading={procesando == index} onPress={() => finalizarTrabajo(trabajo, index)}>Terminar trabajo</Button>}
                        >
                            <dl className="grid gap-4 sm:grid-cols-3">
                                <Dato label="Inicio">{formatFecha(trabajo.fechaInicio)}</Dato>
                                <Dato label="Término">{formatFecha(trabajo.fechaFin)}</Dato>
                                <div className="sm:col-span-3"><Dato label="Descripción">{trabajo.descripcion || "—"}</Dato></div>
                            </dl>
                        </TrabajoCard>
                    ))
            }
        }
    }

    return (
        <AccountLayout navTitle="Mi cuenta" nav={navEspecialista}>
            <PageHeader title="Trabajos" description="Gestiona las solicitudes de tus clientes y los trabajos en curso." />
            <Tabs aria-label="Estado de los trabajos" color="primary" variant="underlined" selectedKey={vista} onSelectionChange={setVista} classNames={{ base: "mb-4", tabList: "gap-6" }}>
                <Tab key="solicitudes" title="Solicitudes" />
                <Tab key="en_curso" title="En curso" />
                <Tab key="terminados" title="Terminados" />
            </Tabs>
            <div className="flex flex-col gap-4">{renderContenido()}</div>
        </AccountLayout>
    )
}

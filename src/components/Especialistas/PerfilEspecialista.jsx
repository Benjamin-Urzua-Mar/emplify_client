/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Header } from '../Global/Header'
import { Footer } from "../Global/Footer"
import { Chat } from '../Global/Chat';
import { Button, Avatar, Textarea, Input, Image, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip } from "@nextui-org/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhotoFilm, faMessage, faLocationDot, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { SectionCard } from '../ui/SectionCard';
import { EmptyState } from '../ui/EmptyState';
import { Rating } from '../ui/Rating';
import { alertError, alertNetworkError, confirmDialog, toast } from '../../lib/alerts';
import { formatPrecio, hoyISO, imageUrl } from '../../lib/format';

const condiciones = [
    "El cliente debe proporcionar toda la información y recursos necesarios para la realización del servicio contratado.",
    "Las citas canceladas con menos de 24 horas de antelación no serán reembolsadas.",
    "En caso de retraso por parte del cliente, el especialista no está obligado a compensar el tiempo perdido.",
    "El cliente debe respetar el tiempo acordado para la cita; cualquier servicio que requiera tiempo adicional puede incurrir en costos adicionales.",
    "El especialista se compromete a mantener la confidencialidad de la información proporcionada por el cliente.",
    "El cliente se compromete a realizar el pago acordado antes de la prestación del servicio.",
    "El especialista no se hace responsable de los problemas derivados de la incorrecta aplicación de las soluciones proporcionadas.",
]

const opiniones = [
    { nombre: "Usuario 1", fecha: "12 de septiembre, 2023", texto: "¡Excelente servicio! Muy profesional y resolutivo.", avatar: "https://i.pravatar.cc/150?u=a04258114e29026708c" },
    { nombre: "Juan", fecha: "12 de septiembre, 2023", texto: "¡Excelente servicio! Muy profesional y resolutivo.", avatar: "https://i.pravatar.cc/150?u=a04258114e29026708d" },
    { nombre: "Usuario 2", fecha: "12 de septiembre, 2023", texto: "¡Excelente servicio! Muy profesional y resolutivo.", avatar: "https://i.pravatar.cc/150?u=a04258114e29026708e" },
]

export const PerfilEspecialista = ({ socket }) => {
    const [showChat, setShowChat] = useState("hidden")
    const [servicio, setServicio] = useState("")
    const [fecha, setFecha] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [errores, setErrores] = useState({})
    const [isSending, setIsSending] = useState(false)
    const [calificacion, setCalificacion] = useState(0)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const redirect = useNavigate()
    const [especialista] = useState(() => {
        try { return JSON.parse(localStorage.getItem("perfilEspecialista")) } catch { return null }
    })
    const logueado = localStorage.getItem("user_id") !== null

    const pedirLogin = async (accion) => {
        const ir = await confirmDialog({ title: "Inicia sesión", text: `Necesitas una cuenta de cliente para ${accion}.`, confirmText: "Iniciar sesión" })
        if (ir) redirect("/clientes/login")
    }

    const reservarCita = () => {
        if (!logueado) return pedirLogin("solicitar un servicio")
        const nuevosErrores = {
            servicio: servicio ? null : "Selecciona un servicio",
            fecha: fecha ? null : "Selecciona una fecha de inicio",
        }
        setErrores(nuevosErrores)
        if (!nuevosErrores.servicio && !nuevosErrores.fecha) onOpen()
    }

    const reservar = async () => {
        const body = JSON.stringify({
            estado: "",
            cliente: localStorage.getItem("user_id"),
            especialista: especialista._id,
            fechaInicio: fecha,
            fechaFin: "",
            descripcion: descripcion,
            servicio: servicio,
            foto: ""
        })

        setIsSending(true)
        try {
            const res = await fetch('https://emplifyapi.burzuam.dpdns.org/clientes/solicitarTrabajo', { method: 'POST', body: body, headers: { "Content-Type": "application/json" } })
            const msg = await res.json()
            onClose()
            switch (msg["codigo"]) {
                case 1:
                    toast.fire({ icon: 'success', title: msg["msg"] })
                    setServicio(""); setFecha(""); setDescripcion("")
                    break;
                case 2:
                case 3:
                case 10:
                    alertError(msg["msg"])
                    break;
            }
        } catch {
            onClose()
            alertNetworkError()
        } finally {
            setIsSending(false)
        }
    }

    const enviarMensaje = (msg) => {
        socket.emit("msg", { msg: msg, room: localStorage.getItem("chatRoom") })
    }

    const handleChat = () => {
        if (!logueado) return pedirLogin("enviar mensajes")
        setShowChat("fixed")
        localStorage.setItem("chatRoom", especialista._id)
    }

    if (!especialista) {
        return (
            <div className="flex min-h-screen flex-col bg-surface-muted">
                <Header />
                <main className="page-container flex-1 py-16">
                    <div className="card">
                        <EmptyState icon={faUserSlash} title="No encontramos este perfil" description="Vuelve a buscar profesionales para ver sus perfiles."
                            action={<Button as={Link} to="/" color="primary">Buscar profesionales</Button>} />
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const nombre = `${especialista.nombres} ${especialista.apellidos}`
    const servicios = especialista.perfil?.servicios ?? []

    return (
        <div className="flex min-h-screen flex-col bg-surface-muted">
            {socket && <Chat isVisible={showChat} onSubmit={enviarMensaje} onClose={() => setShowChat("hidden")} socket={socket} />}
            <Header />
            <main className="page-container grid flex-1 gap-6 py-8 lg:grid-cols-[1fr_22rem] lg:items-start">
                <div className="flex min-w-0 flex-col gap-6">
                    {/* Encabezado del perfil */}
                    <section className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
                        <Avatar color="primary" isBordered radius="lg" className="h-24 w-24 shrink-0 text-large" showFallback name={nombre} src={imageUrl(especialista.perfil?.foto)} />
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">{nombre}</h1>
                            <p className="text-ink-muted">{especialista.profesion}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
                                <Rating value={4.8} count={50} />
                                {especialista.comuna && <span><FontAwesomeIcon className="mr-1.5" icon={faLocationDot} />{especialista.comuna?.nombre ?? especialista.comuna}</span>}
                                {especialista.disponibilidad && <Chip size="sm" variant="flat" color={especialista.disponibilidad == "Disponible" ? "success" : "default"}>{especialista.disponibilidad}</Chip>}
                            </div>
                        </div>
                        <Button color="primary" variant="bordered" startContent={<FontAwesomeIcon icon={faMessage} />} onPress={handleChat}>Enviar mensaje</Button>
                    </section>

                    <SectionCard title="Sobre mí">
                        <p className="whitespace-pre-line text-ink-body">{especialista.perfil?.experiencia || "Este profesional aún no ha agregado una descripción."}</p>
                        <div className="mt-6 grid gap-6 border-t border-default-100 pt-6 sm:grid-cols-2">
                            <div>
                                <h3 className="font-semibold">Especialidad</h3>
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-body">
                                    <li>Base de datos</li>
                                    <li>Power BI</li>
                                    <li>DataXD</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold">Formación</h3>
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-body">
                                    <li>Universidad de Chile, 2020</li>
                                    <li>Master en Ciencias de Datos</li>
                                    <li>Licenciatura en Datos</li>
                                </ul>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="Servicios y precios">
                        {servicios.length == 0 ? <p className="text-sm text-ink-muted">Sin servicios publicados.</p> : (
                            <ul className="divide-y divide-default-100">
                                {servicios.map(s => (
                                    <li key={Object.keys(s)[0]} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                        <span className="text-ink-body">{Object.keys(s)[0]}</span>
                                        <span className="font-semibold text-ink">{formatPrecio(Object.values(s)[0])}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </SectionCard>

                    <SectionCard title="Mis trabajos">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {[1, 2, 3, 4].map(n => (
                                <figure key={n} className="overflow-hidden rounded-xl border border-default-100 bg-surface-muted">
                                    <Image src="https://placehold.jp/250x150.png" alt={`Trabajo ${n}`} radius="none" removeWrapper className="h-44 w-full object-cover" />
                                    <figcaption className="p-3 text-center text-sm text-ink-body">Descripción del trabajo {n}</figcaption>
                                </figure>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard title="Opiniones (50)" actions={<span className="flex items-center gap-2 text-lg font-semibold text-ink">4.8 <Rating value={4.8} /></span>}>
                        {logueado && (
                            <div className="mb-6 flex gap-4 border-b border-default-100 pb-6">
                                <Avatar color="primary" isBordered size="md" showFallback name={localStorage.getItem("userName") ?? ""} className="shrink-0" />
                                <div className="flex min-w-0 flex-1 flex-col gap-3">
                                    <span className="font-semibold text-ink">{localStorage.getItem("userName")}</span>
                                    <Textarea variant="bordered" minRows={2} aria-label="Tu opinión" placeholder="Cuéntanos cómo fue tu experiencia…" />
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <span className="flex items-center gap-2 text-sm text-ink-muted">Calificar: <Rating value={calificacion} onChange={setCalificacion} size="md" /></span>
                                        <div className="flex gap-2">
                                            <Button variant="bordered" startContent={<FontAwesomeIcon icon={faPhotoFilm} />}>Subir evidencias</Button>
                                            <Button color="primary">Publicar</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <ul className="flex flex-col gap-5">
                            {opiniones.map((op, i) => (
                                <li key={i} className="flex gap-4">
                                    <Avatar size="md" showFallback name={op.nombre} src={op.avatar} className="shrink-0" />
                                    <div>
                                        <p className="font-semibold text-ink">{op.nombre}</p>
                                        <p className="text-xs text-ink-muted">{op.fecha}</p>
                                        <p className="mt-1 text-ink-body">{op.texto}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 flex justify-center">
                            <Button variant="light" color="primary">Ver más opiniones</Button>
                        </div>
                    </SectionCard>
                </div>

                {/* Contratar especialista */}
                <aside className="lg:sticky lg:top-6">
                    <div className="card flex flex-col gap-4 p-6">
                        <h2 className="text-xl font-semibold">Contratar especialista</h2>
                        <Select
                            label="Servicio"
                            labelPlacement="outside"
                            variant="bordered"
                            placeholder="Selecciona un servicio"
                            isRequired
                            items={servicios.map(s => ({ key: Object.keys(s)[0], precio: Object.values(s)[0] }))}
                            selectedKeys={servicio ? [servicio] : []}
                            onSelectionChange={(keys) => { setServicio(Array.from(keys)[0] ?? ""); setErrores(e => ({ ...e, servicio: null })) }}
                            isInvalid={!!errores.servicio}
                            errorMessage={errores.servicio}
                        >
                            {(s) => <SelectItem key={s.key} textValue={s.key} description={formatPrecio(s.precio)}>{s.key}</SelectItem>}
                        </Select>
                        <Input
                            type="date"
                            label="Fecha de inicio"
                            labelPlacement="outside"
                            placeholder="dd-mm-aaaa"
                            variant="bordered"
                            isRequired
                            min={hoyISO()}
                            value={fecha}
                            onValueChange={(v) => { setFecha(v); setErrores(e => ({ ...e, fecha: null })) }}
                            isInvalid={!!errores.fecha}
                            errorMessage={errores.fecha}
                        />
                        <Textarea
                            label="Descripción"
                            labelPlacement="outside"
                            variant="bordered"
                            placeholder="Describe brevemente los detalles de tu solicitud"
                            value={descripcion}
                            onValueChange={setDescripcion}
                        />
                        <Button onPress={reservarCita} color="primary" size="lg" className="font-medium">Solicitar servicio</Button>
                        <p className="text-center text-xs text-ink-muted">No se realizará ningún cobro hasta que el especialista acepte.</p>
                    </div>
                </aside>
            </main>

            <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader className="font-display">Condiciones de la reserva</ModalHeader>
                    <ModalBody>
                        <ul className="list-disc space-y-2 pl-5 text-sm text-ink-body">
                            {condiciones.map(c => <li key={c}>{c}</li>)}
                        </ul>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="bordered" onPress={onClose}>Cancelar</Button>
                        <Button color="primary" onPress={reservar} isLoading={isSending}>Aceptar y reservar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Footer />
        </div>
    )
}

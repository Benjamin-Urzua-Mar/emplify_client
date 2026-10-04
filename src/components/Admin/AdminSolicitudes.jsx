import { Button, Avatar, Select, SelectItem, Chip } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import { PageHeader } from "../ui/PageHeader";
import { formatFecha } from "../../lib/format";

// Datos de demostración hasta que exista el endpoint de solicitudes de registro
const solicitudesDemo = [
    { id: 1, nombre: "Pedrito Sánchez", email: "email@ejemplo.com", profesional: "Zoey Lang", fecha: "2023-09-21" },
]

const documentos = ["Cédula de identidad", "Certificado de antecedentes", "Certificado de residencia"]

export const AdminSolicitudes = () => {
    const [orden, setOrden] = useState("recientes")

    const solicitudes = useMemo(() => [...solicitudesDemo].sort((a, b) =>
        orden == "recientes" ? b.fecha.localeCompare(a.fecha) : a.fecha.localeCompare(b.fecha)
    ), [orden])

    return (
        <main className="page-container py-8">
            <PageHeader title="Solicitudes de registro" description="Revisa la documentación de los especialistas antes de aprobar su cuenta." />
            <section className="card mb-4 flex flex-wrap items-center gap-4 p-4">
                <Select label="Ordenar por" size="sm" variant="bordered" disallowEmptySelection selectedKeys={[orden]} onSelectionChange={k => setOrden(Array.from(k)[0])} className="max-w-[12rem]">
                    <SelectItem key="recientes" value="recientes">Más recientes</SelectItem>
                    <SelectItem key="antiguas" value="antiguas">Más antiguas</SelectItem>
                </Select>
            </section>

            <div className="flex flex-col gap-4">
                {solicitudes.map(s => (
                    <article key={s.id} className="card overflow-hidden">
                        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-default-100 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <Avatar name={s.nombre} showFallback radius="lg" />
                                <div>
                                    <p className="font-medium text-ink">{s.nombre}</p>
                                    <p className="text-sm text-ink-muted">{s.email}</p>
                                </div>
                            </div>
                            <Chip size="sm" variant="flat" color="warning">Pendiente</Chip>
                        </header>
                        <div className="flex flex-col gap-3 px-5 py-4">
                            <h3 className="text-lg font-semibold">Solicitud de registro</h3>
                            <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                                <div><dt className="inline text-ink-muted">Profesional: </dt><dd className="inline font-medium text-ink">{s.profesional}</dd></div>
                                <div><dt className="inline text-ink-muted">Fecha de solicitud: </dt><dd className="inline font-medium text-ink">{formatFecha(s.fecha)}</dd></div>
                            </dl>
                            <div>
                                <p className="mb-2 text-sm text-ink-muted">Documentos para revisar:</p>
                                <div className="flex flex-wrap gap-2">
                                    {documentos.map(doc => (
                                        <Button key={doc} size="sm" variant="flat" color="primary" startContent={<FontAwesomeIcon icon={faFileLines} />}>{doc}</Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <footer className="flex justify-end gap-2 border-t border-default-100 bg-surface-muted px-5 py-3">
                            <Button color="danger" variant="light">Rechazar</Button>
                            <Button color="primary">Aprobar</Button>
                        </footer>
                    </article>
                ))}
            </div>
        </main>
    )
}

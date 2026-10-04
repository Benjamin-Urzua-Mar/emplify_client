import { Button, Avatar, Select, SelectItem, Switch, Chip } from "@nextui-org/react";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import { PageHeader } from "../ui/PageHeader";
import { EmptyState } from "../ui/EmptyState";
import { formatFecha } from "../../lib/format";

const colorPrioridad = { Alta: "danger", Media: "warning", Baja: "default" }
const colorEstado = { Resuelto: "success", Pendiente: "warning", "En proceso": "primary" }
const pesoPrioridad = { Alta: 0, Media: 1, Baja: 2 }

// Datos de demostración hasta que exista el endpoint de reportes
const reportesDemo = [
  { id: 1, cliente: "Pedrito Sánchez", email: "email@ejemplo.com", titulo: "Problema de compromiso con el profesional", profesional: "Zoey Lang", fecha: "2023-09-21", prioridad: "Alta", estado: "Resuelto", descripcion: "El profesional no se presentó en la fecha acordada y no respondió los mensajes durante dos días." },
  { id: 2, cliente: "Pedrito Sánchez", email: "email@ejemplo.com", titulo: "Problema de compromiso con el profesional", profesional: "Zoey Lang", fecha: "2023-09-20", prioridad: "Alta", estado: "Pendiente", descripcion: "El trabajo quedó incompleto y el profesional solicitó un pago adicional no acordado." },
  { id: 3, cliente: "Pedrito Sánchez", email: "email@ejemplo.com", titulo: "Problema de compromiso con el profesional", profesional: "Zoey Lang", fecha: "2023-09-19", prioridad: "Media", estado: "En proceso", descripcion: "Retraso de una semana en la entrega sin aviso previo." },
]

export const AdminReportes = () => {
  const [orden, setOrden] = useState("fecha")
  const [mostrarResueltos, setMostrarResueltos] = useState(false)

  const reportes = useMemo(() => {
    const lista = reportesDemo.filter(r => mostrarResueltos || r.estado != "Resuelto")
    const comparadores = {
      fecha: (a, b) => b.fecha.localeCompare(a.fecha),
      prioridad: (a, b) => pesoPrioridad[a.prioridad] - pesoPrioridad[b.prioridad],
      estado: (a, b) => a.estado.localeCompare(b.estado),
    }
    return lista.sort(comparadores[orden])
  }, [orden, mostrarResueltos])

  return (
    <main className="page-container py-8">
      <PageHeader title="Reportes" description="Problemas reportados por los clientes." />
      <section className="card mb-4 flex flex-wrap items-center gap-4 p-4">
        <Select label="Ordenar por" size="sm" variant="bordered" disallowEmptySelection selectedKeys={[orden]} onSelectionChange={k => setOrden(Array.from(k)[0])} className="max-w-[12rem]">
          <SelectItem key="fecha" value="fecha">Fecha</SelectItem>
          <SelectItem key="prioridad" value="prioridad">Prioridad</SelectItem>
          <SelectItem key="estado" value="estado">Estado</SelectItem>
        </Select>
        <Switch size="sm" isSelected={mostrarResueltos} onValueChange={setMostrarResueltos}>Mostrar resueltos</Switch>
      </section>

      <div className="flex flex-col gap-4">
        {reportes.length == 0 && <div className="card"><EmptyState icon={faFlag} title="No hay reportes pendientes" /></div>}
        {reportes.map(r => (
          <article key={r.id} className="card overflow-hidden">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-default-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <Avatar name={r.cliente} showFallback radius="lg" />
                <div>
                  <p className="font-medium text-ink">{r.cliente}</p>
                  <p className="text-sm text-ink-muted">{r.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Chip size="sm" variant="flat" color={colorPrioridad[r.prioridad]}>Prioridad {r.prioridad.toLowerCase()}</Chip>
                <Chip size="sm" variant="flat" color={colorEstado[r.estado]}>{r.estado}</Chip>
              </div>
            </header>
            <div className="flex flex-col gap-3 px-5 py-4">
              <h3 className="text-lg font-semibold">{r.titulo}</h3>
              <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <div><dt className="inline text-ink-muted">Profesional: </dt><dd className="inline font-medium text-ink">{r.profesional}</dd></div>
                <div><dt className="inline text-ink-muted">Fecha: </dt><dd className="inline font-medium text-ink">{formatFecha(r.fecha)}</dd></div>
              </dl>
              <p className="text-ink-body">{r.descripcion}</p>
            </div>
            {r.estado != "Resuelto" && (
              <footer className="flex justify-end gap-2 border-t border-default-100 bg-surface-muted px-5 py-3">
                <Button color="danger" variant="light">Descartar</Button>
                <Button color="primary">Atender</Button>
              </footer>
            )}
          </article>
        ))}
      </div>
    </main>
  )
}

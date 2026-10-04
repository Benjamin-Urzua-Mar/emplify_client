import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@nextui-org/react"
import { AccountLayout } from '../ui/AccountLayout'
import { PageHeader } from '../ui/PageHeader'
import { navCliente } from '../../data/navegacion'

const colorEstado = {
    "Activo": "primary",
    "Terminado": "success",
    "Cancelado": "danger",
}

export const HistorialTrabajos = () => {

    const trabajos = [
        {
            "key": 1,
            "estadoTrabajo": "Activo",
            "cliente": "Gerardo Benitez Daza",
            "especialista": "Felipe Arriagada Perez",
            "fechaInicio": "01-07-2022",
            "fechaFin": "18-07-2022",
            "descripcionTrabajo": "Se realizó una página web con tal, tal y tal",
            "tipoServicio": "Desarrollo web"
        },
        {
            "key": 2,
            "estadoTrabajo": "Terminado",
            "cliente": "Analia Martinez Flores",
            "especialista": "Francisco Martinez Ortiz",
            "fechaInicio": "01-07-2022",
            "fechaFin": "18-07-2022",
            "descripcionTrabajo": "Se realizó una app móvil con tal, tal y tal",
            "tipoServicio": "Desarrollo móvil"
        }
    ]

    const columnas = [
        { "key": "tipoServicio", "label": "Servicio" },
        { "key": "especialista", "label": "Especialista" },
        { "key": "estadoTrabajo", "label": "Estado" },
        { "key": "fechaInicio", "label": "Inicio" },
        { "key": "fechaFin", "label": "Término" },
        { "key": "descripcionTrabajo", "label": "Descripción" },
    ]

    const renderCelda = (trabajo, key) => {
        switch (key) {
            case "estadoTrabajo":
                return <Chip size="sm" variant="flat" color={colorEstado[trabajo.estadoTrabajo] ?? "default"}>{trabajo.estadoTrabajo}</Chip>
            case "tipoServicio":
                return <span className="font-medium text-ink">{trabajo.tipoServicio}</span>
            case "descripcionTrabajo":
                return <span className="line-clamp-2 min-w-[12rem] text-ink-muted">{trabajo.descripcionTrabajo}</span>
            default:
                return <span className="whitespace-nowrap">{trabajo[key]}</span>
        }
    }

    return (
        <AccountLayout navTitle="Mi cuenta" nav={navCliente}>
            <PageHeader title="Historial de trabajos" description="Revisa los servicios que has contratado." />
            <Table aria-label="Historial de trabajos" classNames={{ wrapper: "shadow-card" }}>
                <TableHeader columns={columnas}>
                    {(columna) => <TableColumn key={columna.key}>{columna.label}</TableColumn>}
                </TableHeader>
                <TableBody items={trabajos} emptyContent="Aún no has contratado servicios.">
                    {(trabajo) => (
                        <TableRow key={trabajo.key}>
                            {(keyColumna) => <TableCell>{renderCelda(trabajo, keyColumna)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </AccountLayout>
    )
}

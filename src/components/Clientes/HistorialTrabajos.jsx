import { Header } from '../Global/Header'
import { Footer } from '../Global/Footer'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react"
import { useEffect, useState } from 'react'

export const HistorialTrabajos = () => {

    const trabajos = [
        {
            "key": 1,
            "estadoTrabajo": "Activo",
            "cliente": "Gerardo Benitez Daza",
            "especialista": "Felipe Arriagada Perez",
            "fechaInicio": "01-07-2022",
            "fechaFin": "18-07-2022",
            "descripcionTrabajo": "Se realizo una página web con tal, tal y tal",
            "tipoServicio": "Desarrollo web"
        },
        {
            "key": 2,
            "estadoTrabajo": "Terminado",
            "cliente": "Analia Martinez Flores",
            "especialista": "Francisco Martinez Ortiz",
            "fechaInicio": "01-07-2022",
            "fechaFin": "18-07-2022",
            "descripcionTrabajo": "Se realizo una app movil con tal, tal y tal",
            "tipoServicio": "Desarrollo movil"
        }
    ]

    const columnas = [
        {
            "key": "estadoTrabajo",
            "label": "Estado del trabajo"
        },
        {
            "key": "cliente",
            "label": "Cliente"
        },
        {
            "key": "especialista",
            "label": "Especialista"
        },
        {
            "key": "fechaInicio",
            "label": "Fecha de inicio"
        },
        {
            "key": "fechaFin",
            "label": "Fecha de finalización"
        },
        {
            "key": "descripcionTrabajo",
            "label": "Descripción del trabajo"
        },
        {
            "key": "tipoServicio",
            "label": "Servicio"
        }
    ]

    //const [trabajos, setTrabajos] = useState({})

    /*
    useEffect(() => {
        fetch("/public/trabajo.json").then(
            response => response.json()
        ).then(
            data => {
                setTrabajos(data)
            }
        )
    })
    */
    return (
        <>
            <Header />
            <div className="container m-auto static pb-20 pt-10 px-[100px]">
                <h1 className="text-[1.5rem] font-[500] mb-3">Historial:</h1>

                <Table>
                    <TableHeader columns={columnas}>
                        {(columna) => <TableColumn key={columna.key}>{columna.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={trabajos}>
                        {(trabajo) => (
                            <TableRow key={trabajo.key}>
                                {(keyColumna) => <TableCell>{getKeyValue(trabajo, keyColumna)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Footer />
        </>
    )
}

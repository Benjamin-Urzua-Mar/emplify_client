import { Navbar, NavbarBrand, Card, Button, CardFooter, CardHeader, CardBody, Input, Textarea } from "@nextui-org/react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMessage } from "@fortawesome/free-solid-svg-icons"
import { useCallback, useEffect, useState } from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

export const SolicitudesTrabajo = () => {
    const [solicitudes, setSolicitudes] = useState([])
    const [vista, setVista] = useState("solicitudes")
    const [trabajosEnCurso, setTrabajosEnCurso] = useState([])
    const [trabajosTerminados, setTrabajosTerminados] = useState([])
    useEffect(() => {
        const body = JSON.stringify(
            {
                _id: localStorage.getItem("user_id")
            }
        )
        const headers = {
            "Content-Type": "application/json"
        }

        fetch('https://emplify-server-dev-zcbh.4.us-1.fl0.io/especialistas/getSolicitudesTrabajos', { method: 'POST', body: body, headers: headers })
            .then(res => res.json().then(msg => {
                const ReactSwal = withReactContent(Swal)

                switch (msg["codigo"]) {
                    case 1:
                        console.log(msg["data"])
                        setSolicitudes(msg["data"])
                        break;
                    case 2:
                        ReactSwal.fire({
                            icon: 'error',
                            title: 'Problemas...',
                            text: msg["msg"]
                        })
                        break;
                    case 10:
                        ReactSwal.fire({
                            icon: 'error',
                            title: 'Problemas...',
                            text: msg["msg"],
                        })
                        break;

                }

            }))
    }, [])

    const getTrabajosEnCurso = async () => {
        const body = JSON.stringify(
            {
                _id: localStorage.getItem("user_id")
            }
        )
        const headers = {
            "Content-Type": "application/json"
        }

        fetch('https://emplify-server-dev-zcbh.4.us-1.fl0.io/especialistas/trabajosEnCurso', { method: 'POST', body: body, headers: headers })
            .then(res => res.json().then(msg => {
                const ReactSwal = withReactContent(Swal)
                const toastReserva = ReactSwal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                switch (msg["codigo"]) {
                    case 1:
                        console.log(msg["data"])
                        setTrabajosEnCurso(msg["data"])
                        break;
                    case 2:
                        toastReserva.fire({
                            icon: 'warning',
                            title: msg["msg"]
                        })
                        break;
                    case 10:
                        ReactSwal.fire({
                            icon: 'error',
                            title: 'Problemas...',
                            text: msg["msg"],
                        })
                        break;

                }

            }))
    }

    const getTrabajosTerminados = async () => {
        const body = JSON.stringify(
            {
                _id: localStorage.getItem("user_id")
            }
        )
        const headers = {
            "Content-Type": "application/json"
        }
        fetch('https://emplify-server-dev-zcbh.4.us-1.fl0.io/especialistas/trabajosTerminados', { method: 'POST', body: body, headers: headers })
            .then(res => res.json().then(msg => {
                const ReactSwal = withReactContent(Swal)
                const toastReserva = ReactSwal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                switch (msg["codigo"]) {
                    case 1:
                        setTrabajosTerminados(msg["data"])
                        break;
                    case 2:
                        toastReserva.fire({
                            icon: 'warning',
                            title: msg["msg"]
                        })
                        break;
                    case 10:
                        ReactSwal.fire({
                            icon: 'error',
                            title: 'Problemas...',
                            text: msg["msg"],
                        })
                        break;

                }

            }))
    }

    const fechaInicioChange = (fechaInicioEvent, index) => {
        const inputData = [...solicitudes]
        inputData[index]["fechaInicio"] = fechaInicioEvent.currentTarget.value;
        setSolicitudes(inputData)
    }

    const fechaFinChange = (fechaFinEvent, index) => {
        const inputData = [...solicitudes]
        inputData[index]["fechaFin"] = fechaFinEvent.currentTarget.value;
        setSolicitudes(inputData)
    }
    const descripcionChange = (descripcionEvent, index) => {
        const inputData = [...solicitudes]
        inputData[index]["descripcion"] = descripcionEvent.currentTarget.value;
        setSolicitudes(inputData)
    }

    const aceptarTrabajo = async (e, solicitud, index) => {
        e.preventDefault()
        const solis = [...solicitudes]
        solis.splice(index, 1)

        delete solicitud.nombreCliente
        solicitud["estado"] = "Activo"
        const trabajo = solicitud
        const body = JSON.stringify(
            {
                trabajo: trabajo,
                solicitudes: solis
            }
        )
        const headers = {
            "Content-Type": "application/json"
        }

        await fetch('https://emplify-server-dev-zcbh.4.us-1.fl0.io/especialistas/aceptarTrabajo', { method: 'POST', body: body, headers: headers })
            .then(res => res.json().then(msg => {
                const ReactSwal = withReactContent(Swal)
                const toastReserva = ReactSwal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                switch (msg["codigo"]) {
                    case 1:
                        setSolicitudes(solis)
                        toastReserva.fire({
                            icon: 'success',
                            title: msg["msg"]
                        })
                        break;
                    case 2:
                        ReactSwal.fire({
                            icon: 'error',
                            title: 'Problemas...',
                            text: msg["msg"]
                        })
                        break;
                    case 10:
                        ReactSwal.fire({
                            icon: 'error',
                            title: 'Problemas...',
                            text: msg["msg"],
                        })
                        break;

                }

            }))
    }

    const finalizarTrabajo = async (e, _id, index) => {
        e.preventDefault()
        const enCurso = [...trabajosEnCurso]
        enCurso.splice(index, 1)
        const body = JSON.stringify(
            {
                _id: _id
            }
        )
        const headers = {
            "Content-Type": "application/json"
        }

        await fetch('https://emplify-server-dev-zcbh.4.us-1.fl0.io/especialistas/finalizarTrabajo', { method: 'POST', body: body, headers: headers })
            .then(res => res.json().then(msg => {
                const ReactSwal = withReactContent(Swal)
                const toastReserva = ReactSwal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                switch (msg["codigo"]) {
                    case 1:
                        setTrabajosEnCurso(enCurso)
                        toastReserva.fire({
                            icon: 'success',
                            title: msg["msg"]
                        })
                        break;
                    case 10:
                        ReactSwal.fire({
                            icon: 'error',
                            title: 'Problemas...',
                            text: msg["msg"],
                        })
                        break;

                }

            }))
    }



    const renderTrabajos = useCallback((vista) => {
        switch (vista) {
            case "solicitudes":
                return (
                    <>
                        <div className="border-b pb-6">
                            <h1 className="text-xl font-semibold">Administrar solicitudes de trabajo</h1>
                        </div>
                        {
                            (solicitudes.length == 0)
                                ?
                                <h1 className="font-sans mt-3">No hay solicitudes...</h1>
                                :
                                solicitudes.map((solicitud, index) => {
                                    return (
                                        <>
                                            <form onSubmit={(e) => aceptarTrabajo(e, solicitud, index)}>
                                                <Card key={solicitud.id} className="bg-white rounded-xl shadow-md overflow-hidden font-sans mt-2 mb-4">
                                                    <CardHeader className="justify-between">
                                                        <div className="flex gap-5">
                                                            <div className="flex flex-col gap-1 items-start justify-center">
                                                                <h4 className="text-small font-semibold leading-none text-default-600">Solicitud de {solicitud.nombreCliente}</h4>
                                                                <h5 className="text-small tracking-tight text-default-400">Servicio: {solicitud.servicio}</h5>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <hr />
                                                    <CardBody className="text-small font-medium text-foreground">
                                                        <section className="flex flex-row gap-2 items-center"><span>Fecha inicial:</span> <Input className="w-3/12" type="date" onChange={(e) => fechaInicioChange(e, index)} value={solicitud.fechaInicio}></Input>  <span>Fecha final:</span><Input className="w-3/12" type="date" value={solicitud.fechaFin} onChange={(e) => fechaFinChange(e, index)}></Input></section>
                                                        <section>
                                                            <Textarea
                                                                onChange={(e) => descripcionChange(e, index)}
                                                                className=""
                                                                label="Descripción"
                                                                labelPlacement="outside"
                                                                placeholder="Describe brevemente los detalles de tu solicitud"
                                                                value={solicitud.descripcion}
                                                            />
                                                        </section>
                                                    </CardBody>
                                                    <hr />
                                                    <CardFooter className="flex gap-3">
                                                        <a href="#" className="text-sm text-Primary  block mt-2"><FontAwesomeIcon icon={faMessage}></FontAwesomeIcon>  Responder</a>

                                                        <div className="ml-auto flex gap-3">
                                                            <Button color="danger" variant="solid" type='submit'>Rechazar trabajo</Button>
                                                            <Button color="secondary" variant="solid" type='submit'>Aceptar trabajo</Button>
                                                        </div>
                                                    </CardFooter>
                                                </Card>
                                            </form>
                                        </>
                                    )
                                })
                        }
                    </>
                )
            case "en_curso":
                return (
                    <>
                        <div className="border-b pb-6">
                            <h1 className="text-xl font-semibold">Administrar trabajos en curso</h1>
                        </div>
                        {
                            (trabajosEnCurso.length == 0)
                                ?
                                <h1 className="font-sans mt-3">No hay trabajos en curso...</h1>
                                :
                                trabajosEnCurso.map((trabajo, index) => {
                                    return (
                                        <>
                                            <Card key={index} className="bg-white rounded-xl shadow-md overflow-hidden font-sans mt-2 mb-4">
                                                <CardHeader className="justify-between">
                                                    <div className="flex gap-5">
                                                        <div className="flex flex-col gap-1 items-start justify-center">
                                                            <h4 className="text-small font-semibold leading-none text-default-600">Trabajo para {trabajo.nombreCliente}</h4>
                                                            <h5 className="text-small tracking-tight text-default-400">Servicio: {trabajo.servicio}</h5>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <hr />
                                                <CardBody className="text-small text-foreground">
                                                    <section className="flex flex-row gap-2 items-center"><span className="font-medium">Fecha inicial: <span className="font-normal">{trabajo.fechaInicio.slice(0, 9)}</span></span> <span className="font-medium">Fecha final: </span> <span className="font-normal">{trabajo.fechaFin}</span> </section>
                                                    <section>
                                                        <p><span className="font-medium">Descripción: </span>{trabajo.descripcion}</p>
                                                    </section>
                                                </CardBody>
                                                <hr />
                                                <CardFooter className="flex gap-3">
                                                    <div className="ml-auto flex gap-3">
                                                        <Button color="secondary" variant="solid" type='submit' onClick={(e) => finalizarTrabajo(e, trabajo._id, index)}>Terminar trabajo</Button>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        </>
                                    )
                                })
                        }
                    </>
                )
            case "terminados":
                return (
                    <>
                        <div className="border-b pb-6">
                            <h1 className="text-xl font-semibold">Administrar trabajos en curso</h1>
                        </div>
                        {
                            (trabajosTerminados.length == 0)
                                ?
                                <h1 className="font-sans mt-3">No hay trabajos en terminados...</h1>
                                :
                                trabajosTerminados.map((trabajo, index) => {
                                    return (
                                        <>
                                            <Card key={index} className="bg-white rounded-xl shadow-md overflow-hidden font-sans mt-2 mb-4">
                                                <CardHeader className="justify-between">
                                                    <div className="flex gap-5">
                                                        <div className="flex flex-col gap-1 items-start justify-center">
                                                            <h4 className="text-small font-semibold leading-none text-default-600">Trabajo para {trabajo.nombreCliente}</h4>
                                                            <h5 className="text-small tracking-tight text-default-400">Servicio: {trabajo.servicio}</h5>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <hr />
                                                <CardBody className="text-small text-foreground">
                                                    <section className="flex flex-row gap-2 items-center"><span className="font-medium">Fecha inicial: <span className="font-normal">{trabajo.fechaInicio.slice(0, 9)}</span></span> <span className="font-medium">Fecha final: </span> <span className="font-normal">{trabajo.fechaFin}</span> </section>
                                                    <section>
                                                        <p><span className="font-medium">Descripción: </span>{trabajo.descripcion}</p>
                                                    </section>
                                                </CardBody>
                                                <hr />
                                                <CardFooter className="flex gap-3">
                                                </CardFooter>
                                            </Card>
                                        </>
                                    )
                                })
                        }
                    </>
                )
        }
    }, [solicitudes, trabajosEnCurso, trabajosTerminados])

    return (
        <div className='relative z-10 '>
            <Navbar position="static" className="font-['Robot', sans-serif]  flex items-center justify-start w-full">
                <NavbarBrand className="flex-shrink-0">
                    <Link to="/" className="font-['Poppins', sans-serif] font-[650] text-[32px]">Empl<span className="text-Primary">ify</span></Link>
                </NavbarBrand>
            </Navbar>

            <div className="bg-gray-100 min-h-screen p-10 flex">

                <div className="w-1/4 ">

                    <h2 className="text-xl font-semibold mb-4">Trabajos</h2>


                    <nav>
                        <ul className="space-y-2">


                            <li className="hover:bg-gray-100 p-2 rounded">
                                <Link className="underline text-Primary " onClick={() => setVista("solicitudes")}>Solicitudes de trabajo</Link>

                            </li>

                            <li className="hover:bg-gray-100 p-2 rounded">
                                <Link to="#" className="hover:text-Primary hover:underline" onClick={() => { setVista("en_curso"); getTrabajosEnCurso(); }}>Trabajos en curso</Link>

                            </li>
                            <li className="hover:bg-gray-100 p-2 rounded">
                                <Link to="#" className="hover:text-Primary hover:underline" onClick={() => { setVista("terminados"); getTrabajosTerminados(); }}>Trabajos terminados</Link>

                            </li>


                        </ul>
                    </nav>
                </div>


                {/* Container */}
                <div className="bg-white rounded-lg shadow-lg w-3/4 p-6">
                    {renderTrabajos(vista)}
                </div>
            </div>
        </div>
    )
}

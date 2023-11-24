import { useEffect, useState, useRef } from 'react';
import { Header } from '../Global/Header'
import { Footer } from "../Global/Footer"
import { Chat } from '../Global/Chat';
import { Button, Card, CardBody, CardFooter, CardHeader, Avatar, Popover, PopoverTrigger, PopoverContent, Textarea, Input, Image, Select, SelectItem } from "@nextui-org/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faStar} from "@fortawesome/free-regular-svg-icons"
import { faPhotoFilm, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { v4 } from "uuid"

export const PerfilEspecialista = (socket) => {
    const [showChat, setShowChat] = useState("hidden")
    const [isConnected, setIsConnected] = useState(false)
    const [trabajo, setTrabajo] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [especialista, setEspecialista] = useState(JSON.parse(localStorage.getItem("perfilEspecialista")))

    const reservarCita = () => {
        // Cambia a true para mostrar el modal
        setIsModalOpen(true);
    }

    const closeModal = () => {
        // Cambia a false para cerrar el modal
        setIsModalOpen(false);
    }

    const refServicio = useRef()
    const refFecha = useRef()
    const refDescripcion = useRef()

    const reservar = async () => {
        // Cambia a false para cerrar el modal
        setIsModalOpen(false);

        const servicio = refServicio.current.value
        const fechaInicio = refFecha.current.value
        const descripcion = refDescripcion.current.value

        const body = JSON.stringify(
            {
                estado: "",
                cliente: localStorage.getItem("user_id"),
                especialista: especialista._id,
                fechaInicio: fechaInicio,
                fechaFin: "",
                descripcion: descripcion,
                servicio: servicio,
                foto: ""
            }
        )
        const headers = {
            "Content-Type": "application/json"
        }

        await fetch('http://localhost:8080/clientes/solicitarTrabajo', { method: 'POST', body: body, headers: headers })
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
                    case 3:
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

    const enviarMensaje = (msg) => {
        //console.log()
        socket.socket.emit("msg", { msg: msg, room: localStorage.getItem("chatRoom") })

        //estoy recibiendo el mensaje

        /*
        const socket = io("http://localhost:8080", {
            auth: {
                _id: localStorage.getItem("user_id")
            }
        })
        socket.on('connect', () => {
            console.log("hola");
            setIsConnected(true)
        })
        .emit("cliente", { msj: msj, room: `${localStorage.getItem("user_id")}_${localStorage.getItem("destinatarioChat")}` })
        */
    }

    const handleChat = () => {
        setShowChat("fixed")
        localStorage.setItem("chatRoom", especialista._id)
    }

    return (
        <>
            <Chat isVisible={showChat} onSubmit={enviarMensaje} socket={socket.socket} />
            <Header />
            <div className="relative ">
                <div className="flex relative flex-col md:flex-row bg-gray-200">

                    {/* Sección del perfil del especialista */}
                    <div className="w-full p-4 z-0">

                        <Card className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                            <CardHeader className="justify-between">
                                <div className="flex gap-5">
                                    <Avatar color="secondary" isBordered radius="sm" className="w-20 h-20 text-large" showFallback src={`http://localhost:8080/resources/images/${especialista.perfil.foto}`} />
                                    <div className="flex flex-col gap-1 items-start justify-center">
                                        <h4 className="text-small font-semibold leading-none text-default-600">{`${especialista.nombres} ${especialista.apellidos}`}</h4>
                                        <h5 className="text-small tracking-tight text-default-400">{especialista.profesion}</h5>
                                        <h5 className="text-small tracking-tight text-Primary">★★★★★ <span className="text-default-600 text-xs font-semibold">70 opiniones</span></h5>
                                    </div>
                                </div>
                            </CardHeader>


                            <CardFooter className="flex gap-3">
                                <a href="#" className="text-sm text-Primary  block mt-2"><FontAwesomeIcon icon={faHeart}></FontAwesomeIcon> Guardar</a>
                                <div className="ml-auto flex gap-3">
                                    <Button color="secondary" variant="bordered" type='button' onClick={() => handleChat()} className="">Enviar Mensaje</Button>
                                </div>
                            </CardFooter>
                        </Card>

                        <div className="w-full p-4 ">
                            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                {/* Sección Mis Trabajos */}
                                <div className="p-8">
                                    <h3 className="text-lg font-semibold text-black">Mis Trabajos</h3>
                                    <hr className="my-2" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <div className="bg-gray-200 p-4 z-0 rounded-md">
                                            <Image src="https://placehold.jp/250x150.png"></Image>
                                            <p className="mt-2 text-black text-center">Descripción del trabajo 1</p>
                                        </div>

                                        <div className="bg-gray-200 p-4 z-0 rounded-md">
                                            <Image src="https://placehold.jp/250x150.png"></Image>
                                            <p className="mt-2 text-black text-center">Descripción del trabajo 2</p>
                                        </div>
                                        <div className="bg-gray-200 p-4 z-0 rounded-md">
                                            <Image src="https://placehold.jp/250x150.png"></Image>
                                            <p className="mt-2 text-black text-center">Descripción del trabajo 2</p>
                                        </div>
                                        <div className="bg-gray-200 p-4 z-0 rounded-md">
                                            <Image src="https://placehold.jp/250x150.png"></Image>
                                            <p className="mt-2 text-black text-center">Descripción del trabajo 2</p>
                                        </div>

                                        {/* ... (Más imágenes y descripciones) */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full p-4">
                            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                {/* Sección Servicios y Precios */}
                                <div className="p-8">
                                    <h3 className="text-lg font-semibold text-black">Servicios y Precios</h3>
                                    <hr className="my-2" />

                                    <div className="mt-2">
                                        {
                                            especialista.perfil.servicios.map(servicio => {
                                                return (
                                                    <>
                                                        <div className="flex justify-between items-center border-b-2 py-2">
                                                            <span className="text-black">{Object.keys(servicio)[0]}</span>
                                                            <span className="text-black">${Object.values(servicio)[0]}</span>
                                                        </div>
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="w-full p-4">
                            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                {/* Sección Sobre Mí */}
                                <div className="p-8">
                                    <h3 className="text-lg font-semibold text-black-500 mt-4">Experiencia</h3>
                                    <hr className="my-2" />

                                    <h3 className="text-.d font-semibold text-black-500">Sobre Mí</h3>
                                    <p className="mt-2 text-gray-500 text-justify">{especialista.perfil.experiencia}</p>
                                </div>

                                {/* Sección Profesión */}
                                <div className="p-8 border-t">
                                    <h3 className="text-md font-semibold text-black-500">Especilidad</h3>
                                    <ul className="list-disc pl-5 mt-2 text-gray-500 text-justify">
                                        <li>Base de datos</li>
                                        <ul className="list-disc ">
                                            <li>Power BI</li>
                                            <li>DataXD</li>
                                        </ul>
                                    </ul>
                                </div>


                                {/* Sección Formación */}
                                <div className="p-8 border-t">
                                    <h3 className="text-md font-semibold text-black-500">Formación</h3>
                                    <ul className="list-disc pl-5 mt-2 text-gray-500 text-justify">
                                        <li>Universidad de Chile, 2020</li>
                                        <ul className="list-disc ">
                                            <li>Master en Ciencias de Datos</li>
                                            <li>Licenciatura en Datos</li>
                                        </ul>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="w-full p-4">
                            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                                {/* Sección Opiniones */}
                                <div className="p-8">
                                    <h3 className="text-lg font-semibold text-black">Opiniones (50) <div className="flex items-center mt-2">
                                        <span className="text-black text-xl">4.8 </span>
                                        <div className="flex text-yellow-500 ml-2">

                                            ★★★★★
                                        </div>
                                    </div></h3>
                                    <hr className="my-2" />
                                    <div className="mt-4">
                                        <div className="flex items-start border-b-2 py-2">
                                            <Avatar className='z-0' color="secondary" isBordered radius="full" size="md" showFallback />

                                            <div className="ml-4">
                                                <span className="text-black font-semibold">{localStorage.getItem("userName")}</span>
                                                <br />
                                                <Textarea
                                                    minRows={2}

                                                    className='w-[500px]'
                                                    placeholder='Escribe un comentario...'
                                                >
                                                </Textarea>
                                                <section className='flex justify-between items-center'>
                                                    <Button className='mt-2' variant='bordered' color='secondary'>Subir evidencias <FontAwesomeIcon icon={faPhotoFilm}></FontAwesomeIcon></Button>
                                                    <span className="text-center text-Secondary font-sans">
                                                       Calificar: <FontAwesomeIcon  icon={faStarSolid}></FontAwesomeIcon> <FontAwesomeIcon  icon={faStarSolid}></FontAwesomeIcon> <FontAwesomeIcon  icon={faStarSolid}></FontAwesomeIcon> 
                                                    </span>
                                                    <Button className='mt-2' color='secondary'>Publicar</Button>
                                                </section>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex items-start border-b-2 py-2">
                                            <Avatar className='z-0' color="secondary" isBordered radius="full" size="md" showFallback src='https://i.pravatar.cc/150?u=a04258114e29026708c' />

                                            <div className="ml-4">
                                                <span className="text-black font-semibold">Usuario 1</span>
                                                <p className="text-gray-500 text-sm">12 de Septiembre, 2023</p> {/* Aquí va la fecha del comentario */}
                                                <p className="text-black">¡Excelente servicio! Muy profesional y resolutivo.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex items-start border-b-2 py-2">
                                            <Avatar className='z-0' color="secondary" isBordered radius="full" size="md" showFallback src='https://i.pravatar.cc/150?u=a04258114e29026708c' />

                                            <div className="ml-4">
                                                <span className="text-black font-semibold">Juan</span>
                                                <p className="text-gray-500 text-sm">12 de Septiembre, 2023</p> {/* Aquí va la fecha del comentario */}
                                                <p className="text-black">¡Excelente servicio! Muy profesional y resolutivo.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex items-start border-b-2 py-2">
                                            <Avatar className='z-0' color="secondary" isBordered radius="full" size="md" showFallback src='https://i.pravatar.cc/150?u=a04258114e29026708c' />

                                            <div className="ml-4">
                                                <span className="text-black font-semibold">Usuario 1</span>
                                                <p className="text-gray-500 text-sm">12 de Septiembre, 2023</p> {/* Aquí va la fecha del comentario */}
                                                <p className="text-black">¡Excelente servicio! Muy profesional y resolutivo.</p>
                                            </div>

                                        </div>
                                        <div className="flex justify-center mt-4">
                                            <a href="#" className="text-sm text-Primary hover:underline block mt-2">Ver más</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Sección de reserva de cita */}
                    <div className='relative z-20 w-full md:w-1/2 p-4'>
                        <div className="sticky top-3">
                            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-2xl font-semibold mb-4">Contratar especialista</h2>
                                <label htmlFor="trabajo" className="block text-sm font-medium text-gray-700">Elige tu servicio:</label>
                                <Select
                                    id="trabajo"
                                    items={especialista.perfil.servicios}
                                    ref={refServicio}
                                    placeholder="Seleccione un servicio"
                                    size='xs'
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    {(servicio) => <SelectItem key={Object.keys(servicio)[0]}>{Object.keys(servicio)[0]}</SelectItem>}
                                </Select>

                                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mt-4">Fecha de inicio:</label>
                                <Input
                                    type="date"
                                    id="fecha"
                                    ref={refFecha}
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mt-4">Descripción:</label>
                                <Textarea
                                    ref={refDescripcion}
                                    labelPlacement="outside"
                                    placeholder="Describe brevemente los detalles de tu solicitud"
                                    fullWidth="true"
                                />






                                <Button onClick={reservarCita} color="secondary" className="mt-4 w-full px-3 py-2">Solicitar</Button>

                                {isModalOpen && (
                                    <div className="fixed z-30 inset-0 overflow-y-auto">
                                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                            </div>
                                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                    <div className="sm:flex sm:items-start">
                                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                            <h3 className="text-lg leading-6 font-medium text-gray-900 text-center" id="modal-title">
                                                                Condiciones de la Reserva
                                                            </h3>
                                                            <div className="mt-2">
                                                                <ul className="text-sm text-gray-500 list-disc pl-5 text-justify">
                                                                    <li>El cliente debe proporcionar toda la información y recursos necesarios para la realización del servicio contratado.</li>
                                                                    <li>Las citas canceladas con menos de 24 horas de antelación no serán reembolsadas.</li>
                                                                    <li>En caso de retraso por parte del cliente, el especialista no está obligado a compensar el tiempo perdido.</li>
                                                                    <li>El cliente debe respetar el tiempo acordado para la cita, cualquier servicio que requiera tiempo adicional puede incurrir en costos adicionales.</li>
                                                                    <li>El especialista se compromete a mantener la confidencialidad de la información proporcionada por el cliente.</li>
                                                                    <li>El cliente se compromete a realizar el pago acordado antes de la prestación del servicio.</li>
                                                                    <li>El especialista no se hace responsable de los problemas derivados de la incorrecta aplicación de las soluciones proporcionadas.</li>

                                                                </ul>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:justify-center sm:items-center sm:flex-row-reverse">
                                                    <Button type="button" onClick={reservar} color="secondary">
                                                        Aceptar y Reservar
                                                    </Button>
                                                    <Button type="button" onClick={closeModal} color="secondary" variant="bordered" className="mr-2">
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                <Footer />
            </div>

        </>
    )
}



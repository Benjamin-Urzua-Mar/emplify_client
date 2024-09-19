import { Input, Button } from "@nextui-org/react"
import { Link, useNavigate } from "react-router-dom";
import { Navbar, NavbarBrand } from "@nextui-org/react";
import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const ConfiguracionCliente = () => {
    const [cuenta, setCuenta] = useState({})
    const [nuevaContrasena, setNuevaContrasena] = useState("")
    const [nuevoCorreo, setNuevoCorreo] = useState("")

    const txt_nombres = useRef()
    const txt_apellidos = useRef()
    const txt_telefono = useRef()
    const txt_username = useRef()
    const txt_email = useRef()
    const txt_contrasena = useRef()

    const redirect = useNavigate()

    const editarCuenta = async (e) => {
        e.preventDefault()
        const nombres = txt_nombres.current.value
        const apellidos = txt_apellidos.current.value
        const email = txt_email.current.value
        const contrasena = txt_contrasena.current.value
        const telefono = txt_telefono.current.value
        const username = txt_username.current.value

        const body = JSON.stringify(
            {
                _id: localStorage.getItem("user_id"),
                nombres: nombres,
                apellidos: apellidos,
                email: email,
                contrasena: contrasena,
                telefono: parseInt(telefono.slice(5)),
                username: username
            }
        )
        const headers = {
            "Content-Type": "application/json"
        }

        await fetch(('https://api.burzua.lat/clientes/editarCuenta'), { method: "POST", body: body, headers: headers })
            .then(res => res.json().then(msg => {
                const ReactSwal = withReactContent(Swal)
                switch (msg["codigo"]) {
                    case 1:
                        ReactSwal.fire({
                            icon: 'success',
                            title: '¡Genial!',
                            text: msg["msg"],
                        }).then(confirmed => {
                            if (confirmed) {
                                redirect("/clientes/cuenta")
                            }
                        })
                        break;
                    case 2:
                        ReactSwal.fire({
                            icon: 'error',
                            title: 'Problemas...',
                            text: msg["msg"],
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

    const handleChanges = (e) => {
        const key = e.target.id
        let value = e.target.value
        setCuenta({
            ...cuenta,
            [key]:value
        })
}

const handlePassword = () => {
    Swal.fire({
        title: "Cambiar contraseña",
        text: "¿Está seguro de realizar este cambio?",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        showCancelButton: true,
        icon: "warning"
    }).then(confirmed => {
        if (confirmed) {
            Swal.fire({
                title: "Cambiar contraseña",
                input: "password",
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
                showCancelButton: true,
                icon: "warning",
                preConfirm: contrasena => {
                    setNuevaContrasena(contrasena)
                }
            }).then(confirmed => {
                if (confirmed) {
                    Swal.fire({
                        title: "¡Hecho!",
                        text: "Los cambios se verán reflejados cuando presiones el botón Guardar Cambios",
                        confirmButtonText: "Aceptar",
                        icon: "success",
                    })
                }
            })
        }
    })
}

const handleEmail = () => {
    Swal.fire({
        title: "Cambiar correo",
        text: "¿Está seguro de realizar este cambio?",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        showCancelButton: true,
        icon: "warning"
    }).then(confirmed => {
        if (confirmed) {
            Swal.fire({
                title: "Cambiar correo",
                input: "email",
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
                showCancelButton: true,
                icon: "warning",
                preConfirm: email => {
                    setNuevoCorreo(email)
                }
            }).then(confirmed => {
                if (confirmed) {
                    Swal.fire({
                        title: "¡Hecho!",
                        text: "Los cambios se verán reflejados cuando presiones el botón Guardar Cambios",
                        confirmButtonText: "Aceptar",
                        icon: "success",
                    })
                }
            })
        }
    })
}

useEffect(() => {
    const _id = localStorage.getItem("user_id")
    const body = JSON.stringify({ _id: _id })
    const headers = {
        "Content-Type": "application/json"
    }
    fetch(('https://api.burzua.lat/clientes/getCuenta'), { method: "POST", body: body, headers: headers })
        .then(res => res.json().then(msg => {
            const ReactSwal = withReactContent(Swal)
            switch (msg["codigo"]) {
                case 1:
                    setCuenta(msg["data"])
                    setNuevaContrasena(msg["data"].contrasena)
                    setNuevoCorreo(msg["data"].email)
                    break;
                case 2:
                    ReactSwal.fire({
                        icon: 'error',
                        title: 'Problemas...',
                        text: msg["msg"],
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
return (
    <div className='relative z-10 '>
        <Navbar position="static" className="font-['Robot', sans-serif]  flex items-center justify-start w-full">
            <NavbarBrand className="flex-shrink-0">
                <Link to="/" className="font-['Poppins', sans-serif] font-[650] text-[32px]">Emplify<span className="text-Primary">ify</span></Link>
            </NavbarBrand>
        </Navbar>

        <div className="bg-gray-100 min-h-screen p-10 flex">

            <div className="w-1/4 ">

                <h2 className="text-xl font-semibold mb-4">Mi cuenta</h2>


                <nav>
                    <ul className="space-y-2">

                        <li className="hover:bg-gray-100 p-2 rounded">
                            <Link to="#" className="hover:text-Primary">Historial</Link>

                        </li>
                        <li className="hover:bg-gray-100 p-2 rounded">
                            <Link to="#" className="hover:text-Primary">Profesionales guardados</Link>

                        </li>
                        <li className="hover:bg-gray-100 p-2 rounded">
                            <Link to="#" className="hover:text-Primary">Conversación con los profesionales</Link>

                        </li>
                        <li className="hover:bg-gray-100 p-2 rounded">
                            <Link to="#" className="hover:text-Primary">Preguntas públicas</Link>

                        </li>
                        <li className="hover:bg-gray-100 p-2 rounded">
                            <Link to="#" className="underline text-Primary ">Configuración de la cuenta</Link>

                        </li>

                    </ul>
                </nav>
            </div>


            {/* Container */}
            <div className="bg-white rounded-lg shadow-lg w-3/4 p-6">


                <div className="border-b pb-6">
                    <h1 className="text-xl font-semibold">Configuración de la cuenta</h1>
                    <p className="text-gray-500 mt-2">* Campo obligatorio</p>
                </div>

                {/* Form */}
                <form className="mt-6 space-y-6" method="POST" onSubmit={(e) => editarCuenta(e)}>
                    {/* Nombre*/}
                    <div className="flex items-center space-x-4">
                        <label htmlFor="nombre" className="w-1/4 font-semibold">Nombre *:</label>
                        <Input variant="underlined" type="text" id="nombres" name="txt_nombres" ref={txt_nombres} onChange={e => handleChanges(e)} value={cuenta.nombres} placeholder="Aqui aparecera el nombre" className="w-3/4 p-2 "

                        />
                    </div>

                    {/* Apellidos */}
                    <div className="flex items-center space-x-4">
                        <label htmlFor="apellidos" className="w-1/4 font-semibold">Apellidos:</label>
                        <Input variant="underlined" type="text" id="apellidos" name="txt_apellidos" ref={txt_apellidos} onChange={e => handleChanges(e)} value={cuenta.apellidos} placeholder="Aqui aparecera los apellidos" className="w-3/4 p-2 " />
                    </div>

                    {/* Contraseña */}
                    <div className="flex items-center space-x-4">
                        <label htmlFor="password" className="w-1/4 font-semibold">Contraseña *:</label>
                        <input type="text" id="contrasena" name="txt_password" hidden value={nuevaContrasena} ref={txt_contrasena} />
                        <Link to="#" className="hover:underline text-Primary text-small" onClick={() => handlePassword()} >Cambiar contraseña</Link>
                    </div>

                    {/* Telefono */}
                    <div className="flex items-center space-x-4">
                        <label htmlFor="telefono" className="w-1/4 font-semibold">Teléfono:</label>
                        <Input variant="underlined" type="tel" id="telefono" name="txt_telefono" ref={txt_telefono} onChange={e => handleChanges(e)} 
                        startContent={
                            <span className="text-small text-default-600 w-10">+56 9 </span>
                        } 
                        value={cuenta.telefono} placeholder="+56 9 1111 1111" className="w-3/4 p-2 " />
                    </div>

                    {/* Cambiar nombre de usuario */}
                    <div className="flex items-center space-x-4">
                        <label htmlFor="username" className="w-1/4 font-semibold">Cambiar nombre de usuario:</label>
                        <Input variant="underlined" type="text" id="username" name="txt_username" ref={txt_username} onChange={e => handleChanges(e)} placeholder="MarkCos" className="w-3/4 p-2 " />
                    </div>

                    {/* Correo electrónico */}
                    <div className="flex items-center space-x-4">
                        <label htmlFor="correo" className="w-1/4 font-semibold">Correo electrónico *:</label>
                        <input type="text" id="txt_email" name="txt_email" hidden value={nuevoCorreo} ref={txt_email} />
                        <Link to="#" className="hover:underline text-Primary text-small" onClick={() => handleEmail()}>Cambiar email</Link>
                    </div>

                    {/* Botón para editar perfil */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <Button color="secondary" type="submit" className="sm:mt-0 ">
                                Guardar Cambios
                            </Button>
                            <Button color="danger" type="button" variant="bordered" >
                                Eliminar Cuenta
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

)


}

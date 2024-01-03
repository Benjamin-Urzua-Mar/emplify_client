import { Input, Button } from "@nextui-org/react"
import { useRef } from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { setGlobalState } from "../../../global_states/index"

export const AdminLogin = () => {
    const txt_user = useRef()
    const txt_contrasena = useRef()

    const loginAdmin = async (e) => {
        e.preventDefault()
        const user = txt_user.current.value
        const contrasena = txt_contrasena.current.value

        const body = JSON.stringify(
            {
                user: user,
                contrasena: contrasena
            }
        )
        const headers = {
            "Content-Type": "application/json"
        }

        await fetch('https://emplify-server-dev-zcbh.4.us-1.fl0.io/admin/login', { method: 'POST', body: body, headers: headers })
            .then(res => res.json().then(msg => {
                const ReactSwal = withReactContent(Swal)
                const toastLogin = ReactSwal.mixin({
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
                        ReactSwal.fire({
                            icon: 'success',
                            title: '¡Genial!',
                            text: msg["msg"],
                        }).then((result) => {
                            if (result['isConfirmed']) {
                                sessionStorage.setItem("user_id", msg['sessionId'])
                                sessionStorage.setItem("tipoUsuario", msg['tipoUsuario'])
                                setGlobalState("vistaAdmin", "cliente")
                                toastLogin.fire({
                                    icon: 'success',
                                    title: `Bienvenido ${sessionStorage.getItem("tipoUsuario")}`
                                })

                            }
                        })
                        break;
                    case 2:
                        ReactSwal.fire({
                            icon: 'error',
                            title: 'Problemas...',
                            text: msg["msg"],
                            footer: '<a href="/">Recuperar contraseña</a>'
                        })
                        break;
                    case 3:
                        ReactSwal.fire({
                            icon: 'error',
                            title: 'Problemas...',
                            text: msg["msg"],
                            footer: '<a href="/">Reestablecer cuenta</a>'
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

    return (
        <form className="container p-16 sm:py-28 sm:px-96 m-auto" onSubmit={(e) => loginAdmin(e)}>
            <p className="text-default-500 mb-4">Iniciar sesión como administrador</p>
            <Input type="text" placeholder="Usuario" color="secondary" variant="underlined" name="txt_username" id="txt_username" ref={txt_user} />
            <Input
                variant="underlined"
                type="password"
                placeholder="Contraseña"
                color="secondary"
                name="txt_contrasena"
                id="txt_contrasena"
                ref={txt_contrasena}
            />
            <Button color="secondary" type="submit" className="mt-3">Iniciar sesión</Button>
        </form>
    )
}

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react"
import { Link, useNavigate } from "react-router-dom"
import { useGlobalState, setGlobalState } from "../../../global_states"
import { useState } from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

export const NavBar = () => {
    const [vista] = useGlobalState("vistaAdmin")
    const handleVista = (e, v) => {
        e.preventDefault()
        setGlobalState("vistaAdmin", v)// vistaAdmin:"cliente"        vistaAdmin:"profesionales"
    }

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const redirect = useNavigate()
    const logout = async () => {
        await fetch('https://emplify-server-dev-zcbh.4.us-1.fl0.io/admin/logout', { method: 'POST' })
            .then(res => res.json().then(msg => {
                const ReactSwal = withReactContent(Swal)
                switch (msg["codigo"]) {
                    case 1:
                        ReactSwal.fire({
                            icon: 'success',
                            title: '¡Genial!',
                            text: msg["msg"],
                        }).then((result) => {
                            if (result['isConfirmed']) {
                                redirect("/")
                            }
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
            }
            ))
    }

    return (
        <Navbar position="static" onMenuOpenChange={setIsMenuOpen}>

            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <Link to="/"><span className="font-['Poppins', sans-serif] font-[650] text-[32px]">Empl<span className="text-Primary">ify<small className="text-Primary text-sm ">Admin</small></span></span></Link>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    {
                        (vista == "cliente")
                            ?
                            <Link className="text-Primary" onClick={(e) => handleVista(e, "cliente")}>
                                Clientes
                            </Link>
                            :
                            <Link className="text-default-500 hover:text-Primary hover:underline" onClick={(e) => handleVista(e, "cliente")}>
                                Clientes
                            </Link>
                    }

                </NavbarItem>
                <NavbarItem>
                    {
                        (vista == "profesionales")
                            ?

                            <Link className="text-Primary" onClick={(e) => handleVista(e, "profesionales")} to="#" aria-current="page">
                                Profesionales
                            </Link>
                            :
                            <Link className="text-default-500 hover:text-Primary hover:underline" onClick={(e) => handleVista(e, "profesionales")} to="#" aria-current="page">
                                Profesionales
                            </Link>
                    }
                </NavbarItem>
                <NavbarItem>

                    {
                        (vista  == "reportes")
                            ?

                            <Link className="text-Primary" onClick={(e) => handleVista(e, "reportes")} to="#">
                                Reportes
                            </Link>
                            :
                            <Link className="text-default-500 hover:text-Primary hover:underline" onClick={(e) => handleVista(e, "reportes")} to="#">
                                Reportes
                            </Link>
                    }
                </NavbarItem>

                <NavbarItem>

                    {
                        (vista == "solicitudes")
                            ?

                            <Link className="text-Primary" onClick={(e) => handleVista(e, "solicitudes")} to="#">
                                Solicitudes
                            </Link>
                            :
                            <Link className="text-default-500 hover:text-Primary hover:underline" onClick={(e) => handleVista(e, "solicitudes")} to="#">
                                Solicitudes
                            </Link>
                    }
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link  onClick={() => logout()}>Cerrar sesion</Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu>
                <NavbarMenuItem>
                    {
                        (vista == "cliente")
                            ?
                            <Link className="text-Primary" onClick={(e) => handleVista(e, "cliente")}>
                                Clientes
                            </Link>
                            :
                            <Link className="text-default-500 hover:text-Primary" onClick={(e) => handleVista(e, "cliente")}>
                                Clientes
                            </Link>
                    }

                </NavbarMenuItem>

                <NavbarMenuItem>
                    {
                        (vista == "profesionales")
                            ?

                            <Link className="text-Primary" onClick={(e) => handleVista(e, "profesionales")} to="#" aria-current="page">
                                Profesionales
                            </Link>
                            :
                            <Link className="text-default-500 hover:text-Primary" onClick={(e) => handleVista(e, "profesionales")} to="#" aria-current="page">
                                Profesionales
                            </Link>
                    }
                </NavbarMenuItem>

                <NavbarMenuItem>

                    {
                        (vista !== "profesionales" && vista !== "cliente")
                            ?

                            <Link className="text-Primary" onClick={(e) => handleVista(e, "reportes")} to="#">
                                Reportes
                            </Link>
                            :
                            <Link className="text-default-500 hover:text-Primary" onClick={(e) => handleVista(e, "reportes")} to="#">
                                Reportes
                            </Link>
                    }
                </NavbarMenuItem>

                <NavbarMenuItem>

                    <Link to="/">Cerrar sesion</Link>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    )
}

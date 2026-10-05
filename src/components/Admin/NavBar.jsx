import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { useGlobalState, setGlobalState } from "../../../global_states"
import { useState } from "react"
import { Logo } from "../ui/Logo"
import { alertError, alertNetworkError, toast } from "../../lib/alerts"
import { apiUrl } from "../../lib/config"

const secciones = [
    { key: "cliente", label: "Clientes" },
    { key: "profesionales", label: "Profesionales" },
    { key: "reportes", label: "Reportes" },
    { key: "solicitudes", label: "Solicitudes" },
]

export const NavBar = () => {
    const [vista] = useGlobalState("vistaAdmin")
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const redirect = useNavigate()

    const handleVista = (v) => {
        setGlobalState("vistaAdmin", v)
        setIsMenuOpen(false)
    }

    const logout = async () => {
        try {
            const res = await fetch(apiUrl("/admin/logout"), { method: 'POST' })
            const msg = await res.json()
            switch (msg["codigo"]) {
                case 1:
                    sessionStorage.clear()
                    setGlobalState("vistaAdmin", "inicial")
                    redirect("/")
                    toast.fire({ icon: 'success', title: msg["msg"] || "Sesión cerrada" })
                    break;
                case 10:
                    alertError(msg["msg"])
                    break;
            }
        } catch {
            alertNetworkError()
        }
    }

    const claseLink = (activo) => `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activo ? "bg-brand-50 text-brand-600" : "text-ink-body hover:bg-default-100 hover:text-ink"}`

    return (
        <Navbar isBordered maxWidth="xl" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} classNames={{ wrapper: "px-4 sm:px-6 lg:px-8" }}>
            <NavbarContent>
                <NavbarMenuToggle aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"} className="md:hidden" />
                <NavbarBrand>
                    <Logo suffix="Admin" to={null} />
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden gap-1 md:flex" justify="center">
                {secciones.map(s => (
                    <NavbarItem key={s.key} isActive={vista == s.key}>
                        <button type="button" className={claseLink(vista == s.key)} aria-current={vista == s.key ? "page" : undefined} onClick={() => handleVista(s.key)}>
                            {s.label}
                        </button>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button variant="light" color="danger" onPress={logout} startContent={<FontAwesomeIcon icon={faRightFromBracket} />} className="hidden sm:flex">Cerrar sesión</Button>
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu className="gap-1 pt-4">
                {secciones.map(s => (
                    <NavbarMenuItem key={s.key} isActive={vista == s.key}>
                        <button type="button" className={`w-full text-left text-lg ${claseLink(vista == s.key)}`} onClick={() => handleVista(s.key)}>{s.label}</button>
                    </NavbarMenuItem>
                ))}
                <NavbarMenuItem>
                    <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-lg text-danger hover:bg-danger-50" onClick={logout}>
                        <FontAwesomeIcon icon={faRightFromBracket} />Cerrar sesión
                    </button>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    )
}

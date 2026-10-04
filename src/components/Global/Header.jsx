import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faRightFromBracket, faUser, faClockRotateLeft, faBriefcase, faIdCard } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Avatar, NavbarBrand, NavbarContent, DropdownMenu, DropdownItem, Dropdown, DropdownTrigger, NavbarItem, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, DropdownSection } from "@nextui-org/react";
import { Topbar } from './Topbar'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '../ui/Logo';
import { getSession, logout } from '../../lib/session';
import { imageUrl } from '../../lib/format';

const menuPorTipo = {
  Cliente: [
    { key: "cuenta", label: "Mi cuenta", to: "/clientes/cuenta", icon: faUser },
    { key: "historial", label: "Historial de trabajos", to: "/clientes/historialTrabajos", icon: faClockRotateLeft },
  ],
  Especialista: [
    { key: "perfil", label: "Editar perfil", to: "/especialistas/cuenta", icon: faIdCard },
    { key: "solicitudes", label: "Solicitudes de trabajo", to: "/especialistas/solicitudesTrabajo", icon: faBriefcase },
  ],
}

const accesoInvitado = [
  { titulo: "Iniciar sesión", cliente: "/clientes/login", especialista: "/especialistas/login" },
  { titulo: "Registrarse", cliente: "/clientes/register", especialista: "/especialistas/register" },
]

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const redirect = useNavigate()
  const { pathname } = useLocation()
  const { userName, tipoUsuario, fotoPerfil } = getSession()
  const items = userName ? (menuPorTipo[tipoUsuario] ?? menuPorTipo.Especialista) : []

  return (
    <div className='relative z-40'>
      <Topbar />
      <Navbar isBordered maxWidth="xl" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} classNames={{ wrapper: "px-4 sm:px-6 lg:px-8" }}>
        <NavbarContent>
          <NavbarMenuToggle aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"} className="md:hidden" />
          <NavbarBrand>
            <Logo />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className='hidden gap-2 md:flex' justify="end">
          {!userName ? (
            <>
              <NavbarItem>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button variant="light" endContent={<FontAwesomeIcon size='xs' icon={faChevronDown} />}>Iniciar sesión</Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Iniciar sesión como" color="primary" onAction={(key) => redirect(key)}>
                    <DropdownItem key="/clientes/login" description="Busca y contrata profesionales">Como cliente</DropdownItem>
                    <DropdownItem key="/especialistas/login" description="Gestiona tus trabajos">Como especialista</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
              <NavbarItem>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button color="primary" endContent={<FontAwesomeIcon size='xs' icon={faChevronDown} />}>Registrarse</Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Registrarse como" color="primary" onAction={(key) => redirect(key)}>
                    <DropdownItem key="/clientes/register" description="Encuentra al profesional ideal">Como cliente</DropdownItem>
                    <DropdownItem key="/especialistas/register" description="Ofrece tus servicios">Como especialista</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            </>
          ) : (
            <NavbarItem>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    variant="light"
                    endContent={<FontAwesomeIcon size='xs' icon={faChevronDown} />}
                    startContent={<Avatar size='sm' showFallback name={userName} color="primary" src={imageUrl(fotoPerfil)} />}
                  >
                    {userName}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu color='primary' aria-label="Menú de usuario" onAction={(key) => key == "logout" ? logout(redirect) : redirect(key)}>
                  <DropdownSection showDivider>
                    {items.map(item => (
                      <DropdownItem key={item.to} startContent={<FontAwesomeIcon fixedWidth icon={item.icon} />}>{item.label}</DropdownItem>
                    ))}
                  </DropdownSection>
                  <DropdownSection>
                    <DropdownItem key="logout" className="text-danger" color="danger" startContent={<FontAwesomeIcon fixedWidth icon={faRightFromBracket} />}>
                      Cerrar sesión
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          )}
        </NavbarContent>

        <NavbarMenu className="gap-1 pt-4">
          {!userName ? (
            accesoInvitado.map(grupo => (
              <div key={grupo.titulo} className="mb-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">{grupo.titulo}</p>
                <NavbarMenuItem>
                  <Link to={grupo.cliente} className="block rounded-lg px-2 py-2 text-lg hover:bg-default-100">Como cliente</Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <Link to={grupo.especialista} className="block rounded-lg px-2 py-2 text-lg hover:bg-default-100">Como especialista</Link>
                </NavbarMenuItem>
              </div>
            ))
          ) : (
            <>
              <div className="mb-3 flex items-center gap-3 border-b border-default-100 pb-4">
                <Avatar showFallback name={userName} color="primary" src={imageUrl(fotoPerfil)} />
                <div>
                  <p className="font-semibold text-ink">{userName}</p>
                  <p className="text-sm text-ink-muted">{tipoUsuario}</p>
                </div>
              </div>
              {items.map(item => (
                <NavbarMenuItem key={item.to} isActive={pathname == item.to}>
                  <Link to={item.to} className={`flex items-center gap-3 rounded-lg px-2 py-2 text-lg hover:bg-default-100 ${pathname == item.to ? "text-brand-500" : ""}`}>
                    <FontAwesomeIcon fixedWidth icon={item.icon} />{item.label}
                  </Link>
                </NavbarMenuItem>
              ))}
              <NavbarMenuItem>
                <button type="button" onClick={() => logout(redirect)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-lg text-danger hover:bg-danger-50">
                  <FontAwesomeIcon fixedWidth icon={faRightFromBracket} />Cerrar sesión
                </button>
              </NavbarMenuItem>
            </>
          )}
        </NavbarMenu>
      </Navbar>
    </div>
  )
}

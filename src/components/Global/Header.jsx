import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { DropdownHeader } from '../Flowbite/DropdownHeader'
import { Navbar, Avatar, NavbarBrand, NavbarContent, DropdownMenu, DropdownItem, Dropdown, DropdownTrigger, NavbarItem, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Accordion, AccordionItem, Listbox, ListboxItem } from "@nextui-org/react";
import { Topbar } from './Topbar'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const redirect = useNavigate()
  const logout = async () => {
    if (localStorage.getItem("tipoUsuario") == "Cliente") {
      await fetch('https://api.burzua.lat/clientes/logout', { method: 'POST' })
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
                  localStorage.clear()
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
    } else {
      await fetch('https://api.burzua.lat/especialistas/logout', { method: 'POST' })
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
                  localStorage.clear()
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

  }
  

  return (
    <div className='relative z-10 '>
      <Topbar />
      <Navbar isBordered className="font-['Robot', sans-serif] px-10  md:px-32" onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link to="/" className="font-['Poppins', sans-serif] font-[650] text-[32px]">Empl<span className="text-Primary">ify</span></Link>
          </NavbarBrand>
        </NavbarContent>



        <NavbarContent className='hidden md:flex' justify="end">
          {
            (localStorage.getItem("userName") == null)
              ?
              (<><NavbarItem className="hidden lg:flex">
                <span className='mr-2'><DropdownHeader linkCliente='/clientes/login' linkEspecialista='/especialistas/login' label='Iniciar sesión' /></span>
              </NavbarItem>
                <NavbarItem  >
                  <span><DropdownHeader linkCliente='/clientes/register' linkEspecialista='/especialistas/register' label='Registrarse' /></span>
                </NavbarItem></>)
              :
              !(localStorage.getItem("tipoUsuario") == "Cliente")
                ?
                (<NavbarItem  >
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="light"
                        endContent={<FontAwesomeIcon size='xs' icon={faChevronDown}></FontAwesomeIcon>}
                        startContent={<Avatar size='sm' showFallback color="secondary" src={`https://api.burzua.lat/resources/images/${localStorage.getItem("fotoPerfil")}`} />}
                      >
                        {localStorage.getItem("userName")}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu color='secondary' aria-label="Static Actions">
                      <DropdownItem key="new">Mi cuenta</DropdownItem>
                      <DropdownItem key="perfil">Mi perfil</DropdownItem>
                      <DropdownItem key="edit" onPress={() => { redirect('/especialistas/solicitudesTrabajo') }}>Solicitudes de trabajo</DropdownItem>
                      <DropdownItem key="delete" className="text-danger" onPress={() => logout()} color="danger" startContent={<FontAwesomeIcon size='1x' icon={faRightFromBracket}></FontAwesomeIcon>}>
                        Cerrar sesión
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

                </NavbarItem>)
                :
                (<NavbarItem  >
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="light"
                        endContent={<FontAwesomeIcon size='xs' icon={faChevronDown}></FontAwesomeIcon>}
                        startContent={<Avatar size='sm' showFallback  src={`https://api.burzua.lat/resources/images/${localStorage.getItem("fotoPerfil")}`} color="secondary"  />}
                      >
                        {localStorage.getItem("userName")}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu color='secondary' aria-label="Static Actions">
                      <DropdownItem key="cuenta" onPress={() => { redirect('/clientes/cuenta') }}>Mi cuenta</DropdownItem>
                      <DropdownItem key="historialTrabajo" onPress={() => { redirect('/clientes/historialTrabajos') }}>Historial</DropdownItem>
                      <DropdownItem key="edit">Edit file</DropdownItem>
                      <DropdownItem key="delete" className="text-danger" onPress={() => logout()} color="danger" startContent={<FontAwesomeIcon size='1x' icon={faRightFromBracket}></FontAwesomeIcon>}>
                        Cerrar sesión
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

                </NavbarItem>)
          }

        </NavbarContent>

        <NavbarMenu>
          <NavbarMenuItem >
            <Accordion showDivider={false} variant='light' isCompact>
              <AccordionItem key="1" aria-label="Accordion 1" title="Iniciar sesión">

                <Listbox
                  variant='light'
                  aria-label="Actions"
                  color='secondary'
                >
                  <ListboxItem ><Link to="/clientes/login">Como cliente</Link></ListboxItem>
                  <ListboxItem ><Link to="/especialistas/login">Como especialista</Link></ListboxItem>
                </Listbox>

              </AccordionItem>
              <AccordionItem key="2" aria-label="Accordion 2" title="Registrarse">
                <Listbox
                  variant='light'
                  aria-label="Actions"
                  color='secondary'
                >
                  <ListboxItem ><Link to="/clientes/register">Como cliente</Link></ListboxItem>
                  <ListboxItem ><Link to="/especialistas/register">Como especialista</Link></ListboxItem>
                </Listbox>
              </AccordionItem>
            </Accordion>
          </NavbarMenuItem>
          <NavbarMenuItem className='text-md ml-2'>
            <Link to="/clientes/historialTrabajos">Historial</Link>
          </NavbarMenuItem>

          <NavbarMenuItem className='text-md ml-2 '>
            <Link to="/clientes/configuracionClientes">Mi cuenta</Link>
          </NavbarMenuItem>
          <NavbarMenuItem className='text-md ml-2 '>
            <Link>Soporte</Link>
          </NavbarMenuItem>
          <NavbarMenuItem className='text-md ml-2 '>
            <Link>Regístrate como especialista</Link>
          </NavbarMenuItem>
          <NavbarMenuItem className='text-md ml-2 '>
            <Link>Términos y condiciones</Link>
          </NavbarMenuItem>
          <NavbarMenuItem className='text-md ml-2'>
            <Link className='text-Primary'>Invita a tus amigos</Link>
          </NavbarMenuItem>
          <NavbarMenuItem className='text-md ml-2'>
            <Link className='text-danger-500'>Cerrar sesión</Link>
          </NavbarMenuItem>
        </NavbarMenu>

      </Navbar>

    </div>
  )
}

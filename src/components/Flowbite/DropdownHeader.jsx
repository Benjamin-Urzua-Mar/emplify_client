/* eslint-disable react/prop-types */
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, NavbarItem, } from "@nextui-org/react";
import { Link } from 'react-router-dom';

export const DropdownHeader = ({ label, linkCliente, linkEspecialista }) => {

  return (
    <>
      {/*
    <div className='hover:text-Primary'>
      <Dropdown isOpen={isOpen}>
        <DropdownTrigger onMouseOver={openOnMouseOver}>
          <span>{label}</span>
        </DropdownTrigger>
        <DropdownMenu variant="light" color="secondary">
          <DropdownItem><Link to={linkCliente}>Como cliente</Link></DropdownItem>
          <DropdownItem><Link to={linkEspecialista}>Como especialista</Link></DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    */}

      <Dropdown >
        <NavbarItem>
          <DropdownTrigger >
            <span className="hover:text-Primary hover:cursor-pointer">{label}</span>
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu  variant="light" color="secondary">
          <DropdownItem>
            <Link to={linkCliente}>Como cliente</Link>
          </DropdownItem>
          <DropdownItem>
            <Link to={linkEspecialista}>Como especialista</Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faIdCard, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import { Link } from 'react-router-dom';

export const SideBar = ({visible, mostrarSideBar}) => {
  const accordionClasses = {
    title: "font-small text-SecondCommon hover:text-PrimarySemiTransparent text-medium",
    startContent:"text-PrimarySemiTransparent",
    trigger: "px-2 py-0 data-[hover=true]:bg-default-100 h-10 flex items-center",
    indicator: "text-medium text-SecondCommon ",
    content: "text-medium px-2",
  }
  
  return (
    <nav className={visible + ' grid content-start md:hidden text-Common  w-6/12 h-screen absolute inset-y-0 right-0 z-20 bg-white'}>
      <FontAwesomeIcon className="text-[25px] hover:text-Primary cursor-pointer p-3" onClick={mostrarSideBar} icon={faXmark} />
   {/*poner avatar */}
      <Accordion itemClasses={accordionClasses} isCompact>
        <AccordionItem key="1" aria-label="Iniciar sesión" startContent={<FontAwesomeIcon icon={faRightToBracket} />} title="Iniciar sesión">
          <Button color='none' className='w-full hover:text-Primary justify-start border-none'><Link to='/clientes/login'>Como cliente</Link></Button>
          <Button color='none' className='w-full hover:text-Primary justify-start border-none'><Link to='/especialistas/login'>Como profesional</Link></Button>
        </AccordionItem>
        <AccordionItem key="2" aria-label="Registrarse" startContent={<FontAwesomeIcon icon={faIdCard} />} title="Registrarse">
          <Button color='none' className='w-full hover:text-Primary justify-start border-none'><Link to='/clientes/register'>Como cliente</Link></Button>
          <Button color='none' className='w-full hover:text-Primary justify-start border-none'><Link to='/especialistas/register'>Como profesional</Link></Button>
        </AccordionItem>
      </Accordion>


    </nav>
  )
}

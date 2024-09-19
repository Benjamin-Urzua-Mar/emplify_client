import { Input, Button, } from "@nextui-org/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { useRef, useState } from 'react';
import { Avatar } from "@nextui-org/react";
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { setGlobalState } from "../../../global_states/searchResults";


export const Hero = () => {
  const txt_comuna = useRef()
  const txt_rubro = useRef()
  const redirect = useNavigate()
  const buscarEspecialista = async (e) => {
    e.preventDefault()
    const comuna = txt_comuna.current.value
    const rubro = txt_rubro.current.value

    const body = JSON.stringify(
      {
        comuna: comuna,
        rubro: rubro
      }
    )
    const headers = {
      "Content-Type": "application/json"
    }

    await fetch('https://api.burzua.lat/buscar', { method: 'POST', body: body, headers: headers })
      .then(res => res.json().then(msg => {
        const ReactSwal = withReactContent(Swal)
        const redirectParameters = () => {

          localStorage.setItem("searchResults", JSON.stringify(msg["data"]));
          localStorage.setItem("comuna", comuna);
          localStorage.setItem("rubro", rubro)
        }
        switch (msg["codigo"]) {
          case 1:
            redirect("/buscar", redirectParameters())
            break;
          case 2:
            ReactSwal.fire({
              icon: 'warning',
              title: 'Vaya...',
              text: "Por lo visto no existen profesionales del rubro solicitado dentro de tu comuna.",
              footer: "Asegúrate de haber escrito bien tu comuna."
            })
            break;

          case 10:
            break;
        }
      }))
  }


  return (
    <>
      <section id="hero" className="text-center px-[2rem] py-80 sm:py-52 md:px-[10rem] lg:px-[17rem]  font-['Poppins', sans-serif] bg-fixed bg-[url('./assets/hero.jpg')] bg-cover relative before:content-['']  before:bg-Transparent before:absolute before:top-0 before:bottom-0 before:right-0 before:left-0">
        <div className="relative">
          <h1 className="text-[30px] md:text-[48px]  font-[700]">Bienvenido a Empl<span className="text-Primary">ify</span></h1>
          <h5 className="text-[15px] md:text-[24px] text-gray-700">¡Busca al profesional que salvará tu día!</h5>
          <form className="flex justify-center items-center flex-wrap mt-4" onSubmit={(e) => buscarEspecialista(e)}>
            <Input
              placeholder="Ciudad o Comuna"
              className="p-4 w-full sm:w-3/4 md:w-4/5 lg:w-4/6 2xl:w-1/3"
              ref={txt_comuna}
              endContent={
                <div className="flex items-center">

                  <select
                    className="outline-none border-0 bg-transparent text-default-400 text-small"
                    id="currency"
                    name="currency"
                    ref={txt_rubro}
                  >
                    <option>Rubro</option>
                    <option>Informática</option>
                    <option>Construcción</option>
                    <option>Electricidad</option>
                    <option>Mecánica</option>
                  </select>

                </div>
              }
              type="text"
            />
            <Button color="secondary" type="submit" className="sm:mt-0 ">
              <span><FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon> Buscar</span>
            </Button>
          </form>
        </div>


      </section>
      {/* Sección de Categorías y Acciones */}
      <div>
        <div className="container mx-auto mt-8">

          <div className="flex flex-wrap justify-center my-8">
            <h2 className="text-2xl font-bold text-center mb-4 w-full">Nuestras Categorías</h2>

            <div className="bg-gray-100  rounded-md p-4 m-2 min-w-min">


              <div className="flex space-x-4">
                <a href="/Gasfiter" className="text-sm  hover:underline">Gásfiter</a>
                <a href="/Albanil" className="text-sm  hover:underline">Albañil</a>
                <a href="/Mecanico" className="text-sm  hover:underline">Mecanico</a>
                <a href="/Cerrajero" className="text-sm  hover:underline">Cerrajero</a>
                <a href="/Peluquero" className="text-sm hover:underline">Peluquero</a>
                <a href="/pintor" className="text-sm hover:underline">Pintor</a>
                <a href="/electricista" className="text-sm hover:underline">Electricista</a>
                <a href="/carpintero" className="text-sm hover:underline">Carpintero</a>
                <a href="/gas" className="text-sm hover:underline">Gas</a>
                <a href="/decorador" className="text-sm hover:underline">Decorador</a>
                <a href="/decorador" className="text-sm hover:underline">Arquitecto</a>
                <a href="/decorador" className="text-sm hover:underline">Informatica</a>
                <a href="/decorador" className="text-sm hover:underline">Mudanzas</a>
                <a href="/decorador" className="text-sm hover:underline">Mascotas</a>
                <a href="/decorador" className="text-sm hover:underline">Jardinero</a>

              </div>
              <div className="flex justify-center mt-4">
                <a href="#" className="text-sm text-Primary hover:underline block mt-2">Ver más</a>
              </div>
            </div>
          </div>
        </div>

      </div>
      <hr className="border-t border-gray-300 my-4" />

      {/* Sección WorkersHighlight */}
      <WorkersHighlight />

    </>
  )
}



const WorkersHighlight = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const workers = [
    {
      name: "Juan Pérez",
      specialty: "Informática",
      comment: "Excelente profesional, siempre puntual.",
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d"

    },
    {
      name: "María García",
      specialty: "Construcción",
      comment: "Muy detallista y meticulosa en su trabajo.",
      avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d"

    },
    {
      name: "Lucia Barra",
      specialty: "Construcción",
      comment: "Muy detallista y meticulosa en su trabajo.",
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d"

    },
    {
      name: "Lucas López",
      specialty: "Construcción",
      comment: "Muy detallista y meticulosa en su trabajo.",
      avatarUrl: "https://i.pravatar.cc/150?u=a04258a2462d826712d"

    },
    {
      name: "Gabriel Parra",
      specialty: "Fotógrafo",
      comment: "Muy detallista y meticulosa en su trabajo.",
      avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026708c"

    },
    // ... tus trabajadores ...
  ];

  const nextWorkers = () => {
    setCurrentIndex(prevIndex => (prevIndex + 3) % workers.length);
  }

  const prevWorkers = () => {
    setCurrentIndex(prevIndex => (prevIndex - 3 + workers.length) % workers.length);
  }

  return (
    <section className="mt-10 p-5">
      <h2 className="text-2xl font-bold mb-5 text-center ">Trabajadores del Mes</h2>
      <div className="flex justify-between items-center">
        <Button isIconOnly radius="full" onClick={prevWorkers} color="secondary">
          <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
        </Button>
        <div className="flex space-x-4">
          {[0, 1, 2].map(offset => {
            const workerIndex = (currentIndex + offset) % workers.length;
            return (
              <div key={workerIndex} className="flex items-center p-5 rounded-lg shadow-md w-1/3">
                <div className="mr-5 flex-shrink-0">
                  <Avatar className="w-20 h-20 text-large" src={workers[workerIndex].avatarUrl} alt={workers[workerIndex].name} size="large" />
                </div>

                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{workers[workerIndex].name} </h3>
                    <p className="text-md mb-2"><strong>Especialidad:</strong> {workers[workerIndex].specialty}</p>
                    <p className="text-md"><strong>Comentario:</strong> {workers[workerIndex].comment}</p>
                  </div>
                  <div className="text-right">
                    <Link to="#" className="hover:underline text-Primary">Mostrar Perfil</Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
        <Button isIconOnly radius="full" onClick={nextWorkers} color="secondary" >
          <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
        </Button>
      </div>
    </section>
  );
}

export default Hero;



import { Button, Avatar } from "@nextui-org/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faMagnifyingGlass, faUserCheck, faHandshake, faQuoteLeft } from "@fortawesome/free-solid-svg-icons"
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom'
import { SearchBar } from "../Global/SearchBar";
import { rubros } from "../../data/rubros";

const pasos = [
  { icon: faMagnifyingGlass, titulo: "Busca", texto: "Ingresa tu comuna y el rubro que necesitas." },
  { icon: faUserCheck, titulo: "Compara", texto: "Revisa perfiles, servicios y precios de profesionales verificados." },
  { icon: faHandshake, titulo: "Contrata", texto: "Envía tu solicitud y coordina directamente con el especialista." },
]

export const Hero = () => {
  const [rubro, setRubro] = useState(localStorage.getItem("rubro") ?? "")
  const comunaRef = useRef()
  const heroRef = useRef()

  const elegirRubro = (key) => {
    setRubro(key)
    heroRef.current?.scrollIntoView({ behavior: "smooth" })
    setTimeout(() => comunaRef.current?.focus(), 400)
  }

  return (
    <>
      <section
        id="hero"
        ref={heroRef}
        className="relative bg-[url('./assets/hero.jpg')] bg-cover bg-center md:bg-fixed before:absolute before:inset-0 before:bg-white/75 before:content-['']"
      >
        <div className="page-container relative flex flex-col items-center py-20 text-center sm:py-28 lg:py-36">
          <span className="mb-4 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600">Profesionales verificados</span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Bienvenido a Empl<span className="text-brand-500">ify</span>
          </h1>
          <p className="mt-3 max-w-xl text-lg text-ink-body sm:text-xl">¡Busca al profesional que salvará tu día!</p>
          <div className="mt-8 w-full max-w-3xl rounded-2xl bg-white/80 p-3 shadow-card backdrop-blur sm:p-4">
            <SearchBar ref={comunaRef} rubro={rubro} onRubroChange={setRubro} />
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="page-container py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">¿Cómo funciona?</h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-3">
          {pasos.map((paso, i) => (
            <li key={paso.titulo} className="card flex flex-col items-center p-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-lg text-brand-500">
                <FontAwesomeIcon icon={paso.icon} />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{i + 1}. {paso.titulo}</h3>
              <p className="mt-1 text-sm text-ink-muted">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Categorías */}
      <section className="bg-surface-muted py-16">
        <div className="page-container">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Nuestras categorías</h2>
          <p className="mt-2 text-center text-ink-muted">Elige un rubro y encuentra profesionales en tu comuna.</p>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {rubros.map(r => (
              <button
                key={r.key}
                type="button"
                onClick={() => elegirRubro(r.key)}
                className="card group flex flex-col items-start gap-3 p-5 text-left transition hover:-translate-y-0.5 hover:border-brand-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <FontAwesomeIcon icon={r.icon} />
                </span>
                <span>
                  <span className="block font-semibold text-ink">{r.label}</span>
                  <span className="mt-0.5 block text-sm text-ink-muted">{r.descripcion}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <WorkersHighlight />

      {/* CTA especialistas */}
      <section className="page-container pb-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-brand-600 px-6 py-10 text-white sm:px-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">¿Eres profesional?</h2>
            <p className="mt-2 max-w-lg text-white/85">Únete a Emplify, muestra tu trabajo y recibe solicitudes de clientes cerca de ti.</p>
          </div>
          <Button as={Link} to="/especialistas/register" size="lg" className="bg-white font-medium text-brand-600">
            Regístrate como especialista
          </Button>
        </div>
      </section>
    </>
  )
}

const workers = [
  { name: "Juan Pérez", specialty: "Informática", comment: "Excelente profesional, siempre puntual.", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
  { name: "María García", specialty: "Construcción", comment: "Muy detallista y meticulosa en su trabajo.", avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d" },
  { name: "Lucía Barra", specialty: "Construcción", comment: "Muy detallista y meticulosa en su trabajo.", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
  { name: "Lucas López", specialty: "Construcción", comment: "Cumplió los plazos y dejó todo impecable.", avatarUrl: "https://i.pravatar.cc/150?u=a04258a2462d826712d" },
  { name: "Gabriel Parra", specialty: "Fotografía", comment: "Muy profesional, lo recomiendo totalmente.", avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026708c" },
];

const WorkersHighlight = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextWorkers = () => setCurrentIndex(prev => (prev + 1) % workers.length)
  const prevWorkers = () => setCurrentIndex(prev => (prev - 1 + workers.length) % workers.length)

  return (
    <section className="page-container py-16" aria-roledescription="carrusel" aria-label="Profesionales destacados">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Profesionales destacados</h2>
          <p className="mt-1 text-ink-muted">Lo que dicen los clientes de nuestros especialistas.</p>
        </div>
        <div className="flex gap-2">
          <Button isIconOnly radius="full" variant="bordered" onPress={prevWorkers} aria-label="Anterior">
            <FontAwesomeIcon icon={faAngleLeft} />
          </Button>
          <Button isIconOnly radius="full" color="primary" onPress={nextWorkers} aria-label="Siguiente">
            <FontAwesomeIcon icon={faAngleRight} />
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map(offset => {
          const worker = workers[(currentIndex + offset) % workers.length];
          return (
            <figure key={worker.name} className={`card flex-col gap-4 p-6 ${offset == 0 ? "flex" : offset == 1 ? "hidden md:flex" : "hidden lg:flex"}`}>
              <FontAwesomeIcon icon={faQuoteLeft} className="text-2xl text-brand-200" />
              <blockquote className="flex-1 text-ink-body">{worker.comment}</blockquote>
              <figcaption className="flex items-center gap-3">
                <Avatar src={worker.avatarUrl} name={worker.name} size="lg" />
                <span>
                  <span className="block font-semibold text-ink">{worker.name}</span>
                  <span className="block text-sm text-ink-muted">{worker.specialty}</span>
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

export default Hero;

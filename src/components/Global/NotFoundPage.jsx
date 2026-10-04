import { Button } from "@nextui-org/react"
import { Link } from "react-router-dom"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { CONTACTO } from "../../data/contacto"

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="page-container flex flex-1 flex-col items-center justify-center py-16 text-center">
        <img src="/error-image.png" alt="" className="mb-8 w-full max-w-sm" />
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">Error 404</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Esta página no existe</h1>
        <p className="mt-3 max-w-md text-ink-muted">
          No pudimos encontrar esta página, pero déjanos ayudarte a encontrar lo que buscas.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button as={Link} to="/" color="primary">Ir a la página de inicio</Button>
          <Button as="a" href={`mailto:${CONTACTO.email}`} variant="bordered">Escríbenos</Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

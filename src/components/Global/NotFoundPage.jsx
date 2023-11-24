//import error_404 from ""

export const NotFoundPage = () => {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white-100">
        <img src="/error-image.png" alt="Error illustration" className="mb-4 w-1/2"/>
        <h2 className="text-4xl font-bold mb-2">Esta página no existe</h2>
        <p className="text-center mb-6">
          No pudimos encontrar esta página, pero déjanos ayudarte a encontrar lo que buscas.
        </p>
        <a href="/" className="text-Primary hover:underline mb-4">Ir a la página de inicio</a>
        <p className="text-center mb-4">
          ¿No has encontrado lo que buscabas?
        </p>
        <a href="/contact" className="text-Primary hover:underline">Escríbenos</a>
      </div>
       
    )


}

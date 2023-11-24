export const Footer = () => {
    return (
        <footer className="">
            <div className="flex md:justify-between justify-center px-10 md:px-32 py-5 font-['Robot', sans-serif] grid-flow-col border-t-1.5">
                <div className="flex flex-wrap justify-center text-center md:text-left md:flex-col space-x-2 ">
                    <h1 className="text-[24px] basis-11/12 md:basis-0 mb-2 font-[700] ml-1">Empl<span className="text-Primary">ify</span></h1>
                    
                    <span className="text-Common">Calle Inacap <br className="hidden md:block"/> Los Ángeles, LA 123 <br className="hidden md:block"/> Chile</span>
                    <span className="text-Common mb-3"><span className="font-semibold">Contacto:</span> +569 12345678 <br  className="hidden md:block"/> <span className="font-semibold">Email:</span> soporte@emplify.cl</span>
       
                </div>
                <div className="hidden md:flex flex-col space-x-2">
                    <h1 className="text-[18px]  text-SecondCommon mb-2 font-[500] ml-1">Únete al equipo de Emplify</h1>

                    <a href="#" className="text-Common hover:text-Primary">Regístrate como profesional</a>
                    <a href="#" className="text-Common hover:text-Primary">Centro de socios</a>
                    <a href="#" className="text-Common hover:text-Primary">Promociones</a>
                    <a href="#" className="text-Common hover:text-Primary">Condiciones de uso</a>
                    <a href="#" className="text-Common hover:text-Primary">Sostenibilidad</a>
                </div>
                <div className="hidden md:flex flex-col space-x-2 ">
                <h1 className="text-[18px] text-SecondCommon mb-2 font-[500] ml-1">Sobre Nosotros</h1>

                <a href="#" className="text-Common hover:text-Primary">Quienes somos</a>
                <a href="#" className="text-Common hover:text-Primary">Términos y condiciones</a>
                <a href="#" className="text-Common hover:text-Primary">Privacidad</a>
                <a href="#" className="text-Common hover:text-Primary">Sé parte de Emplify</a>
                </div>
            </div>
            <div className="text-Common text-center px-32">© Emplify 2023-2023.</div>
        </footer>
    )
} 

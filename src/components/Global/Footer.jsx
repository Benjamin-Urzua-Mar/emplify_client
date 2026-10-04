import { Link } from "react-router-dom"
import { Logo } from "../ui/Logo"
import { CONTACTO } from "../../data/contacto"

const columnas = [
    {
        titulo: "Únete a Emplify",
        links: [
            { label: "Regístrate como profesional", to: "/especialistas/register" },
            { label: "Regístrate como cliente", to: "/clientes/register" },
            { label: "Centro de socios", to: "#" },
            { label: "Promociones", to: "#" },
        ],
    },
    {
        titulo: "Sobre nosotros",
        links: [
            { label: "Quiénes somos", to: "#" },
            { label: "Términos y condiciones", to: "#" },
            { label: "Privacidad", to: "#" },
            { label: "Sostenibilidad", to: "#" },
        ],
    },
]

export const Footer = () => {
    return (
        <footer className="border-t border-default-100 bg-white">
            <div className="page-container grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-3 lg:col-span-2">
                    <Logo size="sm" />
                    <p className="max-w-xs text-sm text-ink-muted">Conectamos a personas con profesionales de confianza cerca de ellas.</p>
                    <address className="text-sm not-italic text-ink-muted">
                        {CONTACTO.direccion.join(", ")}<br />
                        <a href={`tel:${CONTACTO.telefonoHref}`} className="hover:text-brand-500">{CONTACTO.telefono}</a> · <a href={`mailto:${CONTACTO.email}`} className="hover:text-brand-500">{CONTACTO.email}</a>
                    </address>
                </div>
                {columnas.map(col => (
                    <nav key={col.titulo} aria-label={col.titulo}>
                        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink">{col.titulo}</h2>
                        <ul className="flex flex-col gap-2">
                            {col.links.map(link => (
                                <li key={link.label}>
                                    <Link to={link.to} className="text-sm text-ink-muted transition-colors hover:text-brand-500">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>
            <div className="border-t border-default-100 py-4 text-center text-xs text-ink-muted">
                © {new Date().getFullYear()} Emplify. Todos los derechos reservados.
            </div>
        </footer>
    )
}

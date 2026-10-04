import { faUser, faClockRotateLeft, faHeart, faComments, faCircleQuestion, faIdCard, faBriefcase, faGear } from "@fortawesome/free-solid-svg-icons"

/* Navegación lateral de las áreas privadas (AccountLayout) */
export const navCliente = [
    { label: "Mi cuenta", to: "/clientes/cuenta", icon: faUser },
    { label: "Historial de trabajos", to: "/clientes/historialTrabajos", icon: faClockRotateLeft },
    { label: "Profesionales guardados", icon: faHeart, disabled: true },
    { label: "Mensajes", icon: faComments, disabled: true },
    { label: "Preguntas públicas", icon: faCircleQuestion, disabled: true },
]

export const navEspecialista = [
    { label: "Editar perfil", to: "/especialistas/cuenta", icon: faIdCard },
    { label: "Solicitudes de trabajo", to: "/especialistas/solicitudesTrabajo", icon: faBriefcase },
    { label: "Configuración de la cuenta", icon: faGear, disabled: true },
]

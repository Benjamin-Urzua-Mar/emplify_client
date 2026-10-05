/*
 * Cuentas de la demo. Deben coincidir con scripts/demo/datosDemo.js del servidor
 * (npm run poblar:demo en emplify_server las crea o restaura).
 */
export const CLAVE_DEMO = "Demo1234"

export const cuentasDemo = [
    {
        rol: "Cliente",
        usuario: "valentina.rios@demo.emplify.cl",
        perfil: "Cliente frecuente de Providencia",
        detalle: "Tiene trabajos en curso y terminados con profesionales de la plataforma.",
        login: "/clientes/login",
    },
    {
        rol: "Cliente",
        usuario: "tomas.vera@demo.emplify.cl",
        perfil: "Cliente nuevo de Maipú",
        detalle: "Sin historial: ideal para buscar un profesional y enviar la primera solicitud.",
        login: "/clientes/login",
    },
    {
        rol: "Profesional",
        usuario: "rodrigo.fuentes@demo.emplify.cl",
        perfil: "Electricista en Providencia",
        detalle: "3 solicitudes pendientes, 1 trabajo en curso y 2 terminados.",
        login: "/especialistas/login",
    },
    {
        rol: "Profesional",
        usuario: "carolina.munoz@demo.emplify.cl",
        perfil: "Soporte informático en Las Condes",
        detalle: "1 solicitud pendiente, 1 trabajo en curso y 1 terminado.",
        login: "/especialistas/login",
    },
    {
        rol: "Administrador",
        usuario: "demo_admin",
        perfil: "Panel de administración",
        detalle: "Gestiona clientes y profesionales: ver detalle, banear y eliminar.",
        login: "/admin",
    },
]

export const recorridosDemo = [
    {
        titulo: "Como cliente",
        pasos: [
            "Inicia sesión con tomas.vera@demo.emplify.cl.",
            "En el inicio, busca por comuna y rubro (por ejemplo, Providencia + Electricidad).",
            "Abre el perfil de un profesional, elige un servicio y una fecha y envía la solicitud.",
            "En \"Mi cuenta\" puedes revisar y editar tus datos.",
        ],
    },
    {
        titulo: "Como profesional",
        pasos: [
            "Inicia sesión con rodrigo.fuentes@demo.emplify.cl.",
            "Entra a \"Solicitudes de trabajo\" desde el menú de tu cuenta.",
            "Acepta una solicitud: pasa a \"Trabajos en curso\".",
            "Finaliza un trabajo en curso: pasa a \"Trabajos terminados\".",
        ],
    },
    {
        titulo: "Como administrador",
        pasos: [
            "Entra a /admin e inicia sesión con demo_admin.",
            "Revisa los listados de clientes y profesionales.",
            "Abre el detalle de un usuario y prueba banearlo: no podrá iniciar sesión hasta que lo desbanees.",
        ],
    },
]

export const funcionesVisuales = [
    "Inicio de sesión con Google o Facebook.",
    "Historial de trabajos del cliente (muestra datos de ejemplo).",
    "Profesionales guardados, Mensajes y Preguntas públicas del menú del cliente.",
    "Editar perfil y Configuración de la cuenta del profesional.",
    "Calificaciones y opiniones de los perfiles (siempre muestran 4,8 y 50 opiniones).",
    "Reportes y Solicitudes del panel de administración (datos de ejemplo).",
    "Chat con el profesional: funciona en tiempo real solo si ambas sesiones están abiertas y no guarda historial.",
    "Fotos de perfil y documentos de los profesionales de ejemplo (se muestran iniciales).",
]

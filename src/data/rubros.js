import { faLaptopCode, faHelmetSafety, faBolt, faScrewdriverWrench, faFan, faFaucetDrip, faToolbox } from "@fortawesome/free-solid-svg-icons"

/*
 * Íconos por rubro. La lista de rubros viene del endpoint /rubros del backend;
 * aquí solo se asocia un ícono por nombre (con uno genérico de respaldo).
 */
const iconos = {
    "informática": faLaptopCode,
    "construcción": faHelmetSafety,
    "electricidad": faBolt,
    "mecánica": faScrewdriverWrench,
    "climatización": faFan,
    "gasfitería": faFaucetDrip,
}

export const iconoRubro = (nombre = "") => iconos[nombre.toLowerCase()] ?? faToolbox

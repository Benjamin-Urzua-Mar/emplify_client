import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

/*
 * Alertas estandarizadas de Emplify (SweetAlert2).
 * Los colores se definen en src/index.css para respetar el design system.
 * Ver docs/GUIA_DE_ESTILOS.md → "Feedback al usuario".
 */
export const ReactSwal = withReactContent(Swal)

export const toast = ReactSwal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (el) => {
        el.addEventListener("mouseenter", Swal.stopTimer)
        el.addEventListener("mouseleave", Swal.resumeTimer)
    }
})

export const alertSuccess = (text, title = "¡Listo!") =>
    ReactSwal.fire({ icon: "success", title, text, confirmButtonText: "Aceptar" })

export const alertError = (text = "Ocurrió un error inesperado. Inténtalo nuevamente.", options = {}) =>
    ReactSwal.fire({ icon: "error", title: "Algo salió mal", text, confirmButtonText: "Entendido", ...options })

export const alertWarning = (text, title = "Atención") =>
    ReactSwal.fire({ icon: "warning", title, text, confirmButtonText: "Aceptar" })

export const alertInfo = (text, title = "Información") =>
    ReactSwal.fire({ icon: "info", title, text, confirmButtonText: "Aceptar" })

/** Diálogo de confirmación. Resuelve `true` solo si el usuario confirma. */
export const confirmDialog = async ({ title = "¿Estás seguro?", text, confirmText = "Confirmar", cancelText = "Cancelar", danger = false }) => {
    const result = await ReactSwal.fire({
        icon: "warning",
        title,
        text,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
        focusCancel: danger,
        ...(danger && { confirmButtonColor: "#f31260" })
    })
    return result.isConfirmed
}

/** Mensaje estándar ante fallos de red. */
export const alertNetworkError = () =>
    alertError("No pudimos conectarnos con el servidor. Revisa tu conexión e inténtalo nuevamente.")

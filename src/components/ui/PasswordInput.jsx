/* eslint-disable react/prop-types */
import { forwardRef, useState } from "react"
import { Input } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons"

/** Campo de contraseña con botón accesible para mostrar/ocultar. */
export const PasswordInput = forwardRef(function PasswordInput({ isVisible: controlledVisible, onToggleVisibility, ...props }, ref) {
    const [localVisible, setLocalVisible] = useState(false)
    const isVisible = controlledVisible ?? localVisible
    const toggle = onToggleVisibility ?? (() => setLocalVisible((v) => !v))

    return (
        <Input
            ref={ref}
            type={isVisible ? "text" : "password"}
            autoComplete="current-password"
            endContent={
                <button
                    type="button"
                    onClick={toggle}
                    className="rounded-md text-default-400 transition-colors hover:text-default-600 focus:outline-none"
                    aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                    <FontAwesomeIcon className="pointer-events-none text-base" icon={isVisible ? faEyeSlash : faEye} />
                </button>
            }
            {...props}
        />
    )
})

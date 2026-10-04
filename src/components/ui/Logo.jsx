/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"

const sizes = {
    sm: "text-xl",
    md: "text-2xl sm:text-3xl",
    lg: "text-4xl sm:text-5xl",
}

/** Logotipo textual de Emplify: "Empl" en tinta + "ify" en color de marca. */
export const Logo = ({ size = "md", suffix, to = "/", className = "" }) => {
    const content = (
        <span className={`font-display font-bold tracking-tight text-ink ${sizes[size]} ${className}`}>
            Empl<span className="text-brand-500">ify</span>
            {suffix && <span className="ml-1.5 align-middle text-xs font-semibold uppercase tracking-wider text-brand-500">{suffix}</span>}
        </span>
    )
    return to ? <Link to={to} aria-label="Emplify, ir al inicio">{content}</Link> : content
}

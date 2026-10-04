/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons"

/** Calificación con estrellas (solo lectura o seleccionable con `onChange`). */
export const Rating = ({ value = 0, count, onChange, size = "sm" }) => {
    const sizes = { sm: "text-sm", md: "text-lg" }
    return (
        <span className={`inline-flex items-center gap-1.5 ${sizes[size]}`}>
            <span className="inline-flex gap-0.5" role={onChange ? "radiogroup" : "img"} aria-label={`${value} de 5 estrellas`}>
                {[1, 2, 3, 4, 5].map((n) => {
                    const star = <FontAwesomeIcon icon={faStar} className={n <= Math.round(value) ? "text-warning-400" : "text-default-200"} />
                    return onChange ? (
                        <button key={n} type="button" role="radio" aria-checked={n === value} aria-label={`${n} estrellas`} onClick={() => onChange(n)} className="transition-transform hover:scale-110 focus:outline-none">
                            {star}
                        </button>
                    ) : (
                        <span key={n}>{star}</span>
                    )
                })}
            </span>
            {count !== undefined && <span className="text-xs font-medium text-ink-muted">({count} opiniones)</span>}
        </span>
    )
}

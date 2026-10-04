/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"

/** Indicador de pasos para formularios multi-etapa. `current` comienza en 1. */
export const StepIndicator = ({ steps, current }) => {
    return (
        <ol className="mb-6 flex items-center gap-2" aria-label="Progreso">
            {steps.map((label, i) => {
                const n = i + 1
                const done = n < current
                const active = n === current
                return (
                    <li key={label} className="flex flex-1 items-center gap-2" aria-current={active ? "step" : undefined}>
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${done || active ? "bg-brand-500 text-white" : "bg-default-100 text-ink-muted"}`}>
                            {done ? <FontAwesomeIcon icon={faCheck} /> : n}
                        </span>
                        <span className={`hidden text-sm sm:block ${active ? "font-semibold text-ink" : "text-ink-muted"}`}>{label}</span>
                        {n < steps.length && <span className={`h-px flex-1 ${done ? "bg-brand-500" : "bg-default-200"}`} />}
                    </li>
                )
            })}
        </ol>
    )
}

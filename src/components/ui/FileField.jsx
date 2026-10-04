/* eslint-disable react/prop-types */
import { useId, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUpFromBracket, faCircleCheck } from "@fortawesome/free-solid-svg-icons"

/** Campo para subir archivos con estado visible (nombre del archivo seleccionado). */
export const FileField = ({ label, name, multiple = false, accept, isRequired = false, description }) => {
    const id = useId()
    const [files, setFiles] = useState([])

    const resumen = files.length === 0
        ? (multiple ? "Seleccionar archivos…" : "Seleccionar archivo…")
        : files.length === 1 ? files[0] : `${files.length} archivos seleccionados`

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-ink">
                {label}{isRequired && <span className="text-danger"> *</span>}
            </label>
            <label
                htmlFor={id}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 border-dashed px-4 py-3 text-sm transition-colors focus-within:border-brand-500 hover:border-brand-300 ${files.length ? "border-success-300 bg-success-50 text-success-700" : "border-default-200 text-ink-muted"}`}
            >
                <span className="truncate">{resumen}</span>
                <FontAwesomeIcon icon={files.length ? faCircleCheck : faArrowUpFromBracket} className="shrink-0" />
                <input
                    id={id}
                    name={name}
                    type="file"
                    multiple={multiple}
                    accept={accept}
                    required={isRequired}
                    className="sr-only"
                    onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))}
                />
            </label>
            {description && <p className="text-xs text-ink-muted">{description}</p>}
        </div>
    )
}

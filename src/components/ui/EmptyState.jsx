/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInbox } from "@fortawesome/free-solid-svg-icons"

/** Estado vacío estándar para listas y resultados. */
export const EmptyState = ({ icon = faInbox, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-xl text-brand-500">
                <FontAwesomeIcon icon={icon} />
            </span>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
            {action && <div className="mt-2">{action}</div>}
        </div>
    )
}

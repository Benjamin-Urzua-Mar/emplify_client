/* eslint-disable react/prop-types */

/** Tarjeta de sección con título, acciones opcionales y contenido. */
export const SectionCard = ({ title, description, actions, children, className = "", bodyClassName = "" }) => {
    return (
        <section className={`card ${className}`}>
            {(title || actions) && (
                <header className="flex flex-wrap items-start justify-between gap-3 border-b border-default-100 px-5 py-4 sm:px-6">
                    <div>
                        {title && <h2 className="text-lg font-semibold">{title}</h2>}
                        {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
                    </div>
                    {actions && <div className="flex items-center gap-2">{actions}</div>}
                </header>
            )}
            <div className={`px-5 py-5 sm:px-6 ${bodyClassName}`}>{children}</div>
        </section>
    )
}

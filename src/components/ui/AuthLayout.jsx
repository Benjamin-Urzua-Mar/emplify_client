/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { Logo } from "./Logo"

/**
 * Layout de autenticación (login, registro y onboarding).
 * - Sin `aside`: tarjeta centrada (login).
 * - Con `aside`: dos columnas, información a la izquierda y formulario a la derecha (registro).
 */
export const AuthLayout = ({ title, subtitle, aside, children, width = "md" }) => {
    const widths = { md: "max-w-md", lg: "max-w-2xl" }

    return (
        <div className="min-h-screen bg-surface-muted">
            <header className="page-container flex h-16 items-center justify-between">
                <Logo />
                <Link to="/" className="flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-brand-500">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Volver al inicio
                </Link>
            </header>

            <main className={`page-container grid gap-10 pb-16 pt-6 sm:pt-10 ${aside ? "lg:grid-cols-[1fr_minmax(0,36rem)] lg:items-start" : ""}`}>
                {aside && (
                    <section className="flex flex-col gap-4 lg:sticky lg:top-10 lg:pt-6">
                        <h1 className="text-3xl font-bold sm:text-4xl">
                            Bienvenido a Empl<span className="text-brand-500">ify</span>
                        </h1>
                        {subtitle && <p className="text-lg text-ink-body">{subtitle}</p>}
                        {aside}
                    </section>
                )}

                <section className={`card mx-auto w-full p-6 sm:p-8 ${aside ? "" : widths[width]}`}>
                    {!aside && (
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                {title ?? <>Bienvenido a Empl<span className="text-brand-500">ify</span></>}
                            </h1>
                            {subtitle && <p className="mt-2 text-ink-muted">{subtitle}</p>}
                        </div>
                    )}
                    {aside && title && <h2 className="mb-6 text-xl font-semibold">{title}</h2>}
                    {children}
                </section>
            </main>
        </div>
    )
}

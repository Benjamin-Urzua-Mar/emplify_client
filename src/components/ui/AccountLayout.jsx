/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom"
import { Chip } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Header } from "../Global/Header"
import { Footer } from "../Global/Footer"

/**
 * Layout de áreas privadas (cuenta, perfil, solicitudes).
 * `nav`: [{ label, icon, to? , onClick?, active?, disabled? }]
 */
export const AccountLayout = ({ navTitle, nav = [], children }) => {
    const { pathname } = useLocation()

    const itemClass = (active, disabled) =>
        `flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-colors ${disabled
            ? "cursor-not-allowed text-default-400"
            : active
                ? "bg-brand-50 text-brand-600"
                : "text-ink-body hover:bg-default-100 hover:text-ink"}`

    return (
        <div className="flex min-h-screen flex-col bg-surface-muted">
            <Header />
            <div className="page-container grid flex-1 gap-6 py-6 md:grid-cols-[15rem_1fr] md:py-10">
                <aside>
                    {navTitle && <h2 className="mb-3 hidden px-3 text-xs font-semibold uppercase tracking-wider text-ink-muted md:block">{navTitle}</h2>}
                    <nav aria-label={navTitle ?? "Secciones"} className="-mx-4 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0">
                        <ul className="flex gap-1 md:flex-col">
                            {nav.map(item => {
                                const active = item.active ?? (item.to && pathname == item.to)
                                const content = (
                                    <>
                                        {item.icon && <FontAwesomeIcon fixedWidth icon={item.icon} />}
                                        <span>{item.label}</span>
                                        {item.disabled && <Chip size="sm" variant="flat" className="ml-auto h-5 text-[10px]">Pronto</Chip>}
                                    </>
                                )
                                return (
                                    <li key={item.label}>
                                        {item.disabled ? (
                                            <span className={itemClass(false, true)} aria-disabled="true">{content}</span>
                                        ) : item.to ? (
                                            <Link to={item.to} className={itemClass(active)} aria-current={active ? "page" : undefined}>{content}</Link>
                                        ) : (
                                            <button type="button" onClick={item.onClick} className={itemClass(active)} aria-current={active ? "page" : undefined}>{content}</button>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>
                </aside>
                <main className="min-w-0">{children}</main>
            </div>
            <Footer />
        </div>
    )
}

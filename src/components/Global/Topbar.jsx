import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faXTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { CONTACTO } from '../../data/contacto'

export const Topbar = () => {
    return (
        <section className="hidden bg-brand-600 text-sm text-white md:block">
            <div className="page-container flex items-center justify-between py-2">
                <span className="flex items-center gap-5">
                    <a href={`mailto:${CONTACTO.email}`} className="flex items-center gap-2 text-white/90 transition-colors hover:text-white">
                        <FontAwesomeIcon icon={faEnvelope} />{CONTACTO.email}
                    </a>
                    <a href={`tel:${CONTACTO.telefonoHref}`} className="flex items-center gap-2 text-white/90 transition-colors hover:text-white">
                        <FontAwesomeIcon icon={faPhone} />{CONTACTO.telefono}
                    </a>
                </span>

                <span className="flex items-center gap-4 text-base">
                    <a href="#" aria-label="Instagram de Emplify" className="text-white/70 transition-colors hover:text-white"><FontAwesomeIcon icon={faInstagram} /></a>
                    <a href="#" aria-label="X (Twitter) de Emplify" className="text-white/70 transition-colors hover:text-white"><FontAwesomeIcon icon={faXTwitter} /></a>
                    <a href="#" aria-label="LinkedIn de Emplify" className="text-white/70 transition-colors hover:text-white"><FontAwesomeIcon icon={faLinkedin} /></a>
                </span>
            </div>
        </section>
    )
}

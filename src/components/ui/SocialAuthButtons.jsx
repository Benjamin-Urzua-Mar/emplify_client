import { Button, Divider } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons"

/** Botones de acceso con proveedores externos. */
export const SocialAuthButtons = () => {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-ink-muted">
                <Divider className="flex-1" />
                o continúa con
                <Divider className="flex-1" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button variant="bordered" className="border-default-200" startContent={<FontAwesomeIcon icon={faGoogle} />}>
                    Google
                </Button>
                <Button variant="bordered" className="border-default-200" startContent={<FontAwesomeIcon icon={faFacebookF} />}>
                    Facebook
                </Button>
            </div>
        </div>
    )
}

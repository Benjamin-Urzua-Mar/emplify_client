import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faMobileRetro, faEnvelope} from '@fortawesome/free-solid-svg-icons'

export const Topbar = () => {
    return (
        <section className="hidden md:flex text-[14px] p-2 px-32 text-white place-content-between font-['Open Sans', sans-serif]  bg-Secondary">
            <span>
                <span>
                    <FontAwesomeIcon className='mr-1' icon={faEnvelope} /><a href="">soporte@emplify.cl</a>
                </span>
                <span className='ml-3' >
                    <FontAwesomeIcon className='mr-1' icon={faMobileRetro} />+569 123123123
                </span>
            </span>

            <span className='text-Transparent text-[16px]'>
                <FontAwesomeIcon  icon={faInstagram} />
                <FontAwesomeIcon  className='ml-3' icon={faTwitter} />
                <FontAwesomeIcon  className='ml-3' icon={faLinkedin} />
            </span>
        </section>
    )
}

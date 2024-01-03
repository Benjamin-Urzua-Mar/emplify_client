import { Input, Button, Select, SelectItem } from "@nextui-org/react"
import { formatRut } from 'rutlib';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons'
import {  useState, useRef } from "react"
import { v4 } from 'uuid'
import { Link, useNavigate } from "react-router-dom";
import { regiones, comunas, provincias } from "../../data/regiones";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export const RegisterCliente = () => {
    const txt_nombres = useRef()
    const txt_apellidos = useRef()
    const txt_email = useRef()
    const txt_contrasena = useRef()
    const txt_telefono = useRef()
    const txt_run = useRef()
    const txt_fechaNacto = useRef()
    const txt_region = useRef()
    const txt_provincia = useRef()
    const txt_comuna = useRef()
    const txt_direccion = useRef()

    const redirect = useNavigate()

    const register = async (e) => {
        e.preventDefault()
        const nombres = txt_nombres.current.value
        const apellidos = txt_apellidos.current.value
        const email = txt_email.current.value
        const contrasena = txt_contrasena.current.value
        const telefono = txt_telefono.current.value
        const run = txt_run.current.value
        const fechaNacto = txt_fechaNacto.current.value
        const region = txt_region.current.value.slice(txt_region.current.value.indexOf(":") + 1)
        const provincia = txt_provincia.current.value.slice(txt_provincia.current.value.indexOf(":") + 1)
        const comuna = txt_comuna.current.value.slice(txt_comuna.current.value.indexOf(":") + 1)
        const direccion = txt_direccion.current.value

        const body = JSON.stringify(
            {   
                nombres: nombres,
                apellidos: apellidos,
                email: email,
                contrasena: contrasena,
                telefono: telefono,
                run: run,
                fechaNacto: fechaNacto,
                region: region,
                provincia: provincia,
                comuna: comuna,
                direccion: direccion,
                estado: true
            }
        )
        const headers = {
            "Content-Type": "application/json"
        }

        await fetch('https://emplify-server-dev-zcbh.4.us-1.fl0.io/clientes/register', { method: 'POST', body: body, headers: headers })
        .then(res => res.json().then(msg => {
            const ReactSwal = withReactContent(Swal)
         
            switch (msg["codigo"]) {
                case 1:
                    ReactSwal.fire({
                        icon: 'success',
                        title: '¡Genial!',
                        text: msg["msg"],
                    }).then((result) => {
                        if (result['isConfirmed']) {
                            return redirect("/clientes/login")
                        }
                    })
                    break;
                case 2:
                    ReactSwal.fire({
                        icon: 'error',
                        title: 'Problemas...',
                        text: msg["msg"],
                        footer: '<a href="/">Recuperar contraseña</a>'
                    })
                    break;
                case 10:
                    ReactSwal.fire({
                        icon: 'error',
                        title: 'Problemas...',
                        text: msg["msg"],
                    })
                    break;
            }
        }))
    }

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [run, setRun] = useState("")
    const formatearRun = (evt) => {
        const { target } = evt;
        const { value } = target;

        setRun(formatRut(value))
    }

    
    const [comboProvincias, setComboProvincias] = useState([{}])
    const [comboComunas, setComboComunas] = useState([{}])
    const cargarCombos = async (evt, tipo) => {
        const { target } = evt;
        const { value } = target;

        if (tipo == "provincia") {
            const key = value.slice(0, 2)
            const data = provincias.filter(provincia => provincia.codigo_padre == key)
            setComboProvincias(data)
        } else {
            const key = value.slice(0, 3)
            const data = comunas.filter(comuna => comuna.codigo_padre == key)
            setComboComunas(data)

        }
    }
    return (
        <main className="container flex justify-between flex-col px-5 lg:flex-row gap-4 m-auto">
            <div className="basis-8/12 text-center pt-10">
                <span className="mb-4 px-4 md:px-0 flex flex-col">
                    <h1 className="text-[2.5rem] font-[500]">Bienvenido a Work<span className="text-Primary">It.</span></h1>
                    <h4 className="text-[1.25rem] font-[500] mb-10">¡Regístrate con nosotros para obtener al profesional que necesitas!</h4>
                    <p className="text-[1.10rem] font-[600]">Todos estos datos serán necesarios para: </p>
                    <span className="text-start place-self-center">
                        <li>Ofrecerle una experiencia personalizada dentro de Emplify.</li>
                        <li>Entregarle seguridad dentro de Emplify.</li>
                        <li>Cubrirle a nivel legal con el uso de Emplify.</li>
                    </span>
                    <Link to='/' className="text-Primary text-sm font-semibold place-self-center lg:place-self-start  mt-10">Volver</Link>
                </span>

            </div>
            <form className=" gap-3 basis-8/12 lg:basis-5/12 pt-3 lg:pt-20 col-span-6 flex flex-col " onSubmit={(e) => register(e)}>
                <div className="grid grid-cols-2 gap-3">
                    <div >
                        <Input variant="underlined"
                            type="text"
                            label="Nombres"
                            labelPlacement="outside"
                            placeholder="Ingrese sus nombres"
                            id="txt_nombres"
                            name="txt_nombres"
                            ref={txt_nombres}

                        />
                        <Input variant="underlined"
                            id="txt_contrasena"
                            name="txt_contrasena"
                            className="mt-2"
                            labelPlacement="outside"
                            label="Contraseña"
                            placeholder="************"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <FontAwesomeIcon className="text-lg text-default-400 pointer-events-none" icon={faEyeSlash} />
                                    ) : (
                                        <FontAwesomeIcon className="text-lg text-default-400 pointer-events-none" icon={faEye} />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            ref={txt_contrasena}

                        />
                        <Input variant="underlined"
                            className="mt-2"
                            type="email"
                            label="Correo electrónico"
                            labelPlacement="outside"
                            placeholder="email@emplify.cl"
                            id="txt_email"
                            name="txt_email"
                            ref={txt_email}

                        />
                        <Input variant="underlined"
                            className="mt-2"
                            type="text"
                            label="Run"
                            labelPlacement="outside"
                            placeholder="12.345.678-k"
                            id="txt_run"
                            name="txt_run"
                            value={run}
                            maxLength={12}
                            onChange={formatearRun}
                            ref={txt_run}
                        />



                        <Select
                            variant="underlined"
                            className="mt-2"
                            labelPlacement={'outside'}
                            label="Región"
                            placeholder="Seleccione una región"
                            items={regiones}
                            onChange={(evt) => cargarCombos(evt, 'provincia')}
                            ref={txt_region}
                        >
                            {(region) => <SelectItem key={`${region.codigo}__${v4()}:${region.nombre}`}>{region.nombre}</SelectItem>}

                        </Select>




                        <Select
                            variant="underlined"
                            className="mt-2"
                            labelPlacement={'outside'}
                            label="Comuna"
                            placeholder="Seleccione una comuna"
                            items={comboComunas}
                            ref={txt_comuna}
                        >
                            {(comuna) => <SelectItem key={`${comuna.codigo}__${v4()}:${comuna.nombre}`}>{comuna.nombre}</SelectItem>}

                        </Select>


                    </div>


                    <div>
                        <Input variant="underlined"
                            id="txt_apellidos"
                            name="txt_apellidos"
                            type="text"
                            label="Apellidos"
                            labelPlacement="outside"
                            placeholder="Ingrese sus apellidos"
                            ref={txt_apellidos}
                        />
                        <Input variant="underlined"
                            id="txt_confirmaContrasena"
                            name="txt_confirmaContrasena"
                            className="mt-2"
                            labelPlacement="outside"
                            label="Confirme contraseña"
                            placeholder="************"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <FontAwesomeIcon className="text-lg text-default-400 pointer-events-none" icon={faEyeSlash} />
                                    ) : (
                                        <FontAwesomeIcon className="text-lg text-default-400 pointer-events-none" icon={faEye} />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}

                        />
                        <Input variant="underlined"
                            startContent={
                                <span className="text-sm text-default-500 align-bottom">+569</span>
                            }
                            className="mt-2"
                            type="text"
                            label="Teléfono"
                            labelPlacement="outside"
                            placeholder="12345678"
                            maxLength={8}
                            id="txt_telefono"
                            name="txt_telefono"
                            ref={txt_telefono}
                        />
                        <Input variant="underlined"
                            className="mt-2"
                            type="date"
                            label="Fecha de nacimiento"
                            labelPlacement="outside"
                            placeholder="dd-mm-aaaa"
                            id="txt_fechaNacto"
                            name="txt_fechaNacto"
                            ref={txt_fechaNacto}
                        />



                        <Select
                            variant="underlined"
                            className="mt-2"
                            labelPlacement={'outside'}
                            label="Provincia"
                            placeholder="Seleccione una provincia"
                            items={comboProvincias}
                            ref={txt_provincia}
                            onChange={(evt) => cargarCombos(evt, 'comuna')}
                        >
                            {(provincia) => <SelectItem key={`${provincia.codigo}__${v4()}:${provincia.nombre}`}>{provincia.nombre}</SelectItem>}

                        </Select>


                        <Input variant="underlined"
                            className="mt-2"
                            id="txt_direccion"
                            name="txt_direccion"
                            type="text"
                            label="Calle y número"
                            labelPlacement="outside"
                            placeholder="Calle 123"
                            ref={txt_direccion}
                        />
                    </div>
                </div>

                <div className="col-span-6 text-sm mt-2 flex flex-col gap-2">

                    <Button color="secondary" type="submit" className="w-8/12 place-self-center mb-2" >Registrarse</Button>
                    <span className="place-self-center">¿Ya estás registrado? <Link to="/clientes/login" className="text-Primary">Inicia sesión</Link></span>
                    <Button color="primary" variant="ghost" className="w-6/12 place-self-center  hover:text-white text-sm"><FontAwesomeIcon className="text-lg" icon={faGoogle} /> Continuar con Google</Button>
                    <Button color="default" variant="ghost" className="w-6/12 place-self-center hover:text-white text-sm"><FontAwesomeIcon className="text-lg" icon={faFacebookF} /> Continuar con Google</Button>

                </div>
            </form>
        </main>
    )
}

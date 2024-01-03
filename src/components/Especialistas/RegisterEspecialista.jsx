import { Input, Button, Select, SelectItem, Tab, Tabs } from "@nextui-org/react"
import { formatRut } from 'rutlib';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'
import {  useState, useRef } from "react"
import { v4 } from 'uuid'
import { Link, useNavigate } from "react-router-dom";
import { regiones, comunas, provincias } from "../../data/regiones";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import KeepAlive from 'react-activation';

export const RegisterEspecialista = () => {

    const txt_nombres = useRef()
    const txt_apellidos = useRef()
    const txt_email = useRef()
    const txt_contrasena = useRef()
    const txt_telefono = useRef()
    const txt_run = useRef()
    const txt_region = useRef()
    const txt_provincia = useRef()
    const txt_comuna = useRef()
    const txt_direccion = useRef()
    const txt_rubro = useRef()
    const txt_profesion = useRef()


    const formRegister = useRef()
    const redirect = useNavigate()

    const register = async (e) => {
        e.preventDefault()

        const nombres = txt_nombres.current.value
        const apellidos = txt_apellidos.current.value
        const email = txt_email.current.value
        const contrasena = txt_contrasena.current.value
        const telefono = txt_telefono.current.value
        const run = txt_run.current.value
        const region = txt_region.current.value.slice(txt_region.current.value.indexOf(":") + 1)
        const provincia = txt_provincia.current.value.slice(txt_provincia.current.value.indexOf(":") + 1)
        const comuna = txt_comuna.current.value.slice(txt_comuna.current.value.indexOf(":") + 1)
        const direccion = txt_direccion.current.value
        const rubro = txt_rubro.current.value.slice(txt_rubro.current.value.indexOf(":") + 1)
        const profesion = txt_profesion.current.value

        const body = new FormData(formRegister.current)
        body.append("nombres", nombres)
        body.append("apellidos", apellidos)
        body.append("email", email)
        body.append("contrasena", contrasena)
        body.append("telefono", telefono)
        body.append("run", run)
        body.append("region", region)
        body.append("provincia", provincia)
        body.append("comuna", comuna)
        body.append("direccion", direccion)
        body.append("rubro", rubro)
        body.append("profesion", profesion)
        body.delete("txt_rubro")
        body.delete("txt_profesion")
        await fetch('https://emplify-server-dev-zcbh.4.us-1.fl0.io/especialistas/register', { method: 'POST', body: body, contentType: false, processData: false, })
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
                                localStorage.setItem("tempRun", run)
                                return redirect("/especialistas/register/perfilInicial")
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
                    case 3:
                        ReactSwal.fire({
                            icon: 'error',
                            title: 'Problemas...',
                            text: msg["msg"]
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


    const [comboProvincias, setComboProvincias] = useState([{}])
    const [comboComunas, setComboComunas] = useState([{}])

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const [run, setRun] = useState("")

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


    const formatearRun = (evt) => {
        const { target } = evt;
        const { value } = target;

        setRun(formatRut(value))
    }



    const [cedIdentidadPlaceholder, setCedIdentidadPlaceholder] = useState(<span className='absolute font-normal text-foreground-500 text-sm'>Subir archivo...</span>)
    const [certResidenciaPlaceholder, setcertResidenciaPlaceholder] = useState(<span className='absolute font-normal text-foreground-500 text-sm'>Subir archivo...</span>)
    const [titProfesionalesPlaceholder, setTitProfesionalesPlaceholder] = useState(<span className='absolute font-normal text-foreground-500 text-sm'>Subir archivos...</span>)
    const [certAntecedentesPlaceholder, setcedAntecedentesPlaceholder] = useState(<span className='absolute font-normal text-foreground-500 text-sm'>Subir archivo...</span>)


    const handleFileInputs = ((tipo) => {
        switch (tipo) {
            case 'identidad':
                setCedIdentidadPlaceholder(<span className='absolute text-green-600 font-normal text-sm'>Archivo subido</span>)
                break;
            case 'residencia':
                setcertResidenciaPlaceholder(<span className='absolute text-green-600 font-normal text-sm'>Archivo subido</span>)
                break;
            case 'titulos':
                setTitProfesionalesPlaceholder(<span className='absolute text-green-600 font-normal text-sm'>Archivos subidos</span>)
                break;
            case 'antecedentes':
                setcedAntecedentesPlaceholder(<span className='absolute text-green-600 font-normal text-sm'>Archivo subido</span>)
                break;
        }
    })

    return (

        <main className="container flex justify-between flex-col px-5 lg:flex-row gap-4 m-auto">
            <div className="basis-8/12 text-center pt-10">
                <span className="mb-4 px-4 md:px-0 flex flex-col">
                    <h1 className="text-[2.5rem] font-[500]">Bienvenido a Work<span className="text-Primary">It.</span></h1>
                    <h4 className="text-[1.25rem] font-[500]">¡Regístrate como profesional!</h4>
                    <h4 className="text-[1.10rem] font-[500] mb-10">Y ¡sé el profesional que tus clientes necesitan!</h4>
                    <p className="text-[1.25rem] font-[600]">Documentación necesaria:</p>
                    <span className="text-start place-self-center">
                        <li>Copia de cédula de identidad</li>
                        <li>Certificado de antecedentes</li>
                        <li>Certificado de residencia</li>
                    </span>
                    <Link to='/' className="text-Primary text-sm font-semibold place-self-center lg:place-self-start  mt-10">Volver</Link>
                </span>

            </div>
            <form className=" gap-3 basis-8/12 lg:basis-5/12 pt-3 lg:pt-20 col-span-6 flex flex-col " onSubmit={(e) => register(e)} encType="multipart/form-data" ref={formRegister}>

                <Tabs aria-label="Pasos" variant="underlined" color="secondary">
                    <Tab key="paso1" title="Paso 1">
                        <KeepAlive  >
                            <div className="grid grid-cols-2 gap-3 relative">
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
                                        ref={txt_region}
                                        onChange={(evt) => cargarCombos(evt, 'provincia')}
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

                                <div className="col-span-6 text-sm mt-2 flex flex-col gap-2">
                                    <span className="place-self-center">¿Ya estás registrado? <Link to="/especialistas/login" className="text-Primary">Inicia sesión</Link></span>
                                </div>
                            </div>
                        </KeepAlive>
                    </Tab>

                    <Tab key="paso2" title="Paso 2">
                        <KeepAlive >
                            <div className="grid grid-cols-2 gap-3 relative">
                                <div>
                                    <span>
                                        <label className="block text-sm mb-1 font-medium text-foreground-900 pb-[1.5]">Cédula de identidad</label>
                                        <Input
                                            className="mb-2"
                                            id={`fl_cedIdentidad_${run}`}
                                            name={`fl_cedIdentidad_${run}`}
                                            variant="underlined"
                                            type="file"
                                            onChange={() => handleFileInputs('identidad')}
                                            endContent={
                                                <Button radius="none" variant="flat" className="px-6" isIconOnly disabled color="none" type="button" >
                                                    <span><FontAwesomeIcon className="text-l text-foreground-400 pointer-events-none" icon={faArrowUpFromBracket} /></span>
                                                </Button>

                                            }
                                            startContent={
                                                cedIdentidadPlaceholder

                                            }
                                            style={{ opacity: 0 }}
                                        />
                                    </span>

                                    <span>
                                        <label className="block text-sm mb-1 font-medium text-foreground-900 pb-[1.5]">Títulos profesionales</label>
                                        <Input
                                            id={`fl_tituloProfesional_${run}`}
                                            name={`fl_tituloProfesional_${run}`}
                                            variant="underlined"
                                            type="file"
                                            multiple
                                            onChange={() => handleFileInputs('titulos')}
                                            endContent={
                                                <Button radius="none" variant="flat" className="px-6" isIconOnly disabled color="none" type="button" >
                                                    <span><FontAwesomeIcon className="text-l  text-foreground-400 pointer-events-none" icon={faArrowUpFromBracket} /></span>
                                                </Button>

                                            }
                                            startContent={
                                                titProfesionalesPlaceholder
                                            }
                                            style={{ opacity: 0 }}
                                        />
                                    </span>

                                    <Select
                                        id="txt_rubro"
                                        name="txt_rubro"
                                        ref={txt_rubro}
                                        variant="underlined"
                                        className="mt-2"
                                        labelPlacement={'outside'}
                                        label="Rubro"
                                        placeholder="Seleccione su rubro"
                                    >
                                        <SelectItem key={`${v4()}:Informática`}>
                                            Informática
                                        </SelectItem>

                                        <SelectItem key={`${v4()}:Construcción`}>
                                            Construcción
                                        </SelectItem>

                                        <SelectItem key={`${v4()}:Mecánica`}>
                                            Mecánica
                                        </SelectItem>
                                    </Select>
                                </div>
                                <div>
                                    <span>
                                        <label className="block text-sm mb-1 font-medium text-foreground-900 pb-[1.5]">Certificado de residencia</label>
                                        <Input
                                            className="mb-2"
                                            id={`fl_certResidencia_${run}`}
                                            name={`fl_certResidencia_${run}`}
                                            variant="underlined"
                                            type="file"
                                            onChange={() => handleFileInputs('residencia')}
                                            endContent={
                                                <Button radius="none" variant="flat" className="px-6" isIconOnly disabled color="none" type="button" >
                                                    <span><FontAwesomeIcon className="text-l  text-foreground-400 pointer-events-none" icon={faArrowUpFromBracket} /></span>
                                                </Button>

                                            }
                                            startContent={
                                                certResidenciaPlaceholder
                                            }
                                            style={{ opacity: 0 }}
                                        />
                                    </span>
                                    <span>
                                        <label className="block text-sm mb-1 font-medium text-foreground-900 pb-[1.5]">Certificado de antecedentes</label>
                                        <Input
                                            id={`fl_certAntecedentes_${run}`}
                                            name={`fl_certAntecedentes_${run}`}
                                            variant="underlined"
                                            type="file"
                                            onChange={() => handleFileInputs('antecedentes')}
                                            endContent={
                                                <Button radius="none" variant="flat" className="px-6" isIconOnly disabled color="none" type="button" >
                                                    <span><FontAwesomeIcon className="text-l  text-foreground-400 pointer-events-none" icon={faArrowUpFromBracket} /></span>
                                                </Button>

                                            }
                                            startContent={
                                                certAntecedentesPlaceholder
                                            }
                                            style={{ opacity: 0 }}
                                        />
                                    </span>
                                    <Input variant="underlined"
                                        className="mt-2"
                                        type="text"
                                        label="Especifique su profesión"
                                        labelPlacement="outside"
                                        placeholder="Ej: Programador"
                                        id="txt_profesion"
                                        name="txt_profesion"
                                        ref={txt_profesion}
                                    />

                                </div>
                                <div className="col-span-6 mt-2 text-sm flex flex-col gap-2">
                                    <Button color="secondary" type="submit" className="w-10/12 place-self-center mb-2">Registrarse</Button>
                                    <span className="place-self-center">¿Ya estás registrado? <Link to="/especialistas/login" className="text-Primary">Inicia sesión</Link></span>
                                </div>
                            </div>
                        </KeepAlive>
                    </Tab>

                </Tabs>



            </form>
        </main>
    )
}

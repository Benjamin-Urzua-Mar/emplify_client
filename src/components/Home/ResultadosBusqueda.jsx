import { Header } from "../Global/Header"
import { Dropdown, DropdownTrigger, Input, Button, DropdownMenu, DropdownItem, Card, CardBody, CardFooter, CardHeader, Avatar, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react"
import { faChevronDown, faMagnifyingGlass, faChevronUp, faLocationDot, faAddressCard, faBriefcase, faWrench } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useMemo, useState } from "react"
import { useGlobalState } from "../../../global_states/searchResults"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"

export const ResultadosBusqueda = () => {
    const [searchResults, setSearchResults] = useState([])
    const [preciosDesde, setPreciosDesde] = useState(new Set(["$100.000"]));
    const redirect = useNavigate()

    const precioDesde = useMemo(
        () => Array.from(preciosDesde).join(", "),
        [preciosDesde]
    );

    const [preciosHasta, setPreciosHasta] = useState(new Set(["$2.000.000"]));

    const precioHasta = useMemo(
        () => Array.from(preciosHasta).join(", "),
        [preciosHasta]
    );

    const [estrellas, setEstrellas] = useState(new Set(["5 estrellas"]));

    const estrella = useMemo(
        () => Array.from(estrellas).join(", "),
        [estrellas]
    );

    const [disponibilidades, setDisponibilidad] = useState(new Set(["Disponible"]));

    const disponibilidad = useMemo(
        () => Array.from(disponibilidades).join(", "),
        [disponibilidades]
    );

    const [mostrarFiltros, setMostrarFiltros] = useState("hidden")
    const [mostrarBusqueda, setMostrarBusqueda] = useState("hidden")
    const [changeChevron, setChangeChevron] = useState(true)
    const [colorFiltro, setColorFiltro] = useState("")
    const [colorBusqueda, setColorBusqueda] = useState("")

    const handleFiltros = () => {
        if (mostrarFiltros == "hidden") {
            setChangeChevron(false)
            setMostrarFiltros("flex")
            setColorFiltro("text-Primary")
        } else {
            setChangeChevron(true)
            setMostrarFiltros("hidden")
            setColorFiltro("text-")
        }
    }

    const handleBusqueda = () => {
        if (mostrarBusqueda == "hidden") {
            setMostrarBusqueda("flex")
            setColorBusqueda("text-Primary")
        } else {
            setMostrarBusqueda("hidden")
            setColorBusqueda("text-")
        }
    }

    useEffect(() => {
        setSearchResults( JSON.parse(localStorage.getItem("searchResults")))
    }, [])

    return (
        <>
            <Header />
            <div className="container m-auto">
                <section className="flex sticky top-0 z-30 bg-white sm:hidden justify-between gap-3 px-16 py-2 text-[1.01rem] font-[500]" >
                    <span className={colorFiltro + " hover:cursor-pointer"} onClick={handleFiltros}>
                        <span className="mr-3">Filtros</span>
                        {(changeChevron) ? (
                            <span ><FontAwesomeIcon size="sm" icon={faChevronDown} /></span>

                        ) : (

                            <span ><FontAwesomeIcon size="sm" icon={faChevronUp} /></span>
                        )}
                    </span>
                    <span className={colorBusqueda + " hover:cursor-pointer"} onClick={handleBusqueda}>
                        <span className="mr-3">Buscar</span>
                        <span ><FontAwesomeIcon size="sm" icon={faMagnifyingGlass} /></span>
                    </span>
                </section>

                <section className={mostrarFiltros + " sm:sticky  top-0 z-30 bg-white  flex-col items-start px-16 sm:flex sm:flex-row sm:justify-between lg:px-36 2xl:px-64  p-5 border-b-1 w-full gap-5"}>

                    <Dropdown >
                        <DropdownTrigger>
                            <Button
                                color="secondary"
                                variant="flat"
                            >
                                Ordenar por <FontAwesomeIcon size="sm" icon={faChevronDown} />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                            <DropdownItem key="new">Reputación</DropdownItem>
                            <DropdownItem key="copy">Relevantes</DropdownItem>
                            <DropdownItem key="edit">Más cercanos</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <span className="flex flex-col sm:flex-row gap-3">
                        <Dropdown>
                            <DropdownTrigger>
                                <Input
                                    value={disponibilidad}
                                    variant="underlined"
                                    label="Mostrar:"
                                    labelPlacement="outside-left"
                                    endContent={<FontAwesomeIcon size="xs" icon={faChevronDown} />}
                                    type="text"
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={disponibilidades}
                                onSelectionChange={setDisponibilidad}
                            >
                                <DropdownItem key="Disponible">Disponible</DropdownItem>
                                <DropdownItem key="Contratado">Contratado</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown>
                            <DropdownTrigger>
                                <Input
                                    value={precioDesde}
                                    variant="underlined"
                                    label="Precio desde:"
                                    labelPlacement="outside-left"
                                    endContent={<FontAwesomeIcon size="xs" icon={faChevronDown} />}
                                    type="text"
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={preciosDesde}
                                onSelectionChange={setPreciosDesde}
                            >
                                <DropdownItem key="$100.000">$100.000</DropdownItem>
                                <DropdownItem key="$200.000">$200.000</DropdownItem>
                                <DropdownItem key="$500.000">$500.000</DropdownItem>
                                <DropdownItem key="$1.000.000">$1.000.000</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown>
                            <DropdownTrigger>
                                <Input
                                    value={precioHasta}
                                    variant="underlined"
                                    label="Precio hasta:"
                                    labelPlacement="outside-left"
                                    endContent={<FontAwesomeIcon size="xs" icon={faChevronDown} />}
                                    type="text"
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={precioHasta}
                                onSelectionChange={setPreciosHasta}
                            >
                                <DropdownItem key="$2.000.000">$2.000.000</DropdownItem>
                                <DropdownItem key="$5.000.000">$5.000.000</DropdownItem>
                                <DropdownItem key="$8.000.000">$8.000.000</DropdownItem>
                                <DropdownItem key="$10.000.000">$10.000.000</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </span>
                    <span>
                        <Dropdown>
                            <DropdownTrigger>
                                <Input
                                    value={estrella}
                                    variant="underlined"
                                    label="Calificación mínima"
                                    labelPlacement="outside-left"
                                    endContent={<FontAwesomeIcon size="xs" icon={faChevronDown} />}
                                    type="text"
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={estrella}
                                onSelectionChange={setEstrellas}
                            >

                                <DropdownItem key="5 estrellas">5 estrellas</DropdownItem>
                                <DropdownItem key="4 estrellas">4 estrellas</DropdownItem>
                                <DropdownItem key="3 estrellas">3 estrellas</DropdownItem>
                                <DropdownItem key="2 estrellas">2 estrellas</DropdownItem>
                                <DropdownItem key="1 estrella">1 estrella</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </span>
                </section>

                <section className={mostrarBusqueda + " sm:flex justify-between items-center gap-3 mt-4 w-full px-16 lg:px-36 2xl:px-64"}>
                    <Input
                        placeholder="Ciudad o Comuna"
                        className=""

                        endContent={
                            <div className="flex items-center">

                                <select
                                    className="outline-none border-0 bg-transparent text-default-400 text-small w-16 sm:w-auto"
                                    id="currency"
                                    name="currency"
                                >
                                    <option>Rubro</option>
                                    <option>Informática</option>
                                    <option>Construcción</option>
                                    <option>Electricidad</option>
                                </select>

                            </div>
                        }
                        type="text"
                    />
                    <Button color="secondary" className="sm:mt-0 ">
                        <span><FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon> Buscar</span>
                    </Button>

                </section>

                <div className="px-16 sm:flex sm:flex-col sm:justify-between lg:px-36 2xl:px-64  p-5">
                    <h1 className="text-[1.8rem] font-[500] ">Resultados de la búsqueda</h1>
                    <h4 className="text-[1.1rem] font-[500] ">{localStorage.getItem("rubro")} en {localStorage.getItem("comuna")}</h4>
                    
                    {
                        searchResults.map((especialista) => {
                            return (
                                <Card key={`${v4()}_${especialista._id}`} className="mt-2">
                                    <CardHeader className="justify-between">
                                        <div className="flex gap-5">
                                            <Avatar color="secondary" isBordered radius="full" size="lg" showFallback src={`https://emplify-server-dev-zcbh.4.us-1.fl0.io/resources/images/${especialista.perfil.foto}`} />
                                            <div className="flex flex-col gap-1 items-start justify-center">
                                                <h4 className="text-small font-semibold leading-none text-default-600">{`${especialista.nombres} ${especialista.apellidos}`}</h4>
                                                <h5 className="text-small tracking-tight text-default-400">{especialista.profesion}</h5>
                                                <h5 className="text-small tracking-tight text-Primary">★★★★★ <span className="text-default-600 text-xs font-semibold">70 opiniones</span></h5>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardBody className="px-3 text-small text-default-500">
                                        <span className="pb-2">
                                            <span>
                                                <FontAwesomeIcon className="text-md text-default-500 pr-2" icon={faLocationDot} />
                                            </span>
                                            {especialista.comuna}
                                        </span>
                                        <p>
                                            <span><FontAwesomeIcon className="text-md text-default-500 pr-2" icon={faAddressCard} /></span>
                                            {especialista.perfil.experiencia}
                                        </p>
                                        <span className="pt-2">
                                            <span>
                                                <FontAwesomeIcon className="text-md text-default-500 pr-2" icon={faBriefcase} />
                                            </span>
                                            {especialista.perfil.antiguedad} años en la plataforma
                                        </span>
                                        <span className="pt-2">
                                            <span>
                                                <FontAwesomeIcon className="text-md text-default-500 pr-2" icon={faWrench} />
                                            </span>
                                            {especialista.perfil.servicios.map(servicio => {
                                                return (
                                                    <>
                                                        <Popover color="none" size="sm" placement="bottom">
                                                            <PopoverTrigger>
                                                                <Button className="text-default-500 " variant="light"><span className="text-xs">{Object.keys(servicio)[0]} <br /><small>Ver precio <FontAwesomeIcon size="xs" icon={faChevronDown} /></small></span></Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent>
                                                                <div className="px-1 py-2">
                                                                    <div className="text-small font-bold">${Object.values(servicio)[0]}</div>
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </>
                                                )
                                            })}

                                        </span>
                                    </CardBody>
                                    <CardFooter className="gap-3 flex justify-between">
                                        <p className="font-semibold text-green-400 text-small">{especialista.disponibilidad}</p>
                                        <Button color="secondary" className="" type="button" onClick={() => redirect("/buscar/perfilEspecialista", localStorage.setItem("perfilEspecialista", JSON.stringify(especialista)))}>Visitar perfil</Button>
                                    </CardFooter>
                                </Card>
                            )
                        })
                    }

                </div>
            </div>
        </>
    )
}

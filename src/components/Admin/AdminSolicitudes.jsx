import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Image, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Checkbox, Input } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";

export const AdminSolicitudes = () => {
    const [ordenes, setOrdenes] = useState(new Set(["Fecha"]));

    const orden = useMemo(
        () => Array.from(ordenes).join(", "),
        [ordenes]
    );

    return (
        <main className="container  mx-auto gap-4">
            <section className="flex py-4">
                <span>
                    <Dropdown>
                        <DropdownTrigger>
                            <Input
                                value={orden}
                                variant="underlined"
                                label="Ordenar por:"
                                labelPlacement="outside-left"
                                endContent={<FontAwesomeIcon size="xs" icon={faChevronDown} />}
                                type="text"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={ordenes}
                            onSelectionChange={setOrdenes}
                        >
                            <DropdownItem key="Fecha">Fecha</DropdownItem>
                            <DropdownItem key="Prioridad">Prioridad</DropdownItem>
                            <DropdownItem key="Estado">Estado</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </span>
                <span>
                    <Checkbox size="sm" className="pt-4 ml-4" color="secondary">Mostrar resueltos</Checkbox>
                </span>
            </section>
            <Card className="mb-3">
                <CardHeader className="flex gap-3">
                    <Image
                        alt="nextui logo"
                        height={40}
                        radius="sm"
                        src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                        width={40}
                    />
                    <div className="flex flex-col">
                        <p className="text-md">Pedrito Sánchez</p>
                        <p className="text-small text-default-500">email@ejemplo.com</p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <h5 className="font-semibold text-xl">Solicitud de registro</h5>
                    <p className="text-default-600">Profesional: <b>Zoey Lang</b></p>
                    <p className="text-default-600">Fecha de solicitud: <b>21-09-2023</b></p>

                    <p className="text-default-600">Revisar:
                        <span className="text-Primary hover:underline hover:cursor-pointer font-semibold"> Cédula de identidad </span>
                        <span className="text-Primary hover:underline hover:cursor-pointer font-semibold"> Certificado de antecedentes </span>
                        <span className="text-Primary hover:underline hover:cursor-pointer font-semibold"> Certificado de residencia </span>
                    </p>
                </CardBody>
                <Divider />
                <CardFooter className="justify-end gap-3">
                    <Button color="danger">Rechazar</Button>
                    <Button color="secondary">Aprobar</Button>
                </CardFooter>
            </Card>

        </main>
    )
}

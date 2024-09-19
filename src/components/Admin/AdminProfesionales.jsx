import { Table, TableHeader, Pagination, TableColumn, TableBody, TableRow, TableCell, User, Chip, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Tooltip, Dropdown, DropdownItem, DropdownTrigger, Input, DropdownMenu, Checkbox, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faBan, faHandcuffs, faChevronDown, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { columns } from "../../data/data_profesionales";
import { useCallback, useState, useMemo, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const statusColorMap = {
  true: "success",
  false: "warning",
};
const statusColorMap2 = {
  Premium: "secondary",
  Corriente: "primary",
};

export const AdminProfesionales = () => {
  const [ordenes, setOrdenes] = useState(new Set(["A-Z"]));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [especialistaSeleccionado, setEspecialistaSeleccionado] = useState([])
  const [actualizarCambios, setActualizarCambios] = useState()

  const handleBan = (_id, nombre, operacion) => {
    const ReactSwal = withReactContent(Swal)
    if (operacion == "ban") {
      ReactSwal.fire({
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: `Cancelar`,
        icon: 'warning',
        title: '¿Está seguro?',
        text: `Está a punto de banear a ${nombre}`,
      }).then((result) => {
        if (result.isConfirmed) {
          const body = JSON.stringify({ id: _id, operacion: operacion })
          const headers = {
            "Content-Type": "application/json"
          }
          fetch(('https://api.burzua.lat/admin/banEspecialista'), { method: "POST", body: body, headers: headers })
            .then(res => res.json().then(msg => {
              setActualizarCambios(1)
              switch (msg["codigo"]) {
                case 1:
                  Swal.fire(msg["msg"], '', 'success')
                  break;
                case 2:
                  Swal.fire(msg["msg"], '', 'info')
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
        } else if (result.isDenied) {
          Swal.fire('Operación cancelada. No hubieron cambios', '', 'info')
        }
      })
    } else {
      ReactSwal.fire({
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: `Cancelar`,
        icon: 'warning',
        title: '¿Está seguro?',
        text: `Está a punto de desbanear a ${nombre}`,
      }).then((result) => {
        if (result.isConfirmed) {
          const body = JSON.stringify({ id: _id, operacion: operacion })
          const headers = {
            "Content-Type": "application/json"
          }
          fetch(('https://api.burzua.lat/admin/banEspecialista'), { method: "POST", body: body, headers: headers })
            .then(res => res.json().then(msg => {
              setActualizarCambios(1)
              switch (msg["codigo"]) {
                case 1:
                  Swal.fire(msg["msg"], '', 'success')
                  break;
                case 2:
                  Swal.fire(msg["msg"], '', 'info')
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
        } else if (result.isDenied) {
          Swal.fire('Operación cancelada. No hubieron cambios', '', 'info')
        }
      })
    }



  }

  const handleDelete = (_id, nombre) => {
    const ReactSwal = withReactContent(Swal)
    ReactSwal.fire({
      showDenyButton: true,
      confirmButtonText: 'Aceptar',
      denyButtonText: `Cancelar`,
      icon: 'warning',
      title: '¿Está seguro?',
      text: `Está a punto de ELIMINAR a ${nombre}`,
    }).then((result) => {
      if (result.isConfirmed) {
        const body = JSON.stringify({ id: _id})
        const headers = {
          "Content-Type": "application/json"
        }
        fetch(('https://api.burzua.lat/admin/deleteEspecialista'), { method: "POST", body: body, headers: headers })
          .then(res => res.json().then(msg => {
            setActualizarCambios(1)
            switch (msg["codigo"]) {
              case 1:
                Swal.fire(msg["msg"], '', 'success')
                break;
              case 2:
                Swal.fire(msg["msg"], '', 'info')
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
      } else if (result.isDenied) {
        Swal.fire('Operación cancelada. No hubieron cambios', '', 'info')
      }
    })
  }

  const handleEdit = (_id) => {
    const body = JSON.stringify({ id: _id })
    const headers = {
      "Content-Type": "application/json"
    }
    fetch(('https://api.burzua.lat/admin/retornarEspecialista'), { method: "POST", body: body, headers: headers })
      .then(res => res.json().then(msg => {
        const ReactSwal = withReactContent(Swal)
        switch (msg["codigo"]) {
          case 1:
            setEspecialistaSeleccionado(msg["data"])
            break;
          case 2:
            ReactSwal.fire({
              icon: 'error',
              title: 'Problemas...',
              text: msg["msg"],
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
    onOpen()
  }

  const [especialistas, setEspecialistas] = useState([])
  useEffect(() => {
    fetch(('https://api.burzua.lat/admin/retornarEspecialistas'))
      .then(res => res.json().then(msg => {
        setActualizarCambios(0)
        const ReactSwal = withReactContent(Swal)
        switch (msg["codigo"]) {
          case 1:
            setEspecialistas(msg["data"])
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
  }, [actualizarCambios])
  const orden = useMemo(
    () => Array.from(ordenes).join(", "),
    [ordenes]
  );

  const renderModalContent = useCallback(user => {
    return (
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Editando a: {`${user.nombres} ${user.apellidos}`}</ModalHeader>
            <ModalBody>

            </ModalBody>
            <ModalFooter>
              <Button color="secondary" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="secondary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    )
  }, [])

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) { 
      case "usuario":
        return (
          <User
            avatarProps={{ radius: "lg", src: `https://api.burzua.lat/resources/images/${user.perfil.foto}` }}
            description={user.email}
            name={`${user.nombres} ${user.apellidos}`}
          >
            {user.email}
          </User>
        );
      case "fecha_registro":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{user.fechaRegistro}</p>
            <p className="text-bold text-sm capitalize text-default-400"></p>
          </div>
        );
      case "estado":
        return (
          <Chip className="capitalize" color={statusColorMap[user.estado]} size="sm" variant="flat">
            {
              (user.estado)
              ? <>Activo</>
              : <>Baneado</>
            }
          </Chip>
        );
      case "tipo_usuario":
        return (
          <Tooltip content={user.content}>
            <Chip className="capitalize" color={statusColorMap2[user.plan]} size="sm" variant="solid">
              {user.plan}
            </Chip>
          </Tooltip>

        );
      case "acciones":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Editar usuario">
              <span className="text-lg text-sky-600 cursor-pointer active:opacity-50">
                <FontAwesomeIcon onClick={() => handleEdit(user._id)} icon={faPencil}></FontAwesomeIcon>
              </span>
            </Tooltip>
            {
              (`${user.estado}` == "false")
                ?
                <Tooltip color="success" content="Desbanear usuario">
                  <span className="text-lg text-success-400 cursor-pointer active:opacity-50">
                    <FontAwesomeIcon onClick={() => handleBan(user._id, `${user.nombres} ${user.apellidos} `, "unban")} icon={faHandcuffs}></FontAwesomeIcon>
                  </span>
                </Tooltip>
                :
                <Tooltip color="warning" content="Banear usuario">
                  <span className="text-lg text-warning cursor-pointer active:opacity-50">
                    <FontAwesomeIcon onClick={() => handleBan(user._id, `${user.nombres} ${user.apellidos} `, "ban")} icon={faBan}></FontAwesomeIcon>
                  </span>
                </Tooltip>
            }

            <Tooltip color="danger" content="Borrar usuario">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <FontAwesomeIcon onClick={() => handleDelete(user._id,  `${user.nombres} ${user.apellidos} `)} icon={faTrash}></FontAwesomeIcon>
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <main className="container mx-auto">
      <Modal
        size="full"
        isOpen={isOpen}
        onClose={onClose}
      >
        {renderModalContent(especialistaSeleccionado)}
      </Modal>

      <section className="flex justify-evenly py-4">
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
              <DropdownItem key="A-Z">A-Z</DropdownItem>
              <DropdownItem key="Fecha de Registro">Fecha de Registro</DropdownItem>
              <DropdownItem key="Estado">Estado</DropdownItem>
              <DropdownItem key="Tipo de Usuario">Tipo de Usuario</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </span>
        <span className="pt-2 ml-4">
          <span className="text-sm font-semibold ">Mostrar: </span >
          <Checkbox defaultSelected className="px-4" size="sm" color="secondary">Baneados</Checkbox>
          <Checkbox defaultSelected className="px-4" size="sm" color="secondary">Activos</Checkbox>
          <Checkbox defaultSelected className="px-4" size="sm" color="secondary">Premium</Checkbox>
          <Checkbox defaultSelected className="px-4" size="sm" color="secondary">Corriente</Checkbox>
        </span>

        <span >
          <Input
            type="text"
            label="Buscar:"
            placeholder="tony.reichert@example.com"
            labelPlacement="outside-left"
            endContent={
              <button className="focus:outline-none" type="button" >
                <FontAwesomeIcon className="text-sm text-default-400 pointer-events-none" icon={faMagnifyingGlass} />
              </button>
            }
          />
        </span>
      </section>
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={especialistas} emptyContent={"No hay especialistas."}>
          {(especialista) => (
            <TableRow key={especialista._id}>
              {(columnKey) => <TableCell>{renderCell(especialista, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <section className="flex justify-end py-2">
        <Pagination color="secondary" className="" total={10} initialPage={1} />
      </section>
    </main>
  );

}

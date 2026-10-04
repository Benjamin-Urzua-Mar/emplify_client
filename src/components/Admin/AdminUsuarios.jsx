/* eslint-disable react/prop-types */
import { Table, Pagination, TableHeader, TableColumn, TableBody, Modal, ModalBody, ModalContent, ModalFooter, Button, ModalHeader, TableRow, TableCell, User, Chip, Tooltip, Input, Select, SelectItem, CheckboxGroup, Checkbox, Spinner, useDisclosure } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye, faBan, faUnlock, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { alertError, alertNetworkError, confirmDialog, toast } from "../../lib/alerts";
import { formatFecha, imageUrl } from "../../lib/format";
import { PageHeader } from "../ui/PageHeader";

const API = "https://emplifyapi.burzuam.dpdns.org/admin"
const FILAS_POR_PAGINA = 10

const colorPlan = { Premium: "primary", Corriente: "default" }

const post = (ruta, data) => fetch(`${API}/${ruta}`, {
  method: "POST",
  body: JSON.stringify(data),
  headers: { "Content-Type": "application/json" }
}).then(res => res.json())

/**
 * Tabla de administración de usuarios (clientes o especialistas).
 * `config`: { titulo, descripcion, singular, endpoints: { listar, ban, eliminar, detalle }, conPlan }
 */
export const AdminUsuarios = ({ config }) => {
  const { endpoints, conPlan } = config
  const [usuarios, setUsuarios] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [orden, setOrden] = useState("nombre")
  const [estados, setEstados] = useState(["activo", "baneado"])
  const [planes, setPlanes] = useState(["Premium", "Corriente"])
  const [pagina, setPagina] = useState(1)
  const [seleccionado, setSeleccionado] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure();

  const recargar = useCallback(() => {
    setIsLoading(true)
    fetch(`${API}/${endpoints.listar}`)
      .then(res => res.json().then(msg => {
        switch (msg["codigo"]) {
          case 1:
            setUsuarios(msg["data"])
            break;
          case 10:
            alertError(msg["msg"])
            break;
        }
      }))
      .catch(() => alertNetworkError())
      .finally(() => setIsLoading(false))
  }, [endpoints.listar])

  useEffect(() => { recargar() }, [recargar])

  const nombreDe = (u) => `${u.nombres} ${u.apellidos}`

  const responder = (msg) => {
    switch (msg["codigo"]) {
      case 1:
        toast.fire({ icon: "success", title: msg["msg"] })
        break;
      case 2:
        toast.fire({ icon: "info", title: msg["msg"] })
        break;
      case 10:
        alertError(msg["msg"])
        break;
    }
  }

  const handleBan = async (usuario) => {
    const banear = usuario.estado !== false
    const confirmado = await confirmDialog({
      title: banear ? "¿Banear usuario?" : "¿Desbanear usuario?",
      text: banear ? `${nombreDe(usuario)} no podrá acceder a Emplify.` : `${nombreDe(usuario)} podrá volver a acceder a Emplify.`,
      confirmText: banear ? "Sí, banear" : "Sí, desbanear",
      danger: banear,
    })
    if (!confirmado) return
    try {
      responder(await post(endpoints.ban, { id: usuario._id, operacion: banear ? "ban" : "unban" }))
    } catch {
      alertNetworkError()
    }
    recargar()
  }

  const handleDelete = async (usuario) => {
    const confirmado = await confirmDialog({
      title: "¿Eliminar usuario?",
      text: `Se eliminará a ${nombreDe(usuario)} de forma permanente. Esta acción no se puede deshacer.`,
      confirmText: "Sí, eliminar",
      danger: true,
    })
    if (!confirmado) return
    try {
      responder(await post(endpoints.eliminar, { id: usuario._id }))
    } catch {
      alertNetworkError()
    }
    recargar()
  }

  const handleVer = async (usuario) => {
    setSeleccionado(usuario)
    onOpen()
    try {
      const msg = await post(endpoints.detalle, { id: usuario._id })
      switch (msg["codigo"]) {
        case 1:
          setSeleccionado(msg["data"])
          break;
        case 2:
        case 10:
          alertError(msg["msg"])
          break;
      }
    } catch {
      alertNetworkError()
    }
  }

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    const lista = usuarios.filter(u => {
      const estado = u.estado === false ? "baneado" : "activo"
      if (!estados.includes(estado)) return false
      if (conPlan && u.plan && !planes.includes(u.plan)) return false
      if (texto && !`${nombreDe(u)} ${u.email}`.toLowerCase().includes(texto)) return false
      return true
    })
    const comparadores = {
      nombre: (a, b) => nombreDe(a).localeCompare(nombreDe(b), "es"),
      fecha: (a, b) => String(b.fechaRegistro ?? "").localeCompare(String(a.fechaRegistro ?? "")),
      estado: (a, b) => Number(a.estado !== false) - Number(b.estado !== false),
      plan: (a, b) => String(a.plan ?? "").localeCompare(String(b.plan ?? "")),
    }
    return lista.sort(comparadores[orden])
  }, [usuarios, busqueda, estados, planes, orden, conPlan])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / FILAS_POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = filtrados.slice((paginaActual - 1) * FILAS_POR_PAGINA, paginaActual * FILAS_POR_PAGINA)

  const columnas = [
    { name: "Usuario", uid: "usuario" },
    { name: "Fecha de registro", uid: "fecha_registro" },
    { name: "Estado", uid: "estado" },
    conPlan ? { name: "Plan", uid: "plan" } : { name: "Último trabajo solicitado", uid: "trabajos_solicitados" },
    { name: "Acciones", uid: "acciones" },
  ]

  const renderCell = (user, columnKey) => {
    switch (columnKey) {
      case "usuario":
        return <User avatarProps={{ radius: "lg", src: conPlan ? imageUrl(user.perfil?.foto) : user.avatar, name: nombreDe(user), showFallback: true }} description={user.email} name={nombreDe(user)} />
      case "fecha_registro":
        return <span className="whitespace-nowrap text-sm">{formatFecha(user.fechaRegistro)}</span>
      case "estado":
        return <Chip color={user.estado === false ? "danger" : "success"} size="sm" variant="flat">{user.estado === false ? "Baneado" : "Activo"}</Chip>
      case "plan":
        return <Chip color={colorPlan[user.plan] ?? "default"} size="sm" variant="flat">{user.plan ?? "—"}</Chip>
      case "trabajos_solicitados":
        return <span className="text-sm text-ink-muted">Ninguno</span>
      case "acciones": {
        const baneado = user.estado === false
        return (
          <div className="flex items-center justify-end gap-1">
            <Tooltip content="Ver detalle">
              <Button isIconOnly size="sm" variant="light" aria-label={`Ver detalle de ${nombreDe(user)}`} onPress={() => handleVer(user)}>
                <FontAwesomeIcon icon={faEye} />
              </Button>
            </Tooltip>
            <Tooltip color={baneado ? "success" : "warning"} content={baneado ? "Desbanear" : "Banear"}>
              <Button isIconOnly size="sm" variant="light" color={baneado ? "success" : "warning"} aria-label={`${baneado ? "Desbanear" : "Banear"} a ${nombreDe(user)}`} onPress={() => handleBan(user)}>
                <FontAwesomeIcon icon={baneado ? faUnlock : faBan} />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar">
              <Button isIconOnly size="sm" variant="light" color="danger" aria-label={`Eliminar a ${nombreDe(user)}`} onPress={() => handleDelete(user)}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Tooltip>
          </div>
        )
      }
      default:
        return user[columnKey];
    }
  }

  const detalle = seleccionado && [
    ["Correo", seleccionado.email],
    ["Teléfono", seleccionado.telefono],
    ["RUN", seleccionado.run],
    ["Comuna", seleccionado.comuna?.nombre ?? seleccionado.comuna],
    ["Dirección", seleccionado.direccion],
    ["Fecha de registro", formatFecha(seleccionado.fechaRegistro)],
    ...(conPlan ? [["Profesión", seleccionado.profesion], ["Rubro", seleccionado.rubro?.nombre ?? seleccionado.rubro], ["Plan", seleccionado.plan]] : []),
  ]

  return (
    <main className="page-container py-8">
      <PageHeader title={config.titulo} description={config.descripcion} />

      <section className="card mb-4 flex flex-col gap-4 p-4 lg:flex-row lg:items-end">
        <Input
          aria-label="Buscar"
          placeholder="Buscar por nombre o correo"
          variant="bordered"
          isClearable
          value={busqueda}
          onValueChange={(v) => { setBusqueda(v); setPagina(1) }}
          onClear={() => setBusqueda("")}
          startContent={<FontAwesomeIcon className="text-default-400" icon={faMagnifyingGlass} />}
          className="lg:max-w-xs"
        />
        <Select label="Ordenar por" size="sm" variant="bordered" disallowEmptySelection selectedKeys={[orden]} onSelectionChange={k => setOrden(Array.from(k)[0])} className="lg:max-w-[12rem]">
          <SelectItem key="nombre" value="nombre">Nombre (A-Z)</SelectItem>
          <SelectItem key="fecha" value="fecha">Fecha de registro</SelectItem>
          <SelectItem key="estado" value="estado">Estado</SelectItem>
          {conPlan && <SelectItem key="plan" value="plan">Plan</SelectItem>}
        </Select>
        <CheckboxGroup label="Estado" orientation="horizontal" size="sm" value={estados} onValueChange={(v) => { setEstados(v); setPagina(1) }} classNames={{ label: "text-xs" }}>
          <Checkbox value="activo">Activos</Checkbox>
          <Checkbox value="baneado">Baneados</Checkbox>
        </CheckboxGroup>
        {conPlan && (
          <CheckboxGroup label="Plan" orientation="horizontal" size="sm" value={planes} onValueChange={(v) => { setPlanes(v); setPagina(1) }} classNames={{ label: "text-xs" }}>
            <Checkbox value="Premium">Premium</Checkbox>
            <Checkbox value="Corriente">Corriente</Checkbox>
          </CheckboxGroup>
        )}
      </section>

      <Table
        aria-label={config.titulo}
        classNames={{ wrapper: "shadow-card" }}
        bottomContent={totalPaginas > 1 && (
          <div className="flex justify-center">
            <Pagination color="primary" showControls page={paginaActual} total={totalPaginas} onChange={setPagina} />
          </div>
        )}
      >
        <TableHeader columns={columnas}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "acciones" ? "end" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={visibles} isLoading={isLoading} loadingContent={<Spinner label="Cargando…" />} emptyContent={isLoading ? " " : `No hay ${config.titulo.toLowerCase()} que coincidan con los filtros.`}>
          {(usuario) => (
            <TableRow key={usuario._id}>
              {(columnKey) => <TableCell>{renderCell(usuario, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className="font-display">{seleccionado ? nombreDe(seleccionado) : config.singular}</ModalHeader>
              <ModalBody>
                {detalle && (
                  <dl className="grid gap-4 sm:grid-cols-2">
                    {detalle.map(([label, valor]) => (
                      <div key={label}>
                        <dt className="text-xs font-medium uppercase tracking-wider text-ink-muted">{label}</dt>
                        <dd className="mt-0.5 break-words text-ink">{valor || "—"}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={close}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}

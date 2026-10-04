import { AdminUsuarios } from "./AdminUsuarios";

const config = {
  titulo: "Clientes",
  singular: "Cliente",
  descripcion: "Administra las cuentas de los clientes registrados.",
  endpoints: { listar: "retornarClientes", ban: "banCliente", eliminar: "deleteCliente", detalle: "retornarCliente" },
  conPlan: false,
}

export const AdminClientes = () => <AdminUsuarios config={config} />

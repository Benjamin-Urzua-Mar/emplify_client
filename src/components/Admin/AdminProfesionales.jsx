import { AdminUsuarios } from "./AdminUsuarios";

const config = {
  titulo: "Profesionales",
  singular: "Profesional",
  descripcion: "Administra las cuentas y planes de los especialistas.",
  endpoints: { listar: "retornarEspecialistas", ban: "banEspecialista", eliminar: "deleteEspecialista", detalle: "retornarEspecialista" },
  conPlan: true,
}

export const AdminProfesionales = () => <AdminUsuarios config={config} />

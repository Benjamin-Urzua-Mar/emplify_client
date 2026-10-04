/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Input, Button, Image, Textarea } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faPlus, faTrash, faImage } from "@fortawesome/free-solid-svg-icons"
import { AccountLayout } from '../ui/AccountLayout';
import { PageHeader } from '../ui/PageHeader';
import { SectionCard } from '../ui/SectionCard';
import { navEspecialista } from '../../data/navegacion';
import { toast } from '../../lib/alerts';

const perfilInicial = {
  sobreMi: "Hola, mi nombre es Juan...",
  especialidad: ['Base de datos', 'Power BI', 'DataXD'],
  formacion: ['Universidad de Chile, 2020', 'Master en Ciencias de Datos', 'Licenciatura en Datos'],
  trabajos: [
    { img: "https://placehold.jp/350x250.png", descripcion: "Descripción del trabajo 1" },
    { img: "https://placehold.jp/350x250.png", descripcion: "Descripción del trabajo 2" },
  ],
  servicios: [
    { descripcion: "Desarrollo de Software", precio: "$80.000/hora" },
    { descripcion: "Administración de Sistemas", precio: "$70.000/hora" },
  ],
}

/** Lista de textos editable (especialidades, formación). */
const ListaEditable = ({ items, editing, onChange, placeholder }) => {
  if (!editing) {
    return items.length
      ? <ul className="list-disc space-y-1 pl-5 text-ink-body">{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
      : <p className="text-sm text-ink-muted">Sin información.</p>
  }
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input variant="bordered" size="sm" aria-label={`${placeholder} ${i + 1}`} placeholder={placeholder} value={item}
            onValueChange={(v) => onChange(items.map((x, idx) => idx == i ? v : x))} />
          <Button isIconOnly size="sm" variant="light" color="danger" aria-label="Eliminar" onPress={() => onChange(items.filter((_, idx) => idx != i))}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      ))}
      <Button size="sm" variant="flat" color="primary" className="self-start" startContent={<FontAwesomeIcon icon={faPlus} />} onPress={() => onChange([...items, ""])}>
        Agregar
      </Button>
    </div>
  )
}

export const EditarPerfil = () => {
  const [perfil, setPerfil] = useState(perfilInicial)
  const [respaldo, setRespaldo] = useState(null)
  const editing = respaldo !== null

  const set = (campo) => (valor) => setPerfil(p => ({ ...p, [campo]: valor }))
  const actualizarItem = (campo, index, cambios) =>
    setPerfil(p => ({ ...p, [campo]: p[campo].map((item, i) => i == index ? { ...item, ...cambios } : item) }))
  const eliminarItem = (campo, index) => setPerfil(p => ({ ...p, [campo]: p[campo].filter((_, i) => i != index) }))

  const handleEdit = () => setRespaldo(perfil)
  const handleCancel = () => { setPerfil(respaldo); setRespaldo(null) }
  const handleSave = () => {
    // Aquí podrías hacer una llamada API para guardar los datos si es necesario.
    setRespaldo(null)
    toast.fire({ icon: "success", title: "Perfil actualizado" })
  }

  const subirImagen = (index, file) => {
    if (!file) return
    const reader = new FileReader();
    reader.onload = (event) => actualizarItem("trabajos", index, { img: event.target.result })
    reader.readAsDataURL(file);
  }

  return (
    <AccountLayout navTitle="Mi cuenta" nav={navEspecialista}>
      <PageHeader
        title="Editar perfil"
        description="Esta información es la que verán los clientes en tu perfil público."
        actions={editing ? (
          <>
            <Button variant="bordered" onPress={handleCancel}>Cancelar</Button>
            <Button color="primary" onPress={handleSave}>Guardar cambios</Button>
          </>
        ) : (
          <Button color="primary" startContent={<FontAwesomeIcon icon={faPen} />} onPress={handleEdit}>Editar perfil</Button>
        )}
      />

      <div className="flex flex-col gap-6">
        <SectionCard title="Sobre mí">
          {editing
            ? <Textarea variant="bordered" aria-label="Sobre mí" minRows={4} value={perfil.sobreMi} onValueChange={set("sobreMi")} />
            : <p className="whitespace-pre-line text-ink-body">{perfil.sobreMi}</p>}
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Especialidad">
            <ListaEditable items={perfil.especialidad} editing={editing} onChange={set("especialidad")} placeholder="Especialidad" />
          </SectionCard>
          <SectionCard title="Formación">
            <ListaEditable items={perfil.formacion} editing={editing} onChange={set("formacion")} placeholder="Formación" />
          </SectionCard>
        </div>

        <SectionCard
          title="Mis trabajos"
          description="Muestra fotos de trabajos que hayas realizado."
          actions={editing && (
            <Button size="sm" color="primary" variant="flat" startContent={<FontAwesomeIcon icon={faPlus} />} onPress={() => set("trabajos")([...perfil.trabajos, { img: "", descripcion: "" }])}>
              Agregar trabajo
            </Button>
          )}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {perfil.trabajos.map((trabajo, index) => (
              <figure key={index} className="overflow-hidden rounded-xl border border-default-100 bg-surface-muted">
                {trabajo.img
                  ? <Image src={trabajo.img} alt={trabajo.descripcion} radius="none" className="h-48 w-full object-cover" removeWrapper />
                  : <div className="flex h-48 items-center justify-center text-3xl text-default-300"><FontAwesomeIcon icon={faImage} /></div>}
                <figcaption className="p-3">
                  {editing ? (
                    <div className="flex flex-col gap-2">
                      <label className="cursor-pointer text-sm font-medium text-brand-500 hover:underline">
                        {trabajo.img ? "Cambiar imagen" : "Subir imagen"}
                        <input type="file" accept="image/*" className="sr-only" onChange={(e) => subirImagen(index, e.target.files[0])} />
                      </label>
                      <Textarea variant="bordered" size="sm" minRows={2} aria-label="Descripción del trabajo" placeholder="Describe el trabajo"
                        value={trabajo.descripcion} onValueChange={(v) => actualizarItem("trabajos", index, { descripcion: v })} />
                      <Button size="sm" color="danger" variant="light" startContent={<FontAwesomeIcon icon={faTrash} />} onPress={() => eliminarItem("trabajos", index)}>
                        Eliminar
                      </Button>
                    </div>
                  ) : (
                    <p className="text-center text-sm text-ink-body">{trabajo.descripcion}</p>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Servicios y precios"
          actions={editing && (
            <Button size="sm" color="primary" variant="flat" startContent={<FontAwesomeIcon icon={faPlus} />} onPress={() => set("servicios")([...perfil.servicios, { descripcion: "", precio: "" }])}>
              Agregar servicio
            </Button>
          )}
        >
          <ul className="divide-y divide-default-100">
            {perfil.servicios.map((servicio, index) => (
              <li key={index} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                {editing ? (
                  <>
                    <Input variant="bordered" size="sm" aria-label="Servicio" placeholder="Servicio" value={servicio.descripcion}
                      onValueChange={(v) => actualizarItem("servicios", index, { descripcion: v })} className="flex-[2]" />
                    <Input variant="bordered" size="sm" aria-label="Precio" placeholder="$0" value={servicio.precio}
                      onValueChange={(v) => actualizarItem("servicios", index, { precio: v })} className="flex-1" />
                    <Button isIconOnly size="sm" variant="light" color="danger" aria-label="Eliminar servicio" onPress={() => eliminarItem("servicios", index)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="text-ink-body">{servicio.descripcion}</span>
                    <span className="font-semibold text-ink">{servicio.precio}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AccountLayout>
  )
}

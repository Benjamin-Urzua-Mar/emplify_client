import { Input, Button, Select, SelectItem } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faIdCard, faFileShield, faHouseCircleCheck } from "@fortawesome/free-solid-svg-icons"
import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../ui/AuthLayout";
import { StepIndicator } from "../ui/StepIndicator";
import { FileField } from "../ui/FileField";
import { DatosPersonalesFields } from "../Global/DatosPersonalesFields";
import { validarDatosPersonales, datosPersonalesIniciales, nombresUbicacion } from "../Global/validaciones";
import { useCatalogo } from "../../lib/catalogos";
import { alertError, alertNetworkError, alertSuccess } from "../../lib/alerts";

const documentos = [
    { icon: faIdCard, label: "Copia de cédula de identidad" },
    { icon: faFileShield, label: "Certificado de antecedentes" },
    { icon: faHouseCircleCheck, label: "Certificado de residencia" },
]

export const RegisterEspecialista = () => {
    const [paso, setPaso] = useState(1)
    const [form, setForm] = useState({ ...datosPersonalesIniciales, rubro: "", profesion: "" })
    const [errores, setErrores] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const formRegister = useRef()
    const rubros = useCatalogo("rubros")
    const redirect = useNavigate()

    const setCampo = (campo, valor) => {
        setForm(f => ({ ...f, [campo]: valor }))
        setErrores(err => ({ ...err, [campo]: null, ...(campo == "ubicacion" && { region: null, provincia: null, comuna: null }) }))
    }

    const irAPaso2 = () => {
        const nuevosErrores = validarDatosPersonales(form)
        setErrores(nuevosErrores)
        if (Object.keys(nuevosErrores).length == 0) {
            setPaso(2)
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    const register = async (e) => {
        e.preventDefault()
        if (paso == 1) return irAPaso2()

        const nuevosErrores = {
            rubro: form.rubro ? null : "Selecciona tu rubro",
            profesion: form.profesion.trim() ? null : "Especifica tu profesión",
        }
        setErrores(nuevosErrores)
        if (nuevosErrores.rubro || nuevosErrores.profesion) return
        if (!formRegister.current.reportValidity()) return

        const { region, provincia, comuna } = nombresUbicacion(form.ubicacion)
        const body = new FormData(formRegister.current)
        body.append("nombres", form.nombres.trim())
        body.append("apellidos", form.apellidos.trim())
        body.append("email", form.email.trim())
        body.append("contrasena", form.contrasena)
        body.append("telefono", form.telefono)
        body.append("run", form.run)
        body.append("region", region)
        body.append("provincia", provincia)
        body.append("comuna", comuna)
        body.append("direccion", form.direccion.trim())
        body.append("rubro", form.rubro)
        body.append("profesion", form.profesion.trim())

        setIsLoading(true)
        try {
            const res = await fetch('https://emplifyapi.burzuam.dpdns.org/especialistas/register', { method: 'POST', body: body })
            const msg = await res.json()
            switch (msg["codigo"]) {
                case 1:
                    alertSuccess(msg["msg"], "¡Registro enviado!").then((result) => {
                        if (result['isConfirmed']) {
                            localStorage.setItem("tempRun", form.run)
                            redirect("/especialistas/register/perfilInicial")
                        }
                    })
                    break;
                case 2:
                    alertError(msg["msg"], { footer: '<a href="/">Recuperar contraseña</a>' })
                    break;
                case 3:
                case 10:
                    alertError(msg["msg"])
                    break;
            }
        } catch {
            alertNetworkError()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Crea tu cuenta de especialista"
            subtitle="¡Regístrate como profesional y sé quien tus clientes necesitan!"
            aside={
                <div className="mt-2">
                    <p className="font-semibold text-ink">Documentación necesaria:</p>
                    <ul className="mt-3 flex flex-col gap-3">
                        {documentos.map(doc => (
                            <li key={doc.label} className="flex items-center gap-3 text-ink-body">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-500"><FontAwesomeIcon icon={doc.icon} /></span>
                                {doc.label}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-sm text-ink-muted">Tu cuenta será revisada por nuestro equipo antes de ser activada.</p>
                </div>
            }
        >
            <StepIndicator steps={["Datos personales", "Documentación"]} current={paso} />
            <form className="flex flex-col gap-6" onSubmit={register} encType="multipart/form-data" ref={formRegister} noValidate>
                <div className={paso == 1 ? "block" : "hidden"}>
                    <DatosPersonalesFields form={form} setCampo={setCampo} errores={errores} />
                </div>

                <div className={paso == 2 ? "grid grid-cols-1 gap-5 sm:grid-cols-2" : "hidden"}>
                    <FileField label="Cédula de identidad" name={`fl_cedIdentidad_${form.run}`} accept="image/*,.pdf" isRequired />
                    <FileField label="Certificado de residencia" name={`fl_certResidencia_${form.run}`} accept="image/*,.pdf" isRequired />
                    <FileField label="Certificado de antecedentes" name={`fl_certAntecedentes_${form.run}`} accept="image/*,.pdf" isRequired />
                    <FileField label="Títulos profesionales" name={`fl_tituloProfesional_${form.run}`} accept="image/*,.pdf" multiple description="Puedes subir varios archivos." />
                    <Select
                        variant="bordered"
                        labelPlacement="outside"
                        label="Rubro"
                        placeholder={rubros.isLoading ? "Cargando rubros…" : "Selecciona tu rubro"}
                        items={rubros.items}
                        isLoading={rubros.isLoading}
                        isRequired
                        selectedKeys={form.rubro ? [form.rubro] : []}
                        onSelectionChange={(keys) => setCampo("rubro", Array.from(keys)[0] ?? "")}
                        isInvalid={!!errores.rubro || !!rubros.error}
                        errorMessage={rubros.error ? "No pudimos cargar los rubros. Recarga la página." : errores.rubro}
                    >
                        {(r) => <SelectItem key={r.nombre} textValue={r.nombre}>{r.nombre}</SelectItem>}
                    </Select>
                    <Input
                        variant="bordered"
                        labelPlacement="outside"
                        label="Profesión"
                        placeholder="Ej: Programador"
                        isRequired
                        value={form.profesion}
                        onValueChange={(v) => setCampo("profesion", v)}
                        isInvalid={!!errores.profesion}
                        errorMessage={errores.profesion}
                    />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    {paso == 2
                        ? <Button variant="bordered" onPress={() => setPaso(1)}>Atrás</Button>
                        : <span />}
                    {paso == 1
                        ? <Button color="primary" size="lg" className="font-medium" onPress={irAPaso2}>Continuar</Button>
                        : <Button color="primary" size="lg" type="submit" isLoading={isLoading} className="font-medium">Crear cuenta</Button>}
                </div>
                <p className="text-center text-sm text-ink-muted">¿Ya estás registrado? <Link to="/especialistas/login" className="link">Inicia sesión</Link></p>
            </form>
        </AuthLayout>
    )
}

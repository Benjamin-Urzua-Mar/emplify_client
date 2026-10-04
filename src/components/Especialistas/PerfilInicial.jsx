import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Textarea, Input, Avatar } from "@nextui-org/react"
import { faPlus, faTrash, faCamera } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"
import { AuthLayout } from "../ui/AuthLayout"
import { StepIndicator } from "../ui/StepIndicator"
import { ReactSwal, alertError, alertNetworkError, alertSuccess } from "../../lib/alerts"

const pasosPerfil = ["Foto", "Sobre ti", "Servicios"]

export const PerfilInicial = () => {
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()
    const [experiencia, setExperiencia] = useState("")
    const [servicios, setServicios] = useState([])
    const [pasos, setPasos] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const inputImage = useRef()
    const formPerfil = useRef()
    const redirect = useNavigate()

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }
        const objUrl = URL.createObjectURL(selectedFile)
        setPreview(objUrl)
        return () => URL.revokeObjectURL(objUrl)
    }, [selectedFile])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) return
        setSelectedFile(e.target.files[0])
    }

    const siguiente = () => setPasos(p => Math.min(p + 1, pasosPerfil.length))
    const atras = () => setPasos(p => Math.max(p - 1, 1))

    const handleChanges = (valor, campo, i) => {
        setServicios(lista => lista.map((s, idx) => idx == i ? { ...s, [campo]: valor } : s))
    }
    const handleAdd = () => setServicios(lista => [...lista, { trabajo: "", precio: "" }])
    const handleDelete = (i) => setServicios(lista => lista.filter((_, idx) => idx != i))

    const serviciosCompletos = servicios.length > 0 && servicios.every(s => s.trabajo.trim() && s.precio.trim())

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (pasos < pasosPerfil.length) return siguiente()
        if (!serviciosCompletos) return

        const body = new FormData(formPerfil.current)
        servicios.forEach((el, i) => {
            body.append(`trabajo_${i}`, el["trabajo"])
            body.append(`precio_${i}`, el["precio"])
        });
        body.append(localStorage.getItem("tempRun"), selectedFile)
        body.append("experiencia", experiencia)

        setIsLoading(true)
        try {
            const res = await fetch('https://emplifyapi.burzuam.dpdns.org/especialistas/editarPerfil', { method: 'POST', body: body })
            const msg = await res.json()
            switch (msg["codigo"]) {
                case 1:
                    alertSuccess(msg["msg"]).then((result) => {
                        if (result['isConfirmed']) {
                            localStorage.removeItem("tempRun")
                            ReactSwal.fire({
                                icon: 'info',
                                title: 'Tu cuenta está en revisión',
                                text: 'Por motivos de seguridad, tu registro deberá ser validado por nuestro equipo de administración. Te notificaremos por correo electrónico cuando puedas utilizar tu cuenta.',
                                confirmButtonText: 'Entendido'
                            }).then(res => {
                                if (res['isConfirmed']) redirect("/")
                            })
                        }
                    })
                    break;
                case 2:
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
        <AuthLayout width="lg" title="Completa tu perfil" subtitle="¡Muestra quién eres! Cuéntale a tus clientes más sobre ti.">
            <StepIndicator steps={pasosPerfil} current={pasos} />
            <form className="flex flex-col gap-6" encType="multipart/form-data" onSubmit={handleSubmit} ref={formPerfil}>
                <div className={pasos == 1 ? "flex flex-col items-center gap-4 py-4" : "hidden"}>
                    <button type="button" onClick={() => inputImage.current.click()} className="group relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4" aria-label="Seleccionar foto de perfil">
                        <Avatar src={preview} showFallback isBordered color="primary" className="h-40 w-40" fallback={<FontAwesomeIcon icon={faCamera} className="text-4xl text-default-400" />} />
                        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">Cambiar foto</span>
                    </button>
                    <input ref={inputImage} onChange={onSelectFile} type="file" accept="image/*" className="sr-only" tabIndex={-1} />
                    <p className="text-center text-sm text-ink-muted">Usa una foto donde se vea bien tu rostro. Formatos JPG o PNG.</p>
                    <Button color="primary" variant="flat" startContent={<FontAwesomeIcon icon={faCamera} />} onPress={() => inputImage.current.click()}>
                        {selectedFile ? "Elegir otra foto" : "Subir foto"}
                    </Button>
                </div>

                <div className={pasos == 2 ? "block" : "hidden"}>
                    <Textarea
                        label="Cuéntanos un poco sobre ti"
                        labelPlacement="outside"
                        variant="bordered"
                        minRows={5}
                        placeholder="Te sugerimos orientar tu descripción en torno a tu experiencia laboral"
                        description="Este texto aparecerá en tu perfil público."
                        value={experiencia}
                        onValueChange={setExperiencia}
                    />
                </div>

                <div className={pasos == 3 ? "flex flex-col gap-3" : "hidden"}>
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="font-semibold text-ink">Servicios que ofreces</p>
                            <p className="text-sm text-ink-muted">Agrega al menos un servicio con su precio.</p>
                        </div>
                        <Button color="primary" variant="flat" type="button" onPress={handleAdd} startContent={<FontAwesomeIcon icon={faPlus} />}>Agregar</Button>
                    </div>

                    {servicios.length == 0 && (
                        <p className="rounded-xl border-2 border-dashed border-default-200 px-4 py-6 text-center text-sm text-ink-muted">Aún no has agregado servicios.</p>
                    )}

                    {servicios.map((data, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <Input
                                aria-label={`Nombre del servicio ${i + 1}`}
                                variant="bordered"
                                placeholder="Nombre del servicio"
                                onValueChange={(v) => handleChanges(v, "trabajo", i)}
                                value={data["trabajo"]}
                                className="flex-[2]"
                            />
                            <Input
                                aria-label={`Precio del servicio ${i + 1}`}
                                variant="bordered"
                                placeholder="1.000.000"
                                inputMode="numeric"
                                startContent={<span className="text-sm text-default-400">$</span>}
                                onValueChange={(v) => handleChanges(v, "precio", i)}
                                value={data["precio"]}
                                className="flex-1"
                            />
                            <Button color="danger" variant="light" type="button" onPress={() => handleDelete(i)} isIconOnly aria-label={`Eliminar servicio ${i + 1}`}>
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between gap-3 border-t border-default-100 pt-5">
                    <Button variant="bordered" type="button" isDisabled={pasos == 1} onPress={atras}>Atrás</Button>
                    {pasos == pasosPerfil.length
                        ? <Button color="primary" isDisabled={!serviciosCompletos} isLoading={isLoading} type="submit">Finalizar</Button>
                        : <Button color="primary" type="button" onPress={siguiente}>Siguiente</Button>}
                </div>
            </form>
        </AuthLayout>
    )
}

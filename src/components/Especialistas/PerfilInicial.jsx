import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Image, Textarea, Input, input } from "@nextui-org/react"
import { Link } from "react-router-dom"
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons"
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons"
import { useCallback, useEffect, useRef, useState } from "react";
import KeepAlive from "react-activation"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

export const PerfilInicial = () => {
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()
    const inputImage = useRef()
    const btnAtras = useRef()
    const btnSiguiente = useRef()
    const [enableFinalizar, setEnableFinalizar] = useState(true)
    let [pasos, setPasos] = useState(1)
    const redirect = useNavigate()

    useEffect(() => {
        if (!selectedFile) {
            setPreview("https://placehold.jp/40px/ffffff/7828c8/300x300.png?text=Arrastre%20aqu%C3%AD%20su%20foto&css=%7B%22border-radius%22%3A%22100%25%22%2C%22background%22%3A%22%20-webkit-%22%7D")
            return
        }
        try {
            const objUrl = URL.createObjectURL(selectedFile)
            setPreview(objUrl)

            return () => URL.revokeObjectURL(objUrl)
        } catch (error) {
            return
        }

    }, [selectedFile])


    const onSelectFile = e => {

        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile("https://placehold.jp/40px/ffffff/7828c8/300x300.png?text=Arrastre%20aqu%C3%AD%20su%20foto&css=%7B%22border-radius%22%3A%22100%25%22%2C%22background%22%3A%22%20-webkit-%22%7D")
            return
        }

        setSelectedFile(e.target.files[0])
    }

    const handlePasos = (op) => {
        if (pasos > 0) {

            if (op == "suma") {
                btnSiguiente.current.click()
                setPasos(pasos++)
            } else {
                btnAtras.current.click()
                setPasos(pasos--)

            }
        } else {
            setPasos(1)
        }
    }

    const handleChanges = (onChangeValue, tipo, i) => {
        const inputData = [...val]
        if (tipo == "trabajo") {
            inputData[i]["trabajo"] = onChangeValue.currentTarget.value;
        } else {
            inputData[i]["precio"] = onChangeValue.currentTarget.value;
        }
        setVal(inputData)
    }

    const [val, setVal] = useState([])
    const handleAdd = () => {
        setEnableFinalizar(false)
        const abc = [...val, []]
        setVal(abc)
    }
    const handleDelete = (i) => {
        const deleteVal = [...val]
        deleteVal.splice(i, 1)
        setVal(deleteVal)
    }

    const renderPasos = useCallback((pasos) => {
        switch (pasos) {
            case 1:
                return (
                    <>
                        <Image
                            width={200}
                            alt="NextUI hero Image"
                            src={preview}
                            className="rounded-full  border-Primary border-2"
                            fallbackSrc="https://placehold.jp/40px/ffffff/7828c8/300x300.png?text=Arrastre%20aqu%C3%AD%20su%20foto&css=%7B%22border-radius%22%3A%22100%25%22%2C%22background%22%3A%22%20-webkit-%22%7D"
                        />
                        <input ref={inputImage} onChange={(e) => onSelectFile(e)} type="file" aria-description="Arrastre aqui" className="bg-red-500 py-32 z-10 opacity-0 absolute  rounded-full " />
                        <Button color="secondary" className="w-full my-4 z-20" onClick={() => inputImage.current.click()}>Subir foto</Button>
                    </>
                );

            case 2:
                return (
                    <KeepAlive>
                        <Textarea
                            label="Cuenta un poco sobre ti"
                            labelPlacement="outside"
                            placeholder="Sugerimos orientar tu descripción en torno a tu experiencia laboral"
                            fullWidth="true"
                            ref={txt_experiencia}
                        />
                    </KeepAlive>
                );
            case 3:
                return (
                    <>
                        <span className="inline-flex gap-3 my-1">
                            <span className="mt-1 font-semibold text-default-600 text-medium ">Agrega los servicios que ofreces</span>
                            <Button color="success" type="button" onClick={() => handleAdd()} className="text-white" isIconOnly><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></Button>
                        </span>

                        {val.map((data, i) => {
                            return (
                                <span key={i}>
                                    <span className="inline-flex gap-2 my-2">
                                        <Input
                                            className="outline-none border-0  bg-transparent "
                                            placeholder="Nombre del servicio"
                                            onChange={(e) => handleChanges(e, "trabajo", i)}
                                            value={data["trabajo"]}
                                            endContent={
                                                <input
                                                    onChange={(e) => handleChanges(e, "precio", i)}
                                                    className="outline-none border-0 w-20 bg-transparent font-normal placeholder:text-foreground-500 text-small"
                                                    placeholder="$ 1.000.000"
                                                    value={data["precio"]}
                                                />
                                            }
                                        />
                                        <Button color="danger" type="button" className="text-white" onClick={() => handleDelete(i)} isIconOnly><FontAwesomeIcon icon={faX}></FontAwesomeIcon></Button>
                                    </span>
                                </span>
                            )
                        })}

                    </>
                );
        }
    }, [preview, val])

    const txt_experiencia = useRef()
    const formPerfil = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const experiencia = txt_experiencia.current.value

        const body = new FormData(formPerfil.current)
        val.forEach((el, i) => {
            body.append(`trabajo_${i}`, el["trabajo"])
            body.append(`precio_${i}`, el["precio"])
        });
        body.append(localStorage.getItem("tempRun"), selectedFile)
        body.append("experiencia", experiencia)

        await fetch('http://localhost:8080/especialistas/editarPerfil', { method: 'POST', body: body, contentType: false, processData: false, })
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
                                localStorage.removeItem("tempRun")
                                ReactSwal.fire({
                                    icon: 'warning',
                                    title: '¡Atención!',
                                    text: 'Por motivos de seguridad, tu registro deberá ser validado por nuestro equipo de administración. Serás notificado a través de correo electrónico una vez puedas utilizar tu cuenta.',
                                    confirmButtonText:'Aceptar'
                                }).then(res => {
                                    if (res['isConfirmed']) return redirect("/")
                                })
                                
                            }
                        })
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
    }

    return (
        <form className="container flex flex-col gap-4 m-auto mt-20 " encType="multipart/form-data" onSubmit={e => handleSubmit(e)} ref={formPerfil}>
            <span className="mb-4">
                <h1 className="text-[2.5rem] font-[500] text-center">Bienvenido a Work<span className="text-Primary">It.</span></h1>
                <h4 className="text-[1.25rem] font-[500] text-center">¡Muestra quien eres! Dale mas detalles sobre ti al cliente</h4>
            </span>

            <div className="flex px-[5rem] md:px-[10rem] lg:px-[31rem]  flex-col gap-4">
                <div className="grid grid-cols-1 place-items-center">
                    {renderPasos(pasos)}
                </div>
                <div className="flex justify-between">
                    <Button color="secondary" ref={btnAtras} type="button" variant="ghost" onClick={() => handlePasos("resta")}>Atrás</Button>
                    {
                        (pasos == 3)
                            ? <Button color="secondary" disabled={enableFinalizar} type="submit">Finalizar</Button>
                            : <Button color="secondary" type="button" ref={btnSiguiente} onClick={() => handlePasos("suma")}>Siguiente</Button>
                    }

                </div>
            </div>
        </form>
    )
}

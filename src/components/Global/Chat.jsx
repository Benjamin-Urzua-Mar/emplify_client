/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPaperPlane, faCircle, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Input, Button } from '@nextui-org/react'
import { useEffect, useState } from 'react'

export const Chat = ({ isVisible, onSubmit, onClose, socket }) => {
    const [mensaje, setMensaje] = useState("")
    const [mensajes, setMensajes] = useState([])
    const [minifyChat, setMinifyChat] = useState(false)

    const nombre = (() => {
        try { return JSON.parse(localStorage.getItem("perfilEspecialista"))?.nombres ?? "Chat" } catch { return "Chat" }
    })()

    useEffect(() => {
        if (localStorage.getItem("tipoUsuario") == "Especialista") {
            socket.emit("especialistaJoin")
        } else {
            socket.emit("clienteJoin", { room: localStorage.getItem("chatRoom") })
        }
    }, [socket])

    useEffect(() => {
        const recibir = info => setMensajes(lista => [{ "Externo": info["msg"] }, ...lista])
        socket.on("msg", recibir)
        return () => socket.off("msg", recibir)
    }, [socket])

    const handleSubmit = e => {
        e.preventDefault()
        if (!mensaje.trim()) return
        onSubmit(mensaje)
        setMensajes(lista => [{ "Local": mensaje }, ...lista])
        setMensaje("")
    }

    return (
        <form onSubmit={handleSubmit} className={`${isVisible} bottom-0 right-4 z-50 w-[calc(100vw-2rem)] sm:right-6 sm:w-80`} aria-label={`Chat con ${nombre}`}>
            <div className="overflow-hidden rounded-t-2xl border border-b-0 border-default-200 bg-white shadow-card">
                <header className="flex h-12 items-center justify-between bg-brand-500 pl-4 pr-1 text-sm font-semibold text-white">
                    <span className="flex items-center gap-2">
                        <FontAwesomeIcon className="text-[8px] text-success-300" icon={faCircle} />
                        {nombre}
                    </span>
                    <span className="flex">
                        <button type="button" onClick={() => setMinifyChat(v => !v)} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/15" aria-label={minifyChat ? "Expandir chat" : "Minimizar chat"}>
                            <FontAwesomeIcon icon={minifyChat ? faChevronUp : faChevronDown} />
                        </button>
                        {onClose && (
                            <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/15" aria-label="Cerrar chat">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        )}
                    </span>
                </header>

                {!minifyChat && (
                    <>
                        <section className="flex h-80 flex-col-reverse gap-2 overflow-y-auto p-3 text-sm" aria-live="polite">
                            {mensajes.length == 0 && <p className="m-auto text-center text-ink-muted">Escribe tu primer mensaje para comenzar la conversación.</p>}
                            {mensajes.map((msj, index) => Object.keys(msj)[0] == "Local" ? (
                                <p key={index} className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-brand-500 px-3 py-2 text-white">{Object.values(msj)[0]}</p>
                            ) : (
                                <p key={index} className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-default-100 px-3 py-2 text-ink">{Object.values(msj)[0]}</p>
                            ))}
                        </section>
                        <div className="flex items-center gap-2 border-t border-default-100 p-2">
                            <Input
                                aria-label="Mensaje"
                                placeholder='Escribe algo…'
                                value={mensaje}
                                onValueChange={setMensaje}
                                size="sm"
                            />
                            <Button type='submit' isIconOnly color="primary" size="sm" aria-label="Enviar mensaje" isDisabled={!mensaje.trim()}>
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </form>
    )
}

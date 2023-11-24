import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faPaperPlane, faCircle, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { Button, Input, button } from '@nextui-org/react'
import { useEffect, useState } from 'react'
export const Chat = (params) => {
    const [mensaje, setMensaje] = useState("")
    const [mensajes, setMensajes] = useState([])
    const [showChat, setShowChat] = useState()
    const [minifyChat, setMinifyChat] = useState(false)

    useEffect(() => {
        setShowChat(params.isVisible)
    }, [params.isVisible])

    useEffect(() => {
        
        if (localStorage.getItem("tipoUsuario") == "Especialista") {
            params.socket.emit("especialistaJoin")
        }else{
            params.socket.emit("clienteJoin", {room: localStorage.getItem("chatRoom")})
        }
        
    }, [params.socket])

    const handleChange = e => {
        setMensaje(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        params.onSubmit(mensaje)
        const nuevoMensajeLocal = [{"Local": mensaje},...mensajes ]
        setMensajes(nuevoMensajeLocal)
        setMensaje("")
    }

    params.socket.on("msg", info => {
        const nuevoMensajeLocal = [{"Externo": info["msg"]}, ...mensajes ]
        setMensajes(nuevoMensajeLocal)
    })

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            {
                (minifyChat)
                    ?
                    <div className={`${showChat} right-[3vw] z-50 bottom-0 bg-Primary text-small text-white font-semibold font-sans w-[21vw] py-1`}>
                        <span className='flex flex-row justify-between px-3'>
                            <span className='inline-block align-middle'><FontAwesomeIcon className='text-[8px] text-lime-500' icon={faCircle}></FontAwesomeIcon> {JSON.parse(localStorage.getItem("perfilEspecialista")).nombres}</span>
                            <span className='inline-block align-middle hover:cursor-pointer' onClick={() => setMinifyChat(false)}><FontAwesomeIcon size='sm' icon={faChevronUp}></FontAwesomeIcon></span>
                        </span>
                    </div>
                    :
                    <div className={`${showChat} right-[3vw] z-50 bottom-0`} >
                        <div className="h-[52vh] w-[21vw] rounded-t-2xl flex flex-col justify-between border-solid border-x border-default-200">
                            <section className="bg-Primary w-full h-12 rounded-t-2xl flex justify-between items-center ">
                                <div className="ml-4 text-small text-white font-semibold font-sans">
                                    <span>{JSON.parse(localStorage.getItem("perfilEspecialista")).nombres}</span>
                                </div>
                                <div className="w-[100%] h-[100%] basis-[15%] rounded-tr-2xl hover:cursor-pointer hover:bg-red-500 " onClick={() => setMinifyChat(true)}>
                                    <FontAwesomeIcon className='m-auto max-w-[100%] mt-3 max-h-[100%] block font-bold ' size='sm' color='white' icon={faX}></FontAwesomeIcon>
                                </div>
                            </section>
                            <section className='bg-white w-full h-full overflow-y-auto text-small text-white  font-sans flex flex-col-reverse   pb-2'>
                                <div className='flex flex-col-reverse justify-start gap-2 h-full'>
                                    {
                                        mensajes.map((msj, index) => {
                                            if (Object.keys(msj)[0] == "Local") {
                                                return (
                                                    <>
                                                        <div key={index} className='bg-Primary rounded-l-2xl rounded-br-2xl py-2 text-end  self-end mx-2'>
                                                            <p className='inline-block px-5'>{Object.values(msj)[0]} </p>
                                                        </div>
                                                    </>
                                                )
                                            } else {
                                                return (
                                                    <>
                                                        <div key={index} className='bg-default-400 rounded-r-2xl rounded-bl-2xl self-start py-2 mx-2 '>
                                                            <p className='inline-block px-5'>{Object.values(msj)[0]}</p>
                                                        </div>

                                                    </>
                                                )
                                            }

                                        })
                                    }
                                </div>
                            </section>
                            <section>
                                <hr />
                                <Input radius='none'
                                    placeholder='Escribe algo...'
                                    value={mensaje}
                                    onChange={(e) => handleChange(e)}
                                    endContent={
                                        <button type='submit'>
                                            <FontAwesomeIcon className='text-Primary max-w-[100%] max-h-[100%]' size='1x' icon={faPaperPlane}></FontAwesomeIcon>
                                        </button>
                                    }
                                />
                            </section>
                        </div>
                    </div>
            }
        </form>


    )
}

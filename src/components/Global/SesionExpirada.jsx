import { Input, Button } from "@nextui-org/react"


export const SesionExpirada = () => {
    return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <div className="w-full max-w-lg">
                <div className="bg-white p-6 rounded shadow">
                    <div className="text-center mb-6">
                        <img src="/warning1.png" alt="Warning" className="mx-auto mb-4 w-24 h-24" />
                        <h3 className="text-lg">Tu sesión ha expirado debido a inactividad</h3>
                    </div>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="emailaddress" className="block text-sm font-medium">Correo electrónico</label>
                            <Input isRequired variant="underlined" type="email" id="txt_emailaddress" name="txt_emailaddress" placeholder="john@deo.com" className="w-full p-2 " />

                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
                            <Input isRequired variant="underlined" type="password" id="txt_password" name="txt_password" placeholder="Ingresa tu contraseña" requerid className="w-full p-2 " />

                        </div>
                        <div className="text-center">
                            < Button type="submit" color="secondary" className=" py-2 px-4 block w-full">Ingresar</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}
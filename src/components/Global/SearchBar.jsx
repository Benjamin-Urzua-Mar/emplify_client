/* eslint-disable react/prop-types */
import { forwardRef, useState } from "react"
import { Input, Button, Select, SelectItem } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { rubros } from "../../data/rubros"
import { alertError, alertNetworkError, alertWarning } from "../../lib/alerts"
import { apiUrl } from "../../lib/config"

/**
 * Buscador de especialistas por comuna y rubro.
 * Guarda los resultados en localStorage y navega a /buscar.
 */
export const SearchBar = forwardRef(function SearchBar({ rubro, onRubroChange, defaultComuna = "", size = "lg" }, comunaRef) {
    const [comuna, setComuna] = useState(defaultComuna)
    const [rubroLocal, setRubroLocal] = useState(localStorage.getItem("rubro") ?? "")
    const [errores, setErrores] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const redirect = useNavigate()

    const rubroActual = rubro ?? rubroLocal
    const setRubro = onRubroChange ?? setRubroLocal

    const buscarEspecialista = async (e) => {
        e.preventDefault()
        const nuevosErrores = {
            comuna: comuna.trim() ? null : "Ingresa una ciudad o comuna",
            rubro: rubroActual ? null : "Selecciona un rubro",
        }
        setErrores(nuevosErrores)
        if (nuevosErrores.comuna || nuevosErrores.rubro) return

        setIsLoading(true)
        try {
            const res = await fetch(apiUrl("/buscar"), {
                method: 'POST',
                body: JSON.stringify({ comuna: comuna.trim(), rubro: rubroActual }),
                headers: { "Content-Type": "application/json" }
            })
            const msg = await res.json()
            switch (msg["codigo"]) {
                case 1:
                    localStorage.setItem("searchResults", JSON.stringify(msg["data"]));
                    localStorage.setItem("comuna", comuna.trim());
                    localStorage.setItem("rubro", rubroActual)
                    redirect("/buscar", { state: { buscadoEn: Date.now() } })
                    break;
                case 2:
                    alertWarning("No encontramos profesionales de ese rubro en tu comuna. Revisa que la comuna esté bien escrita o prueba con otra cercana.", "Sin resultados")
                    break;
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
        <form className="flex w-full flex-col gap-3 sm:flex-row sm:items-start" onSubmit={buscarEspecialista} noValidate>
            <Input
                ref={comunaRef}
                aria-label="Ciudad o comuna"
                placeholder="Ciudad o comuna"
                size={size}
                variant="bordered"
                classNames={{ inputWrapper: "bg-white" }}
                value={comuna}
                onValueChange={(v) => { setComuna(v); setErrores(err => ({ ...err, comuna: null })) }}
                startContent={<FontAwesomeIcon className="text-default-400" icon={faLocationDot} />}
                isInvalid={!!errores.comuna}
                errorMessage={errores.comuna}
                className="sm:flex-[3]"
            />
            <Select
                aria-label="Rubro"
                placeholder="Rubro"
                size={size}
                variant="bordered"
                classNames={{ trigger: "bg-white" }}
                selectedKeys={rubroActual ? [rubroActual] : []}
                onSelectionChange={(keys) => { setRubro(Array.from(keys)[0] ?? ""); setErrores(err => ({ ...err, rubro: null })) }}
                isInvalid={!!errores.rubro}
                errorMessage={errores.rubro}
                className="sm:flex-[2]"
            >
                {rubros.map(r => <SelectItem key={r.key} value={r.key}>{r.label}</SelectItem>)}
            </Select>
            <Button color="primary" type="submit" size={size} isLoading={isLoading} startContent={!isLoading && <FontAwesomeIcon icon={faMagnifyingGlass} />} className="font-medium">
                Buscar
            </Button>
        </form>
    )
})

/* eslint-disable react/prop-types */
import { forwardRef, useState } from "react"
import { Button, Select, SelectItem, Autocomplete, AutocompleteItem } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { useCatalogo } from "../../lib/catalogos"
import { alertError, alertNetworkError, alertWarning } from "../../lib/alerts"

/**
 * Buscador de especialistas por comuna y rubro.
 * Las opciones vienen de los endpoints /comunas y /rubros del backend.
 * Guarda los resultados en localStorage y navega a /buscar.
 */
export const SearchBar = forwardRef(function SearchBar({ rubro, onRubroChange, size = "lg" }, comunaRef) {
    const comunas = useCatalogo("comunas")
    const rubros = useCatalogo("rubros")
    const [comunaId, setComunaId] = useState(localStorage.getItem("comunaId") ?? "")
    const [rubroLocal, setRubroLocal] = useState(localStorage.getItem("rubroId") ?? "")
    const [errores, setErrores] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const redirect = useNavigate()

    const rubroId = rubro ?? rubroLocal
    const setRubroId = onRubroChange ?? setRubroLocal

    const buscarEspecialista = async (e) => {
        e.preventDefault()
        const nuevosErrores = {
            comuna: comunaId ? null : "Selecciona una comuna",
            rubro: rubroId ? null : "Selecciona un rubro",
        }
        setErrores(nuevosErrores)
        if (nuevosErrores.comuna || nuevosErrores.rubro) return

        const comuna = comunas.items.find(c => c._id == comunaId)
        const rubroSeleccionado = rubros.items.find(r => r._id == rubroId)

        setIsLoading(true)
        try {
            const res = await fetch('https://emplifyapi.burzuam.dpdns.org/buscar', {
                method: 'POST',
                body: JSON.stringify({ comuna: comunaId, rubro: rubroId }),
                headers: { "Content-Type": "application/json" }
            })
            const msg = await res.json()
            switch (msg["codigo"]) {
                case 1:
                    localStorage.setItem("searchResults", JSON.stringify(msg["data"]));
                    localStorage.setItem("comunaId", comunaId)
                    localStorage.setItem("rubroId", rubroId)
                    localStorage.setItem("comuna", comuna?.nombre ?? "");
                    localStorage.setItem("rubro", rubroSeleccionado?.nombre ?? "")
                    redirect("/buscar", { state: { buscadoEn: Date.now() } })
                    break;
                case 2:
                    alertWarning(`No encontramos profesionales de ${rubroSeleccionado?.nombre ?? "ese rubro"} en ${comuna?.nombre ?? "tu comuna"}. Prueba con una comuna cercana u otro rubro.`, "Sin resultados")
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

    const errorCatalogo = (catalogo, nombre) => catalogo.error && (
        <span>
            No pudimos cargar las {nombre}.{" "}
            <button type="button" className="font-medium underline" onClick={catalogo.reintentar}>Reintentar</button>
        </span>
    )

    return (
        <form className="flex w-full flex-col gap-3 text-left sm:flex-row sm:items-start" onSubmit={buscarEspecialista} noValidate>
            <Autocomplete
                ref={comunaRef}
                aria-label="Comuna"
                placeholder={comunas.isLoading ? "Cargando comunas…" : "Escribe tu comuna"}
                size={size}
                variant="bordered"
                inputProps={{ classNames: { inputWrapper: "bg-white" } }}
                defaultItems={comunas.items}
                isLoading={comunas.isLoading}
                isDisabled={!!comunas.error}
                selectedKey={comunaId || null}
                onSelectionChange={(key) => { setComunaId(key ?? ""); setErrores(err => ({ ...err, comuna: null })) }}
                startContent={<FontAwesomeIcon className="text-default-400" icon={faLocationDot} />}
                listboxProps={{ emptyContent: "No encontramos esa comuna" }}
                isInvalid={!!errores.comuna || !!comunas.error}
                errorMessage={errorCatalogo(comunas, "comunas") || errores.comuna}
                className="sm:flex-[3]"
            >
                {(comuna) => (
                    <AutocompleteItem key={comuna._id} textValue={comuna.nombre} description={comuna.region}>
                        {comuna.nombre}
                    </AutocompleteItem>
                )}
            </Autocomplete>
            <Select
                aria-label="Rubro"
                placeholder={rubros.isLoading ? "Cargando rubros…" : "Rubro"}
                size={size}
                variant="bordered"
                classNames={{ trigger: "bg-white" }}
                items={rubros.items}
                isLoading={rubros.isLoading}
                isDisabled={!!rubros.error}
                selectedKeys={rubroId ? [rubroId] : []}
                onSelectionChange={(keys) => { setRubroId(Array.from(keys)[0] ?? ""); setErrores(err => ({ ...err, rubro: null })) }}
                isInvalid={!!errores.rubro || !!rubros.error}
                errorMessage={errorCatalogo(rubros, "rubros") || errores.rubro}
                className="sm:flex-[2]"
            >
                {(r) => <SelectItem key={r._id} textValue={r.nombre}>{r.nombre}</SelectItem>}
            </Select>
            <Button color="primary" type="submit" size={size} isLoading={isLoading} startContent={!isLoading && <FontAwesomeIcon icon={faMagnifyingGlass} />} className="font-medium">
                Buscar
            </Button>
        </form>
    )
})

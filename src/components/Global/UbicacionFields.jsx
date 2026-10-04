/* eslint-disable react/prop-types */
import { Select, SelectItem } from "@nextui-org/react"
import { useMemo } from "react"
import { regiones, provincias, comunas } from "../../data/regiones"

/**
 * Selectores encadenados Región → Provincia → Comuna.
 * `value`: { region, provincia, comuna } con los códigos seleccionados.
 */
export const UbicacionFields = ({ value, onChange, errores = {} }) => {
    const listaProvincias = useMemo(() => provincias.filter(p => p.codigo_padre == value.region), [value.region])
    const listaComunas = useMemo(() => comunas.filter(c => c.codigo_padre == value.provincia), [value.provincia])

    const select = (campo) => (keys) => {
        const codigo = Array.from(keys)[0] ?? ""
        if (campo == "region") onChange({ region: codigo, provincia: "", comuna: "" })
        if (campo == "provincia") onChange({ ...value, provincia: codigo, comuna: "" })
        if (campo == "comuna") onChange({ ...value, comuna: codigo })
    }

    const comunes = { variant: "bordered", labelPlacement: "outside", isRequired: true }

    return (
        <>
            <Select {...comunes} label="Región" placeholder="Selecciona una región" items={regiones}
                selectedKeys={value.region ? [value.region] : []} onSelectionChange={select("region")}
                isInvalid={!!errores.region} errorMessage={errores.region}>
                {(region) => <SelectItem key={region.codigo}>{region.nombre}</SelectItem>}
            </Select>
            <Select {...comunes} label="Provincia" placeholder={value.region ? "Selecciona una provincia" : "Primero elige una región"} items={listaProvincias}
                isDisabled={!value.region} selectedKeys={value.provincia ? [value.provincia] : []} onSelectionChange={select("provincia")}
                isInvalid={!!errores.provincia} errorMessage={errores.provincia}>
                {(provincia) => <SelectItem key={provincia.codigo}>{provincia.nombre}</SelectItem>}
            </Select>
            <Select {...comunes} label="Comuna" placeholder={value.provincia ? "Selecciona una comuna" : "Primero elige una provincia"} items={listaComunas}
                isDisabled={!value.provincia} selectedKeys={value.comuna ? [value.comuna] : []} onSelectionChange={select("comuna")}
                isInvalid={!!errores.comuna} errorMessage={errores.comuna}>
                {(comuna) => <SelectItem key={comuna.codigo}>{comuna.nombre}</SelectItem>}
            </Select>
        </>
    )
}

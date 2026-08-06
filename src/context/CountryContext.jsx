import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCountries, PAIS_POR_DEFECTO } from '../services/openaqApi.js'

// Contexto global: guarda el país seleccionado (código ISO) y el listado
// completo de países disponibles en OpenAQ, para que cualquier página o
// componente (Sidebar, HomePage, LocationsPage, etc.) pueda leerlo o cambiarlo
// sin tener que pasarlo por props en cada nivel.

const CountryContext = createContext(null)

const STORAGE_KEY = 'panel-openaq:pais-seleccionado'

export function CountryProvider({ children }) {
  const [countries, setCountries] = useState([])
  const [cargandoPaises, setCargandoPaises] = useState(true)
  const [errorPaises, setErrorPaises] = useState(null)

  const [countryIso, setCountryIsoState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || PAIS_POR_DEFECTO
  )

  useEffect(() => {
    let activo = true
    getCountries({ limit: 200 })
      .then((data) => {
        if (activo) setCountries(data)
      })
      .catch((err) => {
        if (activo) setErrorPaises(err.message)
      })
      .finally(() => {
        if (activo) setCargandoPaises(false)
      })
    return () => {
      activo = false
    }
  }, [])

  function setCountryIso(iso) {
    setCountryIsoState(iso)
    localStorage.setItem(STORAGE_KEY, iso)
  }

  const selectedCountry = useMemo(
    () => countries.find((pais) => pais.code === countryIso) ?? null,
    [countries, countryIso]
  )

  const value = {
    countryIso,
    setCountryIso,
    countries,
    cargandoPaises,
    errorPaises,
    // Nombre legible del país actual; si aún no cargó el listado, usamos el código.
    countryName: selectedCountry?.name || countryIso,
  }

  return <CountryContext.Provider value={value}>{children}</CountryContext.Provider>
}

// Hook de conveniencia para consumir el contexto desde cualquier componente.
export function useCountry() {
  const ctx = useContext(CountryContext)
  if (!ctx) {
    throw new Error('useCountry debe usarse dentro de un <CountryProvider>')
  }
  return ctx
}

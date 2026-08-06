import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLocations } from '../services/openaqApi.js'
import { useCountry } from '../context/CountryContext.jsx'
import SummaryCards from '../components/SummaryCards.jsx'
import MapView from '../components/MapView.jsx'

export default function HomePage() {
  const { countryIso, countryName } = useCountry()
  const [locations, setLocations] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true
    setCargando(true)
    getLocations({ limit: 100, iso: countryIso })
      .then((data) => {
        if (activo) setLocations(data)
      })
      .catch((err) => {
        if (activo) setError(err.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [countryIso])

  const totalSensores = locations.reduce((acc, loc) => acc + (loc.sensors?.length ?? 0), 0)
  const proveedores = new Set(locations.map((loc) => loc.provider?.name).filter(Boolean))
  const ciudades = new Set(locations.map((loc) => loc.locality).filter(Boolean))

  const cards = [
    { label: `Estaciones en ${countryName}`, value: locations.length },
    { label: 'Sensores activos', value: totalSensores },
    { label: 'Proveedores de datos', value: proveedores.size },
    { label: 'Localidades cubiertas', value: ciudades.size },
  ]

  const marcadores = locations
    .filter((loc) => loc.coordinates)
    .map((loc) => ({
      id: loc.id,
      name: loc.name,
      lat: loc.coordinates.latitude,
      lng: loc.coordinates.longitude,
      description: loc.locality,
      linkTo: `/ubicaciones/${loc.id}/sensores`,
    }))

  return (
    <div>
      <div className="hero">
        <div className="eyebrow">OpenAQ · Jair Pincay</div>
        <h1>Calidad del aire de {countryName}, estación por estación.</h1>
        <p>
          Explora las estaciones de monitoreo registradas en OpenAQ para {countryName}, revisa
          qué sensores tiene cada una y consulta sus mediciones más recientes. Cambia de país
          desde la barra lateral para explorar otras ubicaciones.
        </p>
        <Link to="/ubicaciones" className="btn-primary" style={{ display: 'inline-block', marginTop: '0.6rem' }}>
          Ver todas las ubicaciones
        </Link>
      </div>

      {cargando && <div className="loading-state">Cargando datos de OpenAQ…</div>}
      {error && <div className="error-state">{error}</div>}

      {!cargando && !error && (
        <>
          <SummaryCards cards={cards} />
          <div className="panel">
            <h3>Mapa general de estaciones</h3>
            <MapView markers={marcadores} zoom={6} />
          </div>
        </>
      )}
    </div>
  )
}

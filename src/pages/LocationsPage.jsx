import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLocations } from '../services/openaqApi.js'
import { useCountry } from '../context/CountryContext.jsx'
import LocationsTable from '../components/LocationsTable.jsx'
import MapView from '../components/MapView.jsx'

export default function LocationsPage() {
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
      <div className="page-heading">
        <div>
          <div className="breadcrumbs">
            <Link to="/">Inicio</Link> / Ubicaciones
          </div>
          <h2>Ubicaciones de monitoreo en {countryName}</h2>
        </div>
      </div>

      {cargando && <div className="loading-state">Cargando ubicaciones…</div>}
      {error && <div className="error-state">{error}</div>}

      {!cargando && !error && (
        <>
          <div className="panel">
            <MapView markers={marcadores} zoom={6} />
          </div>
          <div className="panel">
            <LocationsTable locations={locations} countryName={countryName} />
          </div>
        </>
      )}
    </div>
  )
}

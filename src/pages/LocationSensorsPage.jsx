import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLocationById, getSensorsByLocation } from '../services/openaqApi.js'
import SensorsTable from '../components/SensorsTable.jsx'
import MapView from '../components/MapView.jsx'

export default function LocationSensorsPage() {
  // Parámetro dinámico de la ruta: /ubicaciones/:locationId/sensores
  const { locationId } = useParams()

  const [location, setLocation] = useState(null)
  const [sensors, setSensors] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true
    setCargando(true)
    setError(null)

    Promise.all([getLocationById(locationId), getSensorsByLocation(locationId)])
      .then(([locationData, sensorsData]) => {
        if (!activo) return
        setLocation(locationData)
        setSensors(sensorsData)
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
  }, [locationId])

  const marcador = location?.coordinates
    ? [
        {
          id: location.id,
          name: location.name,
          lat: location.coordinates.latitude,
          lng: location.coordinates.longitude,
          description: location.locality,
        },
      ]
    : []

  return (
    <div>
      <div className="breadcrumbs">
        <Link to="/">Inicio</Link> / <Link to="/ubicaciones">Ubicaciones</Link> /{' '}
        {location?.name || `Estación #${locationId}`}
      </div>

      {cargando && <div className="loading-state">Cargando sensores…</div>}
      {error && <div className="error-state">{error}</div>}

      {!cargando && !error && (
        <>
          <div className="page-heading">
            <div>
              <h2>{location?.name || `Estación #${locationId}`}</h2>
              <p>
                {location?.locality ? `${location.locality} · ` : ''}
                {sensors.length} sensor{sensors.length === 1 ? '' : 'es'} registrados
              </p>
            </div>
          </div>

          {marcador.length > 0 && (
            <div className="panel">
              <MapView markers={marcador} center={[marcador[0].lat, marcador[0].lng]} zoom={12} small />
            </div>
          )}

          <div className="panel">
            <SensorsTable sensors={sensors} locationId={locationId} />
          </div>
        </>
      )}
    </div>
  )
}

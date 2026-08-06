import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSensorById, getMeasurementsBySensor, getLocationById } from '../services/openaqApi.js'
import MeasurementsTable from '../components/MeasurementsTable.jsx'
import SummaryCards from '../components/SummaryCards.jsx'

export default function SensorMeasurementsPage() {
  // Parámetros dinámicos: /ubicaciones/:locationId/sensores/:sensorId/mediciones
  const { locationId, sensorId } = useParams()

  const [location, setLocation] = useState(null)
  const [sensor, setSensor] = useState(null)
  const [measurements, setMeasurements] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true
    setCargando(true)
    setError(null)

    Promise.all([
      getLocationById(locationId),
      getSensorById(sensorId),
      getMeasurementsBySensor(sensorId, { limit: 100 }),
    ])
      .then(([locationData, sensorData, measurementsData]) => {
        if (!activo) return
        setLocation(locationData)
        setSensor(sensorData)
        setMeasurements(measurementsData)
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
  }, [locationId, sensorId])

  const valores = measurements.map((m) => m.value).filter((v) => v !== null && v !== undefined)
  const promedio = valores.length ? (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1) : '—'
  const maximo = valores.length ? Math.max(...valores) : '—'
  const minimo = valores.length ? Math.min(...valores) : '—'

  const cards = [
    { label: 'Mediciones cargadas', value: measurements.length },
    { label: 'Promedio', value: promedio },
    { label: 'Máximo', value: maximo },
    { label: 'Mínimo', value: minimo },
  ]

  return (
    <div>
      <div className="breadcrumbs">
        <Link to="/">Inicio</Link> / <Link to="/ubicaciones">Ubicaciones</Link> /{' '}
        <Link to={`/ubicaciones/${locationId}/sensores`}>{location?.name || `Estación #${locationId}`}</Link> /{' '}
        {sensor?.name || `Sensor #${sensorId}`}
      </div>

      {cargando && <div className="loading-state">Cargando mediciones…</div>}
      {error && <div className="error-state">{error}</div>}

      {!cargando && !error && (
        <>
          <div className="page-heading">
            <div>
              <h2>{sensor?.name || `Sensor #${sensorId}`}</h2>
              <p>
                Parámetro: <span className="badge">{sensor?.parameter?.displayName || sensor?.parameter?.name}</span>
                {' · '}Unidad: <span className="mono">{sensor?.parameter?.units || '—'}</span>
              </p>
            </div>
          </div>

          <SummaryCards cards={cards} />

          <div className="panel">
            <MeasurementsTable measurements={measurements} unit={sensor?.parameter?.units || ''} />
          </div>
        </>
      )}
    </div>
  )
}

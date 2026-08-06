import { Link } from 'react-router-dom'

// Tabla de sensores de una ubicación. Recibe la lista de sensores y el id
// de la ubicación por props, para construir la ruta dinámica hacia las
// mediciones de cada sensor.
export default function SensorsTable({ sensors, locationId }) {
  if (sensors.length === 0) {
    return (
      <div className="empty-state">
        <p>Esta ubicación no tiene sensores registrados.</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Sensor</th>
            <th>Parámetro</th>
            <th>Unidad</th>
            <th>Último valor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sensors.map((sensor) => (
            <tr key={sensor.id}>
              <td>{sensor.name || `Sensor #${sensor.id}`}</td>
              <td>
                <span className="badge">{sensor.parameter?.displayName || sensor.parameter?.name}</span>
              </td>
              <td className="value-cell mono">{sensor.parameter?.units || '—'}</td>
              <td className="value-cell mono">
                {sensor.latest?.value !== undefined ? sensor.latest.value : '—'}
              </td>
              <td>
                <Link
                  className="row-link"
                  to={`/ubicaciones/${locationId}/sensores/${sensor.id}/mediciones`}
                >
                  Ver mediciones →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

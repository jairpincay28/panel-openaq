import { Link } from 'react-router-dom'

// Tabla de ubicaciones/estaciones de monitoreo. Recibe la lista por props
// y renderiza cada fila con map(). Cada fila enlaza a una ruta dinámica
// /ubicaciones/:locationId/sensores
export default function LocationsTable({ locations, countryName }) {
  if (locations.length === 0) {
    return (
      <div className="empty-state">
        <p>
          No se encontraron ubicaciones de monitoreo{countryName ? ` para ${countryName}` : ''}.
        </p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Ubicación</th>
            <th>Localidad</th>
            <th>Proveedor</th>
            <th># Sensores</th>
            <th>Coordenadas</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <td>{location.name || 'Sin nombre'}</td>
              <td>{location.locality || '—'}</td>
              <td>{location.provider?.name || '—'}</td>
              <td className="value-cell">{location.sensors?.length ?? 0}</td>
              <td className="value-cell mono">
                {location.coordinates
                  ? `${location.coordinates.latitude.toFixed(3)}, ${location.coordinates.longitude.toFixed(3)}`
                  : '—'}
              </td>
              <td>
                <Link className="row-link" to={`/ubicaciones/${location.id}/sensores`}>
                  Ver sensores →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

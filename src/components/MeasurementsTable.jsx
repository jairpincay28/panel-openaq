// Tabla de mediciones de un sensor. Recibe la lista de mediciones y la
// unidad del parámetro por props.
export default function MeasurementsTable({ measurements, unit }) {
  if (measurements.length === 0) {
    return (
      <div className="empty-state">
        <p>Este sensor todavía no tiene mediciones disponibles.</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Desde</th>
            <th>Hasta</th>
            <th>Valor</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((measurement, index) => (
            <tr key={`${measurement.period?.datetimeFrom?.utc || index}`}>
              <td className="mono">{formatFecha(measurement.period?.datetimeFrom?.local)}</td>
              <td className="mono">{formatFecha(measurement.period?.datetimeTo?.local)}</td>
              <td className="value-cell mono">
                {measurement.value} {unit}
              </td>
              <td>
                <span className={`badge ${nivelBadge(measurement.value)}`}>
                  {nivelTexto(measurement.value)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatFecha(isoString) {
  if (!isoString) return '—'
  const fecha = new Date(isoString)
  return fecha.toLocaleString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Clasificación simple orientativa del valor (no es un índice AQI oficial),
// solo para dar contexto visual rápido en la tabla.
function nivelBadge(value) {
  if (value === null || value === undefined) return ''
  if (value < 12) return 'good'
  if (value < 35) return 'warn'
  return 'danger'
}

function nivelTexto(value) {
  if (value === null || value === undefined) return 'Sin dato'
  if (value < 12) return 'Bueno'
  if (value < 35) return 'Moderado'
  return 'Elevado'
}

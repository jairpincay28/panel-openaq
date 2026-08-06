
const BASE_URL = '/api'
export const PAIS_POR_DEFECTO = 'EC'

async function get(endpoint, params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value)
    }
  })

  const url = `${BASE_URL}${endpoint}${query.toString() ? `?${query.toString()}` : ''}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Error ${response.status} al consultar OpenAQ (${endpoint}). Verifica tu API Key en el archivo .env`
    )
  }

  return response.json()
}


export async function getLocations({ limit = 100, page = 1, iso = PAIS_POR_DEFECTO } = {}) {
  const data = await get('/locations', { iso: iso || undefined, limit, page })
  return data.results ?? []
}

export async function getCountries({ limit = 200, page = 1 } = {}) {
  const data = await get('/countries', { limit, page })
  return (data.results ?? [])
    .filter((pais) => pais.code)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function getLocationById(locationId) {
  const data = await get(`/locations/${locationId}`)
  return data.results?.[0] ?? null
}

export async function getSensorsByLocation(locationId) {
  const data = await get(`/locations/${locationId}/sensors`)
  return data.results ?? []
}

export async function getSensorById(sensorId) {
  const data = await get(`/sensors/${sensorId}`)
  return data.results?.[0] ?? null
}

/**
 * Obtiene las mediciones registradas por un sensor.
 * GET /v3/sensors/{id}/measurements
 */
export async function getMeasurementsBySensor(sensorId, { limit = 100, page = 1 } = {}) {
  const data = await get(`/sensors/${sensorId}/measurements`, { limit, page })
  return data.results ?? []
}

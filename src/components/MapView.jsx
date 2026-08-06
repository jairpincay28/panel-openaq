import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Link } from 'react-router-dom'

// Arregla el bug conocido de los íconos por defecto de Leaflet + bundlers (Vite/Webpack)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

/**
 * Mapa reutilizable, recibe:
 * - markers: [{ id, name, lat, lng, linkTo, description }]
 * - center: [lat, lng]
 * - zoom: number
 * - small: boolean (para el contenedor más chico dentro del detalle)
 */
export default function MapView({ markers = [], center, zoom = 6, small = false }) {
  const mapCenter = center ?? (markers[0] ? [markers[0].lat, markers[0].lng] : [-1.83, -78.18])

  return (
    <div className={`map-container${small ? ' small' : ''}`}>
      <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]}>
            <Popup>
              <div className="map-popup">
                <h4>{marker.name}</h4>
                {marker.description && <p style={{ margin: '0 0 0.4rem' }}>{marker.description}</p>}
                {marker.linkTo && <Link to={marker.linkTo}>Ver sensores →</Link>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

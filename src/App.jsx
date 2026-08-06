import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import HomePage from './pages/HomePage.jsx'
import LocationsPage from './pages/LocationsPage.jsx'
import LocationSensorsPage from './pages/LocationSensorsPage.jsx'
import SensorMeasurementsPage from './pages/SensorMeasurementsPage.jsx'
import './App.css'

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ubicaciones" element={<LocationsPage />} />
            <Route
              path="/ubicaciones/:locationId/sensores"
              element={<LocationSensorsPage />}
            />
            <Route
              path="/ubicaciones/:locationId/sensores/:sensorId/mediciones"
              element={<SensorMeasurementsPage />}
            />
            <Route path="*" element={<RutaNoEncontrada />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function RutaNoEncontrada() {
  return (
    <div className="empty-state">
      <h2>404</h2>
      <p>La página que buscas no existe.</p>
    </div>
  )
}

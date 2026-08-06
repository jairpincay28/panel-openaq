import { NavLink } from 'react-router-dom'
import { useCountry } from '../context/CountryContext.jsx'

// Encabezado fijo de la aplicación.
export default function Header() {
  const { countryName } = useCountry()

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark">AQ</div>
        <div className="brand-text">
          <h1>Panel OpenAQ</h1>
          <span>Calidad del aire · {countryName}</span>
        </div>
      </div>

      <nav className="header-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Inicio
        </NavLink>
        <NavLink
          to="/ubicaciones"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Ubicaciones
        </NavLink>
      </nav>

      <div className="header-status">
        <span className="pulse-dot" />
        <span>Datos en vivo · Jair Pincay - Estudiante</span>
      </div>
    </header>
  )
}

import { NavLink } from 'react-router-dom'
import { useCountry } from '../context/CountryContext.jsx'

// Convierte un código ISO de 2 letras (ej. "EC") en su emoji de bandera.
function isoABandera(iso) {
  if (!iso || iso.length !== 2) return '🌎'
  return String.fromCodePoint(
    ...iso
      .toUpperCase()
      .split('')
      .map((letra) => 127397 + letra.charCodeAt(0))
  )
}

// Barra lateral de navegación. Incluye el selector de país: al cambiarlo,
// todas las páginas (Inicio, Ubicaciones) vuelven a consultar OpenAQ con el
// nuevo país gracias al CountryContext.
export default function Sidebar() {
  const { countryIso, setCountryIso, countries, cargandoPaises, errorPaises } = useCountry()

  return (
    <aside className="app-sidebar">
      <div className="sidebar-section">
        <div className="sidebar-title">Navegación</div>
        <NavLink to="/" end className="sidebar-link">
          🏠 Inicio
        </NavLink>
        <NavLink to="/ubicaciones" className="sidebar-link">
          📍 Ubicaciones
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-title">País consultado</div>

        {cargandoPaises && <div className="sidebar-flag">Cargando países…</div>}

        {errorPaises && !cargandoPaises && (
          <div className="sidebar-flag">{isoABandera(countryIso)} {countryIso}</div>
        )}

        {!cargandoPaises && !errorPaises && (
          <select
            className="country-select"
            value={countryIso}
            onChange={(e) => setCountryIso(e.target.value)}
          >
            {countries.map((pais) => (
              <option key={pais.code} value={pais.code}>
                {isoABandera(pais.code)} {pais.code} — {pais.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </aside>
  )
}

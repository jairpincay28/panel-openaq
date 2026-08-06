# Panel OpenAQ — Calidad del aire en tiempo real

## ¿De qué trata esta práctica?

Esta práctica consiste en construir, desde cero, un **dashboard web** que consuma una
**API REST pública** ([OpenAQ](https://openaq.org)) y organice la información en una
**navegación jerárquica de tres niveles**: primero se listan las **ubicaciones**
(estaciones de monitoreo), luego los **sensores** que tiene cada ubicación, y finalmente
las **mediciones** que ha registrado cada sensor. El objetivo es demostrar el manejo de:

- **Consumo de una API REST real** (peticiones HTTP, manejo de parámetros de consulta,
  paginación, autenticación por API Key).
- **Enrutamiento dinámico** con React Router, incluyendo **rutas anidadas con parámetros**
  (`:locationId`, `:sensorId`) que dependen de la selección del usuario.
- **Manejo de estado y ciclo de vida** en componentes funcionales de React (`useState`,
  `useEffect`) para cargar datos de forma asíncrona, mostrar estados de carga y manejar
  errores de red.
- **Separación de responsabilidades**: toda la lógica de comunicación con la API vive en
  una capa de servicios (`src/services/openaqApi.js`), independiente de los componentes
  visuales.
- **Visualización de datos geográficos** con un mapa interactivo (Leaflet), ubicando cada
  estación de monitoreo según sus coordenadas.
- **Manejo seguro de credenciales** en desarrollo: la API Key nunca viaja expuesta en el
  navegador, sino que se inyecta en el servidor mediante un proxy configurado en Vite.
- **Estado global compartido entre páginas** mediante Context API, para que una preferencia
  del usuario (en este caso, el país que quiere consultar) esté disponible en toda la
  aplicación sin tener que pasarla manualmente por props en cada componente.

En resumen: no es solo "pintar tablas con datos", sino ejercitar el flujo completo de una
aplicación real que consulta datos externos, los transforma y los presenta de forma
navegable, responsiva y ordenada por capas (servicios → páginas → componentes).

## ¿Qué hace la aplicación?

Es un **dashboard en React + Vite** que consume la API REST de OpenAQ para navegar
**Ubicaciones → Sensores → Mediciones**, con un **selector de país** (por defecto Ecuador,
`iso=EC`, pero el usuario puede cambiarlo desde la barra lateral a cualquier país
disponible en OpenAQ) y un **mapa interactivo** (Leaflet / OpenStreetMap) que ubica cada
estación de monitoreo.

## Stack

- React 18 + Vite
- React Router DOM (rutas dinámicas anidadas)
- react-leaflet + Leaflet (mapa, sin necesidad de API key adicional)
- Context API (`src/context/CountryContext.jsx`) para el país seleccionado globalmente
- Capa de servicios separada (`src/services/openaqApi.js`)
- CSS responsivo (mobile / tablet / desktop) sin frameworks externos

## Estructura

```
src/
├── components/
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── SummaryCards.jsx
│   ├── LocationsTable.jsx
│   ├── SensorsTable.jsx
│   ├── MeasurementsTable.jsx
│   └── MapView.jsx
├── context/
│   └── CountryContext.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── LocationsPage.jsx
│   ├── LocationSensorsPage.jsx
│   └── SensorMeasurementsPage.jsx
├── services/
│   └── openaqApi.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Rutas

| Ruta | Página |
|---|---|
| `/` | Inicio, resumen general + mapa de todas las estaciones del país seleccionado |
| `/ubicaciones` | Listado completo de ubicaciones del país seleccionado |
| `/ubicaciones/:locationId/sensores` | Sensores de una ubicación (parámetro dinámico) |
| `/ubicaciones/:locationId/sensores/:sensorId/mediciones` | Mediciones de un sensor (parámetro dinámico anidado) |

## 1. Obtener tu API Key de OpenAQ

Desde v3, OpenAQ requiere una API Key gratuita:

1. Entra a https://explore.openaq.org
2. Crea una cuenta / inicia sesión
3. Ve a tu perfil → **API Keys** y genera una nueva
4. Cópiala

## 2. Configurar el proyecto

```bash
npm install
cp .env.example .env
```

Edita `.env` y coloca tu key:

```
VITE_OPENAQ_API_KEY=tu_api_key_real
```

## 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:5173

> El proxy de Vite (`vite.config.js`) reenvía `/api/*` hacia `https://api.openaq.org/v3/*`
> e inyecta el header `X-API-Key` del lado del servidor de desarrollo, para que la key
> no viaje expuesta como parámetro en la URL del navegador.

## 4. Build de producción

```bash
npm run build
npm run preview
```

> Nota: el proxy de Vite solo funciona en `npm run dev`. Para desplegar en producción
> (Vercel, Netlify, etc.) se necesitaría una función serverless o backend liviano que
> agregue el header `X-API-Key` a las peticiones, ya que un sitio estático puro no
> puede ocultar la key. Para efectos académicos, el modo desarrollo cumple el
> requerimiento del proxy configurado mediante Vite.

## Selector de país

La barra lateral incluye un selector que carga dinámicamente (`GET /v3/countries`) todos
los países disponibles en OpenAQ. Al elegir uno, el `CountryContext` actualiza el país
seleccionado de forma global y persiste la elección en `localStorage`, de modo que todas
las páginas (`HomePage`, `LocationsPage`) vuelven a consultar `/v3/locations` con el
nuevo código ISO sin necesidad de recargar la página.

## Notas sobre la API de OpenAQ v3 usada

- `GET /v3/countries` — listado de países disponibles (para el selector)
- `GET /v3/locations?iso={code}` — ubicaciones del país seleccionado
- `GET /v3/locations/{id}` — detalle de una ubicación
- `GET /v3/locations/{id}/sensors` — sensores de una ubicación
- `GET /v3/sensors/{id}` — detalle de un sensor
- `GET /v3/sensors/{id}/measurements` — mediciones de un sensor

## Autor

Datos: 
Jair Pincay
8vo Semestre
Aplicaciones Telemáticas Basadas en Web.



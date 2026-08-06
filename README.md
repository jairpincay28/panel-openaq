# Panel OpenAQ — Calidad del aire en Ecuador

Dashboard en React + Vite que consume la API REST de [OpenAQ](https://openaq.org) para
navegar jerárquicamente: **Ubicaciones → Sensores → Mediciones**, filtrado a estaciones
de Ecuador (`iso=EC`), con un mapa interactivo (Leaflet / OpenStreetMap).

## Stack

- React 18 + Vite
- React Router DOM (rutas dinámicas anidadas)
- react-leaflet + Leaflet (mapa, sin necesidad de API key adicional)
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
| `/` | Inicio, resumen general + mapa de todas las estaciones |
| `/ubicaciones` | Listado completo de ubicaciones en Ecuador |
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

## Notas sobre la API de OpenAQ v3 usada

- `GET /v3/locations?iso=EC` — ubicaciones de Ecuador
- `GET /v3/locations/{id}` — detalle de una ubicación
- `GET /v3/locations/{id}/sensors` — sensores de una ubicación
- `GET /v3/sensors/{id}` — detalle de un sensor
- `GET /v3/sensors/{id}/measurements` — mediciones de un sensor

## Autor

_Completa aquí tus datos: nombre, curso, materia, fecha._

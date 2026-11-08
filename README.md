# ITX Front-End Test — Tienda de móviles

Mini-aplicación SPA para comprar dispositivos móviles: listado con búsqueda en tiempo real (PLP) y detalle con selección de opciones y cesta (PDP).

React 19 + JavaScript (ES6, sin TypeScript) + Vite + React Router. Tests con Vitest y Testing Library.

## Ejecución

Requisitos: Node.js 20 o superior.

```bash
npm install
npm start        # modo desarrollo: http://localhost:5173
npm run build    # compilación de producción en dist/
npm test         # 49 tests
npm run lint     # ESLint
```

La API por defecto es `https://itx-frontend-test.onrender.com/api`. Se puede cambiar con la variable `VITE_API_BASE_URL` (ver `.env.example`).

> La API está en un plan gratuito que "se duerme": la primera petición puede tardar más de 30 s. La aplicación lo avisa tras 3 s de espera.

## Estructura

```
src/
├── api/                    # Acceso a datos
│   ├── config.js           #   URL base, TTL de caché (1 h), timeout
│   ├── httpClient.js       #   fetch + JSON + timeout + errores uniformes
│   ├── cache.js            #   Caché en localStorage con fecha de guardado
│   ├── cachedRequest.js    #   GET con caché, revalidación y deduplicación
│   └── products.js         #   getProducts, getProduct, addToCart
├── utils/
│   ├── normalizeProduct.js #   Capa anticorrupción: corrige las rarezas de la API
│   ├── filterProducts.js   #   Búsqueda por marca y modelo
│   └── format.js           #   Precio, peso, "No disponible"
├── hooks/                  # useAsync (loading / error / retry), useProducts, useProduct
├── context/                # Contador de la cesta, global y persistido
├── components/             # Header, Breadcrumbs, SearchBar, ProductCard, ProductImage,
│                           # ProductDescription, ProductActions, OptionSelector, StatusMessages
└── pages/                  # ProductListPage, ProductDetailPage, NotFoundPage
```

Los componentes no llaman a `fetch` ni conocen el formato de la API. Solo usan los hooks, que devuelven datos ya normalizados.

## Decisiones técnicas

**Exploré la API antes de programar.** Recorrí los 100 productos y encontré varias rarezas:

| Rareza de la API | Tratamiento |
|---|---|
| `price` es un string y en 6 productos está vacío (`""`) | Se convierte a número o `null`; se muestra "Precio no disponible" |
| Nombres con erratas: `dimentions`, `secondaryCmera` | Se renombran a `dimensions`, `secondaryCamera` |
| `displayResolution` contiene el tamaño ("7.0 inches") y `displaySize` la resolución ("720 x 1280 pixels"), en 100 de 100 productos | Se intercambian |
| `cpu`, `os`, `ram`, cámaras... pueden ser string, lista o vacío | Se unen con comas; vacío se muestra como "No disponible" |
| `POST /api/cart` devuelve siempre `{"count": 1}` | El valor se **suma** al contador local (ver abajo) |
| Un id inexistente devuelve 500, no 404 | Error con botón "Reintentar" y enlace al listado |

Todo esto se corrige en un único sitio, `normalizeProduct.js` (capa anticorrupción). Si la API cambia, se toca un fichero.

**Caché en cliente de 1 hora en `localStorage`.**
- Cada respuesta se guarda con su fecha. Durante 1 hora se sirve sin red; después se revalida contra la API.
- Elegí `localStorage` y no memoria porque así sobrevive a una recarga, que es justo lo que pide el enunciado: no repetir peticiones.
- Dos mejoras sobre el requisito:
  - *stale-if-error*: si la revalidación falla, se muestra el dato caducado en lugar de un error;
  - *deduplicación*: si el detalle y los breadcrumbs piden el mismo producto a la vez, sale **una** petición.
- Los errores no se cachean, y un `localStorage` bloqueado o lleno no rompe la aplicación.

**Contador de la cesta.** Vive en un Context de React (visible en todas las vistas) y se persiste en `localStorage`. Como la API siempre responde `count: 1`, sumo ese valor al total local. Si la API devolviera el total real, bastaría con cambiar la suma por una asignación en `CartProvider.jsx`.

**Búsqueda en tiempo real.**
- Se filtra en memoria con `useMemo`: la API no tiene endpoint de búsqueda y son 100 productos.
- Cada palabra de la búsqueda tiene que aparecer en marca + modelo, en cualquier orden, sin distinguir mayúsculas ni acentos.
- La búsqueda vive en la URL (`?q=`), así que se conserva al volver del detalle y se puede compartir.

**Selectores de opciones.**
- Son grupos de radio con aspecto de botón: semántica nativa y accesibles con teclado.
- Si solo hay una opción, aparece seleccionada (requisito).
- "Añadir" se desactiva hasta elegir almacenamiento y color.
- La selección se reinicia al cambiar de producto (`key={product.id}`).

**Rejilla adaptable.** Media queries con CSS Grid: 1 columna en móvil, 2, 3 y **como máximo 4** desde 1024 px. CSS propio, sin librería de componentes, para controlar el diseño y no añadir peso.

**Estados de carga y error en todas las vistas.** Hay un *loader* que, tras 3 s, explica que el servidor puede estar despertando, y errores con botón "Reintentar". El hook `useAsync` descarta las respuestas tardías, así que una navegación rápida nunca muestra el producto anterior.

## Tests

```bash
npm test   # 49 tests, ~5 s
```

| Fichero | Qué cubre |
|---|---|
| `api/cache.test.js` | Frescura durante 1 h, caducidad, persistencia, entrada corrupta, storage bloqueado |
| `api/cachedRequest.test.js` | Sin red dentro de la hora, revalidación, *stale-if-error*, deduplicación, errores no cacheados |
| `utils/normalizeProduct.test.js` | Precio vacío, listas, erratas y campos intercambiados, con datos reales de la API |
| `utils/filterProducts.test.js` | Marca, modelo, mayúsculas, acentos, varias palabras |
| `pages/ProductListPage.test.jsx` | Listado, búsqueda en tiempo real, búsqueda desde la URL, sin resultados, error y reintento |
| `components/ProductActions.test.jsx` | Opción única preseleccionada, botón desactivado, envío de id + códigos, error de la API |
| `context/CartProvider.test.jsx` | Suma, persistencia, recarga, valor corrupto |
| `App.test.jsx` | Recorrido completo: listado → detalle → añadir → contador → volver; atributos obligatorios; 404 |

## Qué haría con más tiempo

- Tests end-to-end con Playwright contra la API real.
- Imágenes responsive (`srcset`) y *skeletons* en lugar del *spinner*.
- Una librería de datos (TanStack Query) si la aplicación crece: hoy la caché propia es pequeña y cumple el requisito de persistencia de 1 h.
- Despliegue estático (Netlify/Vercel) con *fallback* a `index.html` para las rutas de la SPA.

## Cómo encajaría en un sistema mayor

En la PDP se podría mostrar "Productos similares" consumiendo la [API de productos similares](https://github.com/howzera/backendDevTest). Al añadir a la cesta, el backend publicaría un evento y el [servicio de notificaciones con IA](https://github.com/howzera/ai-python-test) enviaría la confirmación. Gracias a `VITE_API_BASE_URL`, cambiar de backend es una variable de entorno.

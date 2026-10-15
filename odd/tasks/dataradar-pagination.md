# DataRadar — Paginación server-side + pulido

## Objetivo
Agregar paginación (server-side, por `.range()` de Supabase) a Vacantes y Empresas, mover los filtros a la URL (`searchParams`), y pulir la UX de listados.

## Problema
Hoy se traen TODAS las vacantes y se filtran/paginan en el cliente. Con mucha data esto rompe: PostgREST devuelve máx. 1000 filas por request, y se paga el costo de cargar todo siempre.

## Por qué
El usuario pidió paginación porque va a haber bastante data.

## Alcance
- `getVacanciesPage(filters, page, perPage)` y `getCompaniesPage(page, perPage)` con `.range()` + `count` y fallback a mocks.
- Filtros de vacantes por URL: q, block, tech, min, max, mode, status, page, size.
- Componente `Pagination` reutilizable (prev/next + números + selector de tamaño + "X–Y de Z").
- Rewrite de `vacancy-explorer` a URL-driven (búsqueda con debounce).
- Paginación en Empresas.

## Fuera de alcance
Filtros en Empresas (solo paginación), Tendencias (agregados, sin paginación), auth.

## Restricciones
Dark-first, español neutro/profesional, sin `any`, Next 14 (searchParams es objeto, no Promise), reutilizar `Select` y `VacancyCard` existentes.

## Acciones

- [x] T1 — Capa de datos: `getVacanciesPage` y `getCompaniesPage` (Supabase `.range()` + count exacto + resolución de stack por página; fallback mocks filtrados en memoria). Tipos `VacancyFilters` y `Paginated<T>`.
- [x] T2 — `Pagination` reutilizable (Links preservando params, elipsis, selector de tamaño, contador).
- [x] T3 — Rewrite `vacancy-explorer` a URL-driven (debounce en búsqueda, selects→URL, scroll top, estado vacío).
- [x] T4 — Páginas server: `/vacantes` parsea searchParams; `/empresas` con paginación.
- [x] T5 — Cierre: `tsc` + `build` en verde, commit + push.

## Criterios de aceptación
- `/vacantes?page=2&size=24&block=colombia&tech=SQL&min=1&mode=remote_full&status=active` filtra y pagina del lado del server.
- Con 18 vacantes reales y `size=12` hay 2 páginas; cambiar de página muestra el skeleton y luego la página correcta.
- Empresas pagina; contador "X–Y de Z" correcto; prev/next deshabilitados en bordes.

## Cheques aplicables
- `cd app && npx tsc --noEmit`
- `cd app && npm run build`

## Estrategia de entrega
- `ask-on-risk`. Un commit work-unit + push.

## Progreso / evidencia
- T1–T5 completados. `tsc --noEmit` y `next build` OK (`/vacantes` y `/empresas` → dinámicas `ƒ`).
- Prueba funcional con data real (dev server): size=12 → 1–12/18 y 13–18/18; block=colombia → 6/6; tech=SQL → 13; min=3 → 5; q=Data → 16; empresas 1–12/15 y 13–15/15.
- Commit `aa313c0` pusheado.

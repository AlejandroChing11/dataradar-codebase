# DataRadar — Lote: descartes reales, orden+nuevo, filtros idioma/portal

## Objetivo
1. Usar la tabla real `discards` en Tendencias (embudo de descartes honesto).
2. Ordenar vacantes por recencia + badge "Nuevo".
3. Filtros de idioma (inglés) y portal (source) en Vacantes.

## Problema
El "embudo de descartes" de Tendencias es derivado/falso; no hay orden por recencia; faltan filtros útiles ya presentes en la data.

## Alcance
- `Discard` type + `getDiscards()` (Supabase + mock) y reemplazo del embudo en Tendencias (funnel activas vs descartadas + breakdown por `source_raw` + lista de motivos).
- `.order("first_seen", desc)` en `getVacanciesPage` (y mock) + badge "Nuevo" (últimos 2 días) en la card.
- `VacancyFilters` con `language` ("ingles"/"no_ingles") y `portal`; filtros en Supabase y mock; dos selects nuevos en el explorer; parseo de `lang`/`portal` en la página.

## Fuera de alcance
Salarios (salary_raw vacío), toggle de tema, detalle de empresa, orden configurable.

## Restricciones
Dark-first, español neutro/profesional, sin `any`, reutilizar `Select`/`Badge`/`Section`. `Badge` gana un tone `accent` para "Nuevo".

## Acciones
- [x] T1 — `Discard` type + `getDiscards()` + `mockDiscards`.
- [x] T2 — `getVacanciesPage`: orden por `first_seen` desc + filtros `language`/`portal` (Supabase y mock).
- [x] T3 — `Badge` tone `accent` + badge "Nuevo" en `vacancy-card`.
- [x] T4 — Explorer: selects Idioma y Portal (URL-driven) + parseo en página.
- [x] T5 — Tendencias: embudo real con `getDiscards()`.
- [x] T6 — Cierre: tsc + build + commit + push.

## Criterios de aceptación
- Tendencias muestra descartes reales (18) con motivos.
- Vacantes ordenadas por más recientes; badge "Nuevo" en las de los últimos 2 días.
- `?lang=ingles` y `?portal=linkedin` filtran del lado del server.

## Cheques aplicables
- `cd app && npx tsc --noEmit`
- `cd app && npm run build`

## Progreso / evidencia
- T1–T6 completados. `tsc --noEmit` y `next build` OK.
- Prueba funcional (data real): lang=no_ingles → 15/15, lang=ingles → 3, q=Data → 16, q=Data&lang=no_ingles → 13 (intersección correcta), portal=linkedin → 14. Tendencias renderiza descartes reales (breakdown por source_raw + motivos).
- Fix extra: "sin inglés" se resuelve por ids (dos pasos) para no pisar el `.or()` de la búsqueda; mocks con `source_portal` en minúscula.
- Commit `(ver git log)` pusheado.

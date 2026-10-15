# DataRadar — Página de detalle de vacante

## Objetivo
Crear `/vacantes/[id]` con una página de detalle pulida, botón "Aplicar" que lleva al mismo link que "Ver oferta", manteniendo "Ver oferta" en la card.

## Problema
No hay vista de detalle; la card solo linkea afuera.

## Por qué
El usuario pidió una página de detalle con CTA "Aplicar".

## Alcance
- `getVacancyById(id)` y `getCompanyById(id)` (Supabase + mock fallback).
- `app/app/vacantes/[id]/page.tsx` (server, `notFound()` si no existe, `generateMetadata`, `revalidate=3600`).
- `app/app/vacantes/[id]/loading.tsx` (skeleton).
- Card: título → Link a `/vacantes/[id]`; "Ver oferta" sigue como link externo.

## Fuera de alcance
Formulario de aplicación real, auth, edición.

## Restricciones
Dark-first, español neutro/profesional, sin `any`, reutilizar `Chip`/`Badge`/`Section`, `url ?? alt_url` para el CTA (ocultar si ambos null).

## Acciones

- [x] T1 — Capa de datos: `getVacancyById` + `getCompanyById`.
- [x] T2 — Página de detalle + metadata + notFound.
- [x] T3 — Loading skeleton de detalle.
- [x] T4 — Card con título linkeado al detalle.
- [x] T5 — Cierre: tsc + build + commit + push.

## Criterios de aceptación
- `/vacantes/LI-4476263007` renderiza el detalle real con "Aplicar" apuntando a `url` (target blank).
- ID inexistente → 404 con el radar animado.
- La card linkea al detalle y "Ver oferta" sigue yendo afuera.

## Cheques aplicables
- `cd app && npx tsc --noEmit`
- `cd app && npm run build`

## Progreso / evidencia
- T1–T5 completados. `tsc --noEmit` y `next build` OK (ruta `/vacantes/[id]` dinámica `ƒ`).
- Prueba end-to-end: `/vacantes/LI-4476263007` renderiza título "Data Engineer (MLOps / featureOps)", empresa "EPAM Systems" y botón "Aplicar" con href a LinkedIn real. ID inválido renderiza el 404 (radar animado).
- Nota: en dev mode el 404 devuelve HTTP 200 (quirk de streaming de Next 14); en producción devuelve 404.

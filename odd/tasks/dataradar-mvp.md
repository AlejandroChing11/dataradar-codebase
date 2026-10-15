# DataRadar — MVP

## Objetivo
Construir el MVP de DataRadar (dashboard de inteligencia de mercado de vacantes de data, junior–mid, 100% remotas LATAM/España) sobre el scaffold Next.js existente en `app/`, dark-first, responsive y listo para Vercel.

## Problema
El `app/` tiene el scaffold (Next 14 + TS + Tailwind con la paleta radar ya en tokens), el cliente Supabase y los tipos. Falta todo el producto: vistas, componentes, charts, datos y la fuente Geist.

## Por qué
El usuario pidió construir el MVP y subir el primer commit.

## Alcance
- Vistas: Dashboard (home), Vacantes, Empresas, Tendencias.
- Datos: mocks que respetan `lib/types.ts` (tablas de Supabase hoy vacías), con capa de acceso lista para conmutar a Supabase.
- Fuente Geist (Sans + Mono).
- Charts SVG propios (sin Recharts): barras (top stacks), línea (evolución), donut (país/bloque).
- Solo lectura, sin auth, sin pipeline (fase posterior en `data/`).

## Fuera de alcance
Auth, escritura desde front, pipeline de ingesta, notificaciones.

## Restricciones / convenciones
- Dark-first (paleta ya en `globals.css`); light por `prefers-color-scheme` ya resuelto.
- Artefactos (UI copy, código, docs) en español neutro/profesional (producto LATAM), sin voseo/slang en strings.
- Sin atribución de AI en commits; Conventional Commits.
- Mocks deterministas (sin `Math.random`), fechas relativas a "hoy" coherentes.

## Acciones (checklist)

- [x] T1 — Fundación: instalar `geist`, cablear Geist Sans/Mono en `app/app/layout.tsx`, shell de navegación (logo + links) y metadata.
- [x] T2 — Capa de datos: `lib/mock-data.ts` (vacantes ~18, empresas ~9, tecnologías, puente, helper `VacancyWithStack`), `lib/data.ts` (acceso Supabase→mock), `lib/supabase.ts` sin throw al import.
- [x] T3 — Componentes UI: nav, kpi-card, vacancy-card, chips/badges, y charts SVG (bar/line/donut).
- [x] T4 — Vistas: Dashboard, Vacantes (filtros/búsqueda client-side), Empresas, Tendencias.
- [x] T5 — Cierre: responsive, metadata/favicon, `next build` y `tsc` en verde, commit work-unit.

## Criterios de aceptación
- `npm run build` termina OK en `app/` sin errores TS.
- Las 4 vistas renderizan con mocks (sin keys de Supabase).
- Dark-first correcto; navegación entre vistas funciona.
- Tipos de `lib/types.ts` respetados (sin `any` injustificado).

## Cheques aplicables
- `cd app && npm run build` (verificación funcional de cierre).
- `npx tsc --noEmit` (typecheck).

## Estrategia de entrega
- `ask-on-risk`. Pronóstico de líneas autorizadas: < 400 (MVP de ~15 archivos, mayoría nuevos).
- Un solo commit work-unit inicial sobre la rama principal (primer commit del repo).

## Progreso / evidencia
- T1–T5 completados. `npx tsc --noEmit` OK (exit 0) y `npm run build` OK (8 rutas estáticas prerenderizadas, Next 14.2.35).
- Commit work-unit: `0c1cbb9` en `main`, pusheado a `origin` (repo `AlejandroChing11/dataradar-codebase`).
- Revisión nativa (RDD): `gentle-ai review assess` → `unassessable` (runtime OpenCode no elegible para review inmutable; la versión instalada solo soporta `claude-code`/`codex`). RDD sigue `on` (default) — decisión del usuario si desactivar o revisar en runtime soportado.
- Datos reales de Supabase pendientes (tablas `dataradar_schema` vacías); la capa `lib/data.ts` conmuta a mocks hasta que haya filas.

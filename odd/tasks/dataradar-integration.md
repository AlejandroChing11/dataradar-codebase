# DataRadar — Integración Supabase + UX polish

## Objetivo
Dejar Supabase conectado y funcional, sumar página 404 con estética de datos animada, skeletons de carga y pulir el front para integrar bien la BD y las peticiones.

## Problema
La conexión a Supabase no funciona: `lib/supabase.ts` lee `NEXT_PUBLIC_SUPABASE_ANON_KEY` pero el `.env.local` trae la publishable key con otro nombre. Además no hay estados de carga/error ni 404 propia.

## Por qué
El usuario pidió conectar Supabase de verdad y pulir la UX (404, skeletons, manejo de peticiones).

## Alcance
- Conexión: publishable key con fallback de nombres + resolución real del stack (bridge `vacancy_technology` + `technologies`).
- 404 animada (estética radar/datos) + error boundary.
- Skeletons/loading por ruta.
- Pulido general de estados (carga, vacío, error).

## Fuera de alcance
Auth, escritura desde el front, seed de datos (las tablas siguen vacías → mock fallback), pipeline `data/`.

## Restricciones
- Dark-first, español neutro/profesional, sin `any`, sin atribución de AI en commits.
- `.env.local` del usuario NO se toca (es gitignored y contiene la key); el código debe ser robusto a los 3 nombres de variable.
- SDK ya en `@supabase/supabase-js@2.118.0` (soporta publishable keys).

## Acciones

- [x] T1 — Conexión: `lib/supabase.ts` lee publishable key con fallback (`PUBLISHABLE_KEY` → `PUBLISHABLE_DEFAULT_KEY` → `ANON_KEY`); `.env.example` actualizado. `lib/data.ts` resuelve el stack con queries a `vacancies` + `technologies` + `vacancy_technology`.
- [x] T2 — Skeletons: `components/skeleton.tsx` (base + variantes) y `loading.tsx` por ruta (dashboard, vacantes, empresas, tendencias).
- [x] T3 — 404 + animaciones: `components/radar-animation.tsx` (barrido radar reutilizable), `app/app/not-found.tsx`, keyframes en `globals.css`.
- [x] T4 — Error boundary: `app/app/error.tsx` ("use client", retry).
- [x] T5 — Cierre: consistencia, `tsc --noEmit` y `next build` en verde, commit work-unit + push.

## Criterios de aceptación
- `getSupabase()` devuelve cliente cuando `.env.local` tiene publishable key (cualquiera de los 3 nombres).
- `lib/data.ts` arma `VacancyWithStack` real desde las 3 tablas cuando hay datos; mock fallback si vacío.
- 404 y error boundary renderizan con la estética radar + animaciones.
- Loading skeletons visibles por ruta.
- Build y typecheck en verde.

## Cheques aplicables
- `cd app && npx tsc --noEmit`
- `cd app && npm run build`

## Estrategia de entrega
- `ask-on-risk`. Menos de 400 líneas autorizadas. Un commit work-unit + push.

## Progreso / evidencia
- T1–T5 completados. `npx tsc --noEmit` OK y `npm run build` OK (8 rutas estáticas).
- `getSupabase()` ya lee la publishable key con fallback de 3 nombres; `lib/data.ts` resuelve el stack real desde las 3 tablas.
- Verificación real contra Supabase pendiente: las tablas `dataradar_schema` siguen vacías → mock fallback. Falta seed para ver datos reales.

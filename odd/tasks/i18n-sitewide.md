# i18n ES/EN en toda la app

## Header
- Objetivo: hacer que el idioma (ES/EN) y el toggle persistan en TODAS las páginas, no solo la landing.
- Branch: main (cambio de alcance medio; se decide delivery con el usuario)
- Test runner: `npx tsc --noEmit` + `npm run build`

## Specs

- S1 — El toggle ES/EN se muestra en el Nav en TODAS las rutas (hoy solo aparece en `/`).
- S2 — El idioma elegido persiste al navegar entre páginas y entre recargas (cookie `dr-lang` + localStorage `dr-lang`).
- S3 — Todo el texto de UI se traduce: nav, footer, landing, vacantes (filtros y paginación), empresas, tendencias y detalle de vacante.
- S4 — Los datos NO se traducen (títulos de vacante, nombres de empresa, tecnologías y fit_line vienen de la fuente, tal cual el contrato actual de i18n.ts).
- S5 — El `<html lang>` refleja el idioma elegido.

## Tasks

- T1 — Reestructurar `lib/i18n.ts` a un diccionario anidado completo. Route: inline. Status: done.
- T2 — `lib/server-i18n.ts`: `getServerLang()` leyendo cookie vía `next/headers`. Route: inline. Status: done.
- T3 — `providers.tsx`: `LangProvider` escribe cookie `dr-lang` + localStorage. Route: inline. Status: done.
- T4 — `layout.tsx`: lee cookie para `<html lang>` e `initialLang`. Route: inline. Status: done.
- T5 — `lang-toggle.tsx`: `router.refresh()` tras cambiar idioma. Route: inline. Status: done.
- T6 — Traducir componentes client: nav, footer, badge, vacancy-card, pagination, vacancy-explorer, select. Route: inline. Status: done.
- T7 — Traducir páginas server: vacantes, empresas, tendencias, detalle, not-found, error. Route: inline. Status: done.
- T8 — Actualizar landing.tsx al diccionario anidado + fmt por idioma. Route: inline. Status: done.
- T9 — Verificación: tsc + build + smoke test curl. Route: inline. Status: done.

## Log

- L1 (2026-10-27): "listo gracias, revisa por fa por que la traduccion y el boton de pasar a en/es no persiste en toda la pagina, por favot haz que persista en toda la pagina"
- L2 (2026-10-27): Diagnóstico — toggle solo en `/`, DICT solo cubre landing, resto hardcodeado en es, contexto client no legible por páginas server. Solución: cookie `dr-lang` + diccionario completo + getServerLang().
- L3 (2026-10-27): Implementado. Toggle en todo el nav, DICT anidado completo (nav, footer, landing, common, vacancies, companies, trends, detail, pagination, select, misc, years), cookie compartida server/client, layout lee cookie para <html lang>, páginas server traducen vía getServerLang(), componentes client vía useLang(). Verificación: tsc EXIT=0, build EXIT=0, smoke test curl confirma ES (sin cookie) y EN (con cookie dr-lang=en). Rutas pasan a dinámicas (ƒ) por lectura de cookie en layout.

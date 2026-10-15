# DataRadar — MVP Readiness

> Fuente única de verdad para construir el MVP de DataRadar en un solo prompt.
> Pásale este documento completo a tu agente de build (opencode) junto con el repo.

---

## 1. Resumen en una línea
DataRadar es un **dashboard de inteligencia del mercado de vacantes de data** (Data Engineer /
Analytics Engineer, junior–mid, 100% remotas para LATAM y España): lista las vacantes del día y
muestra tendencias de qué tecnologías se piden, dónde y cómo evoluciona la demanda.

---

## 2. Marca

- **Nombre:** DataRadar
- **Tagline:** *"Tu radar de vacantes de data, 100% remotas."*
- **Posicionamiento:** no es otra bolsa de empleo genérica. Es un **radar + capa de analítica**:
  datos filtrados a mano (solo remoto real, junior–mid, sin basura) + inteligencia de mercado
  (stacks más pedidos, países, evolución diaria).
- **Audiencia:** data engineers / analytics engineers junior–mid en LATAM y España buscando
  trabajo remoto. También curiosos del mercado que quieren ver tendencias.
- **Voz y tono:** claro, directo, técnico-amigable. Español (LATAM) por defecto. Nada de
  corporativo vacío; habla como alguien del gremio.
- **Concepto de logo:** un barrido de radar — círculos concéntricos con un punto/blip destacado
  (una vacante detectada). Minimal, geométrico.

---

## 3. Producto — alcance del MVP

### Páginas / vistas
1. **Dashboard (home)** — la cara principal. KPIs + gráficas:
   - Tarjetas KPI: vacantes activas, nuevas hoy, nuevas esta semana, nº de empresas rastreadas.
   - Top tecnologías pedidas (barras).
   - Distribución por país/bloque (Colombia vs resto).
   - Evolución de vacantes en el tiempo (línea).
2. **Vacantes** — listado filtrable/buscable:
   - Filtros: bloque (colombia/rest), tecnología, años (years_min/max), modalidad (work_mode),
     activa/inactiva.
   - Cada vacante como card: título, empresa, ubicación, chips del stack, años, modalidad,
     y botón "Ver oferta" (url). Mostrar `fit_line` como nota.
3. **Empresas** — listado del scout: nombre, hq, tipo/signals, link a careers y LinkedIn,
   si tiene roles DE abiertos.
4. **Tendencias** (opcional si da el tiempo) — vista analítica más profunda: stacks en el tiempo,
   % remoto por país, embudo de descartes (cuántas se filtran y por qué).

### Fuera del MVP (no construir aún)
- Autenticación / cuentas de usuario.
- Escritura desde el front (todo es solo lectura).
- El pipeline de ingesta (vive en `data/`, fase posterior).
- Notificaciones, alertas, suscripciones.

### Principio de diseño
Es un **producto de datos**: se escanea y se opera, no se lee de corrido. Prioriza claridad de
información: el resumen antes que el detalle, estado codificado en color (chips, badges), y que lo
importante se vea de un vistazo.

---

## 4. Paleta de colores

Concepto: **pantalla de radar** — base oscura tipo navy, acento teal/cian del barrido, ámbar para
destacar. Dark-first, con modo claro. Define todo como tokens.

### Tokens (dark — por defecto)
```
--bg:            #0B1220   /* fondo navy profundo */
--surface:       #131C2E   /* tarjetas */
--surface-2:     #1B2740   /* tarjetas elevadas / hover */
--border:        #26324C
--text:          #E8EEF7
--text-muted:    #93A1B8
--primary:       #2DD4BF   /* teal radar (acento principal) */
--primary-strong:#14B8A6
--accent:        #F5A623   /* ámbar (destacados, "nuevo") */
--success:       #34D399
--warning:       #FBBF24
--danger:        #F87171
--info:          #60A5FA
```

### Tokens (light)
```
--bg:            #F7F9FC
--surface:       #FFFFFF
--surface-2:     #EEF2F8
--border:        #DCE3EE
--text:          #0F1B2D
--text-muted:    #5A6B82
--primary:       #14B8A6
--primary-strong:#0D9488
--accent:        #D98A00
/* semánticos iguales */
```

### Tipografía
- **UI / display:** **Geist** (la fuente de Vercel — on-brand para un deploy en Vercel, y no es la
  genérica Inter). Paquete `geist`.
- **Datos / números / código:** **Geist Mono** (para KPIs, años, tablas — números tabulares).

Los tokens base ya están en `app/app/globals.css` y mapeados en `app/tailwind.config.ts`.
Geist hay que cablearlo (ver nota de build abajo).

---

## 5. Datos — de dónde salen

Supabase, schema **`dataradar_schema`** (ya creado). Cliente en `app/lib/supabase.ts`
(apunta a ese schema; recuerda exponerlo en Settings → API → Exposed schemas).

Tablas que consume el front (todas con lectura pública vía RLS):

| Tabla | Para qué la usa el front |
|---|---|
| `vacancies` | el listado y las cards de vacantes |
| `companies` | la vista de empresas (scout) |
| `technologies` | catálogo de tecnologías (filtros, nombres) |
| `vacancy_technology` | el puente vacante↔tecnología (chips del stack, "top stacks") |

Tablas internas (NO las toca el front): `ingestions`, `technology_aliases`, `discards`
(solo service role; alimentan la analítica avanzada más adelante).

Los tipos TypeScript de estas tablas están en `app/lib/types.ts`.

> Nota: hoy las tablas están **vacías**. Para desarrollar el MVP con datos, pide el **seed de
> data ficticia** (se carga por el service role) o usa datos mock temporales.

---

## 6. Stack técnico
- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**.
- **@supabase/supabase-js** para leer los datos.
- Gráficas: usa una librería ligera (Recharts o similar) o SVG propio.
- Deploy: **Vercel** (Root Directory = `app`).

### Nota de build (Geist)
Para cablear la fuente: `npm i geist` y en `app/app/layout.tsx`:
```ts
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
// <html className={`${GeistSans.variable} ${GeistMono.variable}`}>
```

---

## 7. Prompt de arranque sugerido
Para construir el MVP de una, pasa este documento + el repo y di algo como:

> "Construye el MVP de DataRadar según `MVP_READINESS.md`. Usa el `app/` Next ya scaffoldeado,
> Tailwind con los tokens de la paleta ya definidos en `globals.css`, y el cliente de Supabase de
> `lib/supabase.ts`. Implementa las vistas Dashboard, Vacantes y Empresas con datos de
> `dataradar_schema`. Cablea la fuente Geist. Mientras no haya datos reales, usa mocks que
> respeten los tipos de `lib/types.ts`. Dark-first, responsive, listo para Vercel."

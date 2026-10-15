# DataRadar

**El radar diario del mercado de vacantes de data, 100% remotas para LATAM y España.**

DataRadar toma el output diario de un radar de vacantes (Data Engineer / Analytics Engineer,
junior–mid, 100% remotas) y lo convierte en una plataforma con dashboard de inteligencia de
mercado: qué se pide, dónde, con qué stack y cómo evoluciona en el tiempo.

Este repo es un **monorepo** con dos mitades:

```
dataradar/
├── app/      → el producto (Next.js) → se despliega en Vercel
└── data/     → la ingeniería de datos (dbt, Airflow, ingesta) → el pipeline
```

- **`app/`** es un Next.js (App Router) puro, pensado para Vercel. Lee de Supabase (schema
  `dataradar_schema`) en modo solo lectura.
- **`data/`** es donde vivirá el pipeline de datos (se construye en una fase posterior): ingesta
  desde S3/APIs, modelos dbt (staging → marts) y orquestación con Airflow.

## Arranque rápido (app)

```bash
cd app
cp .env.example .env.local      # completa tus llaves de Supabase
npm install
npm run dev                     # http://localhost:3000
```

### Importante — exponer el schema en Supabase
El cliente apunta al schema `dataradar_schema` (no `public`). Para que la API lo sirva, agrégalo
en Supabase: **Settings → API → Exposed schemas** → añade `dataradar_schema` → Save.

## Deploy
- **Vercel** apuntando a la carpeta `app/` (Root Directory = `app`). Variables de entorno:
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Base de datos
El esquema vive en Supabase, schema `dataradar_schema`. Ver `data/README.md` y
`MVP_READINESS.md` para el detalle de tablas y del pipeline.

## Para construir el MVP
Lee **`MVP_READINESS.md`** — ahí está la marca, el producto, el alcance del MVP y la paleta,
listo para pasárselo a un agente y construir todo de una.

# DataRadar — data/ (ingeniería de datos)

Esta carpeta es la mitad de **data engineering** del monorepo. Se construye en una fase
posterior (no es parte del MVP del producto). Aquí vivirá el pipeline que convierte los JSON
diarios del radar en analítica confiable.

```
data/
├── ingestion/   → scripts que leen los JSON (shortlist + scout), los aterrizan en S3
│                  y/o los cargan a la tabla raw (ingestions) en Supabase/Snowflake.
├── dbt/         → proyecto dbt: staging -> marts sobre las vacantes.
│                  (ej. stg_vacancies, fct_vacancies, dim_technology, agregados de tendencias)
└── airflow/     → DAG de orquestación: ingesta diaria + build + tests + reporte de salud.
```

## Flujo objetivo (cuando se construya)
```
JSON diario (radar + scout)
   -> S3 (landing, capa lake)        [ingestion/]
   -> raw (ingestions.raw_payload)   [COPY INTO / carga]
   -> staging (parse: viejo y nuevo formato, normaliza stack vía technology_aliases) [dbt]
   -> marts (fct_vacancies, dim_technology, tendencias)                               [dbt]
   -> orquestado a diario                                                             [airflow]
```

## Fuente
Las tablas `ingestions`, `technology_aliases` y `discards` de `dataradar_schema` son de uso
interno del pipeline (solo service role). El front nunca las toca.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Devuelve un cliente de Supabase apuntando al schema del producto (dataradar_schema),
// o null si no están configuradas las variables de entorno. De esta forma el módulo
// nunca lanza al importarse y la capa de datos puede conmutar a los mocks.
//
// IMPORTANTE: ese schema debe estar expuesto en Supabase
// (Settings -> API -> Exposed schemas -> dataradar_schema).
export function getSupabase() {
  // Orden de fallback de la clave: publishable > publishable default > anon.
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key, {
    db: { schema: "dataradar_schema" },
  });
}

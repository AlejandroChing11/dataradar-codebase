import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Devuelve un cliente de Supabase apuntando al schema del producto (dataradar_schema),
// o null si no están configuradas las variables de entorno. De esta forma el módulo
// nunca lanza al importarse y la capa de datos puede conmutar a los mocks.
//
// IMPORTANTE: ese schema debe estar expuesto en Supabase
// (Settings -> API -> Exposed schemas -> dataradar_schema).
export function getSupabase() {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    db: { schema: "dataradar_schema" },
  });
}

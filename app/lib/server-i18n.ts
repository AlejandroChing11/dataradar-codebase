// Resolución del idioma en el SERVIDOR. Lee la cookie `dr-lang` para que
// las páginas server components puedan renderizar en el idioma correcto.
import "server-only";
import { cookies } from "next/headers";
import type { Lang } from "./i18n";

export const LANG_COOKIE = "dr-lang";

export async function getServerLang(): Promise<Lang> {
  try {
    const store = await cookies();
    const value = store.get(LANG_COOKIE)?.value;
    return value === "en" ? "en" : "es";
  } catch {
    // Fuera de un request (p. ej. build), default es.
    return "es";
  }
}

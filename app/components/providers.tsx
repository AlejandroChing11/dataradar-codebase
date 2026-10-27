"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "@/lib/i18n";

/* ===================== Tema (claro / oscuro) ===================== */

type Theme = "light" | "dark";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx | null>(null);

export function useTheme(): ThemeCtx {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <Providers>");
  return ctx;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  // SSR por defecto = oscuro (coincide con el :root base de globals.css).
  const [theme, setTheme] = useState<Theme>("dark");

  // Al montar, resolvemos el tema real: preferencia guardada o la del sistema.
  useEffect(() => {
    let resolved: Theme = "dark";
    try {
      const saved = localStorage.getItem("dr-theme");
      if (saved === "light" || saved === "dark") {
        resolved = saved;
      } else if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: light)").matches
      ) {
        resolved = "light";
      }
    } catch {
      /* localStorage bloqueado: nos quedamos con el default */
    }
    setTheme(resolved);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("dr-theme", next);
      } catch {
        /* no-op */
      }
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ===================== Idioma (toda la UI) ===================== */

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangCtx | null>(null);

export function useLang(): LangCtx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang debe usarse dentro de <Providers>");
  return ctx;
}

// Cookie compartida con el servidor (lib/server-i18n.ts).
const LANG_COOKIE = "dr-lang";

function persistLang(l: Lang) {
  try {
    localStorage.setItem("dr-lang", l);
    // Sin SameSite/expiración explícita: cookie de sesión, legible en server.
    document.cookie = `${LANG_COOKIE}=${l}; path=/`;
  } catch {
    /* no-op */
  }
  document.documentElement.lang = l;
}

function LangProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // Sincroniza desde el server: si la cookie cambió sin pasar por el toggle
  // (p. ej. navegación con back/forward), actualizamos el estado y el <html>.
  useEffect(() => {
    setLangState(initialLang);
    document.documentElement.lang = initialLang;
  }, [initialLang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    persistLang(l);
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

/* ===================== Wrapper ===================== */

export function Providers({
  children,
  initialLang = "es",
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  return (
    <ThemeProvider>
      <LangProvider initialLang={initialLang}>{children}</LangProvider>
    </ThemeProvider>
  );
}

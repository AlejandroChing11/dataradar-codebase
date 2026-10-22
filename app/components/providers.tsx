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

/* ===================== Idioma (solo landing) ===================== */

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

function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dr-lang");
      if (saved === "es" || saved === "en") setLangState(saved);
    } catch {
      /* no-op */
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("dr-lang", l);
    } catch {
      /* no-op */
    }
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

/* ===================== Wrapper ===================== */

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LangProvider>{children}</LangProvider>
    </ThemeProvider>
  );
}

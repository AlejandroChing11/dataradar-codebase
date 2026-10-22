"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/theme-toggle";
import LangToggle from "@/components/lang-toggle";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/vacantes", label: "Vacantes" },
  { href: "/empresas", label: "Empresas" },
  { href: "/tendencias", label: "Tendencias" },
];

function RadarMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13" stroke="var(--border)" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="8.5" stroke="var(--border)" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="4" stroke="var(--border)" strokeWidth="1.5" />
      <line x1="16" y1="16" x2="16" y2="3" stroke="var(--primary)" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="1.75" fill="var(--text)" />
      <circle cx="24.5" cy="9.5" r="2.25" fill="var(--primary)" />
    </svg>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Cierre por tecla Escape.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Cierre al cambiar de ruta (por ejemplo, navegación con atrás/adelante).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <RadarMark />
          <span className="font-mono text-lg font-semibold tracking-tight">DataRadar</span>
        </Link>

        <div className="flex items-center gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive(pathname, l.href)
                      ? "bg-surface-2 text-text"
                      : "text-text-muted hover:bg-surface hover:text-text"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Controles: idioma (solo en la landing) + tema (siempre) */}
          {pathname === "/" && <LangToggle />}
          <ThemeToggle />

          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative h-10 w-10 rounded-md text-text md:hidden"
          >
          <span className="pointer-events-none absolute left-1/2 top-1/2 h-5 w-6 -translate-x-1/2 -translate-y-1/2">
            <span
              className={`absolute left-0 top-[5px] h-[2px] w-6 rounded bg-current transition-transform duration-200 ${
                open ? "translate-y-1 rotate-45" : "translate-y-0 rotate-0"
              }`}
            />
            <span
              className={`absolute left-0 top-[9px] h-[2px] w-6 rounded bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[13px] h-[2px] w-6 rounded bg-current transition-transform duration-200 ${
                open ? "-translate-y-1 -rotate-45" : "translate-y-0 rotate-0"
              }`}
            />
          </span>
          </button>
        </div>
      </nav>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-full z-40 border-b border-border bg-surface md:hidden animate-[dr-menu-in_0.18s_ease-out]"
          >
            <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
              {LINKS.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-2 py-3 text-sm transition-colors ${
                        active
                          ? "bg-surface-2 text-text"
                          : "text-text-muted hover:bg-surface hover:text-text"
                      }`}
                    >
                      <span
                        className={`h-6 w-[3px] shrink-0 rounded-full ${
                          active ? "bg-primary" : "bg-transparent"
                        }`}
                      />
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-border">
              <p className="mx-auto max-w-6xl px-6 py-3 text-xs text-text-muted sm:px-8">
                Tu radar de vacantes de data, 100% remotas.
              </p>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Dashboard" },
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

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <RadarMark />
          <span className="font-mono text-lg font-semibold tracking-tight">DataRadar</span>
        </Link>

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

        <button
          type="button"
          className="rounded-md border border-border p-2 text-text-muted md:hidden"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-border md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-2.5 text-sm ${
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
        </div>
      )}
    </header>
  );
}

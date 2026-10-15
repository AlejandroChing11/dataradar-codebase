"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Technology, VacancyWithStack } from "@/lib/types";
import type { VacancyFilters } from "@/lib/data";
import VacancyCard from "./vacancy-card";
import { WORK_MODE_META } from "./badge";
import Select, { type SelectOption } from "./select";
import Pagination from "./pagination";

const YEAR_OPTIONS = ["all", "0", "1", "2", "3", "4", "5"];

const BLOCK_OPTIONS: SelectOption[] = [
  { value: "all", label: "Todos" },
  { value: "colombia", label: "Colombia" },
  { value: "rest", label: "Resto" },
];

const MIN_YEAR_OPTIONS: SelectOption[] = YEAR_OPTIONS.map((y) => ({
  value: y,
  label: y === "all" ? "Todos" : `${y}+`,
}));

const MAX_YEAR_OPTIONS: SelectOption[] = YEAR_OPTIONS.map((y) => ({
  value: y,
  label: y === "all" ? "Todos" : `≤ ${y}`,
}));

const STATUS_OPTIONS: SelectOption[] = [
  { value: "all", label: "Todas" },
  { value: "active", label: "Activas" },
  { value: "inactive", label: "Inactivas" },
];

const MODE_OPTIONS: SelectOption[] = [
  { value: "all", label: "Todas" },
  ...Object.entries(WORK_MODE_META).map(([value, meta]) => ({
    value,
    label: meta.label,
  })),
];

const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: "all", label: "Todas" },
  { value: "ingles", label: "Requiere inglés" },
  { value: "no_ingles", label: "Sin inglés" },
];

const PORTAL_OPTIONS: SelectOption[] = [
  { value: "all", label: "Todos" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "teamtailor", label: "Teamtailor" },
  { value: "tecnoempleo", label: "Tecnoempleo" },
];

export default function VacancyExplorer({
  vacancies,
  technologies,
  total,
  page,
  perPage,
  totalPages,
  filters,
}: {
  vacancies: VacancyWithStack[];
  technologies: Technology[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  filters: VacancyFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const techOptions = useMemo<SelectOption[]>(
    () => [
      { value: "all", label: "Todas" },
      ...[...technologies]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((t) => ({ value: t.name, label: t.name })),
    ],
    [technologies],
  );

  // Aplica un patch sobre los searchParams actuales. `null` borra la key.
  function updateParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // Draft local de la búsqueda (responsive al tipear) sincronizado con filters.query.
  const [query, setQuery] = useState(filters.query ?? "");

  useEffect(() => {
    setQuery(filters.query ?? "");
  }, [filters.query]);

  // Debounce de 300ms: empuja el término a la URL al dejar de escribir.
  useEffect(() => {
    const term = query.trim();
    if (term === (filters.query ?? "").trim()) return;
    const handler = setTimeout(() => {
      updateParams({ q: term || null, page: null });
    }, 300);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters.query]);

  // Al cambiar de página, volvemos arriba (salvo el primer render).
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-3 lg:grid-cols-4">
        <label className="col-span-2 flex flex-col gap-1 text-xs text-text-muted sm:col-span-3 lg:col-span-2">
          Buscar
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Título o empresa"
            className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text outline-none placeholder:text-text-muted focus:border-primary"
          />
        </label>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>Bloque</span>
          <Select
            value={filters.block ?? "all"}
            onChange={(v) => updateParams({ block: v === "all" ? null : v, page: null })}
            options={BLOCK_OPTIONS}
            ariaLabel="Filtrar por bloque"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>Tecnología</span>
          <Select
            value={filters.tech ?? "all"}
            onChange={(v) => updateParams({ tech: v === "all" ? null : v, page: null })}
            options={techOptions}
            ariaLabel="Filtrar por tecnología"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>Años mín.</span>
          <Select
            value={filters.minYears !== undefined ? String(filters.minYears) : "all"}
            onChange={(v) => updateParams({ min: v === "all" ? null : v, page: null })}
            options={MIN_YEAR_OPTIONS}
            ariaLabel="Filtrar por años mínimos"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>Años máx.</span>
          <Select
            value={filters.maxYears !== undefined ? String(filters.maxYears) : "all"}
            onChange={(v) => updateParams({ max: v === "all" ? null : v, page: null })}
            options={MAX_YEAR_OPTIONS}
            ariaLabel="Filtrar por años máximos"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>Modalidad</span>
          <Select
            value={filters.mode ?? "all"}
            onChange={(v) => updateParams({ mode: v === "all" ? null : v, page: null })}
            options={MODE_OPTIONS}
            ariaLabel="Filtrar por modalidad"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>Estado</span>
          <Select
            value={filters.status ?? "all"}
            onChange={(v) => updateParams({ status: v === "all" ? null : v, page: null })}
            options={STATUS_OPTIONS}
            ariaLabel="Filtrar por estado"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>Idioma</span>
          <Select
            value={filters.language ?? "all"}
            onChange={(v) => updateParams({ lang: v === "all" ? null : v, page: null })}
            options={LANGUAGE_OPTIONS}
            ariaLabel="Filtrar por idioma"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>Portal</span>
          <Select
            value={filters.portal ?? "all"}
            onChange={(v) => updateParams({ portal: v === "all" ? null : v, page: null })}
            options={PORTAL_OPTIONS}
            ariaLabel="Filtrar por portal"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-text-muted">
        <p>
          {total} resultado{total === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={() => router.replace(pathname)}
          className="text-sm text-primary hover:text-primary-strong"
        >
          Limpiar filtros
        </button>
      </div>

      {total === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center text-text-muted">
          No hay vacantes que coincidan con los filtros seleccionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {vacancies.map((v) => (
            <VacancyCard key={v.id} vacancy={v} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        perPage={perPage}
      />
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Technology, VacancyWithStack } from "@/lib/types";
import type { VacancyFilters } from "@/lib/data";
import VacancyCard from "./vacancy-card";
import Select, { type SelectOption } from "./select";
import Pagination from "./pagination";
import { useLang } from "@/components/providers";
import { DICT } from "@/lib/i18n";

const YEAR_OPTIONS = ["all", "0", "1", "2", "3", "4", "5"];

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
  const { lang } = useLang();
  const t = DICT[lang].vacancies;
  const common = DICT[lang].common;

  const blockOptions = useMemo<SelectOption[]>(
    () => [
      { value: "all", label: t.all },
      { value: "colombia", label: common.colombia },
      { value: "rest", label: common.rest },
    ],
    [t.all, common.colombia, common.rest],
  );

  const minYearOptions = useMemo<SelectOption[]>(
    () =>
      YEAR_OPTIONS.map((y) => ({
        value: y,
        label: y === "all" ? t.all : `${y}+`,
      })),
    [t.all],
  );

  const maxYearOptions = useMemo<SelectOption[]>(
    () =>
      YEAR_OPTIONS.map((y) => ({
        value: y,
        label: y === "all" ? t.all : `≤ ${y}`,
      })),
    [t.all],
  );

  const statusOptions = useMemo<SelectOption[]>(
    () => [
      { value: "all", label: t.allF },
      { value: "active", label: t.active },
      { value: "inactive", label: t.inactive },
    ],
    [t.allF, t.active, t.inactive],
  );

  const modeOptions = useMemo<SelectOption[]>(
    () => [
      { value: "all", label: t.allF },
      ...(Object.keys(common.workModes) as (keyof typeof common.workModes)[]).map(
        (value) => ({ value, label: common.workModes[value] }),
      ),
    ],
    [t.allF, common.workModes],
  );

  const languageOptions = useMemo<SelectOption[]>(
    () => [
      { value: "all", label: t.allF },
      { value: "ingles", label: t.requiresEnglish },
      { value: "no_ingles", label: t.noEnglish },
    ],
    [t.allF, t.requiresEnglish, t.noEnglish],
  );

  const portalOptions = useMemo<SelectOption[]>(
    () => [
      { value: "all", label: t.all },
      { value: "linkedin", label: "LinkedIn" },
      { value: "teamtailor", label: "Teamtailor" },
      { value: "tecnoempleo", label: "Tecnoempleo" },
    ],
    [t.all],
  );

  const techOptions = useMemo<SelectOption[]>(
    () => [
      { value: "all", label: t.allF },
      ...[...technologies]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((t) => ({ value: t.name, label: t.name })),
    ],
    [technologies, t.allF],
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
          {t.search}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text outline-none placeholder:text-text-muted focus:border-primary"
          />
        </label>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>{t.block}</span>
          <Select
            value={filters.block ?? "all"}
            onChange={(v) => updateParams({ block: v === "all" ? null : v, page: null })}
            options={blockOptions}
            ariaLabel="Filtrar por bloque"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>{t.technology}</span>
          <Select
            value={filters.tech ?? "all"}
            onChange={(v) => updateParams({ tech: v === "all" ? null : v, page: null })}
            options={techOptions}
            ariaLabel="Filtrar por tecnología"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>{t.minYears}</span>
          <Select
            value={filters.minYears !== undefined ? String(filters.minYears) : "all"}
            onChange={(v) => updateParams({ min: v === "all" ? null : v, page: null })}
            options={minYearOptions}
            ariaLabel="Filtrar por años mínimos"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>{t.maxYears}</span>
          <Select
            value={filters.maxYears !== undefined ? String(filters.maxYears) : "all"}
            onChange={(v) => updateParams({ max: v === "all" ? null : v, page: null })}
            options={maxYearOptions}
            ariaLabel="Filtrar por años máximos"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>{t.mode}</span>
          <Select
            value={filters.mode ?? "all"}
            onChange={(v) => updateParams({ mode: v === "all" ? null : v, page: null })}
            options={modeOptions}
            ariaLabel="Filtrar por modalidad"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>{t.status}</span>
          <Select
            value={filters.status ?? "all"}
            onChange={(v) => updateParams({ status: v === "all" ? null : v, page: null })}
            options={statusOptions}
            ariaLabel="Filtrar por estado"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>{t.language}</span>
          <Select
            value={filters.language ?? "all"}
            onChange={(v) => updateParams({ lang: v === "all" ? null : v, page: null })}
            options={languageOptions}
            ariaLabel="Filtrar por idioma"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>{t.portal}</span>
          <Select
            value={filters.portal ?? "all"}
            onChange={(v) => updateParams({ portal: v === "all" ? null : v, page: null })}
            options={portalOptions}
            ariaLabel="Filtrar por portal"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-text-muted">
        <p>{t.results(total)}</p>
        <button
          type="button"
          onClick={() => router.replace(pathname)}
          className="text-sm text-primary hover:text-primary-strong"
        >
          {t.clearFilters}
        </button>
      </div>

      {total === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center text-text-muted">
          {t.noResults}
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

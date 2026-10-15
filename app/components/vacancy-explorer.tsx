"use client";

import { useMemo, useState } from "react";
import type { Technology, VacancyWithStack } from "@/lib/types";
import VacancyCard from "./vacancy-card";
import { WORK_MODE_META } from "./badge";
import Select, { type SelectOption } from "./select";

type BlockFilter = "all" | "colombia" | "rest";
type StatusFilter = "all" | "active" | "inactive";

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

export default function VacancyExplorer({
  vacancies,
  technologies,
}: {
  vacancies: VacancyWithStack[];
  technologies: Technology[];
}) {
  const [query, setQuery] = useState("");
  const [block, setBlock] = useState<BlockFilter>("all");
  const [tech, setTech] = useState("all");
  const [minYears, setMinYears] = useState("all");
  const [maxYears, setMaxYears] = useState("all");
  const [mode, setMode] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const techOptions = useMemo<SelectOption[]>(
    () => [
      { value: "all", label: "Todas" },
      ...[...technologies]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((t) => ({ value: t.name, label: t.name })),
    ],
    [technologies],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vacancies.filter((v) => {
      if (q) {
        const hay = `${v.title} ${v.company_name ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (block !== "all" && v.block !== block) return false;
      if (tech !== "all" && !v.technologies.some((t) => t.name === tech)) return false;
      if (minYears !== "all" && (v.years_min ?? 0) < Number(minYears)) return false;
      if (maxYears !== "all" && v.years_max !== null && v.years_max > Number(maxYears)) {
        return false;
      }
      if (mode !== "all" && v.work_mode !== mode) return false;
      if (status === "active" && !v.is_active) return false;
      if (status === "inactive" && v.is_active) return false;
      return true;
    });
  }, [vacancies, query, block, tech, minYears, maxYears, mode, status]);

  function resetFilters() {
    setQuery("");
    setBlock("all");
    setTech("all");
    setMinYears("all");
    setMaxYears("all");
    setMode("all");
    setStatus("all");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-3 lg:grid-cols-6">
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
            value={block}
            onChange={(v) => setBlock(v as BlockFilter)}
            options={BLOCK_OPTIONS}
            ariaLabel="Filtrar por bloque"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>Tecnología</span>
          <Select
            value={tech}
            onChange={setTech}
            options={techOptions}
            ariaLabel="Filtrar por tecnología"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>Años mín.</span>
          <Select
            value={minYears}
            onChange={setMinYears}
            options={MIN_YEAR_OPTIONS}
            ariaLabel="Filtrar por años mínimos"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>Años máx.</span>
          <Select
            value={maxYears}
            onChange={setMaxYears}
            options={MAX_YEAR_OPTIONS}
            ariaLabel="Filtrar por años máximos"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>Modalidad</span>
          <Select
            value={mode}
            onChange={setMode}
            options={MODE_OPTIONS}
            ariaLabel="Filtrar por modalidad"
          />
        </div>

        <div className="flex flex-col gap-1 text-xs text-text-muted">
          <span>Estado</span>
          <Select
            value={status}
            onChange={(v) => setStatus(v as StatusFilter)}
            options={STATUS_OPTIONS}
            ariaLabel="Filtrar por estado"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-text-muted">
        <p>
          {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={resetFilters}
          className="text-sm text-primary hover:text-primary-strong"
        >
          Limpiar filtros
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center text-text-muted">
          No hay vacantes que coincidan con los filtros seleccionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((v) => (
            <VacancyCard key={v.id} vacancy={v} />
          ))}
        </div>
      )}
    </div>
  );
}

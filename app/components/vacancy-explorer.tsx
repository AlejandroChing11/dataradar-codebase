"use client";

import { useMemo, useState } from "react";
import type { Technology, VacancyWithStack } from "@/lib/types";
import VacancyCard from "./vacancy-card";
import { WORK_MODE_META } from "./badge";

type BlockFilter = "all" | "colombia" | "rest";
type StatusFilter = "all" | "active" | "inactive";

const YEAR_OPTIONS = ["all", "0", "1", "2", "3", "4", "5"];

const SELECT_CLASS =
  "rounded-md border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-primary";

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

        <label className="flex flex-col gap-1 text-xs text-text-muted">
          Bloque
          <select
            value={block}
            onChange={(e) => setBlock(e.target.value as BlockFilter)}
            className={SELECT_CLASS}
          >
            <option value="all">Todos</option>
            <option value="colombia">Colombia</option>
            <option value="rest">Resto</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-text-muted">
          Tecnología
          <select value={tech} onChange={(e) => setTech(e.target.value)} className={SELECT_CLASS}>
            <option value="all">Todas</option>
            {[...technologies]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-text-muted">
          Años mín.
          <select
            value={minYears}
            onChange={(e) => setMinYears(e.target.value)}
            className={SELECT_CLASS}
          >
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y === "all" ? "Todos" : `${y}+`}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-text-muted">
          Años máx.
          <select
            value={maxYears}
            onChange={(e) => setMaxYears(e.target.value)}
            className={SELECT_CLASS}
          >
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y === "all" ? "Todos" : `≤ ${y}`}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-text-muted">
          Modalidad
          <select value={mode} onChange={(e) => setMode(e.target.value)} className={SELECT_CLASS}>
            <option value="all">Todas</option>
            {Object.entries(WORK_MODE_META).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-text-muted">
          Estado
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className={SELECT_CLASS}
          >
            <option value="all">Todas</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
        </label>
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

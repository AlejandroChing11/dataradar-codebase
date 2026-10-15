import type { Block, Company, VacancyWithStack, WorkMode } from "./types";
import { daysAgo, isWithinLastDays, today } from "./dates";

// Funciones puras de analítica sobre los datos ya resueltos (mocks o Supabase).
// Los tipos de retorno son explícitos para que la capa de datos y las vistas
// no dependan de la implementación.

export interface TechCount {
  name: string;
  count: number;
}

export interface BlockCount {
  block: Block;
  count: number;
}

export interface TimelinePoint {
  date: string;
  value: number;
}

export interface WorkModeCount {
  mode: WorkMode;
  count: number;
}

export interface DiscardReason {
  label: string;
  value: number;
}

export function activeVacancies(vacancies: VacancyWithStack[]): number {
  return vacancies.filter((v) => v.is_active).length;
}

export function newToday(vacancies: VacancyWithStack[]): number {
  const t = today();
  return vacancies.filter((v) => v.first_seen === t).length;
}

export function newThisWeek(vacancies: VacancyWithStack[]): number {
  return vacancies.filter((v) => isWithinLastDays(v.first_seen, 6)).length;
}

export function companiesTracked(companies: Company[]): number {
  return companies.length;
}

export function topTechnologies(
  vacancies: VacancyWithStack[],
  limit = 8
): TechCount[] {
  const counts = new Map<string, number>();
  for (const v of vacancies) {
    for (const t of v.technologies) {
      counts.set(t.name, (counts.get(t.name) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function byBlock(vacancies: VacancyWithStack[]): BlockCount[] {
  const result: BlockCount[] = [
    { block: "colombia", count: 0 },
    { block: "rest", count: 0 },
  ];
  for (const v of vacancies) {
    if (v.block === "colombia") result[0].count += 1;
    else if (v.block === "rest") result[1].count += 1;
  }
  return result;
}

// Conteo de `first_seen` agrupado por día en los últimos 30 días, con ceros en días sin data.
export function timeline(vacancies: VacancyWithStack[]): TimelinePoint[] {
  const counts = new Map<string, number>();
  for (const v of vacancies) {
    counts.set(v.first_seen, (counts.get(v.first_seen) ?? 0) + 1);
  }
  const points: TimelinePoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = daysAgo(i);
    points.push({ date: d, value: counts.get(d) ?? 0 });
  }
  return points;
}

export function byWorkMode(vacancies: VacancyWithStack[]): WorkModeCount[] {
  const order: WorkMode[] = ["remote_full", "remote_country", "hybrid", "onsite"];
  const counts = new Map<WorkMode, number>();
  for (const v of vacancies) {
    if (v.work_mode) counts.set(v.work_mode, (counts.get(v.work_mode) ?? 0) + 1);
  }
  return order.map((mode) => ({ mode, count: counts.get(mode) ?? 0 }));
}

export function avgYearsMin(vacancies: VacancyWithStack[]): number {
  const withMin = vacancies.filter((v) => v.years_min !== null);
  if (withMin.length === 0) return 0;
  const sum = withMin.reduce((acc, v) => acc + (v.years_min ?? 0), 0);
  return sum / withMin.length;
}

export function repostRate(vacancies: VacancyWithStack[]): number {
  if (vacancies.length === 0) return 0;
  const reposts = vacancies.filter((v) => v.is_repost).length;
  return reposts / vacancies.length;
}

export function remoteRateByBlock(
  vacancies: VacancyWithStack[]
): { block: Block; pct: number }[] {
  return (["colombia", "rest"] as Block[]).map((block) => {
    const inBlock = vacancies.filter((v) => v.block === block);
    const remote = inBlock.filter((v) => v.work_mode === "remote_full").length;
    const pct = inBlock.length === 0 ? 0 : Math.round((remote / inBlock.length) * 100);
    return { block, pct };
  });
}

export function avgYearsMinByBlock(
  vacancies: VacancyWithStack[]
): { block: Block; value: number }[] {
  return (["colombia", "rest"] as Block[]).map((block) => {
    const inBlock = vacancies.filter((v) => v.block === block && v.years_min !== null);
    if (inBlock.length === 0) return { block, value: 0 };
    const sum = inBlock.reduce((acc, v) => acc + (v.years_min ?? 0), 0);
    return { block, value: sum / inBlock.length };
  });
}

// Aproximación razonable y derivada del embudo de descartes para la vista de Tendencias.
export function discardReasonBreakdown(
  vacancies: VacancyWithStack[]
): DiscardReason[] {
  const inactive = vacancies.filter((v) => !v.is_active).length;
  const reposts = vacancies.filter((v) => v.is_repost).length;
  const notFullyRemote = vacancies.filter(
    (v) => v.work_mode === "onsite" || v.work_mode === "hybrid"
  ).length;
  const englishAdvanced = vacancies.filter((v) =>
    (v.language_req ?? "").toLowerCase().includes("avanzado")
  ).length;
  return [
    { label: "Cerradas o vencidas", value: inactive },
    { label: "Duplicadas (repost)", value: reposts },
    { label: "No 100% remotas", value: notFullyRemote },
    { label: "Inglés avanzado exigido", value: englishAdvanced },
  ];
}

import type {
  Company,
  Technology,
  Vacancy,
  VacancyTechnology,
  VacancyWithStack,
} from "./types";
import { getSupabase } from "./supabase";
import {
  getMockVacanciesWithStack,
  mockCompanies,
  mockTechnologies,
} from "./mock-data";
import {
  activeVacancies,
  byBlock,
  companiesTracked,
  newThisWeek,
  newToday,
  timeline,
  topTechnologies,
  type BlockCount,
  type TechCount,
  type TimelinePoint,
} from "./analytics";

// La capa de datos intenta Supabase primero y cae de vuelta a los mocks
// cuando el cliente no está configurado, la query falla o no hay filas.
// Por ahora las tablas están vacías, así que siempre se devuelven mocks.

async function tryVacancies(): Promise<VacancyWithStack[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data: vacancies, error: vacanciesError } = await supabase
      .from("vacancies")
      .select("*");
    if (vacanciesError || !vacancies || vacancies.length === 0) return null;

    // Resolución del stack. Es best-effort: si technologies o el bridge fallan
    // pero las vacantes vinieron con datos, la conexión ya es real y devolvemos
    // vacantes con stack vacío en lugar de caer a los mocks.
    let techNames = new Map<number, string>();
    let stacks = new Map<string, { name: string; is_required: boolean }[]>();

    try {
      const [techRes, bridgeRes] = await Promise.all([
        supabase.from("technologies").select("*"),
        supabase.from("vacancy_technology").select("*"),
      ]);

      if (!techRes.error && techRes.data) {
        techNames = new Map<number, string>(
          (techRes.data as Technology[]).map((t): [number, string] => [t.id, t.name])
        );
      }

      if (!bridgeRes.error && bridgeRes.data) {
        for (const vt of bridgeRes.data as VacancyTechnology[]) {
          const name = techNames.get(vt.technology_id);
          if (!name) continue;
          const entry = { name, is_required: vt.is_required };
          const existing = stacks.get(vt.vacancy_id);
          if (existing) {
            existing.push(entry);
          } else {
            stacks.set(vt.vacancy_id, [entry]);
          }
        }
      }
    } catch {
      // El stack es opcional: continuamos con las vacantes sin tecnologías.
    }

    return (vacancies as Vacancy[]).map((v) => ({
      ...v,
      technologies: stacks.get(v.id) ?? [],
    }));
  } catch {
    return null;
  }
}

async function tryCompanies(): Promise<Company[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from("companies").select("*");
    if (error || !data || data.length === 0) return null;
    return data as Company[];
  } catch {
    return null;
  }
}

async function tryTechnologies(): Promise<Technology[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from("technologies").select("*");
    if (error || !data || data.length === 0) return null;
    return data as Technology[];
  } catch {
    return null;
  }
}

export async function getVacancies(): Promise<VacancyWithStack[]> {
  const fromSupabase = await tryVacancies();
  if (fromSupabase) return fromSupabase;
  return getMockVacanciesWithStack();
}

export async function getCompanies(): Promise<Company[]> {
  const fromSupabase = await tryCompanies();
  if (fromSupabase) return fromSupabase;
  return mockCompanies;
}

export async function getTechnologies(): Promise<Technology[]> {
  const fromSupabase = await tryTechnologies();
  if (fromSupabase) return fromSupabase;
  return mockTechnologies;
}

export interface DashboardStats {
  activeVacancies: number;
  newToday: number;
  newThisWeek: number;
  companiesTracked: number;
  topTechnologies: TechCount[];
  byBlock: BlockCount[];
  timeline: TimelinePoint[];
}

export async function getDashboardData(): Promise<{
  vacancies: VacancyWithStack[];
  companies: Company[];
  stats: DashboardStats;
}> {
  const [vacancies, companies] = await Promise.all([getVacancies(), getCompanies()]);
  const stats: DashboardStats = {
    activeVacancies: activeVacancies(vacancies),
    newToday: newToday(vacancies),
    newThisWeek: newThisWeek(vacancies),
    companiesTracked: companiesTracked(companies),
    topTechnologies: topTechnologies(vacancies),
    byBlock: byBlock(vacancies),
    timeline: timeline(vacancies),
  };
  return { vacancies, companies, stats };
}

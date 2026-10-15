import type { Company, Technology, VacancyWithStack } from "./types";
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
    const { data, error } = await supabase.from("vacancies").select("*");
    if (error || !data || data.length === 0) return null;
    // La resolución del stack contra vacancy_technologies + technologies se
    // completa cuando haya datos reales; por ahora se garantiza el shape.
    return (data as VacancyWithStack[]).map((v) => ({
      ...v,
      technologies: v.technologies ?? [],
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

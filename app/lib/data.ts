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

    return resolveStacks(supabase, vacancies as Vacancy[]);
  } catch {
    return null;
  }
}

// Resolución del stack. Es best-effort: si technologies o el bridge fallan
// pero las vacantes vinieron con datos, la conexión ya es real y devolvemos
// vacantes con stack vacío en lugar de caer a los mocks.
type Db = NonNullable<ReturnType<typeof getSupabase>>;

async function resolveStacks(
  supabase: Db,
  vacancies: Vacancy[]
): Promise<VacancyWithStack[]> {
  if (vacancies.length === 0) return [];

  let techNames = new Map<number, string>();
  let stacks = new Map<string, { name: string; is_required: boolean }[]>();

  try {
    const ids = vacancies.map((v) => v.id);
    const [techRes, bridgeRes] = await Promise.all([
      supabase.from("technologies").select("*"),
      supabase.from("vacancy_technology").select("*").in("vacancy_id", ids),
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

  return vacancies.map((v) => ({
    ...v,
    technologies: stacks.get(v.id) ?? [],
  }));
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

export async function getVacancyById(id: string): Promise<VacancyWithStack | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("vacancies")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        const [withStack] = await resolveStacks(supabase, [data as Vacancy]);
        return withStack ?? null;
      }
    } catch {
      // Cae al fallback de mocks.
    }
  }
  return getMockVacanciesWithStack().find((v) => v.id === id) ?? null;
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) return data as Company;
    } catch {
      // Cae al fallback de mocks.
    }
  }
  return mockCompanies.find((c) => c.id === id) ?? null;
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

// ===== Paginación server-side =====

export interface VacancyFilters {
  query?: string;
  block?: "colombia" | "rest";
  tech?: string; // nombre de tecnología (exacto)
  minYears?: number;
  maxYears?: number;
  mode?: string; // valor de work_mode
  status?: "active" | "inactive";
  language?: "ingles" | "no_ingles";
  portal?: string; // "linkedin" | "teamtailor" | "tecnoempleo"
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// Escapa los comodines de LIKE/ILIKE de PostgREST para que el input se trate
// como texto literal dentro del patrón de búsqueda.
function escapeLike(term: string): string {
  return term.replace(/[%_]/g, "\\$&");
}

// Filtro puro en memoria (mismos criterios que la query de Supabase).
// Se reutiliza como fallback cuando no hay cliente o la query falla.
export function filterVacancies(
  items: VacancyWithStack[],
  filters: VacancyFilters
): VacancyWithStack[] {
  const q = filters.query?.trim().toLowerCase();
  return items.filter((v) => {
    if (q) {
      const haystack = `${v.title} ${v.company_name ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.block && v.block !== filters.block) return false;
    if (filters.tech && !v.technologies.some((t) => t.name === filters.tech)) {
      return false;
    }
    if (filters.minYears !== undefined && (v.years_min ?? 0) < filters.minYears) {
      return false;
    }
    if (
      filters.maxYears !== undefined &&
      v.years_max !== null &&
      v.years_max > filters.maxYears
    ) {
      return false;
    }
    if (filters.mode && v.work_mode !== filters.mode) return false;
    if (filters.status === "active" && !v.is_active) return false;
    if (filters.status === "inactive" && v.is_active) return false;
    if (filters.language === "ingles" && !(v.language_req ?? "").toLowerCase().includes("ingl")) {
      return false;
    }
    if (filters.language === "no_ingles" && (v.language_req ?? "").toLowerCase().includes("ingl")) {
      return false;
    }
    if (filters.portal && v.source_portal !== filters.portal) return false;
    return true;
  });
}

export async function getVacanciesPage(
  filters: VacancyFilters,
  page: number,
  perPage: number
): Promise<Paginated<VacancyWithStack>> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      // Los filtros que no son una condición simple se resuelven primero en un
      // conjunto de ids (tecnología vía bridge, "sin inglés" vía OR null/not-
      // ilike) para no pisar el .or() de la búsqueda de texto. Vacío corta.
      let ids: string[] | undefined;
      if (filters.tech) {
        const { data: techRow, error: techError } = await supabase
          .from("technologies")
          .select("id")
          .eq("name", filters.tech)
          .single();

        if (techError || !techRow) {
          return { items: [], total: 0, page, perPage, totalPages: 0 };
        }

        const { data: bridge, error: bridgeError } = await supabase
          .from("vacancy_technology")
          .select("vacancy_id")
          .eq("technology_id", techRow.id);

        if (bridgeError) {
          return { items: [], total: 0, page, perPage, totalPages: 0 };
        }

        ids = (bridge ?? []).map(
          (row) => (row as { vacancy_id: string }).vacancy_id
        );
        if (ids.length === 0) {
          return { items: [], total: 0, page, perPage, totalPages: 0 };
        }
      }

      if (filters.language === "no_ingles") {
        const { data: langRows, error: langError } = await supabase
          .from("vacancies")
          .select("id")
          .or("language_req.is.null,language_req.not.ilike.%ingl%");

        if (langError) {
          return { items: [], total: 0, page, perPage, totalPages: 0 };
        }

        const langIds = (langRows ?? []).map(
          (row) => (row as { id: string }).id
        );
        // Si ya veníamos con ids de tecnología, intersecamos.
        ids = ids ? ids.filter((id) => langIds.includes(id)) : langIds;
        if (ids.length === 0) {
          return { items: [], total: 0, page, perPage, totalPages: 0 };
        }
      }

      let q = supabase.from("vacancies").select("*", { count: "exact" });

      if (filters.query) {
        const term = escapeLike(filters.query.trim());
        q = q.or(`title.ilike.%${term}%,company_name.ilike.%${term}%`);
      }
      if (filters.block) {
        q = q.eq("block", filters.block);
      }
      if (ids) {
        q = q.in("id", ids);
      }
      if (filters.minYears !== undefined) {
        q = q.gte("years_min", filters.minYears);
      }
      if (filters.maxYears !== undefined) {
        q = q.lte("years_max", filters.maxYears);
      }
      if (filters.mode) {
        q = q.eq("work_mode", filters.mode);
      }
      if (filters.status === "active") {
        q = q.eq("is_active", true);
      } else if (filters.status === "inactive") {
        q = q.eq("is_active", false);
      }
      if (filters.language === "ingles") {
        q = q.ilike("language_req", "%ingl%");
      }
      // "no_ingles" ya quedó resuelto como conjunto de ids más arriba.
      if (filters.portal) {
        q = q.eq("source_portal", filters.portal);
      }

      q = q.order("first_seen", { ascending: false });

      const from = (page - 1) * perPage;
      const { data, count, error } = await q.range(from, from + perPage - 1);

      if (!error) {
        const vacancies = (data ?? []) as Vacancy[];
        const items = await resolveStacks(supabase, vacancies);
        const total = count ?? items.length;
        const totalPages = Math.max(1, Math.ceil(total / perPage));
        return { items, total, page, perPage, totalPages };
      }
      // Si hubo error, se cae al fallback de mocks más abajo.
    } catch {
      // Cualquier excepción de red o de Supabase también cae a los mocks.
    }
  }

  // Fallback: mocks filtrados en memoria y paginados.
  const all = getMockVacanciesWithStack();
  const filtered = filterVacancies(all, filters);
  filtered.sort((a, b) => (b.first_seen ?? "").localeCompare(a.first_seen ?? ""));
  const total = filtered.length;
  const from = (page - 1) * perPage;
  const items = filtered.slice(from, from + perPage);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return { items, total, page, perPage, totalPages };
}

export async function getCompaniesPage(
  page: number,
  perPage: number
): Promise<Paginated<Company>> {
  const supabase = getSupabase();
  const from = (page - 1) * perPage;

  if (supabase) {
    try {
      const { data, count, error } = await supabase
        .from("companies")
        .select("*", { count: "exact" })
        .range(from, from + perPage - 1);

      if (!error) {
        const items = (data ?? []) as Company[];
        const total = count ?? items.length;
        const totalPages = Math.max(1, Math.ceil(total / perPage));
        return { items, total, page, perPage, totalPages };
      }
    } catch {
      // Cae al fallback de mocks.
    }
  }

  const items = mockCompanies.slice(from, from + perPage);
  const total = mockCompanies.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return { items, total, page, perPage, totalPages };
}

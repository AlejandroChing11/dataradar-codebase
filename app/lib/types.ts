// Tipos TypeScript del schema dataradar_schema (en Supabase).
// Mantener en sync con el DDL.

export type Block = "colombia" | "rest";
export type WorkMode = "remote_full" | "remote_country" | "hybrid" | "onsite";

export interface Vacancy {
  id: string; // LI-..., TE-..., TT-...
  company_id: string | null;
  title: string;
  company_name: string | null;
  location: string | null;
  work_mode: WorkMode | null;
  remote_countries: string[] | null;
  remote_raw: string | null;
  years_raw: string | null;
  years_min: number | null;
  years_max: number | null;
  language_req: string | null;
  block: Block | null;
  url: string | null;
  alt_url: string | null;
  fit_line: string | null;
  source_portal: string | null;
  salary_raw: string | null;
  published_date: string | null; // ISO date
  first_seen: string; // ISO date
  last_seen: string; // ISO date
  times_seen: number;
  is_repost: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string | null;
  hq: string | null;
  country: string | null;
  website: string | null;
  linkedin: string | null;
  careers_url: string | null;
  open_de_roles: boolean;
  open_de_roles_detail: string | null;
  signals: unknown | null; // jsonb
  first_seen: string;
  last_seen: string;
  created_at: string;
  updated_at: string;
}

export interface Technology {
  id: number;
  name: string;
  category: string | null;
}

export interface VacancyTechnology {
  vacancy_id: string;
  technology_id: number;
  is_required: boolean;
}

// Vacante con su stack resuelto (para las cards)
export interface VacancyWithStack extends Vacancy {
  technologies: { name: string; is_required: boolean }[];
}

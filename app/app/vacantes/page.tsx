import { getTechnologies, getVacanciesPage } from "@/lib/data";
import type { VacancyFilters } from "@/lib/data";
import VacancyExplorer from "@/components/vacancy-explorer";
import PageHeader from "@/components/page-header";

export const revalidate = 3600; // Refresca el radar cada hora (ISR)

const PAGE_SIZES: number[] = [12, 24, 48];
const DEFAULT_SIZE = 12;

type SearchParams = { [key: string]: string | string[] | undefined };

function first(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

function parsePage(raw: string | string[] | undefined): number {
  const value = first(raw);
  return Math.max(1, parseInt(value ?? "", 10) || 1);
}

function parseSize(raw: string | string[] | undefined): number {
  const value = first(raw);
  const n = Number(value);
  return PAGE_SIZES.includes(n) ? n : DEFAULT_SIZE;
}

function parseNumber(raw: string | string[] | undefined): number | undefined {
  const value = first(raw);
  if (value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function parseFilters(searchParams: SearchParams): VacancyFilters {
  const block = first(searchParams.block);
  const status = first(searchParams.status);
  const lang = first(searchParams.lang);
  const portal = first(searchParams.portal);
  return {
    query: first(searchParams.q) || undefined,
    block: block === "colombia" || block === "rest" ? block : undefined,
    tech: first(searchParams.tech) || undefined,
    minYears: parseNumber(searchParams.min),
    maxYears: parseNumber(searchParams.max),
    mode: first(searchParams.mode) || undefined,
    status: status === "active" || status === "inactive" ? status : undefined,
    language: lang === "ingles" || lang === "no_ingles" ? lang : undefined,
    portal:
      portal === "linkedin" || portal === "teamtailor" || portal === "tecnoempleo"
        ? portal
        : undefined,
  };
}

export default async function VacantesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const size = parseSize(sp.size);
  const filters = parseFilters(sp);

  const [result, technologies] = await Promise.all([
    getVacanciesPage(filters, page, size),
    getTechnologies(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="El radar · señales en crudo"
        title="Vacantes"
        highlight="al detalle"
        subtitle="Explora y filtra las vacantes de data remotas que el radar capturó, 100% para LATAM y España."
        accent="var(--primary)"
      />

      <VacancyExplorer
        vacancies={result.items}
        technologies={technologies}
        total={result.total}
        page={result.page}
        perPage={result.perPage}
        totalPages={result.totalPages}
        filters={filters}
      />
    </div>
  );
}

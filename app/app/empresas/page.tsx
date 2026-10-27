import { getCompaniesPage } from "@/lib/data";
import { safeExternalUrl } from "@/lib/safe-url";
import type { Company } from "@/lib/types";
import { Badge } from "@/components/badge";
import Pagination from "@/components/pagination";
import PageHeader from "@/components/page-header";
import { getServerLang } from "@/lib/server-i18n";
import { DICT, type Lang } from "@/lib/i18n";

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

interface Signals {
  level: string;
  source: string;
}

function parseSignals(signals: unknown): Signals | null {
  if (!signals || typeof signals !== "object") return null;
  const s = signals as Record<string, unknown>;
  const level = typeof s.level === "string" ? s.level : "";
  const source = typeof s.source === "string" ? s.source : "";
  if (!level && !source) return null;
  return { level, source };
}

const LEVEL_COLORS: Record<string, string> = {
  alta: "var(--success)",
  media: "var(--warning)",
  baja: "var(--text-muted)",
};

function CompanyCard({ company, lang }: { company: Company; lang: Lang }) {
  const t = DICT[lang].companies;
  const signals = parseSignals(company.signals);
  const website = safeExternalUrl(company.website);
  const careersUrl = safeExternalUrl(company.careers_url);
  const linkedin = safeExternalUrl(company.linkedin);
  return (
    <article className="dr-card-glow flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug">{company.name}</h3>
          <p className="mt-1 text-sm text-text-muted">
            {[company.hq, company.country].filter(Boolean).join(" · ")}
          </p>
        </div>
        {company.open_de_roles ? (
          <Badge tone="success">{t.rolesOpen}</Badge>
        ) : (
          <Badge tone="muted">{t.noRoles}</Badge>
        )}
      </div>

      {signals && (
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: LEVEL_COLORS[signals.level] ?? "var(--text-muted)" }}
            aria-hidden="true"
          />
          <span>{t.activity(signals.level)}</span>
          <span className="text-text-muted">·</span>
          <span className="truncate">{signals.source}</span>
        </div>
      )}

      {company.open_de_roles_detail && (
        <p className="text-sm text-text-muted">{company.open_de_roles_detail}</p>
      )}

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-strong"
          >
            {t.web}
          </a>
        )}
        {careersUrl && (
          <a
            href={careersUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-strong"
          >
            {t.jobs}
          </a>
        )}
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-strong"
          >
            {t.linkedin}
          </a>
        )}
      </div>
    </article>
  );
}

export default async function EmpresasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const size = parseSize(sp.size);
  const result = await getCompaniesPage(page, size);
  const lang = await getServerLang();
  const t = DICT[lang].companies;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        highlight={t.highlight}
        subtitle={t.subtitle}
        accent="var(--accent)"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {result.items.map((c) => (
          <CompanyCard key={c.id} company={c} lang={lang} />
        ))}
      </div>

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        total={result.total}
        perPage={result.perPage}
      />
    </div>
  );
}

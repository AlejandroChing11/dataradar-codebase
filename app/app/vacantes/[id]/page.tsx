import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVacancyById, getCompanyById } from "@/lib/data";
import { safeExternalUrl } from "@/lib/safe-url";
import type { Block, Vacancy } from "@/lib/types";
import Chip from "@/components/chip";
import {
  Badge,
  StatusBadge,
  WorkModeBadge,
  type BadgeTone,
} from "@/components/badge";
import Section from "@/components/section";
import { getServerLang } from "@/lib/server-i18n";
import { DICT, yearsLabel } from "@/lib/i18n";

export const revalidate = 3600;

// El componente Badge solo expone tones success/info/warning/danger/muted.
// Para el bloque usamos "warning" (ámbar, el tono más cercano al accent) en
// Colombia y "info" (azul) en Resto, respetando los tokens sin opacidad.
const BLOCK_TONE: Record<Block, BadgeTone> = {
  colombia: "warning",
  rest: "info",
};

function formatDate(iso: string | null, lang: "es" | "en"): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ExternalLinkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const v = await getVacancyById(id);
  if (!v) return { title: "Vacante no encontrada — DataRadar" };
  const desc = [v.company_name, v.fit_line].filter(Boolean).join(" · ");
  return {
    title: `${v.title} — ${v.company_name ?? "DataRadar"}`,
    description: desc,
  };
}

interface DetailRow {
  label: string;
  value: string;
}

function buildDetails(v: Vacancy, lang: "es" | "en"): DetailRow[] {
  const t = DICT[lang].detail;
  const common = DICT[lang].common;
  const remote =
    v.remote_raw ??
    (v.remote_countries && v.remote_countries.length > 0
      ? v.remote_countries.join(", ")
      : null);

  const rows: DetailRow[] = [
    { label: t.years, value: v.years_raw ?? yearsLabel(lang, v.years_min, v.years_max) },
    { label: t.salary, value: v.salary_raw ?? t.notPublished },
    { label: t.language, value: v.language_req ?? "" },
    {
      label: t.mode,
      value: v.work_mode ? common.workModes[v.work_mode] : "",
    },
    { label: t.remote, value: remote ?? "" },
    { label: t.portal, value: v.source_portal ?? "" },
    { label: t.published, value: formatDate(v.published_date, lang) ?? "" },
    { label: t.firstSeen, value: formatDate(v.first_seen, lang) ?? "" },
    { label: t.lastSeen, value: formatDate(v.last_seen, lang) ?? "" },
    { label: t.timesSeen, value: String(v.times_seen) },
    { label: t.repost, value: v.is_repost ? t.yes : t.no },
  ];

  return rows.filter((r) => r.value !== "" && r.value !== null);
}

export default async function VacancyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vacancy = await getVacancyById(id);
  if (!vacancy) notFound();

  const lang = await getServerLang();
  const t = DICT[lang].detail;
  const common = DICT[lang].common;
  const ct = DICT[lang].companies;

  const company = vacancy.company_id
    ? await getCompanyById(vacancy.company_id)
    : null;

  const applyUrl = safeExternalUrl(vacancy.url ?? vacancy.alt_url);
  const required = vacancy.technologies.filter((t) => t.is_required);
  const optional = vacancy.technologies.filter((t) => !t.is_required);
  const details = buildDetails(vacancy, lang);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/vacantes"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text"
      >
        <span aria-hidden="true">←</span>
        {t.back}
      </Link>

      <header className="rounded-xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge active={vacancy.is_active} />
          {vacancy.work_mode && <WorkModeBadge mode={vacancy.work_mode} />}
          {vacancy.block && (
            <Badge tone={BLOCK_TONE[vacancy.block]}>
              {vacancy.block === "colombia" ? common.colombia : common.rest}
            </Badge>
          )}
        </div>

        <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">
          {vacancy.title}
        </h1>
        <p className="mt-1 text-text-muted">
          {[vacancy.company_name ?? common.company, vacancy.location]
            .filter(Boolean)
            .join(" · ")}
        </p>

        {vacancy.fit_line && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-surface-2 p-4">
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent"
              aria-hidden="true"
            />
            <p className="text-sm text-accent">{vacancy.fit_line}</p>
          </div>
        )}

        {applyUrl ? (
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-[#06281f] transition-colors hover:bg-primary-strong"
          >
            {t.apply}
            <ExternalLinkIcon />
          </a>
        ) : (
          <p className="mt-5 text-sm text-text-muted">
            {t.applyUnavailable}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Section title={t.stackTitle}>
            {vacancy.technologies.length === 0 ? (
              <p className="text-sm text-text-muted">{t.noStack}</p>
            ) : (
              <div className="flex flex-col gap-4">
                {required.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-text-muted">
                      {t.required}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {required.map((t) => (
                        <Chip key={t.name} label={t.name} required />
                      ))}
                    </div>
                  </div>
                )}
                {optional.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-text-muted">
                      {t.valued}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {optional.map((t) => (
                        <Chip key={t.name} label={t.name} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Section>

          <Section title={t.detailsTitle}>
            <dl className="divide-y divide-border">
              {details.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <dt className="text-sm text-text-muted">{row.label}</dt>
                  <dd className="text-right text-sm font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Section>
        </div>

        <aside className="flex flex-col gap-6">
          {company && (
            <Section title={t.companyTitle}>
              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="font-semibold">{company.name}</h3>
                <p className="mt-1 text-sm text-text-muted">
                  {[company.hq, company.country].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-strong"
                    >
                      {ct.web}
                    </a>
                  )}
                  {company.careers_url && (
                    <a
                      href={company.careers_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-strong"
                    >
                      {ct.jobs}
                    </a>
                  )}
                  {company.linkedin && (
                    <a
                      href={company.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-strong"
                    >
                      {ct.linkedin}
                    </a>
                  )}
                </div>
                {company.open_de_roles_detail && (
                  <p className="mt-3 text-sm text-text-muted">
                    {company.open_de_roles_detail}
                  </p>
                )}
              </div>
            </Section>
          )}

          <Section title={t.applyTitle}>
            <div className="rounded-xl border border-border bg-surface p-5">
              {applyUrl ? (
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-[#06281f] transition-colors hover:bg-primary-strong"
                >
                  {t.apply}
                  <ExternalLinkIcon />
                </a>
              ) : (
                <p className="text-sm text-text-muted">{t.noLink}</p>
              )}
              <p className="mt-3 text-xs text-text-muted">
                {t.redirectNote}
              </p>
            </div>
          </Section>
        </aside>
      </div>
    </div>
  );
}

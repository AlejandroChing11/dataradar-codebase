import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVacancyById, getCompanyById } from "@/lib/data";
import type { Block, Vacancy } from "@/lib/types";
import Chip from "@/components/chip";
import {
  Badge,
  StatusBadge,
  WorkModeBadge,
  WORK_MODE_META,
  type BadgeTone,
} from "@/components/badge";
import Section from "@/components/section";

export const revalidate = 3600;

// El componente Badge solo expone tones success/info/warning/danger/muted.
// Para el bloque usamos "warning" (ámbar, el tono más cercano al accent) en
// Colombia y "info" (azul) en Resto, respetando los tokens sin opacidad.
const BLOCK_META: Record<Block, { label: string; tone: BadgeTone }> = {
  colombia: { label: "Colombia", tone: "warning" },
  rest: { label: "Resto", tone: "info" },
};

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function yearsLabel(v: Vacancy): string {
  const min = v.years_min;
  const max = v.years_max;
  if (min === null && max === null) return "Sin requisito de años";
  if (min === null) return `Hasta ${max} años`;
  if (max === null) return `${min}+ años`;
  return min === max ? `${min} año` : `${min}–${max} años`;
}

interface DetailRow {
  label: string;
  value: string;
}

function buildDetails(v: Vacancy): DetailRow[] {
  const remote =
    v.remote_raw ??
    (v.remote_countries && v.remote_countries.length > 0
      ? v.remote_countries.join(", ")
      : null);

  const rows: DetailRow[] = [
    // Años y Salario siempre se muestran (con fallback).
    { label: "Años", value: v.years_raw ?? yearsLabel(v) },
    { label: "Salario", value: v.salary_raw ?? "No publicado" },
    { label: "Idioma", value: v.language_req ?? "" },
    {
      label: "Modalidad",
      value: v.work_mode ? WORK_MODE_META[v.work_mode].label : "",
    },
    { label: "Remoto", value: remote ?? "" },
    { label: "Portal", value: v.source_portal ?? "" },
    { label: "Publicado", value: formatDate(v.published_date) ?? "" },
    { label: "Primer avistamiento", value: formatDate(v.first_seen) ?? "" },
    { label: "Último avistamiento", value: formatDate(v.last_seen) ?? "" },
    { label: "Veces visto", value: String(v.times_seen) },
    { label: "Repost", value: v.is_repost ? "Sí" : "No" },
  ];

  return rows.filter((r) => r.value !== "" && r.value !== null);
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

export default async function VacancyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vacancy = await getVacancyById(id);
  if (!vacancy) notFound();

  const company = vacancy.company_id
    ? await getCompanyById(vacancy.company_id)
    : null;

  const applyUrl = vacancy.url ?? vacancy.alt_url;
  const required = vacancy.technologies.filter((t) => t.is_required);
  const optional = vacancy.technologies.filter((t) => !t.is_required);
  const details = buildDetails(vacancy);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/vacantes"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text"
      >
        <span aria-hidden="true">←</span>
        Volver a vacantes
      </Link>

      <header className="rounded-xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge active={vacancy.is_active} />
          {vacancy.work_mode && <WorkModeBadge mode={vacancy.work_mode} />}
          {vacancy.block && (
            <Badge tone={BLOCK_META[vacancy.block].tone}>
              {BLOCK_META[vacancy.block].label}
            </Badge>
          )}
        </div>

        <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">
          {vacancy.title}
        </h1>
        <p className="mt-1 text-text-muted">
          {[vacancy.company_name ?? "Empresa", vacancy.location]
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
            Aplicar
            <ExternalLinkIcon />
          </a>
        ) : (
          <p className="mt-5 text-sm text-text-muted">
            Link de aplicación no disponible
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Section title="Stack tecnológico">
            {vacancy.technologies.length === 0 ? (
              <p className="text-sm text-text-muted">Sin stack registrado</p>
            ) : (
              <div className="flex flex-col gap-4">
                {required.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-text-muted">
                      Requeridas
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
                      Valoradas
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

          <Section title="Detalles">
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
            <Section title="Empresa">
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
                      Web
                    </a>
                  )}
                  {company.careers_url && (
                    <a
                      href={company.careers_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-strong"
                    >
                      Empleos
                    </a>
                  )}
                  {company.linkedin && (
                    <a
                      href={company.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-strong"
                    >
                      LinkedIn
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

          <Section title="Aplicar">
            <div className="rounded-xl border border-border bg-surface p-5">
              {applyUrl ? (
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-[#06281f] transition-colors hover:bg-primary-strong"
                >
                  Aplicar
                  <ExternalLinkIcon />
                </a>
              ) : (
                <p className="text-sm text-text-muted">Link no disponible</p>
              )}
              <p className="mt-3 text-xs text-text-muted">
                Redirige al portal original de la oferta.
              </p>
            </div>
          </Section>
        </aside>
      </div>
    </div>
  );
}

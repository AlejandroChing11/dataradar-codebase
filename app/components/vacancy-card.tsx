import Link from "next/link";
import type { VacancyWithStack } from "@/lib/types";
import Chip from "./chip";
import { StatusBadge, WorkModeBadge } from "./badge";

function yearsLabel(v: VacancyWithStack): string {
  const min = v.years_min;
  const max = v.years_max;
  if (min === null && max === null) return "Sin requisito de años";
  if (min === null) return `Hasta ${max} años`;
  if (max === null) return `${min}+ años`;
  return min === max ? `${min} año` : `${min}–${max} años`;
}

export default function VacancyCard({ vacancy }: { vacancy: VacancyWithStack }) {
  const href = vacancy.url ?? vacancy.alt_url ?? "#";
  // Requeridas primero para resaltar el core del stack.
  const techs = [...vacancy.technologies].sort(
    (a, b) => Number(b.is_required) - Number(a.is_required)
  );

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 transition-colors hover:bg-surface-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug">
            <Link
              href={`/vacantes/${vacancy.id}`}
              title="Ver detalle"
              className="transition-colors hover:text-primary"
            >
              {vacancy.title}
            </Link>
          </h3>
          <p className="mt-1 truncate text-sm text-text-muted">
            {vacancy.company_name ?? "Empresa"}
          </p>
        </div>
        <StatusBadge active={vacancy.is_active} />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-text-muted">
        {vacancy.location && <span>{vacancy.location}</span>}
        {vacancy.work_mode && <WorkModeBadge mode={vacancy.work_mode} />}
        <span>{yearsLabel(vacancy)}</span>
      </div>

      {techs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {techs.map((t) => (
            <Chip key={t.name} label={t.name} required={t.is_required} />
          ))}
        </div>
      )}

      {vacancy.fit_line && <p className="text-sm text-text-muted">{vacancy.fit_line}</p>}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-primary hover:text-primary-strong"
      >
        Ver oferta
        <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}

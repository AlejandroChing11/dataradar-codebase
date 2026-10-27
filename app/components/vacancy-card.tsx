"use client";

import Link from "next/link";
import type { VacancyWithStack } from "@/lib/types";
import { isWithinLastDays } from "@/lib/dates";
import { safeExternalUrl } from "@/lib/safe-url";
import Chip from "./chip";
import { Badge, StatusBadge, WorkModeBadge } from "./badge";
import { useLang } from "@/components/providers";
import { DICT, yearsLabel } from "@/lib/i18n";

export default function VacancyCard({ vacancy }: { vacancy: VacancyWithStack }) {
  const { lang } = useLang();
  const t = DICT[lang].common;
  const href = safeExternalUrl(vacancy.url ?? vacancy.alt_url) ?? "#";
  const isNew = isWithinLastDays(vacancy.first_seen, 2);
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
              title={t.viewDetail}
              className="transition-colors hover:text-primary"
            >
              {vacancy.title}
            </Link>
          </h3>
          <p className="mt-1 truncate text-sm text-text-muted">
            {vacancy.company_name ?? t.company}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isNew && <Badge tone="accent">{t.newLabel}</Badge>}
          <StatusBadge active={vacancy.is_active} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-text-muted">
        {vacancy.location && <span>{vacancy.location}</span>}
        {vacancy.work_mode && <WorkModeBadge mode={vacancy.work_mode} />}
        <span>{yearsLabel(lang, vacancy.years_min, vacancy.years_max)}</span>
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
        {t.viewOffer}
        <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}

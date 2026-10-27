import { getVacancies } from "@/lib/data";
import {
  activeVacancies,
  avgYearsMinByBlock,
  discardReasonBreakdown,
  remoteRateByBlock,
  repostRate,
  topTechnologies,
} from "@/lib/analytics";
import type { Block } from "@/lib/types";
import DemandBubbles, { type BubbleDatum } from "@/components/charts/demand-bubbles";
import DonutChart, { type DonutDatum } from "@/components/charts/donut-chart";
import Section from "@/components/section";
import PageHeader from "@/components/page-header";
import { getServerLang } from "@/lib/server-i18n";
import { DICT } from "@/lib/i18n";

export const revalidate = 3600; // Refresca el radar cada hora (ISR)

const DONUT_COLORS = [
  "var(--primary)",
  "var(--accent)",
  "var(--info)",
  "var(--warning)",
  "var(--danger)",
  "var(--success)",
];

function Stat({
  label,
  value,
  note,
  accent = "var(--primary)",
}: {
  label: string;
  value: string;
  note?: string;
  accent?: string;
}) {
  return (
    <div className="dr-card-glow overflow-hidden rounded-xl border border-border bg-surface p-5">
      <div className="h-1 w-10 rounded-full" style={{ background: accent }} />
      <div className="mt-3 text-sm text-text-muted">{label}</div>
      <div
        className="mt-1 font-mono text-2xl font-bold tabular-nums"
        style={{ color: accent }}
      >
        {value}
      </div>
      {note && <div className="mt-1 text-xs text-text-muted">{note}</div>}
    </div>
  );
}

export default async function TendenciasPage() {
  const vacancies = await getVacancies();
  const lang = await getServerLang();
  const t = DICT[lang].trends;

  const active = activeVacancies(vacancies);
  const discarded = vacancies.length - active;
  const discardRate =
    active + discarded > 0 ? Math.round((discarded / (active + discarded)) * 100) : 0;

  const remoteByBlock = remoteRateByBlock(vacancies);
  const avgMinByBlock = avgYearsMinByBlock(vacancies);
  const repostPct = Math.round(repostRate(vacancies) * 100);
  const top: BubbleDatum[] = topTechnologies(vacancies, 8).map((t) => ({
    name: t.name,
    count: t.count,
  }));

  // Embudo de descartes derivado de las vacantes (no toca la tabla interna `discards`).
  const discardByReason: DonutDatum[] = discardReasonBreakdown(vacancies, lang).map((r, i) => ({
    label: r.label,
    value: r.value,
    color: DONUT_COLORS[i % DONUT_COLORS.length],
  }));

  const remoteLabel = (block: Block): string => {
    const found = remoteByBlock.find((r) => r.block === block);
    return `${found?.pct ?? 0}%`;
  };
  const avgMinLabel = (block: Block): string => {
    const found = avgMinByBlock.find((r) => r.block === block);
    return (found?.value ?? 0).toFixed(1);
  };

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        highlight={t.highlight}
        subtitle={t.subtitle}
        accent="var(--info)"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label={t.remoteCol} value={remoteLabel("colombia")} note={t.remoteNoteCol} accent="var(--primary)" />
        <Stat label={t.remoteRest} value={remoteLabel("rest")} note={t.remoteNoteRest} accent="var(--info)" />
        <Stat label={t.avgMinCol} value={avgMinLabel("colombia")} note={t.avgNote} accent="var(--accent)" />
        <Stat label={t.avgMinRest} value={avgMinLabel("rest")} note={t.avgNote} accent="var(--warning)" />
        <Stat label={t.repost} value={`${repostPct}%`} note={t.repostNote(active)} accent="var(--success)" />
      </div>

      <Section title={t.topTitle} subtitle={t.topSubtitle}>
        <div className="rounded-xl border border-border bg-surface p-6">
          <DemandBubbles items={top} />
        </div>
      </Section>

      <Section title={t.funnelTitle} subtitle={t.funnelSubtitle}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <Stat label={t.activeCount} value={String(active)} accent="var(--success)" />
            <Stat label={t.closedCount} value={String(discarded)} accent="var(--text-muted)" />
            <Stat label={t.discardRate} value={`${discardRate}%`} accent="var(--danger)" />
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <DonutChart data={discardByReason} />
          </div>
        </div>
      </Section>
    </div>
  );
}

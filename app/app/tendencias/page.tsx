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
  const discardByReason: DonutDatum[] = discardReasonBreakdown(vacancies).map((r, i) => ({
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
        eyebrow="El radar · lectura del mercado"
        title="Tendencias"
        highlight="del mercado"
        subtitle="Señales del mercado: modalidad, seniority y descartes sobre las vacantes rastreadas."
        accent="var(--info)"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="100% remoto — Colombia" value={remoteLabel("colombia")} note="Sobre las vacantes de Colombia" accent="var(--primary)" />
        <Stat label="100% remoto — Resto" value={remoteLabel("rest")} note="Sobre las vacantes del resto" accent="var(--info)" />
        <Stat label="Media de años mínimos — Colombia" value={avgMinLabel("colombia")} note="Requisito junior/mid" accent="var(--accent)" />
        <Stat label="Media de años mínimos — Resto" value={avgMinLabel("rest")} note="Requisito junior/mid" accent="var(--warning)" />
        <Stat label="Repost rate" value={`${repostPct}%`} note={`${active} vacantes activas`} accent="var(--success)" />
      </div>

      <Section title="Lo que más piden" subtitle="Frecuencia de tecnologías en las vacantes — cada blip es una tecnología, más grande = más pedida">
        <div className="rounded-xl border border-border bg-surface p-6">
          <DemandBubbles items={top} />
        </div>
      </Section>

      <Section title="Embudo de descartes" subtitle="Señales de descarte derivadas de las vacantes">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Vacantes activas" value={String(active)} accent="var(--success)" />
            <Stat label="Cerradas o vencidas" value={String(discarded)} accent="var(--text-muted)" />
            <Stat label="Tasa de descarte" value={`${discardRate}%`} accent="var(--danger)" />
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <DonutChart data={discardByReason} />
          </div>
        </div>
      </Section>
    </div>
  );
}

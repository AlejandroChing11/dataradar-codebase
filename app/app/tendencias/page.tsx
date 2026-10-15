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
import BarChart from "@/components/charts/bar-chart";
import Section from "@/components/section";

export const revalidate = 3600; // Refresca el radar cada hora (ISR)

const BLOCK_LABEL: Record<Block, string> = {
  colombia: "Colombia",
  rest: "Resto",
};

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="text-sm text-text-muted">{label}</div>
      <div className="mt-2 font-mono text-2xl font-semibold tabular-nums">{value}</div>
      {note && <div className="mt-1 text-xs text-text-muted">{note}</div>}
    </div>
  );
}

export default async function TendenciasPage() {
  const vacancies = await getVacancies();

  const active = activeVacancies(vacancies);
  const remoteByBlock = remoteRateByBlock(vacancies);
  const avgMinByBlock = avgYearsMinByBlock(vacancies);
  const repostPct = Math.round(repostRate(vacancies) * 100);
  const top = topTechnologies(vacancies, 8).map((t) => ({ label: t.name, value: t.count }));
  const discards = discardReasonBreakdown(vacancies);

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
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Tendencias</h1>
        <p className="max-w-2xl text-text-muted">
          Señales del mercado: modalidad, seniority y descartes sobre las vacantes rastreadas.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="100% remoto — Colombia" value={remoteLabel("colombia")} note="Sobre las vacantes de Colombia" />
        <Stat label="100% remoto — Resto" value={remoteLabel("rest")} note="Sobre las vacantes del resto" />
        <Stat label="Media de años mínimos — Colombia" value={avgMinLabel("colombia")} note="Requisito junior/mid" />
        <Stat label="Media de años mínimos — Resto" value={avgMinLabel("rest")} note="Requisito junior/mid" />
        <Stat label="Repost rate" value={`${repostPct}%`} note={`${active} vacantes activas`} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Section title="Top stacks" subtitle="Frecuencia de tecnologías">
          <div className="rounded-xl border border-border bg-surface p-5">
            <BarChart data={top} />
          </div>
        </Section>

        <Section title="Embudo de descartes" subtitle="Motivos por los que una vacante sale del radar">
          <div className="rounded-xl border border-border bg-surface p-5">
            <BarChart data={discards} accent="var(--warning)" />
          </div>
        </Section>
      </div>
    </div>
  );
}

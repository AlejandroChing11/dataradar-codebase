import { getDashboardData } from "@/lib/data";
import KpiCard from "@/components/kpi-card";
import BarChart from "@/components/charts/bar-chart";
import DonutChart from "@/components/charts/donut-chart";
import LineChart from "@/components/charts/line-chart";
import Section from "@/components/section";

const BLOCK_COLORS: Record<string, string> = {
  colombia: "var(--accent)",
  rest: "var(--primary)",
};

export default async function DashboardPage() {
  const { stats } = await getDashboardData();

  const blockDonut = stats.byBlock.map((b) => ({
    label: b.block === "colombia" ? "Colombia" : "Resto",
    value: b.count,
    color: BLOCK_COLORS[b.block],
  }));

  const topTech = stats.topTechnologies.map((t) => ({ label: t.name, value: t.count }));

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="max-w-2xl text-text-muted">
          Inteligencia diaria del mercado de vacantes de data remotas para LATAM y España.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Vacantes activas" value={stats.activeVacancies} accent="var(--primary)" />
        <KpiCard
          label="Nuevas hoy"
          value={stats.newToday}
          delta="primer avistamiento"
          accent="var(--success)"
        />
        <KpiCard label="Nuevas esta semana" value={stats.newThisWeek} accent="var(--info)" />
        <KpiCard label="Empresas rastreadas" value={stats.companiesTracked} accent="var(--accent)" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Section title="Top tecnologías" subtitle="Frecuencia de uso en las vacantes">
          <div className="rounded-xl border border-border bg-surface p-5">
            <BarChart data={topTech} />
          </div>
        </Section>

        <Section title="Distribución por bloque" subtitle="Colombia frente al resto">
          <div className="rounded-xl border border-border bg-surface p-5">
            <DonutChart data={blockDonut} />
          </div>
        </Section>

        <Section
          title="Evolución de vacantes"
          subtitle="Primeros avistamientos, últimos 30 días"
          className="md:col-span-2 xl:col-span-1"
        >
          <div className="rounded-xl border border-border bg-surface p-5">
            <LineChart data={stats.timeline} />
          </div>
        </Section>
      </div>
    </div>
  );
}

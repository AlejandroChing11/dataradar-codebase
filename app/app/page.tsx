import Link from "next/link";
import { getDashboardData, getVacancies } from "@/lib/data";
import RadarSweep from "@/components/radar-animation";

export const revalidate = 3600; // Refresca el radar cada hora (ISR)

const TECH_COLORS = [
  "var(--primary)",
  "var(--accent)",
  "var(--info)",
  "var(--success)",
  "var(--warning)",
];

const BTN_PRIMARY =
  "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-bg transition-colors hover:bg-primary-strong";
const BTN_GHOST =
  "inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 font-medium text-text transition-colors hover:border-primary/60 hover:text-primary";

function fmt(n: number) {
  return (n ?? 0).toLocaleString("es-CO");
}

export default async function Landing() {
  const [{ stats }, vacancies] = await Promise.all([
    getDashboardData(),
    getVacancies(),
  ]);

  const topTech = stats.topTechnologies.slice(0, 8);
  const maxTech = Math.max(1, ...topTech.map((t) => t.count));

  const fresh = [...vacancies]
    .sort((a, b) => (b.first_seen ?? "").localeCompare(a.first_seen ?? ""))
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-16 sm:gap-20">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="dr-grid relative grid items-center gap-10 overflow-hidden rounded-3xl border border-border bg-surface/40 p-6 sm:p-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-primary">
            <span className="dr-live size-2 rounded-full bg-primary" />
            en vivo · actualizado hoy
          </span>

          <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Leímos <span className="dr-grad">{fmt(stats.activeVacancies)}</span>{" "}
            vacantes de data
            <br className="hidden sm:block" /> para que tú no tengas que hacerlo.
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-lg text-text-muted">
            Nuestro radar barre LinkedIn, Tecnoempleo y más{" "}
            <strong className="font-semibold text-text">cada día hábil</strong>,
            filtra el ruido —adiós <em>body shops</em> y “senior disfrazado de
            junior”— y te deja solo lo{" "}
            <strong className="font-semibold text-text">100% remoto</strong> para
            LATAM y España.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/vacantes" className={BTN_PRIMARY}>
              Ver vacantes →
            </Link>
            <Link href="/tendencias" className={BTN_GHOST}>
              Tendencias del mercado
            </Link>
          </div>
        </div>

        <div className="relative grid place-items-center">
          <div className="dr-glow">
            <RadarSweep size={248} />
          </div>
          <span className="absolute -bottom-1 rounded-full border border-success/40 bg-success/10 px-3 py-1 font-mono text-xs text-success">
            +{fmt(stats.newToday)} nuevas hoy
          </span>
        </div>
      </section>

      {/* ═══════════════ FRANJA DE INDICADORES ═══════════════ */}
      <section className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {[
          { v: stats.activeVacancies, l: "vacantes activas", c: "text-primary" },
          { v: stats.newToday, l: "nuevas hoy", c: "text-success" },
          { v: stats.newThisWeek, l: "esta semana", c: "text-info" },
          { v: stats.companiesTracked, l: "empresas rastreadas", c: "text-accent" },
        ].map((s) => (
          <div key={s.l}>
            <div className={`font-mono text-4xl font-bold tracking-tight sm:text-5xl ${s.c}`}>
              {fmt(s.v)}
            </div>
            <div className="mt-1 text-sm text-text-muted">{s.l}</div>
          </div>
        ))}
      </section>

      {/* ═══════════════ LO QUE PIDE EL MERCADO ═══════════════ */}
      <section>
        <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          El stack que más piden <span className="dr-grad">ahora mismo</span>
        </h2>
        <p className="mt-2 max-w-xl text-text-muted">
          Frecuencia real en las vacantes que el radar capturó. Si lo tienes,
          aplícale sin miedo.
        </p>

        <div className="mt-7 flex flex-col gap-3.5">
          {topTech.map((t, i) => {
            const color = TECH_COLORS[i % TECH_COLORS.length];
            const pct = Math.max(6, Math.round((t.count / maxTech) * 100));
            return (
              <div key={t.name} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate font-mono text-sm sm:w-36">
                  {t.name}
                </span>
                <div className="h-7 flex-1 overflow-hidden rounded-md bg-surface-2">
                  <div
                    className="h-full rounded-md transition-all"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-sm text-text-muted">
                  {t.count}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ RECIÉN CAPTURADAS ═══════════════ */}
      {fresh.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              Recién capturadas <span aria-hidden>📡</span>
            </h2>
            <Link
              href="/vacantes"
              className="shrink-0 font-mono text-sm text-primary hover:underline"
            >
              ver todas →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {fresh.map((v) => {
              const isCol = v.block === "colombia";
              const badgeBg = isCol
                ? "color-mix(in oklab, var(--accent) 16%, transparent)"
                : "color-mix(in oklab, var(--primary) 16%, transparent)";
              const badgeFg = isCol ? "var(--accent)" : "var(--primary)";
              return (
                <Link
                  key={v.id}
                  href={`/vacantes/${v.id}`}
                  className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/50"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 font-mono text-[11px]"
                      style={{ background: badgeBg, color: badgeFg }}
                    >
                      {isCol ? "🇨🇴 Colombia" : "🌎 Resto"}
                    </span>
                    {v.is_active && (
                      <span className="font-mono text-[11px] text-success">
                        ● activa
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-pretty font-semibold leading-snug transition-colors group-hover:text-primary">
                    {v.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-text-muted">{v.company_name}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {v.technologies.slice(0, 3).map((tk) => (
                      <span
                        key={tk.name}
                        className="rounded border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-text-muted"
                      >
                        {tk.name}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══════════════ CIERRE — EL RADAR NO DUERME ═══════════════ */}
      <section className="dr-grid relative overflow-hidden rounded-3xl border border-accent/30 bg-accent/5 p-8 text-center sm:p-14">
        <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          El radar no duerme <span aria-hidden>☕</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-text-muted">
          Corre de lunes a viernes a las 8:44 am (hora Colombia): lee las
          vacantes nuevas, descarta el ruido y actualiza todo esto solo. Tú solo
          llega a leer.
        </p>
        <Link href="/vacantes" className={`${BTN_PRIMARY} mt-7`}>
          Explorar el radar →
        </Link>
      </section>
    </div>
  );
}

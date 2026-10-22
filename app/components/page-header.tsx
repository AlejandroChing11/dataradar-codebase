import RadarSweep from "@/components/radar-animation";

// Cabecera editorial reutilizable para las páginas internas: rejilla sutil,
// halo de color, eyebrow mono y título con palabra en degradado.
export default function PageHeader({
  eyebrow,
  title,
  highlight,
  subtitle,
  accent = "var(--primary)",
  showRadar = true,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle: string;
  accent?: string;
  showRadar?: boolean;
}) {
  return (
    <header className="dr-grid relative flex items-center justify-between gap-6 overflow-hidden rounded-2xl border border-border bg-surface/30 p-6 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full opacity-25 blur-3xl"
        style={{ background: accent }}
      />
      <div className="relative min-w-0">
        <p className="font-mono text-xs uppercase tracking-wider" style={{ color: accent }}>
          {eyebrow}
        </p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
          {highlight && <span className="dr-grad"> {highlight}</span>}
        </h1>
        <p className="mt-2 max-w-2xl text-pretty text-text-muted">{subtitle}</p>
      </div>

      {showRadar && (
        <div className="relative hidden shrink-0 opacity-80 sm:block">
          <RadarSweep size={104} />
        </div>
      )}
    </header>
  );
}

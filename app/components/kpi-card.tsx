export interface KpiCardProps {
  label: string;
  value: number;
  delta?: string;
  accent?: string;
}

export default function KpiCard({
  label,
  value,
  delta,
  accent = "var(--primary)",
}: KpiCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 transition-colors hover:bg-surface-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-text-muted">{label}</span>
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-mono text-3xl font-semibold tabular-nums">{value}</span>
        {delta && <span className="text-xs text-text-muted">{delta}</span>}
      </div>
    </div>
  );
}

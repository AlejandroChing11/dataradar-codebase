"use client";

// Campo de "blips" de demanda: cada tecnología es una burbuja luminosa cuyo
// tamaño refleja cuántas vacantes la piden. Reemplaza a los gráficos de barras
// con algo más vivo y temático (blips de radar). El valor exacto va dentro de
// cada burbuja, así se lee la magnitud sin ambigüedad.

export interface BubbleDatum {
  name: string;
  count: number;
}

const PALETTE = [
  "var(--primary)",
  "var(--accent)",
  "var(--info)",
  "var(--success)",
  "var(--warning)",
  "var(--danger)",
];

// Tinta oscura fija para el número: las burbujas siempre son colores saturados
// y claros, así que se lee en tema claro y oscuro por igual.
const INK = "#0b1220";

export default function DemandBubbles({
  items,
  minSize = 68,
  maxSize = 148,
}: {
  items: BubbleDatum[];
  minSize?: number;
  maxSize?: number;
}) {
  if (items.length === 0) return null;
  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <div className="flex flex-wrap items-center justify-center gap-5 py-2 sm:justify-start sm:gap-6">
      {items.map((it, i) => {
        const color = PALETTE[i % PALETTE.length];
        const size = Math.round(minSize + (it.count / max) * (maxSize - minSize));
        const numSize = Math.max(16, Math.round(size * 0.3));

        return (
          <div
            key={it.name}
            className="dr-pop flex shrink-0 flex-col items-center gap-2"
            style={{ animationDelay: `${i * 55}ms` }}
          >
            <div
              className="dr-float grid place-items-center rounded-full"
              style={{
                width: size,
                height: size,
                animationDelay: `${i * 240}ms`,
                background: `radial-gradient(circle at 34% 28%, color-mix(in oklab, ${color} 78%, white 22%), ${color})`,
                boxShadow: `inset 0 -6px 16px -6px rgba(0,0,0,0.35), 0 0 0 1px color-mix(in oklab, ${color} 45%, transparent), 0 14px 34px -12px ${color}`,
              }}
            >
              <span
                className="font-mono font-bold leading-none tabular-nums"
                style={{ fontSize: numSize, color: INK }}
              >
                {it.count}
              </span>
            </div>
            <span className="max-w-[9rem] truncate text-center font-mono text-xs text-text-muted">
              {it.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

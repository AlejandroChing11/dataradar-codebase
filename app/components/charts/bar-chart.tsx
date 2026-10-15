export interface BarDatum {
  label: string;
  value: number;
}

// Gráfico de barras horizontales en SVG propio (sin librerías).
export default function BarChart({
  data,
  accent = "var(--primary)",
}: {
  data: BarDatum[];
  accent?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const rowH = 34;
  const labelW = 132;
  const valueW = 44;
  const barMaxW = 150;
  const width = labelW + barMaxW + valueW + 8;
  const height = data.length * rowH + 4;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      aria-label="Gráfico de barras horizontales"
    >
      {data.map((d, i) => {
        const y = i * rowH;
        const barW = Math.max(2, Math.round((d.value / max) * barMaxW));
        return (
          <g key={d.label}>
            <text
              x={0}
              y={y + 19}
              fill="var(--text-muted)"
              fontSize="12"
              fontFamily="var(--font-geist-mono)"
            >
              {d.label}
            </text>
            <rect x={labelW} y={y + 8} width={barW} height={14} rx={4} fill={accent} />
            <text
              x={labelW + barW + 8}
              y={y + 19}
              fill="var(--text)"
              fontSize="12"
              fontFamily="var(--font-geist-mono)"
            >
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

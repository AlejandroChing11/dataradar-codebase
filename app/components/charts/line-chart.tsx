export interface LineDatum {
  date: string;
  value: number;
}

function shortDate(date: string): string {
  const [, m, d] = date.split("-");
  return `${d}/${m}`;
}

// Gráfico de línea en SVG propio con área degradada bajo la polilínea.
export default function LineChart({
  data,
  accent = "var(--primary)",
}: {
  data: LineDatum[];
  accent?: string;
}) {
  const W = 600;
  const H = 220;
  const padX = 36;
  const padY = 24;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;
  const max = Math.max(1, ...data.map((d) => d.value));
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

  const points = data.map((d, i) => ({
    ...d,
    x: padX + i * stepX,
    y: H - padY - (d.value / max) * innerH,
  }));

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  const firstX = points[0]?.x.toFixed(1) ?? padX;
  const lastX = points[points.length - 1]?.x.toFixed(1) ?? padX;
  const area = `${line} L${lastX},${H - padY} L${firstX},${H - padY} Z`;

  // Etiquetas de fecha espaciadas (~6) sobre el eje x.
  const labelCount = 6;
  const labelIdx = new Set<number>();
  for (let k = 0; k < labelCount; k++) {
    labelIdx.add(Math.round((k * (data.length - 1)) / (labelCount - 1)));
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Gráfico de evolución">
      <defs>
        <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={area} fill="url(#line-fill)" />
      <path
        d={line}
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((p, i) => {
        if (!labelIdx.has(i)) return null;
        return (
          <text
            key={i}
            x={p.x}
            y={H - 6}
            fill="var(--text-muted)"
            fontSize="11"
            fontFamily="var(--font-geist-mono)"
            textAnchor="middle"
          >
            {shortDate(p.date)}
          </text>
        );
      })}
    </svg>
  );
}

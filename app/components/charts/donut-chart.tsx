export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

// Donut SVG propio con label central (total) y leyenda.
export default function DonutChart({ data }: { data: DonutDatum[] }) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const R = 60;
  const strokeWidth = 18;
  const C = 2 * Math.PI * R;
  const size = (R + strokeWidth) * 2;

  let acc = 0;
  const segments = data.map((d) => {
    const frac = total === 0 ? 0 : d.value / total;
    const dash = frac * C;
    const seg = { ...d, dash, offset: acc };
    acc += dash;
    return seg;
  });

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="shrink-0"
        role="img"
        aria-label="Gráfico de dona"
      >
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {segments.map((s) => (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${s.dash} ${C - s.dash}`}
              strokeDashoffset={-s.offset}
            />
          ))}
        </g>
        <text
          x={size / 2}
          y={size / 2}
          fill="var(--text)"
          fontSize="24"
          fontFamily="var(--font-geist-mono)"
          fontWeight="600"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {total}
        </text>
      </svg>

      <ul className="flex w-full flex-col gap-2 text-sm">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: d.color }}
              aria-hidden="true"
            />
            <span className="text-text-muted">{d.label}</span>
            <span className="ml-auto font-mono tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

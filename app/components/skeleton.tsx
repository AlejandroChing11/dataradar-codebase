import type { CSSProperties } from "react";

// Skeleton base: bloque con shimmer translúcido sobre el color de superficie.
// El shimmer es un overlay absoluto para no pisar `bg-surface-2` (que es una
// variable CSS; los modificadores de opacidad de Tailwind no funcionan sobre ella).
export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded bg-surface-2 ${className}`}
      style={style}
    >
      <div className="dr-shimmer absolute inset-0" />
    </div>
  );
}

// Réplica del layout de kpi-card.tsx (label + dot + número).
export function KpiCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-3.5 w-24" />
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-surface-2" />
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

const BAR_WIDTHS = ["82%", "48%", "66%", "35%", "90%", "58%", "74%"];

// Barras horizontales de anchos variados (espejo de bar-chart.tsx).
export function BarChartSkeleton({ bars = 7 }: { bars?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-3 w-20 shrink-0" />
          <Skeleton
            className="h-3.5 rounded-sm"
            style={{ width: BAR_WIDTHS[i % BAR_WIDTHS.length] }}
          />
        </div>
      ))}
    </div>
  );
}

// Círculo (donut) + leyenda (espejo de donut-chart.tsx).
export function DonutSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
      <div className="relative h-[156px] w-[156px] shrink-0 overflow-hidden rounded-full">
        <div className="absolute inset-0 rounded-full border-[18px] border-surface-2" />
        <div className="dr-shimmer absolute inset-0 rounded-full" />
      </div>
      <div className="flex w-full flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-surface-2" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="ml-auto h-3 w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Bloque rectangular (espejo de line-chart.tsx).
export function LineChartSkeleton() {
  return <Skeleton className="h-44 w-full" />;
}

// Réplica del layout de vacancy-card.tsx (título, empresa, chips, footer).
export function VacancyCardSkeleton() {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="mt-auto h-4 w-24" />
    </article>
  );
}

// Grid del dashboard: header + 4 KPI + sección de charts.
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <div className="mt-2 flex-1 rounded-xl border border-border bg-surface p-5">
            <BarChartSkeleton />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-44" />
          <div className="mt-2 flex-1 rounded-xl border border-border bg-surface p-5">
            <DonutSkeleton />
          </div>
        </div>

        <div className="flex flex-col gap-2 md:col-span-2 xl:col-span-1">
          <Skeleton className="h-5 w-48" />
          <div className="mt-2 flex-1 rounded-xl border border-border bg-surface p-5">
            <LineChartSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

// Grid genérico de cards (empresas/vacantes) con `count` opcional.
export function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-3 w-1/2" />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-surface-2" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}

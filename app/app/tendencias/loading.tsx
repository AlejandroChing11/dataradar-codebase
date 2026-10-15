import { BarChartSkeleton, Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-2 h-6 w-16" />
            <Skeleton className="mt-1 h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <div className="mt-2 rounded-xl border border-border bg-surface p-5">
            <BarChartSkeleton />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-44" />
          <div className="mt-2 rounded-xl border border-border bg-surface p-5">
            <BarChartSkeleton bars={6} />
          </div>
        </div>
      </div>
    </div>
  );
}

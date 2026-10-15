import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-4 w-32" />

      {/* Header: badges + título + empresa + callout + botón */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-6">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="mt-1 h-8 w-3/4 max-w-md" />
        <Skeleton className="h-4 w-1/2 max-w-sm" />
        <Skeleton className="mt-1 h-16 w-full max-w-lg" />
        <Skeleton className="h-11 w-36" />
      </div>

      {/* Grid: columna principal + aside */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-44" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-32" />
            <div className="mt-2 flex flex-col">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 border-b border-border py-3"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-28" />
            <div className="mt-2 rounded-xl border border-border bg-surface p-5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="mt-2 h-4 w-24" />
              <Skeleton className="mt-4 h-4 w-40" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-24" />
            <div className="mt-2 rounded-xl border border-border bg-surface p-5">
              <Skeleton className="h-11 w-36" />
              <Skeleton className="mt-3 h-3 w-48" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

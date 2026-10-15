"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Select, { type SelectOption } from "./select";

const DEFAULT_PER_PAGE_OPTIONS = [12, 24, 48];

type PageItem = number | "…";

// Genera la lista de páginas a mostrar: siempre la primera y la última,
// más una ventana de ±1 alrededor de la página actual, con elipsis en los huecos.
function pageItems(page: number, totalPages: number): PageItem[] {
  const wanted = new Set<number>([1, totalPages]);
  for (let p = page - 1; p <= page + 1; p++) {
    if (p >= 1 && p <= totalPages) wanted.add(p);
  }
  const sorted = [...wanted].sort((a, b) => a - b);
  const out: PageItem[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export default function Pagination({
  page,
  totalPages,
  total,
  perPage,
  perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
}: {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  perPageOptions?: number[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Arma un href preservando los params actuales y aplicando solo el patch.
  function hrefFor(patch: Record<string, string | null>): string {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  // La página 1 se representa sin el param `page` (URL limpia).
  function pageHref(n: number): string {
    return hrefFor({ page: n <= 1 ? null : String(n) });
  }

  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const sizeOptions: SelectOption[] = perPageOptions.map((n) => ({
    value: String(n),
    label: `${n} por página`,
  }));

  const pages = pageItems(page, totalPages);
  const showNumberBar = totalPages > 1;

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-muted">
          {total === 0
            ? "0 resultados"
            : `Mostrando ${start}–${end} de ${total} resultado${total === 1 ? "" : "s"}`}
        </p>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>Por página</span>
          <Select
            value={String(perPage)}
            onChange={(v) =>
              router.replace(hrefFor({ size: v, page: "1" }), { scroll: false })
            }
            options={sizeOptions}
            ariaLabel="Resultados por página"
          />
        </div>
      </div>

      {showNumberBar && (
        <nav
          aria-label="Paginación"
          className="flex flex-wrap items-center justify-center gap-1.5"
        >
          <Link
            href={page > 1 ? pageHref(page - 1) : pathname}
            aria-disabled={page <= 1}
            className={`rounded-md border border-border px-3 py-1.5 text-sm transition-colors ${
              page <= 1
                ? "pointer-events-none text-text-muted opacity-50"
                : "text-text hover:bg-surface-2"
            }`}
          >
            Anterior
          </Link>

          {pages.map((item, i) =>
            typeof item === "number" ? (
              <Link
                key={item}
                href={pageHref(item)}
                aria-current={item === page ? "page" : undefined}
                className={`rounded-md border px-2.5 py-1.5 font-mono text-sm tabular-nums transition-colors ${
                  item === page
                    ? "border-primary bg-primary text-bg"
                    : "border-border text-text-muted hover:bg-surface-2"
                }`}
              >
                {item}
              </Link>
            ) : (
              <span
                key={`ellipsis-${i}`}
                className="px-1.5 py-1.5 font-mono text-sm text-text-muted"
              >
                {item}
              </span>
            )
          )}

          <Link
            href={page < totalPages ? pageHref(page + 1) : pathname}
            aria-disabled={page >= totalPages}
            className={`rounded-md border border-border px-3 py-1.5 text-sm transition-colors ${
              page >= totalPages
                ? "pointer-events-none text-text-muted opacity-50"
                : "text-text hover:bg-surface-2"
            }`}
          >
            Siguiente
          </Link>
        </nav>
      )}
    </div>
  );
}

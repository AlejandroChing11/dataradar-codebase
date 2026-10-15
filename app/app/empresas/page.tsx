import { getCompanies } from "@/lib/data";
import type { Company } from "@/lib/types";
import { Badge } from "@/components/badge";

export const revalidate = 3600; // Refresca el radar cada hora (ISR)

interface Signals {
  level: string;
  source: string;
}

function parseSignals(signals: unknown): Signals | null {
  if (!signals || typeof signals !== "object") return null;
  const s = signals as Record<string, unknown>;
  const level = typeof s.level === "string" ? s.level : "";
  const source = typeof s.source === "string" ? s.source : "";
  if (!level && !source) return null;
  return { level, source };
}

const LEVEL_COLORS: Record<string, string> = {
  alta: "var(--success)",
  media: "var(--warning)",
  baja: "var(--text-muted)",
};

function CompanyCard({ company }: { company: Company }) {
  const signals = parseSignals(company.signals);
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 transition-colors hover:bg-surface-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug">{company.name}</h3>
          <p className="mt-1 text-sm text-text-muted">
            {[company.hq, company.country].filter(Boolean).join(" · ")}
          </p>
        </div>
        {company.open_de_roles ? (
          <Badge tone="success">Roles DE abiertos</Badge>
        ) : (
          <Badge tone="muted">Sin roles abiertos</Badge>
        )}
      </div>

      {signals && (
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: LEVEL_COLORS[signals.level] ?? "var(--text-muted)" }}
            aria-hidden="true"
          />
          <span>Actividad {signals.level}</span>
          <span className="text-text-muted">·</span>
          <span className="truncate">{signals.source}</span>
        </div>
      )}

      {company.open_de_roles_detail && (
        <p className="text-sm text-text-muted">{company.open_de_roles_detail}</p>
      )}

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-strong"
          >
            Web
          </a>
        )}
        {company.careers_url && (
          <a
            href={company.careers_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-strong"
          >
            Empleos
          </a>
        )}
        {company.linkedin && (
          <a
            href={company.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-strong"
          >
            LinkedIn
          </a>
        )}
      </div>
    </article>
  );
}

export default async function EmpresasPage() {
  const companies = await getCompanies();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Empresas</h1>
        <p className="max-w-2xl text-text-muted">
          Empresas de LATAM y España rastreadas por sus roles de data remotos.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((c) => (
          <CompanyCard key={c.id} company={c} />
        ))}
      </div>
    </div>
  );
}

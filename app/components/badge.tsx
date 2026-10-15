import type { WorkMode } from "@/lib/types";

export type BadgeTone = "success" | "info" | "warning" | "danger" | "muted";

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "border-success text-success",
  info: "border-info text-info",
  warning: "border-warning text-warning",
  danger: "border-danger text-danger",
  muted: "border-border text-text-muted",
};

export const WORK_MODE_META: Record<WorkMode, { label: string; tone: BadgeTone }> = {
  remote_full: { label: "100% remoto", tone: "success" },
  remote_country: { label: "Remoto país", tone: "info" },
  hybrid: { label: "Híbrido", tone: "warning" },
  onsite: { label: "Presencial", tone: "danger" },
};

export function Badge({
  tone = "muted",
  children,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}

export function WorkModeBadge({ mode }: { mode: WorkMode }) {
  const meta = WORK_MODE_META[mode];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export function StatusBadge({ active }: { active: boolean }) {
  return active ? <Badge tone="success">Activa</Badge> : <Badge tone="muted">Inactiva</Badge>;
}

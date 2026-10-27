"use client";

import type { WorkMode } from "@/lib/types";
import { useLang } from "@/components/providers";
import { DICT } from "@/lib/i18n";

export type BadgeTone = "success" | "info" | "warning" | "danger" | "muted" | "accent";

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "border-success text-success",
  info: "border-info text-info",
  warning: "border-warning text-warning",
  danger: "border-danger text-danger",
  muted: "border-border text-text-muted",
  accent: "border-accent text-accent",
};

const WORK_MODE_TONE: Record<WorkMode, BadgeTone> = {
  remote_full: "success",
  remote_country: "info",
  hybrid: "warning",
  onsite: "danger",
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
  const { lang } = useLang();
  const label = DICT[lang].common.workModes[mode];
  return <Badge tone={WORK_MODE_TONE[mode]}>{label}</Badge>;
}

export function StatusBadge({ active }: { active: boolean }) {
  const { lang } = useLang();
  const label = active ? DICT[lang].common.active : DICT[lang].common.inactive;
  return active ? <Badge tone="success">{label}</Badge> : <Badge tone="muted">{label}</Badge>;
}

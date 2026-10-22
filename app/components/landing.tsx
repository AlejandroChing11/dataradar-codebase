"use client";

import Link from "next/link";
import RadarSweep from "@/components/radar-animation";
import DemandBubbles from "@/components/charts/demand-bubbles";
import { useLang } from "@/components/providers";
import { DICT } from "@/lib/i18n";

export interface LandingData {
  activeVacancies: number;
  newToday: number;
  newThisWeek: number;
  companiesTracked: number;
  topTech: { name: string; count: number }[];
  fresh: {
    id: string;
    title: string;
    company_name: string;
    block: string;
    is_active: boolean;
    technologies: string[];
  }[];
}

const BTN_PRIMARY =
  "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-bg transition-colors hover:bg-primary-strong";
const BTN_GHOST =
  "inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 font-medium text-text transition-colors hover:border-primary/60 hover:text-primary";

function fmt(n: number) {
  return (n ?? 0).toLocaleString("es-CO");
}

export default function Landing({ data }: { data: LandingData }) {
  const { lang } = useLang();
  const t = DICT[lang];

  return (
    <div className="flex flex-col gap-16 sm:gap-20">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="dr-grid relative grid items-center gap-10 overflow-hidden rounded-3xl border border-border bg-surface/40 p-6 sm:p-10 lg:grid-cols-[1.25fr_0.75fr]">
        {/* halo de color detrás */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-10 h-60 w-60 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--accent)" }}
        />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-primary">
            <span className="dr-live size-2 rounded-full bg-primary" />
            {t.heroBadge}
          </span>

          <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {t.heroTitlePre}{" "}
            <span className="dr-grad">{fmt(data.activeVacancies)}</span>{" "}
            {t.heroTitlePost}
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-lg text-text-muted">
            {t.heroSubPre}
            <strong className="font-semibold text-text">{t.heroSubStrong1}</strong>
            {t.heroSubMid}
            <strong className="font-semibold text-text">{t.heroSubStrong2}</strong>
            {t.heroSubPost}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/vacantes" className={BTN_PRIMARY}>
              {t.ctaPrimary}
            </Link>
            <Link href="/tendencias" className={BTN_GHOST}>
              {t.ctaGhost}
            </Link>
          </div>
        </div>

        <div className="relative grid place-items-center">
          <div className="dr-glow">
            <RadarSweep size={248} />
          </div>
          <span className="absolute -bottom-1 rounded-full border border-success/40 bg-success/10 px-3 py-1 font-mono text-xs text-success">
            {t.chipToday(fmt(data.newToday))}
          </span>
        </div>
      </section>

      {/* ═══════════════ FRANJA DE INDICADORES ═══════════════ */}
      <section className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {[
          { v: data.activeVacancies, l: t.statActive, c: "text-primary" },
          { v: data.newToday, l: t.statToday, c: "text-success" },
          { v: data.newThisWeek, l: t.statWeek, c: "text-info" },
          { v: data.companiesTracked, l: t.statCompanies, c: "text-accent" },
        ].map((s) => (
          <div key={s.l}>
            <div className={`font-mono text-4xl font-bold tracking-tight sm:text-5xl ${s.c}`}>
              {fmt(s.v)}
            </div>
            <div className="mt-1 text-sm text-text-muted">{s.l}</div>
          </div>
        ))}
      </section>

      {/* ═══════════════ LO QUE PIDE EL MERCADO ═══════════════ */}
      <section>
        <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          {t.stackTitlePre} <span className="dr-grad">{t.stackTitleHl}</span>
        </h2>
        <p className="mt-2 max-w-xl text-text-muted">{t.stackSub}</p>

        <div className="mt-8">
          <DemandBubbles items={data.topTech} />
        </div>
      </section>

      {/* ═══════════════ RECIÉN CAPTURADAS ═══════════════ */}
      {data.fresh.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              {t.freshTitle} <span aria-hidden>📡</span>
            </h2>
            <Link
              href="/vacantes"
              className="shrink-0 font-mono text-sm text-primary hover:underline"
            >
              {t.freshSeeAll}
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {data.fresh.map((v) => {
              const isCol = v.block === "colombia";
              const badgeBg = isCol
                ? "color-mix(in oklab, var(--accent) 16%, transparent)"
                : "color-mix(in oklab, var(--primary) 16%, transparent)";
              const badgeFg = isCol ? "var(--accent)" : "var(--primary)";
              return (
                <Link
                  key={v.id}
                  href={`/vacantes/${v.id}`}
                  className="dr-card-glow group flex flex-col rounded-xl border border-border bg-surface p-5"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 font-mono text-[11px]"
                      style={{ background: badgeBg, color: badgeFg }}
                    >
                      {isCol ? t.blockCol : t.blockRest}
                    </span>
                    {v.is_active && (
                      <span className="font-mono text-[11px] text-success">
                        {t.active}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-pretty font-semibold leading-snug transition-colors group-hover:text-primary">
                    {v.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-text-muted">{v.company_name}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {v.technologies.slice(0, 3).map((tk) => (
                      <span
                        key={tk}
                        className="rounded border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-text-muted"
                      >
                        {tk}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══════════════ CIERRE — EL RADAR NO DUERME ═══════════════ */}
      <section className="dr-grid relative overflow-hidden rounded-3xl border border-accent/30 bg-accent/5 p-8 text-center sm:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
        <h2 className="relative text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          {t.closingTitle} <span aria-hidden>☕</span>
        </h2>
        <p className="relative mx-auto mt-3 max-w-lg text-pretty text-text-muted">
          {t.closingSub}
        </p>
        <Link href="/vacantes" className={`${BTN_PRIMARY} relative mt-7`}>
          {t.closingCta}
        </Link>
      </section>
    </div>
  );
}

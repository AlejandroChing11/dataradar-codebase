"use client";

import Link from "next/link";
import RadarSweep from "@/components/radar-animation";
import { useLang } from "@/components/providers";
import { DICT } from "@/lib/i18n";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { lang } = useLang();
  const t = DICT[lang].misc;

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <RadarSweep size={180} />

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t.errorTitle}</h1>
        <p className="max-w-md text-text-muted">
          {t.errorSub}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-[#06281f] transition-colors hover:bg-primary-strong"
        >
          {t.retry}
        </button>
        <Link
          href="/"
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-2"
        >
          {t.backHome}
        </Link>
      </div>
    </div>
  );
}

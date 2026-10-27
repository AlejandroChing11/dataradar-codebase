"use client";

import { useLang } from "@/components/providers";
import { DICT } from "@/lib/i18n";

export default function Footer() {
  const { lang } = useLang();
  const t = DICT[lang].footer;

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-text-muted sm:flex-row sm:px-6">
        <p>{t.tagline}</p>
        <p className="font-mono text-xs">{t.mvp}</p>
      </div>
    </footer>
  );
}

"use client";

import { useLang } from "@/components/providers";
import type { Lang } from "@/lib/i18n";

const OPTIONS: Lang[] = ["es", "en"];

export default function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Idioma"
      className="flex items-center rounded-md border border-border p-0.5 font-mono text-xs"
    >
      {OPTIONS.map((opt) => {
        const active = lang === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => setLang(opt)}
            aria-pressed={active}
            className={`rounded px-2 py-1 uppercase transition-colors ${
              active
                ? "bg-primary text-bg"
                : "text-text-muted hover:text-text"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

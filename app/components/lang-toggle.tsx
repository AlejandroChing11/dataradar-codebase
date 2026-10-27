"use client";

import { useRouter } from "next/navigation";
import { useLang } from "@/components/providers";
import { DICT, type Lang } from "@/lib/i18n";

const OPTIONS: Lang[] = ["es", "en"];

export default function LangToggle() {
  const { lang, setLang } = useLang();
  const router = useRouter();
  const langAria = DICT[lang].misc.langAria;

  function choose(opt: Lang) {
    if (opt === lang) return;
    setLang(opt);
    // Re-renderiza el árbol server (páginas y layout) con la cookie actualizada.
    router.refresh();
  }

  return (
    <div
      role="group"
      aria-label={langAria}
      className="flex items-center rounded-md border border-border p-0.5 font-mono text-xs"
    >
      {OPTIONS.map((opt) => {
        const active = lang === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => choose(opt)}
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

import Link from "next/link";
import RadarSweep from "@/components/radar-animation";
import { getServerLang } from "@/lib/server-i18n";
import { DICT } from "@/lib/i18n";

export default async function NotFound() {
  const lang = await getServerLang();
  const t = DICT[lang].misc;

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <RadarSweep size={200} />

      <p className="dr-fade-up font-mono text-7xl font-semibold tabular-nums tracking-tight text-primary sm:text-8xl">
        404
      </p>

      <div
        className="dr-fade-up flex flex-col items-center gap-2"
        style={{ animationDelay: "0.1s" }}
      >
        <h1 className="text-2xl font-semibold tracking-tight">{t.notFoundTitle}</h1>
        <p className="max-w-md text-text-muted">
          {t.notFoundSub}
        </p>
      </div>

      <div className="dr-fade-up" style={{ animationDelay: "0.2s" }}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-[#06281f] transition-colors hover:bg-primary-strong"
        >
          {t.backHome}
        </Link>
      </div>
    </div>
  );
}

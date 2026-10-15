import Link from "next/link";
import RadarSweep from "@/components/radar-animation";

export default function NotFound() {
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
        <h1 className="text-2xl font-semibold tracking-tight">Señal perdida</h1>
        <p className="max-w-md text-text-muted">
          No encontramos la ruta que buscabas en el radar.
        </p>
      </div>

      <div className="dr-fade-up" style={{ animationDelay: "0.2s" }}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-[#06281f] transition-colors hover:bg-primary-strong"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}

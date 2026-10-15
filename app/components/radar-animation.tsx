// Radar animado reutilizable para estados vacíos/de error (404, error boundary).
// Es un componente server: solo usa animaciones CSS definidas en globals.css
// (dr-radar-sweep, dr-blip). El barrido es una cuña teal translúcida que rota
// 360° de forma lineal; los blips pulsan con retardo escalonado.
export default function RadarSweep({ size = 180 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      aria-hidden="true"
      className="mx-auto block"
    >
      <defs>
        <radialGradient
          id="dr-sweep-gradient"
          gradientUnits="userSpaceOnUse"
          cx="100"
          cy="100"
          r="90"
        >
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
          <stop offset="70%" stopColor="var(--primary)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Retícula: círculos concéntricos + cruz sutil */}
      <circle cx="100" cy="100" r="30" fill="none" stroke="var(--border)" strokeWidth="1" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="var(--border)" strokeWidth="1" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="var(--border)" strokeWidth="1" />
      <line x1="100" y1="0" x2="100" y2="200" stroke="var(--border)" strokeWidth="1" opacity="0.4" />
      <line x1="0" y1="100" x2="200" y2="100" stroke="var(--border)" strokeWidth="1" opacity="0.4" />

      {/* Barrido rotatorio */}
      <g className="dr-sweep">
        <path d="M100,100 L100,10 A90,90 0 0 1 177.94,55 Z" fill="url(#dr-sweep-gradient)" />
      </g>

      {/* Blips con pulso escalonado */}
      <circle cx="138" cy="78" r="4" fill="var(--primary)" className="dr-blip" />
      <circle
        cx="62"
        cy="52"
        r="3"
        fill="var(--accent)"
        className="dr-blip"
        style={{ animationDelay: "0.7s" }}
      />
      <circle
        cx="152"
        cy="132"
        r="3.5"
        fill="var(--primary)"
        className="dr-blip"
        style={{ animationDelay: "1.4s" }}
      />
    </svg>
  );
}

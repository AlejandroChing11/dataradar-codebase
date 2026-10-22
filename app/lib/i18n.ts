// Internacionalización — SOLO la landing (los datos no se traducen: títulos de
// vacantes, nombres de empresa y tecnologías vienen tal cual de la fuente).

export type Lang = "es" | "en";

export interface LandingDict {
  heroBadge: string;
  heroTitlePre: string; // antes del número
  heroTitlePost: string; // después del número
  heroSub: (parts: { diaHabil: string; remoto: string }) => string; // no se usa; ver abajo
  heroSubPre: string;
  heroSubStrong1: string;
  heroSubMid: string;
  heroSubStrong2: string;
  heroSubPost: string;
  ctaPrimary: string;
  ctaGhost: string;
  chipToday: (n: string) => string;
  statActive: string;
  statToday: string;
  statWeek: string;
  statCompanies: string;
  stackTitlePre: string;
  stackTitleHl: string;
  stackSub: string;
  freshTitle: string;
  freshSeeAll: string;
  blockCol: string;
  blockRest: string;
  active: string;
  closingTitle: string;
  closingSub: string;
  closingCta: string;
  langLabel: string;
  themeLight: string;
  themeDark: string;
}

export const DICT: Record<Lang, LandingDict> = {
  es: {
    heroBadge: "en vivo · actualizado hoy",
    heroTitlePre: "Leímos",
    heroTitlePost: "vacantes de data para que tú no tengas que hacerlo.",
    heroSub: () => "",
    heroSubPre: "Nuestro radar barre LinkedIn, Tecnoempleo y más ",
    heroSubStrong1: "cada día hábil",
    heroSubMid: ", filtra el ruido —adiós body shops y “senior disfrazado de junior”— y te deja solo lo ",
    heroSubStrong2: "100% remoto",
    heroSubPost: " para LATAM y España.",
    ctaPrimary: "Ver vacantes →",
    ctaGhost: "Tendencias del mercado",
    chipToday: (n) => `+${n} nuevas hoy`,
    statActive: "vacantes activas",
    statToday: "nuevas hoy",
    statWeek: "esta semana",
    statCompanies: "empresas rastreadas",
    stackTitlePre: "El stack que más piden",
    stackTitleHl: "ahora mismo",
    stackSub:
      "Frecuencia real en las vacantes que el radar capturó. Si lo tienes, aplícale sin miedo.",
    freshTitle: "Recién capturadas",
    freshSeeAll: "ver todas →",
    blockCol: "🇨🇴 Colombia",
    blockRest: "🌎 Resto",
    active: "● activa",
    closingTitle: "El radar no duerme",
    closingSub:
      "Corre de lunes a viernes a las 8:44 am (hora Colombia): lee las vacantes nuevas, descarta el ruido y actualiza todo esto solo. Tú solo llega a leer.",
    closingCta: "Explorar el radar →",
    langLabel: "Idioma",
    themeLight: "Tema claro",
    themeDark: "Tema oscuro",
  },
  en: {
    heroBadge: "live · updated today",
    heroTitlePre: "We read",
    heroTitlePost: "data jobs so you don't have to.",
    heroSub: () => "",
    heroSubPre: "Our radar sweeps LinkedIn, Tecnoempleo and more ",
    heroSubStrong1: "every business day",
    heroSubMid: ", filters out the noise —no body shops, no “senior disguised as junior”— and leaves you only the ",
    heroSubStrong2: "100% remote",
    heroSubPost: " roles for LATAM and Spain.",
    ctaPrimary: "Browse jobs →",
    ctaGhost: "Market trends",
    chipToday: (n) => `+${n} new today`,
    statActive: "active jobs",
    statToday: "new today",
    statWeek: "this week",
    statCompanies: "companies tracked",
    stackTitlePre: "The stack everyone wants",
    stackTitleHl: "right now",
    stackSub:
      "Real frequency across the jobs the radar captured. If you've got it, apply with confidence.",
    freshTitle: "Just captured",
    freshSeeAll: "see all →",
    blockCol: "🇨🇴 Colombia",
    blockRest: "🌎 Rest",
    active: "● active",
    closingTitle: "The radar never sleeps",
    closingSub:
      "It runs Monday to Friday at 8:44 am (Colombia time): reads the new jobs, drops the noise and refreshes all of this on its own. You just show up to read.",
    closingCta: "Explore the radar →",
    langLabel: "Language",
    themeLight: "Light theme",
    themeDark: "Dark theme",
  },
};

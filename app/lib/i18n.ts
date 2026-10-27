// Internacionalización de TODA la UI (ES/EN).
//
// Los datos NO se traducen: títulos de vacante, nombres de empresa,
// tecnologías y fit_line vienen tal cual de la fuente. Este diccionario
// solo cubre la interfaz (labels, filtros, botones, encabezados, etc.).

import type { WorkMode } from "./types";

export type Lang = "es" | "en";

/* ===================== Landing ===================== */

export interface LandingDict {
  heroBadge: string;
  heroTitlePre: string; // antes del número
  heroTitlePost: string; // después del número
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

/* ===================== Dict completo ===================== */

export interface Dict {
  nav: {
    home: string;
    vacancies: string;
    companies: string;
    trends: string;
    tagline: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    tagline: string;
    mvp: string;
  };
  landing: LandingDict;
  common: {
    workModes: Record<WorkMode, string>;
    active: string;
    inactive: string;
    newLabel: string;
    colombia: string;
    rest: string;
    company: string;
    viewDetail: string;
    viewOffer: string;
  };
  vacancies: {
    eyebrow: string;
    title: string;
    highlight: string;
    subtitle: string;
    search: string;
    searchPlaceholder: string;
    block: string;
    technology: string;
    minYears: string;
    maxYears: string;
    mode: string;
    status: string;
    language: string;
    portal: string;
    all: string;
    allF: string;
    active: string;
    inactive: string;
    requiresEnglish: string;
    noEnglish: string;
    results: (n: number) => string;
    clearFilters: string;
    noResults: string;
  };
  companies: {
    eyebrow: string;
    title: string;
    highlight: string;
    subtitle: string;
    rolesOpen: string;
    noRoles: string;
    activity: (level: string) => string;
    web: string;
    jobs: string;
    linkedin: string;
  };
  trends: {
    eyebrow: string;
    title: string;
    highlight: string;
    subtitle: string;
    remoteCol: string;
    remoteRest: string;
    remoteNoteCol: string;
    remoteNoteRest: string;
    avgMinCol: string;
    avgMinRest: string;
    avgNote: string;
    repost: string;
    repostNote: (n: number) => string;
    topTitle: string;
    topSubtitle: string;
    funnelTitle: string;
    funnelSubtitle: string;
    activeCount: string;
    closedCount: string;
    discardRate: string;
    discardReasons: {
      closed: string;
      repost: string;
      notRemote: string;
      english: string;
    };
  };
  detail: {
    back: string;
    apply: string;
    applyUnavailable: string;
    noLink: string;
    redirectNote: string;
    stackTitle: string;
    noStack: string;
    required: string;
    valued: string;
    detailsTitle: string;
    companyTitle: string;
    applyTitle: string;
    years: string;
    salary: string;
    language: string;
    mode: string;
    remote: string;
    portal: string;
    published: string;
    firstSeen: string;
    lastSeen: string;
    timesSeen: string;
    repost: string;
    notPublished: string;
    yes: string;
    no: string;
  };
  pagination: {
    showing: (start: number, end: number, total: number) => string;
    zeroResults: string;
    perPage: string;
    perPageOption: (n: number) => string;
    perPageAria: string;
    previous: string;
    next: string;
    paginationAria: string;
  };
  select: {
    noOptions: string;
  };
  misc: {
    notFoundTitle: string;
    notFoundSub: string;
    backHome: string;
    errorTitle: string;
    errorSub: string;
    retry: string;
    langAria: string;
  };
}

/* ===================== Helpers ===================== */

// Etiqueta de años de experiencia, localizada.
export function yearsLabel(
  lang: Lang,
  min: number | null,
  max: number | null
): string {
  const isEn = lang === "en";
  if (min === null && max === null) {
    return isEn ? "No years requirement" : "Sin requisito de años";
  }
  if (min === null) {
    return isEn ? `Up to ${max} years` : `Hasta ${max} años`;
  }
  if (max === null) {
    return isEn ? `${min}+ years` : `${min}+ años`;
  }
  if (min === max) {
    return isEn ? `${min} year${min === 1 ? "" : "s"}` : `${min} año${min === 1 ? "" : "s"}`;
  }
  return isEn ? `${min}–${max} years` : `${min}–${max} años`;
}

/* ===================== Diccionarios ===================== */

const ES: Dict = {
  nav: {
    home: "Inicio",
    vacancies: "Vacantes",
    companies: "Empresas",
    trends: "Tendencias",
    tagline: "Tu radar de vacantes de data, 100% remotas.",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  footer: {
    tagline: "Tu radar de vacantes de data, 100% remotas.",
    mvp: "DataRadar · MVP",
  },
  landing: {
    heroBadge: "en vivo · actualizado hoy",
    heroTitlePre: "Leímos",
    heroTitlePost: "vacantes de data para que tú no tengas que hacerlo.",
    heroSubPre: "Nuestro radar barre LinkedIn, Tecnoempleo y más ",
    heroSubStrong1: "cada día hábil",
    heroSubMid:
      ", filtra el ruido —adiós body shops y “senior disfrazado de junior”— y te deja solo lo ",
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
  common: {
    workModes: {
      remote_full: "100% remoto",
      remote_country: "Remoto país",
      hybrid: "Híbrido",
      onsite: "Presencial",
    },
    active: "Activa",
    inactive: "Inactiva",
    newLabel: "Nuevo",
    colombia: "Colombia",
    rest: "Resto",
    company: "Empresa",
    viewDetail: "Ver detalle",
    viewOffer: "Ver oferta",
  },
  vacancies: {
    eyebrow: "El radar · señales en crudo",
    title: "Vacantes",
    highlight: "al detalle",
    subtitle:
      "Explora y filtra las vacantes de data remotas que el radar capturó, 100% para LATAM y España.",
    search: "Buscar",
    searchPlaceholder: "Título o empresa",
    block: "Bloque",
    technology: "Tecnología",
    minYears: "Años mín.",
    maxYears: "Años máx.",
    mode: "Modalidad",
    status: "Estado",
    language: "Idioma",
    portal: "Portal",
    all: "Todos",
    allF: "Todas",
    active: "Activas",
    inactive: "Inactivas",
    requiresEnglish: "Requiere inglés",
    noEnglish: "Sin inglés",
    results: (n) => `${n} resultado${n === 1 ? "" : "s"}`,
    clearFilters: "Limpiar filtros",
    noResults: "No hay vacantes que coincidan con los filtros seleccionados.",
  },
  companies: {
    eyebrow: "El radar · quién contrata",
    title: "Empresas",
    highlight: "en la mira",
    subtitle: "Empresas de LATAM y España rastreadas por sus roles de data remotos.",
    rolesOpen: "Roles DE abiertos",
    noRoles: "Sin roles abiertos",
    activity: (level) => `Actividad ${level}`,
    web: "Web",
    jobs: "Empleos",
    linkedin: "LinkedIn",
  },
  trends: {
    eyebrow: "El radar · lectura del mercado",
    title: "Tendencias",
    highlight: "del mercado",
    subtitle: "Señales del mercado: modalidad, seniority y descartes sobre las vacantes rastreadas.",
    remoteCol: "100% remoto — Colombia",
    remoteRest: "100% remoto — Resto",
    remoteNoteCol: "Sobre las vacantes de Colombia",
    remoteNoteRest: "Sobre las vacantes del resto",
    avgMinCol: "Media de años mínimos — Colombia",
    avgMinRest: "Media de años mínimos — Resto",
    avgNote: "Requisito junior/mid",
    repost: "Repost rate",
    repostNote: (n) => `${n} vacantes activas`,
    topTitle: "Lo que más piden",
    topSubtitle:
      "Frecuencia de tecnologías en las vacantes — cada blip es una tecnología, más grande = más pedida",
    funnelTitle: "Embudo de descartes",
    funnelSubtitle: "Señales de descarte derivadas de las vacantes",
    activeCount: "Vacantes activas",
    closedCount: "Cerradas o vencidas",
    discardRate: "Tasa de descarte",
    discardReasons: {
      closed: "Cerradas o vencidas",
      repost: "Duplicadas (repost)",
      notRemote: "No 100% remotas",
      english: "Inglés avanzado exigido",
    },
  },
  detail: {
    back: "Volver a vacantes",
    apply: "Aplicar",
    applyUnavailable: "Link de aplicación no disponible",
    noLink: "Link no disponible",
    redirectNote: "Redirige al portal original de la oferta.",
    stackTitle: "Stack tecnológico",
    noStack: "Sin stack registrado",
    required: "Requeridas",
    valued: "Valoradas",
    detailsTitle: "Detalles",
    companyTitle: "Empresa",
    applyTitle: "Aplicar",
    years: "Años",
    salary: "Salario",
    language: "Idioma",
    mode: "Modalidad",
    remote: "Remoto",
    portal: "Portal",
    published: "Publicado",
    firstSeen: "Primer avistamiento",
    lastSeen: "Último avistamiento",
    timesSeen: "Veces visto",
    repost: "Repost",
    notPublished: "No publicado",
    yes: "Sí",
    no: "No",
  },
  pagination: {
    showing: (start, end, total) => `Mostrando ${start}–${end} de ${total} resultado${total === 1 ? "" : "s"}`,
    zeroResults: "0 resultados",
    perPage: "Por página",
    perPageOption: (n) => `${n} por página`,
    perPageAria: "Resultados por página",
    previous: "Anterior",
    next: "Siguiente",
    paginationAria: "Paginación",
  },
  select: {
    noOptions: "Sin opciones",
  },
  misc: {
    notFoundTitle: "Señal perdida",
    notFoundSub: "No encontramos la ruta que buscabas en el radar.",
    backHome: "Volver al dashboard",
    errorTitle: "Algo salió mal",
    errorSub: "Ocurrió un error inesperado al cargar el radar. Probá de nuevo en unos segundos.",
    retry: "Reintentar",
    langAria: "Idioma",
  },
};

const EN: Dict = {
  nav: {
    home: "Home",
    vacancies: "Jobs",
    companies: "Companies",
    trends: "Trends",
    tagline: "Your remote data jobs radar.",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  footer: {
    tagline: "Your remote data jobs radar.",
    mvp: "DataRadar · MVP",
  },
  landing: {
    heroBadge: "live · updated today",
    heroTitlePre: "We read",
    heroTitlePost: "data jobs so you don't have to.",
    heroSubPre: "Our radar sweeps LinkedIn, Tecnoempleo and more ",
    heroSubStrong1: "every business day",
    heroSubMid:
      ", filters out the noise —no body shops, no “senior disguised as junior”— and leaves you only the ",
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
  common: {
    workModes: {
      remote_full: "100% remote",
      remote_country: "Remote country",
      hybrid: "Hybrid",
      onsite: "On-site",
    },
    active: "Active",
    inactive: "Inactive",
    newLabel: "New",
    colombia: "Colombia",
    rest: "Rest",
    company: "Company",
    viewDetail: "View detail",
    viewOffer: "View offer",
  },
  vacancies: {
    eyebrow: "The radar · raw signals",
    title: "Jobs",
    highlight: "in detail",
    subtitle:
      "Explore and filter the remote data jobs the radar captured, 100% for LATAM and Spain.",
    search: "Search",
    searchPlaceholder: "Title or company",
    block: "Block",
    technology: "Technology",
    minYears: "Min. years",
    maxYears: "Max. years",
    mode: "Mode",
    status: "Status",
    language: "Language",
    portal: "Portal",
    all: "All",
    allF: "All",
    active: "Active",
    inactive: "Inactive",
    requiresEnglish: "Requires English",
    noEnglish: "No English",
    results: (n) => `${n} result${n === 1 ? "" : "s"}`,
    clearFilters: "Clear filters",
    noResults: "No jobs match the selected filters.",
  },
  companies: {
    eyebrow: "The radar · who's hiring",
    title: "Companies",
    highlight: "on the radar",
    subtitle: "LATAM and Spain companies tracked for their remote data roles.",
    rolesOpen: "Open DE roles",
    noRoles: "No open roles",
    activity: (level) => `Activity ${level}`,
    web: "Web",
    jobs: "Jobs",
    linkedin: "LinkedIn",
  },
  trends: {
    eyebrow: "The radar · market read",
    title: "Trends",
    highlight: "in the market",
    subtitle: "Market signals: mode, seniority and discards across the tracked jobs.",
    remoteCol: "100% remote — Colombia",
    remoteRest: "100% remote — Rest",
    remoteNoteCol: "Across Colombia jobs",
    remoteNoteRest: "Across the rest",
    avgMinCol: "Avg. minimum years — Colombia",
    avgMinRest: "Avg. minimum years — Rest",
    avgNote: "Junior/mid requirement",
    repost: "Repost rate",
    repostNote: (n) => `${n} active jobs`,
    topTitle: "What they ask for most",
    topSubtitle:
      "Technology frequency across jobs — each blip is a technology, bigger = more requested",
    funnelTitle: "Discard funnel",
    funnelSubtitle: "Discard signals derived from the jobs",
    activeCount: "Active jobs",
    closedCount: "Closed or expired",
    discardRate: "Discard rate",
    discardReasons: {
      closed: "Closed or expired",
      repost: "Duplicates (repost)",
      notRemote: "Not 100% remote",
      english: "Advanced English required",
    },
  },
  detail: {
    back: "Back to jobs",
    apply: "Apply",
    applyUnavailable: "Application link unavailable",
    noLink: "Link unavailable",
    redirectNote: "Redirects to the original job portal.",
    stackTitle: "Tech stack",
    noStack: "No stack recorded",
    required: "Required",
    valued: "Nice to have",
    detailsTitle: "Details",
    companyTitle: "Company",
    applyTitle: "Apply",
    years: "Years",
    salary: "Salary",
    language: "Language",
    mode: "Mode",
    remote: "Remote",
    portal: "Portal",
    published: "Published",
    firstSeen: "First seen",
    lastSeen: "Last seen",
    timesSeen: "Times seen",
    repost: "Repost",
    notPublished: "Not published",
    yes: "Yes",
    no: "No",
  },
  pagination: {
    showing: (start, end, total) => `Showing ${start}–${end} of ${total} result${total === 1 ? "" : "s"}`,
    zeroResults: "0 results",
    perPage: "Per page",
    perPageOption: (n) => `${n} per page`,
    perPageAria: "Results per page",
    previous: "Previous",
    next: "Next",
    paginationAria: "Pagination",
  },
  select: {
    noOptions: "No options",
  },
  misc: {
    notFoundTitle: "Signal lost",
    notFoundSub: "We couldn't find the route you were looking for on the radar.",
    backHome: "Back to dashboard",
    errorTitle: "Something went wrong",
    errorSub: "An unexpected error occurred while loading the radar. Try again in a few seconds.",
    retry: "Retry",
    langAria: "Language",
  },
};

export const DICT: Record<Lang, Dict> = { es: ES, en: EN };

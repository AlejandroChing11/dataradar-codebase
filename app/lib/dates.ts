// Utilidades de fecha deterministas (sin aleatoriedad), relativas a hoy pero estables
// dentro de una misma ejecución. Formato de fecha: "YYYY-MM-DD" en hora local.

export function localDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Fecha de hoy en hora local.
export function today(): string {
  return localDate(new Date());
}

// Fecha de hace n días (n >= 0) en hora local.
export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return localDate(d);
}

// true si la fecha (YYYY-MM-DD) cae dentro de los últimos `days` días, inclusive.
export function isWithinLastDays(date: string, days: number): boolean {
  return date >= daysAgo(days) && date <= today();
}

// Sanitiza URLs que provienen de datos externos (listings de empleo, portales)
// antes de renderizarlas en un <a href>. Solo se permiten esquemas http/https;
// se bloquea javascript:, data:, vbscript:, etc. para prevenir XSS almacenado.

const SAFE_PROTOCOLS = new Set(["http:", "https:"]);

export function safeExternalUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    return SAFE_PROTOCOLS.has(url.protocol) ? trimmed : null;
  } catch {
    // URL inválida o relativa: se descarta en lugar de renderizarla.
    return null;
  }
}

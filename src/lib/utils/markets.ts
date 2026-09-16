export const MARKETS = ["mx", "ar", "es"] as const;

export type Market = (typeof MARKETS)[number];

const LABELS: Record<Market, string> = {
  mx: "México",
  ar: "Argentina",
  es: "España",
};

const HREFLANGS: Record<Market, string> = {
  mx: "es-MX",
  ar: "es-AR",
  es: "es-ES",
};

const FLAGS: Record<Market, string> = {
  mx: "🇲🇽",
  ar: "🇦🇷",
  es: "🇪🇸",
};

// Cada mercado tiene su propia URL raíz (/mx, /ar, /es); el selector del home
// se genera desde acá para que ninguno quede sin acceso propio.
export const MARKET_ENTRIES = MARKETS.map((code) => ({
  code,
  label: LABELS[code],
  flag: FLAGS[code],
  href: `/${code}`,
}));

export const isMarket = (value?: string): value is Market =>
  !!value && (MARKETS as readonly string[]).includes(value);

export const marketLabel = (value?: string) =>
  isMarket(value) ? LABELS[value] : "";

export const marketHreflang = (value?: string) =>
  isMarket(value) ? HREFLANGS[value] : "es";

// Market used as x-default and as the target of market-agnostic links.
export const DEFAULT_MARKET: Market = "mx";

/** Mercado al que pertenece una ruta, o null si es una página global. */
export const marketFromPath = (pathname: string): Market | null => {
  const first = pathname.split("/").filter(Boolean)[0];
  return isMarket(first) ? first : null;
};

/**
 * Reescribe un enlace escrito para el mercado por defecto (/mx/...) al mercado
 * que se está navegando. Evita enlaces cruzados entre países en los bloques
 * compartidos (CTA, FAQ, secciones reutilizadas en las tres versiones).
 */
export const resolveMarketUrl = (url: string, pathname: string): string => {
  const active = marketFromPath(pathname) ?? DEFAULT_MARKET;
  // Un enlace a la raíz de un país (/mx, /ar, /es) es una elección explícita de
  // mercado — el selector de país — y nunca debe reescribirse.
  if (url.startsWith(`/${DEFAULT_MARKET}/`))
    return `/${active}/${url.slice(DEFAULT_MARKET.length + 2)}`;
  return url;
};

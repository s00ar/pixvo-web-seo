import { MARKETS, isMarket } from "@/lib/utils/markets";
import { humanize, plainify } from "@/lib/utils/textConverter";

export interface Crumb {
  /** Texto visible del nivel. */
  name: string;
  /** Ruta absoluta del sitio. Ausente = nivel sin página propia (texto plano). */
  href?: string;
}

/**
 * Etiquetas humanas para los segmentos intermedios de la ruta.
 * Si un segmento no está acá se humaniza el slug ("seo-para-pymes" → "Seo para pymes").
 */
const SEGMENT_LABELS: Record<string, string> = {
  blog: "Blog",
  "casos-de-exito": "Casos de éxito",
  recursos: "Recursos",
  soluciones: "Soluciones",
  problemas: "Problemas",
  proyectos: "Proyectos",
  legal: "Legal",
  careers: "Carreras",
};

/**
 * Rutas que EXISTEN como página índice en el build.
 * Criterio: un nivel intermedio sólo se enlaza si su índice existe realmente;
 * de lo contrario se renderiza como texto sin enlace (evita 404 en breadcrumbs).
 * No existen: /{mercado}/soluciones, /{mercado}/problemas, /proyectos, /legal.
 */
export const INDEX_ROUTES: ReadonlySet<string> = new Set<string>([
  "/",
  "/blog",
  "/careers",
  ...MARKETS.flatMap((market) => [
    `/${market}`,
    `/${market}/casos-de-exito`,
    `/${market}/recursos`,
  ]),
]);

const labelFor = (segment: string) =>
  SEGMENT_LABELS[segment] ?? humanize(segment.replace(/-/g, " "));

/** Normaliza un pathname a la forma "/a/b" (sin barra final, salvo la raíz). */
export const normalizePath = (pathname: string) =>
  pathname.replace(/\/+$/, "") || "/";

/**
 * Construye la ruta de navegación de una página.
 * Devuelve [] para las raíces (`/`, `/mx`, `/ar`, `/es`) y para 404.
 */
export const buildBreadcrumbs = (
  pathname: string,
  pageTitle?: string,
): Crumb[] => {
  const path = normalizePath(pathname);
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) return [];
  if (segments[0] === "404") return [];

  const market = isMarket(segments[0]) ? segments[0] : null;
  // Home nacional (/mx, /ar, /es): es una raíz, no lleva breadcrumb.
  if (market && segments.length === 1) return [];

  const crumbs: Crumb[] = [
    { name: "Inicio", href: market ? `/${market}` : "/" },
  ];

  const start = market ? 1 : 0;
  let accumulated = market ? `/${market}` : "";

  for (let i = start; i < segments.length; i++) {
    const segment = segments[i];
    accumulated += `/${segment}`;
    const isLast = i === segments.length - 1;

    if (isLast) {
      const raw = pageTitle?.trim() ? plainify(pageTitle).trim() : labelFor(segment);
      crumbs.push({ name: raw });
    } else {
      crumbs.push({
        name: labelFor(segment),
        href: INDEX_ROUTES.has(accumulated) ? accumulated : undefined,
      });
    }
  }

  return crumbs;
};

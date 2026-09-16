/**
 * Genera los sitemaps segmentados a partir del BUILD real (`dist/`).
 *
 *   /sitemap_index.xml
 *     ├── sitemap-mx.xml        -> /mx/*
 *     ├── sitemap-ar.xml        -> /ar/*
 *     ├── sitemap-es.xml        -> /es/*
 *     ├── sitemap-blog.xml      -> /blog/*
 *     ├── sitemap-projects.xml  -> /proyectos/*
 *     └── sitemap-pages.xml     -> resto de páginas globales indexables
 *
 * Reglas: se excluyen 404, noindex, URLs con parámetros, duplicados y toda
 * página cuyo <link rel="canonical"> apunte a otra URL (hoy: /about, /contact,
 * /pricing). El canonical se LEE del HTML construido.
 *
 * Reemplaza a @astrojs/sitemap (desactivado en astro.config.mjs).
 */
import {
  SITE,
  MARKETS,
  HREFLANG,
  DEFAULT_MARKET,
  collectPages,
  indexablePages,
  writeOutput,
  removeOutput,
} from "./lib/seo-build.mjs";

const SECTIONS = [
  { key: "mx", file: "sitemap-mx.xml" },
  { key: "ar", file: "sitemap-ar.xml" },
  { key: "es", file: "sitemap-es.xml" },
  { key: "blog", file: "sitemap-blog.xml" },
  { key: "projects", file: "sitemap-projects.xml" },
  { key: "pages", file: "sitemap-pages.xml" },
];

const INDEX_FILE = "sitemap_index.xml";
/** Restos de @astrojs/sitemap que ya no deben publicarse. */
const LEGACY = ["sitemap-index.xml", "sitemap-0.xml"];

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const abs = (u) => `${SITE}${u === "/" ? "/" : u}`;

export function buildSitemaps({ write = true, log = console.log } = {}) {
  const all = collectPages();
  const pages = indexablePages(all);
  const indexableUrls = new Set(pages.map((p) => p.url));

  const bySection = new Map(SECTIONS.map((s) => [s.key, []]));
  for (const p of pages) bySection.get(p.section).push(p);

  const written = [];
  for (const section of SECTIONS) {
    const entries = bySection.get(section.key);
    const isMarket = MARKETS.includes(section.key);

    const urls = entries.map((p) => {
      const parts = [`    <loc>${esc(abs(p.url))}</loc>`, `    <lastmod>${p.lastmod}</lastmod>`];

      if (isMarket) {
        // hreflang recíproco: solo se emite si TODAS las variantes existen
        // como URL indexable del build.
        const rest = p.url.slice(`/${p.market}`.length); // "" o "/soluciones/x"
        const variants = MARKETS.map((m) => [m, `/${m}${rest}`]);
        if (variants.every(([, u]) => indexableUrls.has(u))) {
          for (const [m, u] of variants) {
            parts.push(
              `    <xhtml:link rel="alternate" hreflang="${HREFLANG[m]}" href="${esc(abs(u))}"/>`,
            );
          }
          parts.push(
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(
              abs(`/${DEFAULT_MARKET}${rest}`),
            )}"/>`,
          );
        }
      }
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    });

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` +
      ` xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
      `${urls.join("\n")}\n</urlset>\n`;

    if (write) writeOutput(section.file, xml);
    written.push({ file: section.file, count: entries.length, urls: entries.map((p) => p.url) });
  }

  const newest = (list) => list.map((p) => p.lastmod).sort().at(-1) ?? new Date().toISOString().slice(0, 10);
  const indexXml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    SECTIONS.map(
      (s) =>
        `  <sitemap>\n    <loc>${esc(`${SITE}/${s.file}`)}</loc>\n` +
        `    <lastmod>${newest(bySection.get(s.key))}</lastmod>\n  </sitemap>`,
    ).join("\n") +
    `\n</sitemapindex>\n`;

  if (write) {
    writeOutput(INDEX_FILE, indexXml);
    for (const f of LEGACY) removeOutput(f);
  }

  const excluded = all.filter((p) => !p.indexable);
  if (log) {
    log(`[seo] ${INDEX_FILE} -> ${pages.length} URLs indexables`);
    for (const w of written) log(`[seo]   ${w.file}: ${w.count}`);
    log(`[seo] excluidas: ${excluded.length}`);
    for (const e of excluded) log(`[seo]   ${e.url} (${e.excludeReasons.join(", ")})`);
  }

  return { all, pages, written, excluded, indexFile: INDEX_FILE };
}

if (import.meta.url === `file://${process.argv[1].split("\\").join("/")}` || process.argv[1]?.endsWith("generate-sitemaps.mjs")) {
  buildSitemaps();
}

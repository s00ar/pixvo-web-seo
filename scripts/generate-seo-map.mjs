/**
 * Genera `docs/seo/keyword-url-map.csv` cruzando el registro central de
 * entidades SEO (`scripts/seo-entities.mjs`) con las URLs REALES del build
 * (`dist/client`). Si aparece una página nueva sin entidad declarada, el
 * script falla: así el CSV nunca queda incompleto.
 */
import fs from "node:fs";
import path from "node:path";
import {
  ROOT,
  MARKETS,
  collectPages,
  readFrontmatter,
} from "./lib/seo-build.mjs";
import {
  MARKET_ENTITIES,
  GLOBAL_ENTITIES,
  BLOG_TEMPLATE,
  NON_INDEXABLE_TEMPLATE,
} from "./seo-entities.mjs";

const OUT = path.join(ROOT, "docs", "seo", "keyword-url-map.csv");

const COLUMNS = [
  "url",
  "country",
  "cluster",
  "primary_keyword",
  "secondary_keywords",
  "intent",
  "funnel",
  "page_type",
  "priority",
  "conversion",
  "parent_url",
  "status",
  "lastmod",
  "sitemap",
];

const csvCell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const SITEMAP_FILE = {
  mx: "sitemap-mx.xml",
  ar: "sitemap-ar.xml",
  es: "sitemap-es.xml",
  blog: "sitemap-blog.xml",
  projects: "sitemap-projects.xml",
  pages: "sitemap-pages.xml",
};

export function buildSeoMap({ write = true, log = console.log } = {}) {
  const pages = collectPages().filter((p) => p.url !== "/404");
  const rows = [];
  const missing = [];

  for (const page of pages) {
    if (!page.indexable) {
      rows.push({
        ...NON_INDEXABLE_TEMPLATE,
        url: page.url,
        country: page.market ?? "global",
        parent_url: page.canonical || "",
        status: `canonicalizada-no-indexable (${page.excludeReasons.join("; ")})`,
        lastmod: page.lastmod,
        sitemap: "",
      });
      continue;
    }

    const sitemap = SITEMAP_FILE[page.section] ?? "";

    if (page.market) {
      const rest = page.url.slice(`/${page.market}`.length);
      const e = MARKET_ENTITIES[rest];
      if (!e) {
        missing.push(page.url);
        continue;
      }
      rows.push({
        url: page.url,
        country: page.market,
        cluster: e.cluster,
        primary_keyword: e.primary_keyword,
        secondary_keywords: e.secondary_keywords,
        intent: e.intent,
        funnel: e.funnel,
        page_type: e.page_type,
        priority: e.priority,
        conversion: e.conversion,
        parent_url: e.parent === null ? "/" : `/${page.market}${e.parent}`,
        status: "indexable",
        lastmod: page.lastmod,
        sitemap,
      });
      continue;
    }

    const g = GLOBAL_ENTITIES[page.url];
    if (g) {
      rows.push({
        url: page.url,
        country: "global",
        cluster: g.cluster,
        primary_keyword: g.primary_keyword,
        secondary_keywords: g.secondary_keywords,
        intent: g.intent,
        funnel: g.funnel,
        page_type: g.page_type,
        priority: g.priority,
        conversion: g.conversion,
        parent_url: g.parent_url,
        status: g.status ?? "indexable",
        lastmod: page.lastmod,
        sitemap,
      });
      continue;
    }

    // Artículos del blog: keyword primaria derivada del título real del md.
    if (page.section === "blog") {
      const fm = readFrontmatter(page.source);
      if (!fm.title) {
        missing.push(page.url);
        continue;
      }
      rows.push({
        ...BLOG_TEMPLATE,
        url: page.url,
        country: "global",
        primary_keyword: fm.title,
        // `tags` viene como array YAML inline: se normaliza a "a | b | c".
        secondary_keywords: (fm.tags ?? "")
          .replace(/^\[|\]$/g, "")
          .split(",")
          .map((t) => t.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean)
          .join(" | "),
        status: "indexable",
        lastmod: page.lastmod,
        sitemap,
      });
      continue;
    }

    missing.push(page.url);
  }

  if (missing.length) {
    throw new Error(
      `Hay URLs indexables sin entidad SEO declarada en scripts/seo-entities.mjs:\n  ` +
        missing.join("\n  "),
    );
  }

  rows.sort((a, b) => a.url.localeCompare(b.url));

  const csv =
    COLUMNS.join(",") +
    "\n" +
    rows.map((r) => COLUMNS.map((c) => csvCell(r[c])).join(",")).join("\n") +
    "\n";

  if (write) {
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, csv, "utf8");
  }

  // Canibalización: misma primary_keyword dentro del mismo country.
  const byKey = new Map();
  for (const r of rows) {
    if (!r.primary_keyword) continue;
    const k = `${r.country}::${r.primary_keyword.toLowerCase()}`;
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(r.url);
  }
  const cannibal = [...byKey.entries()].filter(([, u]) => u.length > 1);

  if (log) {
    log(`[seo] docs/seo/keyword-url-map.csv -> ${rows.length} filas`);
    log(`[seo]   indexables: ${rows.filter((r) => r.status.startsWith("indexable")).length}`);
    log(`[seo]   no indexables: ${rows.filter((r) => !r.status.startsWith("indexable")).length}`);
    log(`[seo]   canibalización: ${cannibal.length}`);
    for (const [k, u] of cannibal) log(`[seo]     ${k} -> ${u.join(", ")}`);
  }

  return { rows, cannibal, pages, missing };
}

if (process.argv[1]?.endsWith("generate-seo-map.mjs")) {
  buildSeoMap();
}

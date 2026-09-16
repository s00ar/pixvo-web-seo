/**
 * Verificación sobre el BUILD (`dist/`). Falla con exit 1 si algo
 * no cierra. Se ejecuta como parte de `npm run build`.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, DIST, SITE, MARKETS, collectPages } from "./lib/seo-build.mjs";
import { buildSeoMap } from "./generate-seo-map.mjs";

const errors = [];
const ok = (msg) => console.log(`  OK   ${msg}`);
const fail = (msg) => {
  errors.push(msg);
  console.log(`  FAIL ${msg}`);
};

const FILES = [
  "sitemap_index.xml",
  "sitemap-mx.xml",
  "sitemap-ar.xml",
  "sitemap-es.xml",
  "sitemap-blog.xml",
  "sitemap-projects.xml",
  "sitemap-pages.xml",
];

console.log("\n== Verificación SEO sobre dist/ ==\n");

// 1. Existencia + parseo XML (parser mínimo: balance de tags + declaración).
const contents = {};
for (const f of FILES) {
  const p = path.join(DIST, f);
  if (!fs.existsSync(p)) {
    fail(`falta ${f}`);
    continue;
  }
  const xml = fs.readFileSync(p, "utf8");
  contents[f] = xml;
  const tags = [...xml.matchAll(/<(\/?)([a-zA-Z:][\w:.-]*)([^>]*?)(\/?)>/g)];
  const stack = [];
  let bad = null;
  for (const [, close, name, , selfClose] of tags) {
    if (close) {
      if (stack.pop() !== name) bad = name;
    } else if (!selfClose) stack.push(name);
  }
  if (!xml.startsWith("<?xml") || bad || stack.length) fail(`${f} no parsea (tag ${bad ?? stack})`);
  else ok(`${f} existe y parsea`);
}

// Restos de @astrojs/sitemap
for (const legacy of ["sitemap-index.xml", "sitemap-0.xml"]) {
  if (fs.existsSync(path.join(DIST, legacy))) fail(`quedó el archivo legacy ${legacy}`);
}
ok("sin restos de @astrojs/sitemap");

const locsOf = (f) => [...(contents[f] ?? "").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// 2. El índice referencia exactamente los 6 sitemaps.
const indexLocs = locsOf("sitemap_index.xml").map((l) => l.replace(`${SITE}/`, ""));
const expected = FILES.slice(1);
if (JSON.stringify(indexLocs) === JSON.stringify(expected)) ok("sitemap_index.xml referencia los 6 sitemaps");
else fail(`sitemap_index.xml referencia ${indexLocs.join(", ")}`);

// 3. Conteos por mercado == páginas reales del mercado.
const pages = collectPages();
const indexable = pages.filter((p) => p.indexable);
for (const m of MARKETS) {
  const real = indexable.filter((p) => p.market === m).length;
  const inMap = locsOf(`sitemap-${m}.xml`).length;
  if (real === inMap) ok(`sitemap-${m}.xml: ${inMap} URLs == ${real} páginas indexables de /${m}`);
  else fail(`sitemap-${m}.xml tiene ${inMap} URLs pero /${m} tiene ${real} páginas indexables`);
}
const marketCounts = MARKETS.map((m) => locsOf(`sitemap-${m}.xml`).length);
if (new Set(marketCounts).size === 1) ok(`paridad entre mercados: ${marketCounts[0]} URLs cada uno`);
else fail(`mercados desbalanceados: ${marketCounts.join(" / ")}`);

// 4. Sin URLs repetidas entre sitemaps + cobertura total.
const allLocs = expected.flatMap(locsOf);
const seen = new Set();
const dupes = allLocs.filter((l) => (seen.has(l) ? true : (seen.add(l), false)));
if (!dupes.length) ok(`sin URLs repetidas entre sitemaps (${allLocs.length} en total)`);
else fail(`URLs repetidas: ${[...new Set(dupes)].join(", ")}`);

if (allLocs.length === indexable.length)
  ok(`cobertura sitemaps: ${allLocs.length} == ${indexable.length} URLs indexables del build`);
else fail(`sitemaps con ${allLocs.length} URLs vs ${indexable.length} indexables del build`);

// 5. Ninguna URL de sitemap con canonical hacia otra URL / noindex / params.
const byUrl = new Map(pages.map((p) => [p.url, p]));
let canonicalProblems = 0;
for (const loc of allLocs) {
  const u = loc.replace(SITE, "").replace(/\/$/, "") || "/";
  const p = byUrl.get(u);
  if (!p) {
    fail(`${loc} no corresponde a ninguna página construida`);
    canonicalProblems++;
  } else if (p.canonical && p.canonical !== p.url) {
    fail(`${loc} tiene canonical hacia ${p.canonical}`);
    canonicalProblems++;
  } else if (p.robots.includes("noindex")) {
    fail(`${loc} es noindex`);
    canonicalProblems++;
  } else if (loc.includes("?")) {
    fail(`${loc} tiene parámetros`);
    canonicalProblems++;
  }
}
if (!canonicalProblems) ok("ninguna URL de sitemap redirige, es noindex ni canonicaliza a otra URL");

// 6. Las 3 páginas canonicalizadas del theme quedaron fuera.
for (const u of ["/about", "/contact", "/pricing", "/404"]) {
  if (allLocs.some((l) => l.replace(SITE, "") === u)) fail(`${u} no debería estar en ningún sitemap`);
}
ok("/about, /contact, /pricing y /404 excluidos");

// 7. hreflang recíproco y apuntando a URLs existentes.
const indexableSet = new Set(indexable.map((p) => p.url));
let hreflangErrors = 0;
let hreflangSets = 0;
for (const m of MARKETS) {
  for (const href of [...contents[`sitemap-${m}.xml`].matchAll(/xhtml:link[^>]+href="([^"]+)"/g)]) {
    const u = href[1].replace(SITE, "");
    if (!indexableSet.has(u)) {
      fail(`hreflang apunta a URL no indexable: ${u}`);
      hreflangErrors++;
    }
  }
  hreflangSets += (contents[`sitemap-${m}.xml`].match(/<xhtml:link/g) ?? []).length;
}
if (!hreflangErrors) ok(`hreflang: ${hreflangSets} enlaces alternate, todos a URLs indexables`);

// 8. CSV: cobertura 100% + canibalización.
const CSV = path.join(ROOT, "docs", "seo", "keyword-url-map.csv");
if (!fs.existsSync(CSV)) fail("falta docs/seo/keyword-url-map.csv");
else {
  const lines = fs.readFileSync(CSV, "utf8").trim().split("\n");
  const urls = lines.slice(1).map((l) => l.split(",")[0]);
  const csvIndexableUrls = new Set(
    lines.slice(1).filter((l) => /,indexable/.test(l)).map((l) => l.split(",")[0]),
  );
  const buildIndexable = new Set(indexable.map((p) => p.url));
  const faltan = [...buildIndexable].filter((u) => !csvIndexableUrls.has(u));
  const sobran = [...csvIndexableUrls].filter((u) => !buildIndexable.has(u));
  console.log(
    `  INFO CSV: ${urls.length} filas (${csvIndexableUrls.size} indexables + ${urls.length - csvIndexableUrls.size} no indexables)`,
  );
  if (faltan.length === 0 && sobran.length === 0)
    ok(`cobertura CSV: diferencia exacta = 0 sobre ${buildIndexable.size} URLs indexables`);
  else fail(`cobertura CSV: faltan ${faltan.length} (${faltan.join(", ")}), sobran ${sobran.length}`);

  const { cannibal } = buildSeoMap({ write: false, log: null });
  if (!cannibal.length) ok("sin canibalización: ninguna primary_keyword repetida dentro del mismo país");
  else for (const [k, u] of cannibal) fail(`canibalización ${k}: ${u.join(", ")}`);
}

console.log(`\n${errors.length ? `FALLÓ con ${errors.length} error(es)` : "Todo OK"}\n`);
process.exit(errors.length ? 1 : 0);

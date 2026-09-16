/**
 * Utilidades compartidas para derivar el inventario SEO desde el BUILD real
 * (`dist/client`), no desde listas escritas a mano.
 *
 * Lo usan `scripts/generate-sitemaps.mjs`, `scripts/generate-seo-map.mjs`
 * y `scripts/verify-seo.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(fileURLToPath(new URL("../../", import.meta.url)));
export const DIST = path.join(ROOT, "dist", "client");
/** El adapter de Vercel copia `dist/client` acá durante el build. */
export const VERCEL_STATIC = path.join(ROOT, ".vercel", "output", "static");

export const SITE = "https://pixvo.tech";
export const MARKETS = ["mx", "ar", "es"];
export const HREFLANG = { mx: "es-MX", ar: "es-AR", es: "es-ES" };
export const DEFAULT_MARKET = "mx";

/** Páginas que nunca entran al inventario indexable, más allá del canonical. */
const HARD_EXCLUDE = new Set(["/404"]);

const readdirDeep = (dir) => {
  const out = [];
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "_astro") continue;
        walk(full);
      } else if (entry.name.endsWith(".html")) {
        out.push(full);
      }
    }
  };
  walk(dir);
  return out;
};

/** `dist/client/mx/planes/index.html` -> `/mx/planes` (trailingSlash: "never"). */
const fileToUrlPath = (file) => {
  const rel = path.relative(DIST, file).split(path.sep).join("/");
  let url = "/" + rel.replace(/index\.html$/, "").replace(/\.html$/, "");
  if (url !== "/" && url.endsWith("/")) url = url.slice(0, -1);
  return url;
};

const attr = (tag, name) => tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1] ?? "";

const normalize = (absoluteUrl) => {
  if (!absoluteUrl) return "";
  let u = absoluteUrl.trim();
  if (u.startsWith(SITE)) u = u.slice(SITE.length);
  u = u.split("#")[0].split("?")[0];
  if (u === "" ) u = "/";
  if (u !== "/" && u.endsWith("/")) u = u.slice(0, -1);
  return u;
};

/**
 * Candidatos de archivo fuente para una URL, en orden de preferencia.
 * Se usa solo para derivar `lastmod`; si ninguno existe se cae al HTML
 * construido (fecha de build). Nunca se inventan fechas.
 */
const sourceCandidates = (url) => {
  const c = [];
  const seg = url.split("/").filter(Boolean);
  const marketPath = url.replace(/^\//, "");

  if (url === "/") {
    c.push("src/content/homepage/-index.md", "src/pages/index.astro");
  }
  // /{mercado} y todo /{mercado}/... vive en src/content/pages
  c.push(`src/content/pages/${marketPath}.md`);
  c.push(`src/content/pages/${marketPath}/-index.md`);

  if (seg[1] === "casos-de-exito") {
    c.push(seg[2] ? `src/content/case-study/${seg[2]}.md` : "src/content/case-study/-index.md");
  }
  if (seg[0] === "blog") {
    c.push(seg[1] ? `src/content/blog/${seg[1]}.md` : "src/content/blog/-index.md");
  }
  if (seg[0] === "careers") {
    c.push(seg[1] ? `src/content/careers/${seg[1]}.md` : "src/content/careers/-index.md");
  }
  if (seg[0] === "features") c.push("src/content/features/-index.md");
  if (seg[0] === "integrations") c.push("src/content/integrations/-index.md");
  return c;
};

const resolveSource = (url) => {
  for (const rel of sourceCandidates(url)) {
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs;
  }
  return null;
};

/** Sección de sitemap a la que pertenece la URL. */
export const sectionOf = (url) => {
  const seg = url.split("/").filter(Boolean);
  if (MARKETS.includes(seg[0])) return seg[0];
  if (seg[0] === "blog") return "blog";
  if (seg[0] === "proyectos") return "projects";
  return "pages";
};

/** Frontmatter mínimo (title / meta_title / description / date). */
export const readFrontmatter = (absFile) => {
  if (!absFile || !fs.existsSync(absFile)) return {};
  const raw = fs.readFileSync(absFile, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (!v) continue;
    v = v.replace(/^["'](.*)["']$/, "$1");
    fm[kv[1]] = v;
  }
  return fm;
};

/**
 * Inventario completo del build.
 * Devuelve TODAS las páginas HTML con su canonical real leído del HTML,
 * marcando cuáles son indexables.
 */
export function collectPages() {
  if (!fs.existsSync(DIST)) {
    throw new Error(`No existe ${DIST}. Corré \`astro build\` antes de generar SEO.`);
  }
  const pages = readdirDeep(DIST).map((file) => {
    const html = fs.readFileSync(file, "utf8");
    const url = fileToUrlPath(file);

    const canonicalTag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] ?? "";
    const canonical = normalize(attr(canonicalTag, "href"));

    const robotsTag = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] ?? "";
    const robots = attr(robotsTag, "content").toLowerCase();

    const alternates = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]*>/gi)]
      .map((mm) => ({ hreflang: attr(mm[0], "hreflang"), href: normalize(attr(mm[0], "href")) }))
      .filter((a) => a.hreflang);

    const source = resolveSource(url);
    const lastmod = new Date((source ? fs.statSync(source) : fs.statSync(file)).mtime)
      .toISOString()
      .slice(0, 10);

    const reasons = [];
    if (HARD_EXCLUDE.has(url)) reasons.push("pagina-de-error");
    if (robots.includes("noindex")) reasons.push("noindex");
    if (url.includes("?")) reasons.push("url-con-parametros");
    if (canonical && canonical !== url) reasons.push(`canonicalizada-a:${canonical}`);

    return {
      url,
      file,
      source,
      lastmod,
      canonical,
      robots,
      alternates,
      section: sectionOf(url),
      market: MARKETS.includes(url.split("/").filter(Boolean)[0]) ? url.split("/")[1] : null,
      indexable: reasons.length === 0,
      excludeReasons: reasons,
    };
  });

  pages.sort((a, b) => a.url.localeCompare(b.url));

  // Duplicados exactos de URL (no debería ocurrir, pero se verifica igual).
  const seen = new Map();
  for (const p of pages) {
    if (seen.has(p.url)) p.excludeReasons.push("url-duplicada"), (p.indexable = false);
    else seen.set(p.url, p);
  }
  return pages;
}

export const indexablePages = (pages = collectPages()) => pages.filter((p) => p.indexable);

/** Escribe el archivo en dist/client y lo espeja en .vercel/output/static. */
export function writeOutput(relPath, contents) {
  const targets = [path.join(DIST, relPath)];
  if (fs.existsSync(VERCEL_STATIC)) targets.push(path.join(VERCEL_STATIC, relPath));
  for (const t of targets) {
    fs.mkdirSync(path.dirname(t), { recursive: true });
    fs.writeFileSync(t, contents, "utf8");
  }
  return targets;
}

export function removeOutput(relPath) {
  for (const base of [DIST, VERCEL_STATIC]) {
    const t = path.join(base, relPath);
    if (fs.existsSync(t)) fs.rmSync(t, { force: true });
  }
}

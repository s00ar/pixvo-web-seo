import { access, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { commercialTargets } from '../src/data/articleCommercial.js';
import { buildSeoRegistry } from '../src/data/seoRegistry.js';

const domain = 'https://pixvo.tech';
const marketCodes = ['mx', 'ar', 'es'];
const sitemapNames = ['mx', 'ar', 'es', 'blog', 'projects', 'global'];
const posts = JSON.parse(await readFile('public/posts/index.json', 'utf8'));
const templateRegistry = buildSeoRegistry(posts).filter((item) => item.indexability === 'index,follow');

const csv = (value = '') => {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
const csvDocument = (columns, rows) => `${[columns.join(','), ...rows.map((row) => columns.map((column) => csv(row[column])).join(','))].join('\n')}\n`;
const decode = (value = '') => String(value)
  .replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&nbsp;', ' ');
const stripTags = (value = '') => decode(value.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const normalizeText = (value = '') => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const normalizePath = (value) => {
  const url = new URL(value, domain);
  let path = url.pathname.replace(/\/{2,}/g, '/');
  if (path !== '/' && !/\.[a-z0-9]+$/i.test(path) && !path.endsWith('/')) path += '/';
  return path;
};
const pathToFile = (pathname) => pathname === '/' ? 'dist/index.html' : join('dist', pathname.slice(1), 'index.html');
const exists = async (path) => access(path).then(() => true).catch(() => false);
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, 'i'))?.[1] || '';
const meta = (html, name, attribute = 'name') => html.match(new RegExp(`<meta[^>]+${attribute}=["']${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]+content=["']([^"']*)["']`, 'i'))?.[1]
  || html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attribute}=["']${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i'))?.[1]
  || '';
const linkTag = (html, rel) => html.match(new RegExp(`<link[^>]+rel=["']${rel}["'][^>]+href=["']([^"']+)["']`, 'i'))?.[1]
  || html.match(new RegExp(`<link[^>]+href=["']([^"']+)["'][^>]+rel=["']${rel}["']`, 'i'))?.[1]
  || '';

const sitemapUrls = [];
for (const name of sitemapNames) {
  const xml = await readFile(`dist/sitemap-${name}.xml`, 'utf8');
  sitemapUrls.push(...[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]));
}
const urls = [...new Set(sitemapUrls)];
const urlSet = new Set(urls.map((url) => normalizePath(url)));

function expandRecord(record, code) {
  const replaceMarket = (value = '') => value.replace('{pais}', code);
  return { ...record, url: replaceMarket(record.url), parent_url: replaceMarket(record.parent_url), country: code };
}
const records = templateRegistry.flatMap((record) => record.url.includes('{pais}') ? marketCodes.map((code) => expandRecord(record, code)) : [record]);
const recordByPath = new Map(records.map((record) => [normalizePath(record.url), record]));

const redirectConfig = JSON.parse(await readFile('vercel.json', 'utf8'));
const redirectPaths = new Set((redirectConfig.redirects || []).map((item) => normalizePath(item.source)));

const htmlByPath = new Map();
for (const url of urls) {
  const pathname = normalizePath(url);
  htmlByPath.set(pathname, await readFile(pathToFile(pathname), 'utf8'));
}

const allInternalLinks = new Map();
const incoming = new Map([...urlSet].map((path) => [path, new Set()]));
const brokenLinks = [];
const redirectLinks = [];
const wrongMarketLinks = [];

for (const [sourcePath, html] of htmlByPath) {
  const links = new Set();
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const href = decode(match[1]);
    if (/^(?:mailto:|tel:|javascript:|#)/i.test(href)) continue;
    let target;
    try { target = new URL(href, `${domain}${sourcePath}`); } catch { continue; }
    if (target.origin !== domain) continue;
    const targetPath = normalizePath(target.pathname);
    links.add(targetPath);
    if (urlSet.has(targetPath)) incoming.get(targetPath).add(sourcePath);
    if (redirectPaths.has(targetPath)) redirectLinks.push({ source: sourcePath, target: targetPath });
    const targetFileExists = await exists(pathToFile(targetPath));
    if (!urlSet.has(targetPath) && !targetFileExists && !redirectPaths.has(targetPath)) brokenLinks.push({ source: sourcePath, target: targetPath });
    const sourceMarket = sourcePath.match(/^\/(mx|ar|es)\//)?.[1];
    const targetMarket = targetPath.match(/^\/(mx|ar|es)\//)?.[1];
    const intentionalMarketSelector = targetMarket && targetPath === `/${targetMarket}/`;
    if (sourceMarket && targetMarket && sourceMarket !== targetMarket && !intentionalMarketSelector) wrongMarketLinks.push({ source: sourcePath, target: targetPath });
  }
  allInternalLinks.set(sourcePath, links);
}

function moneyPage(record) {
  const code = record.country && marketCodes.includes(record.country) ? record.country : '{pais}';
  const local = (route) => `/${code}/${route}${route ? '/' : ''}`;
  const conversionTarget = commercialTargets[record.conversion]?.route;
  if (conversionTarget) return local(conversionTarget);
  const clusterTargets = {
    brand: '', 'growth-system': 'sistema-crecimiento-digital', conversion: 'solicitar-diagnostico', seo: 'soluciones/seo-para-pymes',
    automation: 'soluciones/automatizacion-de-procesos', leads: 'soluciones/seguimiento-de-leads', analytics: 'soluciones/analitica-digital',
    wordpress: 'soluciones/optimizacion-wordpress', cro: 'soluciones/optimizacion-de-conversion', proof: 'sistema-crecimiento-digital', product: 'sistema-crecimiento-digital', research: 'auditoria-crecimiento-digital',
  };
  const baseCluster = record.cluster.replace(/^editorial:/, '');
  return local(clusterTargets[baseCluster] || 'sistema-crecimiento-digital');
}

const contentGuides = {
  home: [900, 1400], commercial_hub: [1200, 1800], pricing: [1200, 1800], audit: [1200, 1800],
  problem: [900, 1400], comparison: [1200, 2000], case_index: [700, 1200], case_study: [1000, 1800], about: [600, 1000],
};
const contentRows = [];
const graphRows = [];
const htmlIssues = [];

for (const url of urls) {
  const pathname = normalizePath(url);
  const record = recordByPath.get(pathname) || {};
  const html = htmlByPath.get(pathname);
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const words = stripTags(main).match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) || [];
  const guide = record.page_type === 'solution'
    ? (record.priority === 'P1' ? [1200, 1800] : [900, 1500])
    : contentGuides[record.page_type];
  const wordStatus = !guide ? 'sin_rango_editorial' : words.length < guide[0] ? 'debajo_de_guia' : words.length > guide[1] ? 'sobre_guia_revisar' : 'dentro_de_guia';
  contentRows.push({ url, country: record.country || 'global', page_type: record.page_type || '', cluster: record.cluster || '', primary_keyword: record.primary_keyword || '', word_count: words.length, guide_min: guide?.[0] || '', guide_max: guide?.[1] || '', status: wordStatus, note: guide ? 'Rango editorial orientativo; no es un umbral de ranking.' : 'Sin rango orientativo definido en el encargo.' });

  const sourceLinks = allInternalLinks.get(pathname) || new Set();
  const relevantIncoming = [...(incoming.get(pathname) || [])].filter((source) => {
    const sourceRecord = recordByPath.get(source);
    return sourceRecord && (sourceRecord.cluster === record.cluster || normalizePath(sourceRecord.parent_url || '/') === pathname || moneyPage(sourceRecord) === pathname);
  }).length;
  graphRows.push({
    url, country: record.country || 'global', page_type: record.page_type || '', priority: record.priority || '', cluster: record.cluster || '',
    parent_url: record.parent_url || '', money_page: moneyPage(record), inbound_links: incoming.get(pathname)?.size || 0, relevant_inbound_links: relevantIncoming,
    outbound_links: [...sourceLinks].filter((target) => urlSet.has(target)).length, orphan: pathname !== '/' && (incoming.get(pathname)?.size || 0) === 0 ? 'yes' : 'no',
    broken_outbound: brokenLinks.filter((item) => item.source === pathname).length, redirect_outbound: redirectLinks.filter((item) => item.source === pathname).length,
    wrong_country_outbound: wrongMarketLinks.filter((item) => item.source === pathname).length,
  });

  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const description = meta(html, 'description');
  const canonical = linkTag(html, 'canonical');
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => stripTags(match[1]));
  const headingLevels = [...main.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
  if (!title || !description || canonical !== url || h1s.length !== 1 || !meta(html, 'og:image', 'property') || !meta(html, 'twitter:image')) htmlIssues.push({ url, issue: 'metadatos_o_h1_incompletos' });
  for (let index = 1; index < headingLevels.length; index += 1) if (headingLevels[index] > headingLevels[index - 1] + 1) htmlIssues.push({ url, issue: `salto_h${headingLevels[index - 1]}_a_h${headingLevels[index]}` });
  for (const script of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(script[1]); } catch { htmlIssues.push({ url, issue: 'json_ld_invalido' }); }
  }
}

const imageRows = [];
async function localImageInfo(rawUrl) {
  let pathname;
  try {
    const parsed = new URL(rawUrl, domain);
    if (parsed.origin !== domain) return { built: false, source: '', bytes: 0 };
    pathname = parsed.pathname;
  } catch { return { built: false, source: '', bytes: 0 }; }
  const builtPath = join('dist', pathname.slice(1));
  const built = await exists(builtPath);
  let source = pathname.startsWith('/images/') ? join('public', pathname.slice(1)) : '';
  if (/^\/assets\/services-workspace-.*\.jpg$/.test(pathname)) source = 'src/assets/images/services-workspace.jpg';
  const sourceExists = source ? await exists(source) : false;
  const info = built ? await stat(builtPath) : { size: 0 };
  return { built, source, sourceExists, bytes: info.size, pathname };
}

for (const url of urls) {
  const pathname = normalizePath(url);
  const html = htmlByPath.get(pathname);
  const ogUrl = meta(html, 'og:image', 'property');
  const ogInfo = await localImageInfo(ogUrl);
  const ogWidth = Number(meta(html, 'og:image:width', 'property')) || '';
  const ogHeight = Number(meta(html, 'og:image:height', 'property')) || '';
  imageRows.push({ url, role: 'og', image_url: ogUrl, source_file: ogInfo.source, source_exists: ogInfo.source ? String(ogInfo.sourceExists) : 'build_asset', build_exists: String(ogInfo.built), width: ogWidth, height: ogHeight, bytes: ogInfo.bytes, alt: '', loading: '', decoding: '', srcset: '', sizes: '', status: !ogInfo.built ? 'error_missing' : !ogWidth || !ogHeight ? 'warning_dimensions_missing' : ogInfo.bytes > 900000 ? 'warning_large_file' : ogWidth < 600 ? 'warning_narrow_social_asset' : 'ok' });
  const allSrcsets = [...html.matchAll(/\ssrcset=["']([^"']+)["']/gi)].flatMap((match) => match[1].split(',').map((part) => part.trim().split(/\s+/)[0]));
  const srcsetValid = (await Promise.all(allSrcsets.map((item) => localImageInfo(item)))).every((item) => item.built);
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const src = attr(tag, 'src');
    const info = await localImageInfo(src);
    const alt = attr(tag, 'alt');
    const width = attr(tag, 'width');
    const height = attr(tag, 'height');
    const loading = attr(tag, 'loading');
    const decoding = attr(tag, 'decoding');
    const srcset = attr(tag, 'srcset');
    const sizes = attr(tag, 'sizes');
    imageRows.push({ url, role: 'content', image_url: new URL(src, domain).toString(), source_file: info.source, source_exists: info.source ? String(info.sourceExists) : 'build_asset', build_exists: String(info.built), width, height, bytes: info.bytes, alt, loading, decoding, srcset, sizes, status: !info.built ? 'error_missing' : !alt ? 'error_alt_missing' : !width || !height ? 'error_dimensions_missing' : !decoding ? 'warning_decoding_missing' : allSrcsets.length && !srcsetValid ? 'error_srcset_missing' : info.bytes > 900000 && loading !== 'lazy' ? 'warning_large_eager_image' : 'ok' });
  }
}

const ownershipIssues = [];
for (const field of ['primary_keyword', 'title', 'h1']) {
  const groups = new Map();
  for (const record of templateRegistry) {
    const key = normalizeText(record[field]);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(record);
  }
  for (const [value, group] of groups) {
    const owners = [...new Set(group.map((item) => item.ownership_key))];
    if (owners.length > 1) ownershipIssues.push({ issue_type: `duplicate_${field}`, left_url: group[0].url, right_url: group[1].url, value, similarity: 1, status: 'error' });
  }
}
const titleRecords = templateRegistry.filter((item) => item.title);
for (let left = 0; left < titleRecords.length; left += 1) {
  for (let right = left + 1; right < titleRecords.length; right += 1) {
    const a = titleRecords[left]; const b = titleRecords[right];
    if (a.ownership_key === b.ownership_key) continue;
    const tokensA = new Set(normalizeText(a.title).split(' ').filter((item) => item.length > 2 && item !== 'pixvo'));
    const tokensB = new Set(normalizeText(b.title).split(' ').filter((item) => item.length > 2 && item !== 'pixvo'));
    const intersection = [...tokensA].filter((item) => tokensB.has(item)).length;
    const union = new Set([...tokensA, ...tokensB]).size;
    const similarity = union ? intersection / union : 0;
    if (similarity >= 0.8) ownershipIssues.push({ issue_type: 'similar_title_review', left_url: a.url, right_url: b.url, value: `${a.title} <> ${b.title}`, similarity: similarity.toFixed(2), status: 'reviewed' });
  }
}

const malformedUrls = urls.filter((url) => {
  const path = new URL(url).pathname;
  return path !== path.toLowerCase() || (path !== '/' && !path.endsWith('/')) || /[_\s]/.test(path);
});
const orphanRows = graphRows.filter((row) => row.orphan === 'yes');
const priorityAverages = Object.fromEntries(['P1', 'P2', 'P3'].map((priority) => {
  const rows = graphRows.filter((row) => row.priority === priority);
  return [priority, rows.length ? rows.reduce((sum, row) => sum + Number(row.relevant_inbound_links), 0) / rows.length : 0];
}));
const imageErrors = imageRows.filter((row) => row.status.startsWith('error'));
const ownershipErrors = ownershipIssues.filter((row) => row.status === 'error');
const belowGuide = contentRows.filter((row) => row.status === 'debajo_de_guia');

await writeFile('docs/seo/content-audit.csv', csvDocument(['url', 'country', 'page_type', 'cluster', 'primary_keyword', 'word_count', 'guide_min', 'guide_max', 'status', 'note'], contentRows), 'utf8');
await writeFile('docs/seo/internal-link-graph.csv', csvDocument(['url', 'country', 'page_type', 'priority', 'cluster', 'parent_url', 'money_page', 'inbound_links', 'relevant_inbound_links', 'outbound_links', 'orphan', 'broken_outbound', 'redirect_outbound', 'wrong_country_outbound'], graphRows), 'utf8');
await writeFile('docs/seo/image-audit.csv', csvDocument(['url', 'role', 'image_url', 'source_file', 'source_exists', 'build_exists', 'width', 'height', 'bytes', 'alt', 'loading', 'decoding', 'srcset', 'sizes', 'status'], imageRows), 'utf8');
await writeFile('docs/seo/ownership-audit.csv', csvDocument(['issue_type', 'left_url', 'right_url', 'value', 'similarity', 'status'], ownershipIssues), 'utf8');

const report = `# Auditoría reproducible del build\n\nGenerada desde el HTML de \`dist\`; los rangos de palabras son orientativos y se validan como control editorial del contenido publicado.\n\n- URLs indexables auditadas: ${urls.length}\n- URLs con un único H1 y metadatos completos: ${urls.length - htmlIssues.length}/${urls.length}\n- Enlaces rotos: ${brokenLinks.length}\n- Enlaces internos a redirects: ${redirectLinks.length}\n- Enlaces comerciales hacia país incorrecto: ${wrongMarketLinks.length}\n- Páginas huérfanas (excluido el selector raíz): ${orphanRows.length}\n- Errores físicos de imágenes: ${imageErrors.length}\n- Conflictos de ownership: ${ownershipErrors.length}\n- Titles similares para revisión humana: ${ownershipIssues.filter((item) => item.issue_type === 'similar_title_review').length}\n- Promedio de enlaces entrantes relevantes P1: ${priorityAverages.P1.toFixed(2)}\n- Promedio P2: ${priorityAverages.P2.toFixed(2)}\n- Promedio P3: ${priorityAverages.P3.toFixed(2)}\n- URLs fuera de la convención minúsculas/guiones/trailing slash: ${malformedUrls.length}\n\n## Observaciones editoriales\n\n- URLs debajo de la guía orientativa: ${belowGuide.length}. Las ampliaciones se generan desde el contexto, las señales, los criterios, la evidencia y los límites ya documentados para cada plantilla.\n- Imágenes con advertencias no bloqueantes: ${imageRows.filter((row) => row.status.startsWith('warning')).length}. Las advertencias distinguen assets verticales específicos y archivos grandes cargados de forma diferida.\n- El proyecto técnico se audita como \`project\`, separado de \`case_study\`.\n`;
await writeFile('docs/seo/final-build-audit.md', report, 'utf8');

if (brokenLinks.length || redirectLinks.length || wrongMarketLinks.length || orphanRows.length || imageErrors.length || ownershipErrors.length || malformedUrls.length || htmlIssues.length || belowGuide.length) {
  throw new Error(`Auditoría del build falló: broken=${brokenLinks.length}, redirects=${redirectLinks.length}, wrong-country=${wrongMarketLinks.length}, orphans=${orphanRows.length}, images=${imageErrors.length}, ownership=${ownershipErrors.length}, urls=${malformedUrls.length}, html=${htmlIssues.length}, below-guide=${belowGuide.length}.`);
}
if (priorityAverages.P1 < priorityAverages.P3) throw new Error(`La autoridad interna relevante P1 (${priorityAverages.P1.toFixed(2)}) es menor que P3 (${priorityAverages.P3.toFixed(2)}).`);
console.log(`Auditoría build: ${urls.length} URLs, ${imageRows.length} imágenes, grafo sin huérfanas/rotos/redirects/país incorrecto y ownership sin conflictos.`);

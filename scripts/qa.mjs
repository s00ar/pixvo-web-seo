import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { articleCommercialRegistry, commercialTargets, getArticleCommercialData } from '../src/data/articleCommercial.js';
import { caseStudies } from '../src/data/caseStudies.js';
import { auditFaqs, getProblemCta, getSolutionConnections, getSolutionFaqs, planFaqs, problemCatalog, resourceCatalog, solutionCatalog, systemFaqs } from '../src/data/growthSystem.js';
import { buildSeoRegistry, seoColumns } from '../src/data/seoRegistry.js';

const markets = { mx: 'es-MX', ar: 'es-AR', es: 'es-ES' };
const sitemapNames = ['mx', 'ar', 'es', 'blog', 'projects', 'global'];
const caseAssets = {
  microcuotas: '/images/case-studies/microcuotas/microcuotas-1024.png',
  'hospital-metropolitano': '/images/case-studies/hospital-metropolitano/hospital-metropolitano.jpg',
  'sanidad-web': '/images/case-studies/sanidad-web/sanidad-1024.png',
  'paola-informa': '/images/case-studies/paola-informa/paola-informa.webp',
  arpitools: '/images/case-studies/arpitools/arpitools-mobile.jpg',
};
const postSummaries = JSON.parse(await readFile('public/posts/index.json', 'utf8'));
const fullPosts = Object.fromEntries(await Promise.all(postSummaries.map(async ({ slug }) => [slug, JSON.parse(await readFile(`public/posts/${slug}.json`, 'utf8'))])));
const seoRegistry = buildSeoRegistry(postSummaries);
for (const post of postSummaries) {
  const classification = articleCommercialRegistry[post.slug];
  if (!classification) throw new Error(`El artículo ${post.slug} no tiene clasificación comercial explícita.`);
  if (!classification.primaryIntent || !classification.cluster || !commercialTargets[classification.commercialTarget]) throw new Error(`Clasificación comercial incompleta en ${post.slug}.`);
  for (const target of classification.relatedTargets || []) if (!commercialTargets[target]) throw new Error(`Target comercial inexistente ${target} en ${post.slug}.`);
  const registryArticle = seoRegistry.find((item) => item.url === `/blog/${post.slug}/`);
  if (!registryArticle?.cluster.includes(classification.cluster) || registryArticle.conversion !== classification.commercialTarget) throw new Error(`El registro SEO no refleja la clasificación de ${post.slug}.`);
}
const requiredCaseFields = ['executiveSummary', 'situation', 'problem', 'operationalImpact', 'solution', 'workflow', 'architecture', 'beforeAfter', 'result', 'verifiedFacts', 'caveat', 'services', 'commercialLinks', 'relatedCases'];
for (const item of caseStudies) {
  for (const field of requiredCaseFields) if (!item[field] || item[field].length === 0) throw new Error(`El caso ${item.slug} no tiene ${field}.`);
  if (item.slug !== 'microcuotas' && item.metrics.length > 0) throw new Error(`Solo Microcuotas puede publicar métricas verificables: ${item.slug}.`);
  for (const link of item.commercialLinks) {
    if (/^\/?(mx|ar|es)\//.test(link.target) || !link.anchor || /^(ver más|ver cómo funciona)$/i.test(link.anchor)) throw new Error(`Enlace comercial inválido o genérico en ${item.slug}.`);
    const solutionSlug = link.target.replace(/^soluciones\//, '');
    if (link.target.startsWith('soluciones/') && !solutionCatalog[solutionSlug]) throw new Error(`El caso ${item.slug} enlaza a una solución inexistente: ${link.target}.`);
  }
}
const microcuotas = caseStudies.find(({ slug }) => slug === 'microcuotas');
for (const value of ['Más de 5.600', '≈ 400', '21', 'Menos de USD 0,10']) if (!microcuotas.metrics.some((metric) => metric.value === value)) throw new Error(`Falta una métrica autorizada de Microcuotas: ${value}.`);
const hospital = caseStudies.find(({ slug }) => slug === 'hospital-metropolitano');
if (!hospital.attribution.includes('Metamorfosis 360') || !hospital.attribution.includes('Events Group') || /HYPOSPADIAS/i.test(JSON.stringify(hospital))) throw new Error('La atribución o los límites de Hospital Metropolitano son incorrectos.');
const required = [
  'sitemap.xml',
  'sitemap_index.xml',
  ...sitemapNames.map((name) => `sitemap-${name}.xml`),
  'robots.txt',
  'images/projects/shortcodes-en-pestanas-wordpress.png',
  ...new Set(caseStudies.flatMap((item) => [
    item.image,
    item.socialImage,
    ...(item.imageSrcSet || '').split(',').map((candidate) => candidate.trim().split(/\s+/)[0]),
    ...(item.detailSources || []).flatMap((source) => source.srcSet.split(',').map((candidate) => candidate.trim().split(/\s+/)[0])),
  ].filter(Boolean).map((path) => path.slice(1)))),
  ...Object.keys(markets).flatMap((market) => [
    `${market}/index.html`,
    `${market}/gracias-diagnostico/index.html`,
    `${market}/casos-de-exito/index.html`,
    ...Object.keys(caseAssets).map((slug) => `${market}/casos-de-exito/${slug}/index.html`),
    `${market}/blog/index.html`,
    ...postSummaries.map(({ slug }) => `${market}/blog/${slug}/index.html`),
    `${market}/problemas/leads-no-convierten/index.html`,
    `${market}/recursos/seo-vs-google-ads/index.html`,
    `${market}/soluciones/seo-wordpress/index.html`,
  ]),
];
for (const file of required) await access(`dist/${file}`);

const sitemapXml = Object.fromEntries(await Promise.all(sitemapNames.map(async (name) => [name, await readFile(`dist/sitemap-${name}.xml`, 'utf8')])));
for (const [name, xml] of Object.entries(sitemapXml)) {
  if (!xml.includes('<urlset') || xml.includes('gracias-diagnostico')) throw new Error(`Sitemap ${name} inválido o incluye páginas noindex.`);
}

const urlsFrom = (xml) => [...xml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)].map((match) => match[1]);
const marketRoutes = Object.fromEntries(Object.keys(markets).map((market) => [market, urlsFrom(sitemapXml[market]).map((url) => new URL(url).pathname.replace(new RegExp(`^/${market}/?`), '').replace(/\/$/, ''))]));
const referenceRoutes = JSON.stringify(marketRoutes.mx);
for (const market of Object.keys(markets)) {
  if (JSON.stringify(marketRoutes[market]) !== referenceRoutes) throw new Error(`La arquitectura publicada de ${market} no coincide con México.`);
  for (const url of urlsFrom(sitemapXml[market])) if (!new URL(url).pathname.startsWith(`/${market}/`) || new URL(url).search) throw new Error(`Sitemap ${market} contiene una URL ajena o parametrizada: ${url}.`);
}

const allUrls = sitemapNames.flatMap((name) => urlsFrom(sitemapXml[name]));
const registryUrls = seoRegistry.flatMap((item) => item.url.includes('{pais}')
  ? Object.keys(markets).map((market) => `https://pixvo.tech${item.url.replace('{pais}', market)}`)
  : [`https://pixvo.tech${item.url}`]);
if (new Set(allUrls).size !== allUrls.length) throw new Error('Los sitemaps contienen URLs duplicadas.');
if (JSON.stringify([...allUrls].sort()) !== JSON.stringify([...registryUrls].sort())) throw new Error('El registro SEO central y los sitemaps no cubren exactamente las mismas URLs indexables.');

const keywordMap = await readFile('docs/seo/keyword-url-map.csv', 'utf8');
const mapLines = keywordMap.trim().split(/\r?\n/);
const keywordUrls = mapLines.slice(1).map((line) => line.split(',')[0]);
const expectedKeywordUrls = allUrls.map((url) => new URL(url).pathname);
if (mapLines[0] !== seoColumns.join(',') || mapLines.length !== allUrls.length + 1 || JSON.stringify([...keywordUrls].sort()) !== JSON.stringify([...expectedKeywordUrls].sort())) throw new Error('keyword-url-map.csv no cubre exactamente todas las URLs indexables.');
for (const line of mapLines.slice(1)) {
  const [url, country] = line.split(',');
  const market = url.match(/^\/(mx|ar|es)\//)?.[1];
  if (market && country !== market) throw new Error(`País incorrecto en keyword-url-map.csv para ${url}.`);
}
for (const column of ['url', 'country', 'cluster', 'primary_keyword', 'secondary_keywords', 'intent', 'funnel', 'page_type', 'priority', 'conversion', 'parent_url', 'status']) if (!seoColumns.includes(column)) throw new Error(`Falta la columna SEO obligatoria: ${column}`);
const ownership = new Map();
for (const item of seoRegistry) {
  const key = item.primary_keyword.trim().toLocaleLowerCase('es');
  if (!ownership.has(key)) ownership.set(key, new Set());
  ownership.get(key).add(item.ownership_key);
}
for (const [keyword, owners] of ownership) if (owners.size > 1) throw new Error(`La keyword principal "${keyword}" tiene propietarios contradictorios: ${[...owners].join(', ')}`);

const seoByTemplate = new Map(seoRegistry.map((item) => [item.url, item]));
const requiredOwnership = {
  '/{pais}/sistema-crecimiento-digital/': ['sistema de crecimiento digital para PyMEs', ['consultoría de crecimiento digital', 'estrategia de crecimiento digital', 'SEO y automatización para PyMEs', 'sistema de captación digital']],
  '/{pais}/planes/': ['precios Pixvo Growth System', ['planes de crecimiento digital', 'precio SEO para PyMEs']],
  '/{pais}/auditoria-crecimiento-digital/': ['auditoría de crecimiento digital', ['auditoría SEO y conversión', 'auditoría de marketing digital']],
  '/{pais}/soluciones/seo-para-pymes/': ['SEO para PyMEs', ['consultoría SEO para PyMEs', 'servicio SEO para empresas']],
  '/{pais}/soluciones/automatizacion-de-procesos/': ['automatización de procesos para PyMEs', ['automatización empresarial', 'automatización con n8n']],
  '/{pais}/soluciones/seguimiento-de-leads/': ['automatización del seguimiento de leads', ['seguimiento de leads', 'automatizar prospectos']],
};
for (const [url, [primary, secondary]] of Object.entries(requiredOwnership)) {
  const entity = seoByTemplate.get(url);
  if (!entity || entity.primary_keyword !== primary || entity.intent !== 'transactional' && entity.page_type !== 'commercial_hub') throw new Error(`Ownership transaccional incorrecto en ${url}.`);
  for (const keyword of secondary) if (!entity.secondary_keywords.includes(keyword)) throw new Error(`Falta la keyword secundaria "${keyword}" en ${url}.`);
}
for (const [url, primary] of Object.entries({
  '/{pais}/nosotros/': 'sobre Pixvo',
  '/{pais}/contacto/': 'contacto Pixvo',
  '/{pais}/casos-de-exito/': 'casos de éxito Pixvo',
})) if (seoByTemplate.get(url)?.primary_keyword !== primary) throw new Error(`Ownership institucional incorrecto en ${url}.`);

const seoWordPress = solutionCatalog['seo-wordpress'];
const optimizationWordPress = solutionCatalog['optimizacion-wordpress'];
for (const term of ['Rastreo', 'Indexación', 'Arquitectura de información', 'Canonical', 'Schema', 'Contenido', 'Search Console', 'SEO técnico']) if (!seoWordPress.items.some((item) => item.includes(term))) throw new Error(`SEO WordPress no cubre ${term}.`);
for (const term of ['Rendimiento', 'Core Web Vitals', 'Estabilidad', 'Experiencia de usuario', 'Conversión', 'Mejoras técnicas']) if (!optimizationWordPress.items.some((item) => item.includes(term))) throw new Error(`Optimización WordPress no cubre ${term}.`);
if (JSON.stringify(seoWordPress.items) === JSON.stringify(optimizationWordPress.items)) throw new Error('SEO WordPress y Optimización WordPress no están diferenciados.');

for (const [slug, problem] of Object.entries(problemCatalog)) {
  for (const field of ['symptoms', 'causes', 'diagnosis']) if (!Array.isArray(problem[field]) || problem[field].length < 3) throw new Error(`El problema ${slug} no formaliza ${field}.`);
  if (!solutionCatalog[problem.primary] || !solutionCatalog[problem.secondary]) throw new Error(`El problema ${slug} no conduce a soluciones publicadas.`);
}
for (const [slug, resource] of Object.entries(resourceCatalog)) {
  for (const field of ['title', 'lead', 'decision', 'criteria', 'options', 'primary', 'secondary', 'nextStep']) if (!resource[field] || resource[field].length === 0) throw new Error(`El recurso ${slug} no tiene ${field}.`);
  const entity = seoByTemplate.get(`/{pais}/recursos/${slug}/`);
  if (entity?.intent !== 'commercial research' || entity?.funnel !== 'MOFU') throw new Error(`El recurso ${slug} no mantiene intención MOFU comercial.`);
}

const internalMap = await readFile('docs/seo/internal-link-map.csv', 'utf8');
if (!internalMap.startsWith('source_url,destination_url,relationship,cluster,funnel_role,placement,status\n') || internalMap.trim().split(/\r?\n/).length < 150) throw new Error('El mapa de enlazado interno no fue generado completamente.');
for (const slug of Object.keys(solutionCatalog)) {
  const source = `/{pais}/soluciones/${slug}/`;
  const connections = getSolutionConnections(slug);
  for (const target of ['/{pais}/sistema-crecimiento-digital/', '/{pais}/planes/', '/{pais}/auditoria-crecimiento-digital/', '/{pais}/solicitar-diagnostico/']) if (!internalMap.includes(`${source},${target},`)) throw new Error(`Falta una relación comercial obligatoria desde ${source} hacia ${target}.`);
  if (connections.resources.length < 1 || connections.resources.length > 2) throw new Error(`La solución ${slug} debe tener uno o dos recursos MOFU.`);
  for (const item of connections.problems) if (!internalMap.includes(`/{pais}/problemas/${item.slug}/,${source},problem-to-`)) throw new Error(`Falta el enlace inverso problema → solución para ${slug}.`);
  for (const item of connections.cases) if (!internalMap.includes(`/{pais}/casos-de-exito/${item.slug}/,${source},case-to-solution`)) throw new Error(`Falta el enlace inverso caso → solución para ${slug}.`);
}
const titles = new Map();
for (const absoluteUrl of allUrls) {
  const url = new URL(absoluteUrl);
  const route = url.pathname;
  const file = route === '/' ? 'dist/index.html' : join('dist', route, 'index.html');
  await access(file);
  const html = await readFile(file, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  if (!title || !html.includes('name="description"') || !html.includes(`rel="canonical" href="${absoluteUrl}"`)) throw new Error(`Metadatos incompletos en ${route}`);
  if ((html.match(/rel="canonical"/g) || []).length !== 1 || (html.match(/<h1\b/g) || []).length !== 1) throw new Error(`Canonical o H1 duplicado en ${route}.`);
  if (titles.has(title)) throw new Error(`Title duplicado en ${route} y ${titles.get(title)}`);
  titles.set(title, route);
  for (const tag of ['property="og:title"', 'property="og:description"', 'property="og:url"', 'property="og:type"', 'property="og:image"', 'name="twitter:card" content="summary_large_image"', 'name="twitter:title"', 'name="twitter:description"', 'name="twitter:image"']) if (!html.includes(tag)) throw new Error(`Falta ${tag} en ${route}.`);
  if (!html.includes('data-prerendered="true"') || !html.includes('<h1>') || !html.includes('application/ld+json') || (route !== '/' && !html.includes('aria-label="Migas de pan"'))) throw new Error(`Prerender SEO incompleto en ${route}`);
  if (html.includes('"@type":"CaseStudy"')) throw new Error(`Tipo Schema inexistente CaseStudy en ${route}.`);
  const jsonLd = [...html.matchAll(/<script data-static-seo type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  for (const block of jsonLd) try { JSON.parse(block); } catch { throw new Error(`JSON-LD inválido en ${route}.`); }
  if (/\?(?:utm_|gclid)/i.test(html)) throw new Error(`Enlace interno con tracking en ${route}.`);
  if (/^\/(?:blog\/[^/]+|(?:mx|ar|es)\/blog\/[^/]+)\/$/.test(route)) for (const tag of ['name="author"', 'property="article:published_time"', 'property="article:modified_time"']) if (!html.includes(tag)) throw new Error(`Falta metadata editorial ${tag} en ${route}.`);
}

for (const [market, locale] of Object.entries(markets)) {
  for (const routePath of marketRoutes[market]) {
    const html = await readFile(join('dist', market, routePath, 'index.html'), 'utf8');
    if (!html.includes(`<html lang="${locale}">`)) throw new Error(`Idioma HTML incorrecto en /${market}/${routePath}`);
    for (const [alternateMarket, alternateLocale] of Object.entries(markets)) {
      const expected = `hreflang="${alternateLocale}" href="https://pixvo.tech/${alternateMarket}/${routePath}${routePath ? '/' : ''}"`;
      if (!html.includes(expected)) throw new Error(`Hreflang recíproco ausente en /${market}/${routePath}: ${alternateLocale}`);
    }
    const expectedDefault = routePath === 'blog' || routePath.startsWith('blog/') ? `https://pixvo.tech/${routePath}/` : 'https://pixvo.tech/';
    if (!html.includes(`hreflang="x-default" href="${expectedDefault}"`)) throw new Error(`x-default incorrecto en /${market}/${routePath}`);
  }
  const thanks = await readFile(`dist/${market}/gracias-diagnostico/index.html`, 'utf8');
  if (!thanks.includes('noindex,follow') || thanks.includes('hreflang=')) throw new Error(`Configuración incorrecta en gracias de ${market}`);
  for (const [slug, image] of Object.entries(caseAssets)) {
    const casePage = await readFile(`dist/${market}/casos-de-exito/${slug}/index.html`, 'utf8');
    for (const heading of ['Resumen ejecutivo', 'Situación inicial', 'Problema', 'Impacto operativo del problema', 'Solución', 'Cómo funciona', 'Arquitectura y decisiones técnicas', 'Antes vs. después', 'Resultado verificable', 'Hechos verificables', 'Limitaciones de evidencia', 'Servicios y capacidades relacionadas', 'Otros casos relacionados']) if (!casePage.includes(heading)) throw new Error(`Falta la sección ${heading} en ${market}: ${slug}`);
    const item = caseStudies.find((candidate) => candidate.slug === slug);
    const socialImage = item.socialImage || image;
    if (!casePage.includes('CreativeWork') || !casePage.includes('<picture>') || !casePage.includes(`src="${image}"`) || !casePage.includes(`og:image" content="https://pixvo.tech${socialImage}"`)) throw new Error(`Caso incompleto en ${market}: ${slug}`);
    if (!casePage.includes(`og:image:width" content="${item.socialImageWidth || item.imageWidth}"`) || !casePage.includes(`og:image:height" content="${item.socialImageHeight || item.imageHeight}"`)) throw new Error(`Dimensiones sociales ausentes en ${market}: ${slug}`);
    const expectedLoading = slug === 'hospital-metropolitano' ? 'lazy' : 'eager';
    if (!casePage.includes(`loading="${expectedLoading}"`) || !casePage.includes('decoding="async"') || !casePage.includes(`width="${item.imageWidth}" height="${item.imageHeight}"`) || (expectedLoading === 'eager' && !casePage.includes('fetchpriority="high"'))) throw new Error(`Estrategia responsive/CLS incompleta en ${market}: ${slug}`);
    if (item.imageSrcSet && (!casePage.includes('srcset=') || !casePage.includes('sizes='))) throw new Error(`srcset/sizes ausente en ${market}: ${slug}`);
    if (item.detailSources?.length && !casePage.includes(`<source media="${item.detailSources[0].media}"`)) throw new Error(`Fuente mobile ausente en ${market}: ${slug}`);
    if ((slug === 'microcuotas') !== casePage.includes('Métricas verificables')) throw new Error(`Publicación incorrecta de métricas en ${market}: ${slug}`);
    if (slug === 'hospital-metropolitano' && (!casePage.includes('Metamorfosis 360') || !casePage.includes('Events Group'))) throw new Error(`Atribución ausente en ${market}: ${slug}`);
    for (const link of item.commercialLinks) if (!casePage.includes(`href="/${market}/${link.target}/">${link.anchor}</a>`)) throw new Error(`Falta anchor comercial descriptivo en ${market}: ${slug} → ${link.target}.`);
    if (!casePage.includes('Analicemos qué parte de este proceso puedes automatizar')) throw new Error(`CTA contextual ausente en el caso ${market}/${slug}.`);
    if (!casePage.includes(`"position":3,"name":"Casos de éxito","item":"https://pixvo.tech/${market}/casos-de-exito/"`) || !casePage.includes(`"position":4,"name":"${item.title}"`)) throw new Error(`BreadcrumbList incompleto en ${market}: ${slug}.`);
  }
  for (const [slug, solution] of Object.entries(solutionCatalog)) {
    const page = await readFile(`dist/${market}/soluciones/${slug}/index.html`, 'utf8');
    const connections = getSolutionConnections(slug);
    const solutionFaqs = getSolutionFaqs(slug);
    if (!page.includes('"@type":"FAQPage"')) throw new Error(`Schema FAQ ausente en la solución ${market}/${slug}.`);
    for (const [question, answer] of solutionFaqs) if (!page.includes(question) || !page.includes(answer)) throw new Error(`FAQ visible/schema no coincide en ${market}/${slug}.`);
    for (const href of [`/${market}/sistema-crecimiento-digital/`, `/${market}/planes/`, `/${market}/auditoria-crecimiento-digital/`, `/${market}/solicitar-diagnostico/`]) if (!page.includes(`href="${href}"`)) throw new Error(`Falta enlace comercial ${href} en la solución ${market}/${slug}.`);
    if (solution.related.length < 2 || solution.related.length > 3) throw new Error(`La solución ${slug} debe declarar dos o tres soluciones relacionadas.`);
    for (const item of connections.resources) if (!page.includes(`href="/${market}/recursos/${item.slug}/"`)) throw new Error(`Falta recurso MOFU ${item.slug} en la solución ${market}/${slug}.`);
    for (const item of connections.problems) if (!page.includes(`href="/${market}/problemas/${item.slug}/"`)) throw new Error(`Falta enlace solución → problema en ${market}/${slug}.`);
    for (const item of connections.cases) if (!page.includes(`href="/${market}/casos-de-exito/${item.slug}/"`)) throw new Error(`Falta enlace solución → caso en ${market}/${slug}.`);
  }
  for (const [slug, problem] of Object.entries(problemCatalog)) {
    const page = await readFile(`dist/${market}/problemas/${slug}/index.html`, 'utf8');
    for (const heading of ['Síntomas que conviene comprobar', 'Causas habituales', 'Cómo diagnosticar el cuello de botella', 'Soluciones relacionadas con el problema', 'Auditoría o diagnóstico']) if (!page.includes(heading)) throw new Error(`Falta la etapa ${heading} en el problema ${market}/${slug}.`);
    for (const href of [`/${market}/soluciones/${problem.primary}/`, `/${market}/soluciones/${problem.secondary}/`, `/${market}/auditoria-crecimiento-digital/`]) if (!page.includes(`href="${href}"`)) throw new Error(`Falta enlace de diagnóstico ${href} en ${market}/${slug}.`);
    if (page.includes('"@type":"FAQPage"') || !page.includes(getProblemCta(slug))) throw new Error(`FAQ genérico o CTA no contextual en ${market}/${slug}.`);
  }
  for (const [slug, resource] of Object.entries(resourceCatalog)) {
    const page = await readFile(`dist/${market}/recursos/${slug}/index.html`, 'utf8');
    for (const heading of ['Qué decisión ayuda a resolver', 'Criterios para comparar', 'Cuándo elegir cada alternativa', 'Soluciones comerciales relacionadas', 'Siguiente paso']) if (!page.includes(heading)) throw new Error(`El recurso ${market}/${slug} no ayuda a decidir: falta ${heading}.`);
    const targetHref = (target) => solutionCatalog[target] ? `/${market}/soluciones/${target}/` : `/${market}/${target}/`;
    for (const href of [targetHref(resource.primary), targetHref(resource.secondary), targetHref(resource.nextStep), `/${market}/planes/`, `/${market}/solicitar-diagnostico/`]) if (!page.includes(`href="${href}"`)) throw new Error(`Falta enlace comercial ${href} en el recurso ${market}/${slug}.`);
  }
  for (const post of postSummaries) {
    const classification = getArticleCommercialData(post);
    const page = await readFile(`dist/${market}/blog/${post.slug}/index.html`, 'utf8');
    const full = fullPosts[post.slug];
    const primary = commercialTargets[classification.commercialTarget];
    if (!page.includes('¿Quieres aplicar esta estrategia en tu empresa?') || !page.includes(`href="/${market}/${primary.route}/"`)) throw new Error(`El artículo ${market}/${post.slug} no conduce a su landing principal.`);
    for (const targetId of classification.relatedTargets || []) if (!page.includes(`href="/${market}/${commercialTargets[targetId].route}/"`)) throw new Error(`El artículo ${market}/${post.slug} no enlaza ${targetId}.`);
    if (!page.includes('<picture>') || !page.includes(`src="${full.image.src}"`) || !page.includes(`alt="${full.image.alt}"`) || !page.includes(`width="${full.image.width}" height="${full.image.height}"`) || !page.includes('srcset=') || !page.includes('sizes=')) throw new Error(`Imagen editorial responsive ausente en ${market}/${post.slug}.`);
  }
}

for (const post of postSummaries) {
  const classification = getArticleCommercialData(post);
  const page = await readFile(`dist/blog/${post.slug}/index.html`, 'utf8');
  for (const market of Object.keys(markets)) {
    const targets = [classification.commercialTarget, ...(classification.relatedTargets || [])];
    for (const targetId of targets) if (!page.includes(`href="/${market}/${commercialTargets[targetId].route}/"`)) throw new Error(`El artículo global ${post.slug} no enlaza ${targetId} para ${market}.`);
  }
  const full = fullPosts[post.slug];
  if (!page.includes('¿Quieres aplicar esta estrategia en tu empresa?') || !page.includes('"@type":"BreadcrumbList"') || !page.includes('"@type":"Article"') || !page.includes('<picture>') || !page.includes(`src="${full.image.src}"`)) throw new Error(`Prerender comercial/editorial incompleto en ${post.slug}.`);
  if (page.includes('"@type":"FAQPage"')) throw new Error(`El artículo ${post.slug} publica FAQ genérico sin preguntas editoriales propias.`);
}

const articleSource = await readFile('src/pages/ArticlePage.jsx', 'utf8');
const articleCommercialSource = await readFile('src/data/articleCommercial.js', 'utf8');
if (/\/mx\//.test(articleSource) || /\/mx\//.test(articleCommercialSource)) throw new Error('El blog contiene URLs comerciales hardcodeadas a México.');
const opportunities = await readFile('docs/seo/commercial-opportunities.csv', 'utf8');
for (const opportunity of ['Integración de sistemas y webhooks', 'Integración de captación pagada y CRM', 'Desarrollo de aplicaciones mobile']) if (!opportunities.includes(opportunity)) throw new Error(`Falta registrar la oportunidad comercial: ${opportunity}.`);

const projectPage = await readFile('dist/proyectos/shortcodes-en-pestanas/index.html', 'utf8');
if (!projectPage.includes('rel="canonical" href="https://pixvo.tech/proyectos/shortcodes-en-pestanas/"') || !projectPage.includes('src="/images/projects/shortcodes-en-pestanas-wordpress.png"') || !projectPage.includes('"@type":"WebPage"') || !projectPage.includes('"@type":"CreativeWork"') || !projectPage.includes('"@type":"BreadcrumbList"') || !projectPage.includes('proyecto técnico de portfolio')) throw new Error('Prerender, schema o separación editorial del proyecto global incompletos.');
for (const market of Object.keys(markets)) for (const href of [`/${market}/solicitar-diagnostico/`, `/${market}/soluciones/seo-wordpress/`, `/${market}/soluciones/optimizacion-wordpress/`]) if (!projectPage.includes(`href="${href}"`)) throw new Error(`El proyecto global no enlaza su destino legítimo ${href}.`);

const navigationSource = await readFile('src/data/navigation.js', 'utf8');
const headerSource = await readFile('src/components/layout/Header.jsx', 'utf8');
const footerSource = await readFile('src/components/layout/Footer.jsx', 'utf8');
if (!navigationSource.includes("id: 'cases'") || !navigationSource.includes("placements: ['header', 'footer-system']") || !/id: 'blog'.*scope: 'market'/.test(navigationSource) || /\/(mx|ar|es)\//.test(navigationSource)) throw new Error('La navegación compartida no incluye Casos de éxito/Blog localizados o contiene prefijos de país fijos.');
if (!headerSource.includes("getNavigationItems('header')") || !footerSource.includes('footerNavigationGroups')) throw new Error('Header y footer deben consumir la configuración de navegación compartida.');

const rootHtml = await readFile('dist/index.html', 'utf8');
if (!rootHtml.includes('<title>Pixvo | Elige tu mercado</title>') || !rootHtml.includes('<h1>Pixvo Growth System</h1>')) throw new Error('El root internacional no funciona como selector de mercado.');
for (const market of Object.keys(markets)) {
  const home = await readFile(`dist/${market}/index.html`, 'utf8');
  const system = await readFile(`dist/${market}/sistema-crecimiento-digital/index.html`, 'utf8');
  const plansPage = await readFile(`dist/${market}/planes/index.html`, 'utf8');
  const auditPage = await readFile(`dist/${market}/auditoria-crecimiento-digital/index.html`, 'utf8');
  if (!home.includes('<h1>Pixvo: SEO, automatización y analítica para PyMEs</h1>') || home.includes('<h1>Sistema de crecimiento digital para PyMEs</h1>')) throw new Error(`La home de ${market} compite con Growth System.`);
  if (!system.includes('<h1>Sistema de crecimiento digital para PyMEs</h1>')) throw new Error(`Growth System no posee su intención en ${market}.`);
  if (!plansPage.includes('<h1>Planes y precios de Pixvo Growth System</h1>') || !plansPage.includes(`href="/${market}/auditoria-crecimiento-digital/"`)) throw new Error(`Planes no mantiene intención transaccional en ${market}.`);
  if (!auditPage.includes('<h1>Auditoría de crecimiento digital, SEO y conversión</h1>') || !auditPage.toLocaleLowerCase('es').includes('auditoría de marketing digital')) throw new Error(`Auditoría no mantiene su ownership transaccional en ${market}.`);
  for (const [page, items, label] of [[system, systemFaqs, 'sistema'], [plansPage, planFaqs, 'planes'], [auditPage, auditFaqs, 'auditoría']]) {
    if (!page.includes('"@type":"FAQPage"')) throw new Error(`FAQPage ausente en ${label} de ${market}.`);
    for (const [question, answer] of items) if (!page.includes(question) || !page.includes(answer)) throw new Error(`FAQ visible/schema no coincide en ${label} de ${market}.`);
  }
}

const croDestination = '/mx/soluciones/optimizacion-de-conversion/';
const vercel = await readFile('vercel.json', 'utf8');
const redirects = await readFile('public/_redirects', 'utf8');
const appRoutes = await readFile('src/routes/AppRoutes.jsx', 'utf8');
if (!vercel.includes('"source": "/mx/soluciones/c/"') || !vercel.includes(`"destination": "${croDestination}"`) || !redirects.includes(`/mx/soluciones/c/ ${croDestination} 301`) || !appRoutes.includes('path="mx/soluciones/c"')) throw new Error('Falta el 301 de la URL CRO histórica.');
if (allUrls.some((url) => url.includes('/soluciones/c/')) || keywordMap.includes('/soluciones/c/')) throw new Error('La URL CRO histórica sigue siendo indexable o propietaria de keywords.');
for (const market of Object.keys(markets)) {
  const cro = await readFile(`dist/${market}/soluciones/optimizacion-de-conversion/index.html`, 'utf8');
  if (!cro.includes(`rel="canonical" href="https://pixvo.tech/${market}/soluciones/optimizacion-de-conversion/"`) || !cro.includes('Optimización de conversión web')) throw new Error(`Destino CRO incompleto en ${market}.`);
}
if (urlsFrom(sitemapXml.projects).length !== 1 || !sitemapXml.projects.includes('/proyectos/shortcodes-en-pestanas/') || /proyectos\/(sanidad-web|paola-informa)/.test(sitemapXml.projects)) throw new Error('El sitemap de proyectos compite con los casos consolidados.');

const indexXml = await readFile('dist/sitemap_index.xml', 'utf8');
const legacyIndexXml = await readFile('dist/sitemap.xml', 'utf8');
for (const name of sitemapNames) if (!indexXml.includes(`/sitemap-${name}.xml`)) throw new Error(`Falta sitemap-${name}.xml en el índice.`);
if (legacyIndexXml !== indexXml) throw new Error('sitemap.xml debe mantener compatibilidad con sitemap_index.xml.');
const robots = await readFile('dist/robots.txt', 'utf8');
if (!robots.includes('sitemap_index.xml') || /utm_|gclid/i.test(robots)) throw new Error('robots.txt contiene una directiva SEO incorrecta.');

const contentAudit = await readFile('docs/seo/content-audit.csv', 'utf8');
const graphAudit = await readFile('docs/seo/internal-link-graph.csv', 'utf8');
const imageAudit = await readFile('docs/seo/image-audit.csv', 'utf8');
const ownershipAudit = await readFile('docs/seo/ownership-audit.csv', 'utf8');
const finalAudit = await readFile('docs/seo/final-build-audit.md', 'utf8');
if (contentAudit.trim().split(/\r?\n/).length !== allUrls.length + 1 || !contentAudit.startsWith('url,country,page_type,cluster,primary_keyword,word_count,guide_min,guide_max,status,note')) throw new Error('El informe de contenido no cubre todas las URLs indexables.');
const graphLines = graphAudit.trim().split(/\r?\n/);
const graphColumns = graphLines[0].split(',');
if (graphLines.length !== allUrls.length + 1) throw new Error('El grafo interno no cubre todas las URLs indexables.');
for (const line of graphLines.slice(1)) {
  const values = line.split(',');
  const value = (column) => values[graphColumns.indexOf(column)];
  if (value('orphan') === 'yes' || ['broken_outbound', 'redirect_outbound', 'wrong_country_outbound'].some((column) => Number(value(column)) > 0)) throw new Error(`El grafo interno contiene una incidencia en ${value('url')}.`);
}
if (imageAudit.includes('error_missing') || imageAudit.includes('error_alt_missing') || imageAudit.includes('error_dimensions_missing') || imageAudit.includes('error_srcset_missing')) throw new Error('La auditoría física de imágenes contiene errores.');
if (ownershipAudit.split(/\r?\n/).some((line) => line.endsWith(',error'))) throw new Error('La auditoría de ownership contiene conflictos.');
for (const statement of ['Enlaces rotos: 0', 'Enlaces internos a redirects: 0', 'Páginas huérfanas (excluido el selector raíz): 0', 'Errores físicos de imágenes: 0', 'Conflictos de ownership: 0']) if (!finalAudit.includes(statement)) throw new Error(`El informe final no confirma: ${statement}.`);

console.log(`QA SEO: ${marketRoutes.mx.length} rutas indexables idénticas por mercado, ${allUrls.length} URLs totales, ${titles.size} titles únicos, ${sitemapNames.length} sitemaps y 3 páginas noindex validados.`);

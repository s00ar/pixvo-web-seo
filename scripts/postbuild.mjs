import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { getArticleCommercialData, resolveCommercialTarget } from '../src/data/articleCommercial.js';
import { caseStudies } from '../src/data/caseStudies.js';
import { getEditorialExpansion } from '../src/data/editorialExpansions.js';
import { getEntityPresentation } from '../src/data/entityPresentation.js';
import { auditFaqs, getPrice, getProblemCta, getSolutionConnections, getSolutionFaqs, planFaqs, plans, problemCatalog, resourceCatalog, solutionCatalog, systemFaqs } from '../src/data/growthSystem.js';
import { getNavigationItem, getNavigationItems, resolveNavigationUrl } from '../src/data/navigation.js';
import { marketRoutePaths, seoRecordByMarketPath } from '../src/data/seoRegistry.js';

const posts = JSON.parse(await readFile('public/posts/index.json', 'utf8'));
const fullPosts = await Promise.all(posts.map(({ slug }) => readFile(`public/posts/${slug}.json`, 'utf8').then(JSON.parse)));
const postBySlug = Object.fromEntries(fullPosts.map((post) => [post.slug, post]));

const domain = process.env.SITE_URL || 'https://pixvo.tech';
const markets = {
  mx: { name: 'México', locale: 'es-MX', currency: 'MXN' },
  ar: { name: 'Argentina', locale: 'es-AR', currency: 'USD' },
  es: { name: 'España', locale: 'es-ES', currency: 'EUR' },
};

const solutionLabels = {
  'seo-para-pymes': 'SEO para PyMEs',
  'seo-wordpress': 'SEO para WordPress',
  'contenido-seo': 'Servicio de contenido SEO',
  'automatizacion-de-procesos': 'Automatización de procesos para PyMEs',
  'automatizacion-de-marketing': 'Automatización de marketing para PyMEs',
  'seguimiento-de-leads': 'Automatización y seguimiento de leads',
  'analitica-digital': 'Consultoría de analítica digital',
  'optimizacion-wordpress': 'Optimización WordPress para empresas',
  'optimizacion-de-conversion': 'Optimización de conversión web (CRO)',
};
const problemLabels = {
  'leads-no-convierten': 'Por qué mis leads no convierten',
  'reducir-tareas-manuales': 'Cómo automatizar tareas repetitivas',
  'web-no-convierte': 'Mi web recibe visitas pero no vende',
  'dependencia-publicidad-paga': 'Cómo reducir la dependencia de publicidad pagada',
  'medir-resultados-marketing': 'Cómo medir resultados de marketing',
  'conectar-marketing-y-ventas': 'Cómo conectar marketing y ventas',
  'wordpress-lento': 'WordPress lento: causas y soluciones',
  'contenido-no-genera-clientes': 'Por qué el contenido no genera clientes',
};
const resourceLabels = {
  'seo-vs-google-ads': 'SEO vs Google Ads',
  'agencia-seo-vs-consultor-seo': 'Agencia SEO vs consultor SEO',
  'seo-mensual-vs-auditoria': 'SEO mensual vs auditoría SEO',
  'n8n-vs-zapier': 'n8n vs Zapier',
  'crm-vs-automatizacion-de-leads': 'CRM vs automatización de leads',
  'rediseno-web-vs-optimizacion-cro': 'Rediseño web vs CRO',
  'seo-vs-sistema-de-crecimiento': 'SEO vs sistema de crecimiento digital',
};
const routeTitles = {
  '': 'SEO, automatización y crecimiento para PyMEs',
  'sistema-crecimiento-digital': 'Sistema de crecimiento digital para PyMEs',
  planes: 'Precios de Pixvo Growth System',
  'auditoria-crecimiento-digital': 'Auditoría de crecimiento digital',
  'solicitar-diagnostico': 'Solicitar diagnóstico de crecimiento digital',
  'gracias-diagnostico': 'Solicitud recibida',
  nosotros: 'Sobre Pixvo y su equipo',
  contacto: 'Contacto Pixvo',
  'casos-de-exito': 'Casos, proyectos y transformaciones verificables',
  recursos: 'Recursos para decidir cómo crecer',
  blog: 'Blog de tecnología y crecimiento',
};
const caseBySlug = Object.fromEntries(caseStudies.map((item) => [item.slug, item]));
const labels = { ...solutionLabels, ...problemLabels, ...resourceLabels };
const indexedPaths = marketRoutePaths(posts);
const sharedPaths = [...indexedPaths, 'gracias-diagnostico'];
const paths = Object.fromEntries(Object.keys(markets).map((market) => [market, sharedPaths]));
const seoByPath = seoRecordByMarketPath(posts);
const rawTemplate = await readFile('dist/index.html', 'utf8');
const template = rawTemplate
  .replace(/<(?:meta|link)\s+data-static-seo\b[^>]*>/g, '')
  .replace(/<script\s+data-static-seo\b[^>]*>[\s\S]*?<\/script>/g, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>');
const builtAssets = await readdir('dist/assets');
const defaultSocialAsset = builtAssets.find((name) => /^services-workspace-.*\.jpg$/.test(name));
if (!defaultSocialAsset) throw new Error('No se encontró la imagen social comercial en el build.');
const defaultSocialImage = `/assets/${defaultSocialAsset}`;

const esc = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');
const absolute = (path) => new URL(path, domain).toString();

function render({ title, description, canonical, lang = 'es', type = 'website', image = defaultSocialImage, imageWidth = 512, imageHeight = 279, robots = 'index,follow', schema = [], alternates = '', alternateLocales = [], author, publishedTime, modifiedTime, body = '' }) {
  const imageDimensions = `${imageWidth ? `<meta data-static-seo property="og:image:width" content="${imageWidth}">` : ''}${imageHeight ? `<meta data-static-seo property="og:image:height" content="${imageHeight}">` : ''}`;
  const articleMeta = `${author ? `<meta data-static-seo name="author" content="${esc(author)}">` : ''}${publishedTime ? `<meta data-static-seo property="article:published_time" content="${esc(publishedTime)}">` : ''}${modifiedTime ? `<meta data-static-seo property="article:modified_time" content="${esc(modifiedTime)}">` : ''}`;
  const localeMeta = alternateLocales.map((locale) => `<meta data-static-seo property="og:locale:alternate" content="${locale.replace('-', '_')}">`).join('');
  const absoluteImage = absolute(image || defaultSocialImage);
  const tags = `<meta data-static-seo name="description" content="${esc(description)}"><meta data-static-seo name="robots" content="${robots}"><link data-static-seo rel="canonical" href="${canonical}">${alternates}${articleMeta}<meta data-static-seo property="og:title" content="${esc(title)}"><meta data-static-seo property="og:description" content="${esc(description)}"><meta data-static-seo property="og:url" content="${canonical}"><meta data-static-seo property="og:type" content="${type}"><meta data-static-seo property="og:locale" content="${lang.replace('-', '_')}">${localeMeta}<meta data-static-seo property="og:image" content="${absoluteImage}">${imageDimensions}<meta data-static-seo name="twitter:card" content="summary_large_image"><meta data-static-seo name="twitter:title" content="${esc(title)}"><meta data-static-seo name="twitter:description" content="${esc(description)}"><meta data-static-seo name="twitter:image" content="${absoluteImage}">${schema.map((item) => `<script data-static-seo type="application/ld+json">${json(item)}</script>`).join('')}`;
  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace('</head>', `${tags}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

function breadcrumbHtml(items) {
  return `<nav aria-label="Migas de pan"><ol>${items.map((item, index) => `<li>${index < items.length - 1 ? `<a href="${item.path}">${esc(item.name)}</a>` : `<span aria-current="page">${esc(item.name)}</span>`}</li>`).join('')}</ol></nav>`;
}

function marketBreadcrumbItems(marketCode, path, heading) {
  const items = [{ name: 'Inicio', path: '/' }, { name: markets[marketCode].name, path: `/${marketCode}/` }];
  if (path.startsWith('soluciones/')) items.push({ name: 'Sistema de crecimiento', path: `/${marketCode}/sistema-crecimiento-digital/` });
  if (path.startsWith('recursos/')) items.push({ name: 'Recursos', path: `/${marketCode}/recursos/` });
  if (path.startsWith('casos-de-exito/')) items.push({ name: 'Casos de éxito', path: `/${marketCode}/casos-de-exito/` });
  if (path.startsWith('blog/')) items.push({ name: 'Blog', path: `/${marketCode}/blog/` });
  if (path) items.push({ name: heading, path: `/${marketCode}/${path}/` });
  return items;
}

function articleCommercialHtml(article, marketCode) {
  const classification = getArticleCommercialData(article);
  const marketCodes = marketCode ? [marketCode] : Object.keys(markets);
  const primary = resolveCommercialTarget(classification.commercialTarget);
  const related = [...new Set(classification.relatedTargets || [])].map(resolveCommercialTarget).filter((item) => item.route !== primary.route);
  const primaryLinks = marketCodes.map((code) => `<a href="/${code}/${primary.route}/">${esc(markets[code].name)}</a>`).join(' · ');
  const relatedLinks = related.flatMap((target) => marketCodes.map((code) => `<li><a href="/${code}/${target.route}/">${esc(target.anchor)}${marketCode ? '' : ` en ${esc(markets[code].name)}`}</a></li>`)).join('');
  const projectLink = classification.projectSlug ? `<p><a href="/proyectos/${classification.projectSlug}/">Ver el proyecto técnico relacionado, separado de los casos de éxito</a></p>` : '';
  return `<section data-commercial-cluster="${esc(classification.cluster)}"><h2>¿Quieres aplicar esta estrategia en tu empresa?</h2><p>Consulta ${esc(primary.label)} y sus condiciones para tu mercado. No realizamos georedirecciones automáticas.</p><p>${primaryLinks}</p>${relatedLinks ? `<h3>Capacidades relacionadas</h3><ul>${relatedLinks}</ul>` : ''}${projectLink}</section>`;
}

function articlePicture(article) {
  const image = article.image || { src: article.featuredImage, alt: article.title, width: 1200, height: 628 };
  return `<figure><picture>${image.srcset ? `<source type="image/webp" srcset="${esc(image.srcset)}" sizes="(max-width: 720px) 100vw, 1200px">` : ''}<img src="${esc(image.src)}" alt="${esc(image.alt || article.title)}" width="${image.width || 1200}" height="${image.height || 628}" loading="eager" decoding="async" fetchpriority="high"></picture></figure>`;
}

function faqHtml(items) {
  return items.length ? `<section><h2>Preguntas frecuentes</h2>${items.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join('')}</section>` : '';
}

function faqSchema(items) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) };
}

function editorialExpansionHtml(sections) {
  if (!sections.length) return '';
  return `<section class="editorial-expansion">${sections.map((section) => `<section><h2>${esc(section.title)}</h2>${(section.paragraphs || []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}${section.bullets?.length ? `<ul>${section.bullets.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}</section>`).join('')}</section>`;
}

function marketShell(marketCode, body) {
  const headerItems = getNavigationItems('header');
  const diagnosis = getNavigationItem('diagnosis');
  const footerItems = [...getNavigationItems('footer-system'), ...getNavigationItems('footer-solutions'), ...getNavigationItems('footer-company')];
  const header = `<nav aria-label="Navegación principal">${headerItems.map((item) => `<a href="${resolveNavigationUrl(item, marketCode)}">${esc(item.label)}</a>`).join('')}<a href="${resolveNavigationUrl(diagnosis, marketCode)}">${esc(diagnosis.label)}</a></nav>`;
  const footer = `<footer><nav aria-label="Navegación del pie">${[...new Map(footerItems.map((item) => [item.id, item])).values()].map((item) => `<a href="${resolveNavigationUrl(item, marketCode)}">${esc(item.label)}</a>`).join('')}${Object.entries(markets).map(([code, market]) => `<a href="/${code}/">${esc(market.name)}</a>`).join('')}</nav></footer>`;
  return `${header}${body}${footer}`;
}

function globalShell(body) {
  return `<nav aria-label="Navegación internacional"><a href="/">Pixvo</a><a href="/blog/">Blog</a>${Object.entries(markets).map(([code, market]) => `<a href="/${code}/">${esc(market.name)}</a>`).join('')}</nav>${body}`;
}

function marketAlternates(path) {
  if (path === 'gracias-diagnostico') return '';
  const alternates = Object.entries(markets).map(([code, market]) => `<link data-static-seo rel="alternate" hreflang="${market.locale}" href="${domain}/${code}/${path}${path ? '/' : ''}">`).join('');
  const xDefault = path === 'blog' || path.startsWith('blog/') ? `${domain}/${path}/` : `${domain}/`;
  return `${alternates}<link data-static-seo rel="alternate" hreflang="x-default" href="${xDefault}">`;
}

function globalBlogAlternates(path) {
  const alternates = Object.entries(markets).map(([code, market]) => `<link data-static-seo rel="alternate" hreflang="${market.locale}" href="${domain}/${code}/${path}/">`).join('');
  return `${alternates}<link data-static-seo rel="alternate" hreflang="x-default" href="${domain}/${path}/">`;
}

function casePicture(item) {
  const sources = (item.detailSources || []).map((source) => `<source${source.media ? ` media="${esc(source.media)}"` : ''} srcset="${esc(source.srcSet)}"${source.sizes ? ` sizes="${esc(source.sizes)}"` : ''}${source.width ? ` width="${source.width}"` : ''}${source.height ? ` height="${source.height}"` : ''}>`).join('');
  const deferred = item.slug === 'hospital-metropolitano';
  return `<figure><picture>${sources}<img src="${item.image}"${item.imageSrcSet ? ` srcset="${esc(item.imageSrcSet)}"` : ''} sizes="${esc(item.detailSizes || '100vw')}" alt="${esc(item.imageAlt)}" width="${item.imageWidth}" height="${item.imageHeight}" loading="${deferred ? 'lazy' : 'eager'}" decoding="async"${deferred ? '' : ' fetchpriority="high"'}></picture>${item.caption ? `<figcaption>${esc(item.caption)}</figcaption>` : ''}</figure>`;
}

function marketPage(marketCode, path) {
  const market = markets[marketCode];
  const seoEntity = seoByPath.get(path);
  const slug = path.split('/').at(-1);
  const caseStudy = path.startsWith('casos-de-exito/') ? caseBySlug[slug] : null;
  const article = path.startsWith('blog/') ? postBySlug[slug] : null;
  const solution = path.startsWith('soluciones/') ? solutionCatalog[slug] : null;
  const problem = path.startsWith('problemas/') ? problemCatalog[slug] : null;
  const resource = path.startsWith('recursos/') ? resourceCatalog[slug] : null;
  const leadCase = path === 'casos-de-exito' ? caseStudies[0] : null;
  const pageImage = caseStudy?.socialImage || caseStudy?.image || article?.featuredImage || leadCase?.socialImage || leadCase?.image;
  const imageWidth = caseStudy?.socialImageWidth || caseStudy?.imageWidth || article?.image?.width || leadCase?.socialImageWidth || leadCase?.imageWidth;
  const imageHeight = caseStudy?.socialImageHeight || caseStudy?.imageHeight || article?.image?.height || leadCase?.socialImageHeight || leadCase?.imageHeight;
  const heading = seoEntity?.h1 || (caseStudy ? caseStudy.title : article?.title || routeTitles[path] || getEntityPresentation(slug)?.label || labels[slug] || 'Pixvo Growth System');
  const title = path === 'soluciones/seo-para-pymes'
    ? `SEO para PyMEs en ${market.name} | Pixvo`
    : `${seoEntity?.title || `${heading} | Pixvo`} — ${market.name}`;
  const canonical = `${domain}/${marketCode}/${path}${path ? '/' : ''}`;
  const routeDescriptions = {
    'solicitar-diagnostico': 'Comparte el contexto de tu empresa para valorar un diagnóstico de captación, conversión, automatización, seguimiento y medición.',
    planes: 'Compara alcance, capacidad operativa, permanencia, límites y precios aprobados de Pixvo Growth System.',
    'auditoria-crecimiento-digital': 'Auditoría de captación, SEO, conversión, medición y seguimiento para priorizar un roadmap verificable.',
    contacto: 'Consulta los canales de contacto de Pixvo y comparte el contexto de tu empresa.',
    nosotros: 'Conoce el enfoque, las responsabilidades y los límites de trabajo de Pixvo Growth System.',
  };
  const description = caseStudy?.summary || article?.excerpt || solution?.description || solution?.lead || problem?.lead || resource?.lead || routeDescriptions[path] || (path === 'casos-de-exito'
    ? 'Casos de trabajo y experiencia asociada: problemas, soluciones, transformación funcional, métricas disponibles y límites de evidencia explícitos.'
    : path === ''
      ? `Pixvo conecta SEO, automatización y analítica para ayudar a las PyMEs de ${market.name} a generar y aprovechar oportunidades comerciales.`
      : `Conoce ${heading} en ${market.name}: alcance, método y siguiente paso dentro de Pixvo Growth System.`);
  const breadcrumbItems = marketBreadcrumbItems(marketCode, path, heading);
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absolute(item.path) })),
  };
  const schemas = [breadcrumbs];
  const pageFaqs = path === 'sistema-crecimiento-digital'
    ? systemFaqs
    : path === 'planes'
      ? planFaqs
      : path === 'auditoria-crecimiento-digital'
        ? auditFaqs
        : solution
          ? getSolutionFaqs(slug)
          : [];
  if (path.startsWith('soluciones/')) schemas.push({ '@context': 'https://schema.org', '@type': 'Service', name: heading, areaServed: market.name, provider: { '@type': 'Organization', name: 'Pixvo', url: domain }, url: canonical });
  if (path.startsWith('recursos/')) schemas.push({ '@context': 'https://schema.org', '@type': 'Article', headline: heading, description, author: { '@type': 'Organization', name: 'Pixvo' }, mainEntityOfPage: canonical });
  if (caseStudy) {
    const creator = caseStudy.slug === 'hospital-metropolitano'
      ? [{ '@type': 'Organization', name: 'Metamorfosis 360' }, { '@type': 'Organization', name: 'Events Group' }]
      : { '@type': 'Organization', name: 'Pixvo' };
    const caseImage = { '@type': 'ImageObject', url: absolute(caseStudy.socialImage || caseStudy.image), width: caseStudy.socialImageWidth || caseStudy.imageWidth, height: caseStudy.socialImageHeight || caseStudy.imageHeight, caption: caseStudy.caption || caseStudy.imageAlt };
    schemas.push({ '@context': 'https://schema.org', '@type': 'WebPage', name: heading, description, image: caseImage, mainEntity: { '@type': 'CreativeWork', name: caseStudy.title, abstract: caseStudy.summary, image: caseImage, creator } });
  }
  if (path === 'blog') schemas.push({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: heading, url: canonical, publisher: { '@type': 'Organization', name: 'Pixvo' } });
  if (article) schemas.push({ '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.excerpt, ...(article.publishedAt ? { datePublished: article.publishedAt, dateModified: article.updatedAt || article.publishedAt } : {}), image: absolute(article.featuredImage), ...(article.author ? { author: { '@type': 'Person', name: article.author } } : {}), publisher: { '@type': 'Organization', name: 'Pixvo', url: domain }, mainEntityOfPage: canonical });
  if (pageFaqs.length) schemas.push(faqSchema(pageFaqs));
  const articleSections = article?.content || (article ? [
    { title: 'Contexto', paragraphs: [article.overview || article.excerpt], blocks: [{ type: 'list', items: article.topics || [] }] },
    { title: 'Aplicación práctica', paragraphs: [article.application || ''] },
    { title: 'Conclusión', paragraphs: [article.conclusion || ''] },
  ] : []);
  const solutionConnections = solution ? getSolutionConnections(slug) : null;
  const routeLink = (target, label) => `<a href="/${marketCode}/${target}/">${esc(label)}</a>`;
  let body = caseStudy
    ? `<main data-prerendered="true"><article><h1>${esc(caseStudy.title)}</h1><p>${esc(caseStudy.summary)}</p>${casePicture(caseStudy)}<h2>Resumen ejecutivo</h2><p>${esc(caseStudy.executiveSummary)}</p><h2>Situación inicial</h2><p>${esc(caseStudy.situation)}</p><h2>Problema</h2><p>${esc(caseStudy.problem)}</p><h2>Impacto operativo del problema</h2><p>${esc(caseStudy.operationalImpact)}</p><h2>Solución</h2><p>${esc(caseStudy.solution)}</p><h2>Cómo funciona</h2><ol>${caseStudy.workflow.map((step) => `<li>${esc(step)}</li>`).join('')}</ol><h2>Arquitectura y decisiones técnicas</h2><p>${esc(caseStudy.architecture)}</p><h2>Antes vs. después</h2><dl>${caseStudy.beforeAfter.map((comparison) => `<dt>Antes</dt><dd>${esc(comparison.before)}</dd><dt>Después</dt><dd>${esc(comparison.after)}</dd>`).join('')}</dl><h2>Resultado verificable</h2><p>${esc(caseStudy.result)}</p>${caseStudy.metrics.length ? `<h2>Métricas verificables</h2><ul>${caseStudy.metrics.map((metric) => `<li><strong>${esc(metric.value)}</strong> ${esc(metric.label)}. ${esc(metric.context)}</li>`).join('')}</ul>` : ''}<h2>Hechos verificables</h2><ul>${caseStudy.verifiedFacts.map((fact) => `<li>${esc(fact)}</li>`).join('')}</ul>${caseStudy.attribution ? `<h2>Atribución pública</h2><p>${esc(caseStudy.attribution)}</p>` : ''}<h2>Limitaciones de evidencia</h2><p>${esc(caseStudy.caveat)}</p><h2>Servicios y capacidades relacionadas</h2><ul>${(caseStudy.commercialLinks || []).map((link) => `<li><a href="/${marketCode}/${link.target}/">${esc(link.anchor)}</a></li>`).join('')}</ul><h2>Otros casos relacionados</h2><ul>${caseStudy.relatedCases.map((related) => `<li><a href="/${marketCode}/casos-de-exito/${related}/">${esc(caseBySlug[related]?.title || related)}</a></li>`).join('')}</ul><h2>¿Tu empresa tiene un cuello de botella parecido?</h2><p><a href="/${marketCode}/solicitar-diagnostico/">Analicemos qué parte de este proceso puedes automatizar</a></p></article></main>`
    : article
      ? `<main data-prerendered="true"><article><h1>${esc(article.title)}</h1><p>${esc(article.excerpt)}</p>${articlePicture(article)}${article.caseStudySlug ? `<p><a href="/${marketCode}/casos-de-exito/${article.caseStudySlug}/">Ver el caso principal con su evidencia y limitaciones</a></p>` : ''}${articleSections.map((section) => `<section><h2>${esc(section.title)}</h2>${(section.paragraphs || []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}${(section.blocks || []).map((block) => block.type === 'list' ? `<ul>${(block.items || []).map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : '').join('')}</section>`).join('')}${articleCommercialHtml(article, marketCode)}</article></main>`
      : path === 'blog'
        ? `<main data-prerendered="true"><h1>Blog de Pixvo</h1><p>Guías sobre SEO, automatización, analítica y desarrollo.</p><ul>${posts.map((post) => `<li><a href="/${marketCode}/blog/${post.slug}/">${esc(post.title)}</a></li>`).join('')}</ul></main>`
        : path === 'casos-de-exito'
          ? `<main data-prerendered="true"><article><h1>${esc(heading)}</h1><p>${esc(description)}</p>${casePicture(caseStudies[0])}<p>Microcuotas es el caso cuantificable principal. Hospital Metropolitano conserva una atribución pública explícita; los demás proyectos documentan transformación funcional sin convertir estimaciones en resultados.</p><h2>Casos destacados</h2><ul>${caseStudies.map((item) => `<li><a href="/${marketCode}/casos-de-exito/${item.slug}/">${esc(item.title)}</a><p>${esc(item.summary)}</p><p>${esc(item.result)}</p></li>`).join('')}</ul><h2>Cómo leer la evidencia</h2><ul><li>El problema y el impacto operativo se presentan por separado.</li><li>Las métricas solo aparecen cuando existe una fuente utilizable.</li><li>Las limitaciones y la atribución se mantienen visibles.</li><li>Las tecnologías explican la solución, pero no sustituyen la transformación.</li></ul><p>${routeLink('auditoria-crecimiento-digital', 'Auditar un cuello de botella')} · ${routeLink('solicitar-diagnostico', 'Compartir el contexto de tu empresa')}</p></article></main>`
          : solution
            ? `<main data-prerendered="true"><article><h1>${esc(heading)}</h1><p>${esc(description)}</p><h2>El resultado comercial guía la prioridad</h2><p>No implementamos tareas aisladas para acumular entregables. Primero identificamos el cuello de botella, la evidencia y las dependencias; después priorizamos una mejora verificable y la conectamos con el resto del sistema.</p><h2>Qué trabajamos</h2><ul>${solution.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>${solution.excluded ? `<h2>Qué no equivale a este servicio</h2><ul>${solution.excluded.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}<h2>Problemas que ayuda a resolver</h2><ul>${solutionConnections.problems.map((item) => `<li>${routeLink(`problemas/${item.slug}`, item.h1)}. ${esc(item.lead)}</li>`).join('')}</ul><h2>Soluciones relacionadas</h2><ul>${solution.related.map((related) => `<li>${routeLink(`soluciones/${related}`, solutionCatalog[related].title)}. ${esc(solutionCatalog[related].lead)}</li>`).join('')}</ul><h2>Comparativas para tomar la decisión</h2><ul>${solutionConnections.resources.map((item) => `<li>${routeLink(`recursos/${item.slug}`, item.title)}. ${esc(item.decision)}</li>`).join('')}</ul>${solutionConnections.cases.length ? `<h2>Casos relacionados con esta capacidad</h2><ul>${solutionConnections.cases.map((item) => `<li>${routeLink(`casos-de-exito/${item.slug}`, item.title)}. ${esc(item.summary)}</li>`).join('')}</ul>` : ''}<h2>Define el alcance</h2><p>${routeLink('auditoria-crecimiento-digital', 'Solicitar una auditoría')} · ${routeLink('planes', 'Comparar planes y precios')} · ${routeLink('solicitar-diagnostico', 'Solicitar diagnóstico')}</p></article></main>`
            : problem
              ? `<main data-prerendered="true"><article><h1>${esc(heading)}</h1><p>${esc(problem.lead)}</p><h2>Síntomas que conviene comprobar</h2><ul>${problem.symptoms.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><h2>Causas habituales</h2><ul>${problem.causes.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><h2>Cómo diagnosticar el cuello de botella</h2><ul>${problem.diagnosis.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><h2>Soluciones relacionadas con el problema</h2><p>${routeLink(`soluciones/${problem.primary}`, solutionCatalog[problem.primary].title)} · ${routeLink(`soluciones/${problem.secondary}`, solutionCatalog[problem.secondary].title)}</p><h2>Auditoría o diagnóstico</h2><p>${routeLink('auditoria-crecimiento-digital', 'Auditoría de crecimiento digital')} · ${routeLink(problem.conversion, getProblemCta(slug))}</p></article></main>`
              : resource
                ? `<main data-prerendered="true"><article><h1>${esc(resource.title)}</h1><p>${esc(resource.lead)}</p><h2>Qué decisión ayuda a resolver</h2><p>${esc(resource.decision)}</p><h2>Criterios para comparar</h2><ul>${resource.criteria.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><h2>Cuándo elegir cada alternativa</h2>${resource.options.map((item) => `<h3>${esc(item.title)}</h3><p>${esc(item.text)}</p>`).join('')}<h2>Soluciones comerciales relacionadas</h2><p>${routeLink(getEntityPresentation(resource.primary).route, getEntityPresentation(resource.primary).label)} · ${routeLink(getEntityPresentation(resource.secondary).route, getEntityPresentation(resource.secondary).label)}</p><h2>Siguiente paso</h2><p>${routeLink(getEntityPresentation(resource.nextStep).route, getEntityPresentation(resource.nextStep).label)} · ${routeLink('planes', 'Planes y precios')} · ${routeLink('solicitar-diagnostico', 'Solicitar diagnóstico')}</p></article></main>`
                : path === 'sistema-crecimiento-digital'
                  ? `<main data-prerendered="true"><article><h1>${esc(heading)}</h1><p>${esc(description)}</p><h2>Un sistema, no una colección de servicios aislados</h2><p>La consultoría parte del cuello de botella y organiza SEO, automatización, conversión, seguimiento y analítica dentro de un roadmap común. El objetivo es conectar demanda, experiencia, procesos y datos sin prometer ventas ni posiciones concretas.</p><h2>Problemas que puede priorizar</h2><ul>${Object.entries(problemCatalog).map(([problemSlug, item]) => `<li>${routeLink(`problemas/${problemSlug}`, item.h1)}. ${esc(item.lead)}</li>`).join('')}</ul><h2>Soluciones del sistema</h2><ul>${Object.entries(solutionCatalog).map(([solutionSlug, item]) => `<li>${routeLink(`soluciones/${solutionSlug}`, item.title)}. ${esc(item.lead)}</li>`).join('')}</ul><h2>Decisiones relacionadas</h2><p>${routeLink('recursos/seo-vs-sistema-de-crecimiento', 'SEO vs sistema de crecimiento digital')} · ${routeLink('recursos/seo-mensual-vs-auditoria', 'SEO mensual vs auditoría')}</p><h2>Evidencia y contratación</h2><p>${routeLink('casos-de-exito/microcuotas', 'Caso Microcuotas')} · ${routeLink('auditoria-crecimiento-digital', 'Auditoría')} · ${routeLink('planes', 'Planes')} · ${routeLink('solicitar-diagnostico', 'Diagnóstico')}</p></article></main>`
                  : path === 'planes'
                    ? `<main data-prerendered="true"><article><h1>${esc(heading)}</h1><p>${esc(description)}</p><p>Cada plan define capacidad, permanencia, revisiones y límites. Los importes solo se muestran cuando están aprobados para el mercado; el onboarding y la mensualidad se presentan por separado.</p><h2>Alcance de los planes</h2>${plans.map((plan) => `<section><h3>${esc(plan.name)}</h3><p>${esc(plan.audience)} Incluye ${plan.units} unidades operativas al mes y una permanencia mínima de ${plan.minimum} meses.</p><h4>Incluye</h4><ul>${plan.included.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><h4>Límites</h4><ul>${plan.limits.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></section>`).join('')}<h2>Antes de elegir un plan</h2><p>${routeLink('sistema-crecimiento-digital', 'Entender Pixvo Growth System')} · ${routeLink('auditoria-crecimiento-digital', 'Solicitar una auditoría')} · ${routeLink('recursos/seo-mensual-vs-auditoria', 'SEO mensual vs auditoría')}</p><h2>Evidencia relacionada</h2><p>${routeLink('casos-de-exito/microcuotas', 'Caso Microcuotas')} · ${routeLink('solicitar-diagnostico', 'Revisar qué plan encaja')}</p></article></main>`
                    : path === 'auditoria-crecimiento-digital'
                      ? `<main data-prerendered="true"><article><h1>${esc(heading)}</h1><p>${esc(description)}</p><h2>El problema puede no estar donde crees</h2><p>Una auditoría de marketing digital separa captación, experiencia, conversión, medición y seguimiento. Más tráfico no corrige una web que no convierte; más formularios no ayudan si el proceso comercial pierde el contexto.</p><h2>Qué analizamos</h2><ul><li>Relevancia del tráfico, demanda y visibilidad.</li><li>Arquitectura, landings y recorrido de conversión.</li><li>Formularios, eventos, fuentes y trazabilidad.</li><li>Tiempo de respuesta, clasificación y seguimiento.</li><li>Automatizaciones, integraciones y errores operativos.</li><li>Dependencias, riesgos y capacidad de implementación.</li></ul><h2>Qué recibes</h2><ul><li>Diagnóstico limitado por la evidencia disponible.</li><li>Problemas y oportunidades priorizados.</li><li>Roadmap con dependencias y siguiente paso sugerido.</li></ul><h2>Áreas relacionadas</h2><p>${routeLink('sistema-crecimiento-digital', 'Sistema de crecimiento')} · ${routeLink('soluciones/seo-para-pymes', 'SEO para PyMEs')} · ${routeLink('soluciones/automatizacion-de-procesos', 'Automatización de procesos')} · ${routeLink('soluciones/seguimiento-de-leads', 'Seguimiento de leads')}</p><h2>Siguiente paso</h2><p>${routeLink('recursos/seo-mensual-vs-auditoria', 'SEO mensual vs auditoría')} · ${routeLink('planes', 'Planes')} · ${routeLink('casos-de-exito/microcuotas', 'Caso Microcuotas')} · ${routeLink('solicitar-diagnostico', 'Solicitar la auditoría')}</p></article></main>`
          : path === ''
            ? `<main data-prerendered="true"><article><h1>${esc(heading)}</h1><p>${esc(description)}</p><h2>Tu empresa no necesita más herramientas desconectadas</h2><p>Una web, contenido, publicidad y software pueden coexistir sin compartir una ruta comercial. Pixvo conecta captación, conversión, automatización, seguimiento y analítica para que cada mejora responda a un problema verificable.</p><h2>Problemas que conviene diagnosticar</h2><ul>${Object.entries(problemCatalog).slice(0, 6).map(([problemSlug, item]) => `<li>${routeLink(`problemas/${problemSlug}`, item.h1)}. ${esc(item.lead)}</li>`).join('')}</ul><h2>SEO, automatización y analítica dentro de un mismo sistema</h2><ul>${Object.entries(solutionCatalog).map(([solutionSlug, item]) => `<li>${routeLink(`soluciones/${solutionSlug}`, item.title)}. ${esc(item.lead)}</li>`).join('')}</ul><h2>Cómo funciona Pixvo Growth System</h2><ol><li>Auditoría y línea base.</li><li>Roadmap y priorización.</li><li>Implementación dentro de un alcance definido.</li><li>Automatización de procesos repetibles.</li><li>Medición y optimización continua.</li></ol><h2>Evidencia y decisión comercial</h2><p>${routeLink('casos-de-exito', 'Revisar casos y límites de evidencia')} · ${routeLink('recursos', 'Comparar alternativas')} · ${routeLink('planes', 'Ver planes y precios')} · ${routeLink('solicitar-diagnostico', 'Solicitar diagnóstico')}</p></article></main>`
            : path === 'recursos'
              ? `<main data-prerendered="true"><article><h1>${esc(heading)}</h1><p>${esc(description)}</p><h2>Comparativas disponibles</h2><ul>${Object.entries(resourceCatalog).map(([resourceSlug, item]) => `<li>${routeLink(`recursos/${resourceSlug}`, item.title)}. ${esc(item.decision)}</li>`).join('')}</ul><h2>Si el problema todavía no está claro</h2><p>${routeLink('auditoria-crecimiento-digital', 'Solicitar una auditoría')} · ${routeLink('planes', 'Comparar planes')}</p></article></main>`
              : path === 'nosotros'
                ? `<main data-prerendered="true"><article><h1>${esc(heading)}</h1><p>${esc(description)}</p><h2>Cómo trabaja Pixvo</h2><p>Auditamos, priorizamos, implementamos y medimos dentro de un alcance definido. No prometemos posiciones, ventas ni resultados que dependan de la oferta, la atención o el cierre comercial de la empresa.</p><h2>Capacidad y límites</h2><ul><li>Trabajo recurrente con alcance, dependencias y criterios de finalización.</li><li>Supervisión humana en decisiones y entregables asistidos por inteligencia artificial.</li><li>Transparencia sobre accesos, medición y limitaciones de evidencia.</li></ul><p>${routeLink('casos-de-exito', 'Revisar experiencia y casos documentados')} · ${routeLink('contacto', 'Contactar con Pixvo')}</p></article></main>`
                : path === 'contacto'
                  ? `<main data-prerendered="true"><article><h1>${esc(heading)}</h1><p>${esc(description)}</p><h2>Habla con Pixvo</h2><p>La primera conversación sirve para entender el problema, la evidencia disponible y la capacidad de implementación. No implica una promesa de encaje ni de resultados.</p><p>${routeLink('solicitar-diagnostico', 'Aportar el contexto por escrito')} · ${routeLink('sistema-crecimiento-digital', 'Entender el sistema')}</p></article></main>`
                  : path === 'solicitar-diagnostico'
                    ? `<main data-prerendered="true"><article><h1>${esc(heading)}</h1><p>${esc(description)}</p><h2>Qué es y para quién</h2><p>El diagnóstico organiza el contexto de una PyME que necesita localizar un cuello de botella en captación, conversión, automatización, seguimiento o medición. Sirve para valorar el encaje; no garantiza una contratación ni un resultado.</p><h2>Qué analizamos</h2><ul><li>Objetivo, oferta y problema prioritario.</li><li>Canales, volumen aproximado de oportunidades y capacidad de atención.</li><li>Sitio web, herramientas, CRM, medición y responsables disponibles.</li><li>Presupuesto aprobado o pendiente y momento previsto de inicio.</li></ul><h2>Qué información pedimos</h2><p>El formulario solicita datos de contacto, empresa, situación actual y condiciones de encaje. Al terminar prepara un resumen en WhatsApp: la persona debe confirmar el envío y nada se transmite por esa vía sin su acción.</p><h2>Qué sucede después</h2><p>Pixvo revisa si el problema, la evidencia y la capacidad disponible permiten definir una auditoría o un alcance. Las lagunas se mantienen como pendientes y las condiciones deben quedar documentadas antes de implementar.</p><h2>Privacidad y alternativa</h2><p>Los datos personales del formulario no se envían a Analytics. ${routeLink('contacto', 'Consulta los canales de contacto')} o revisa la <a href="/legal/politica-de-privacidad/">política de privacidad</a>.</p><h2>Evidencia y siguiente paso</h2><p>${routeLink('casos-de-exito/microcuotas', 'Caso relacionado de automatización y seguimiento')} · ${routeLink('auditoria-crecimiento-digital', 'Conocer el alcance de la auditoría')} · ${routeLink('planes', 'Revisar planes')}</p></article></main>`
                    : `<main data-prerendered="true"><article><h1>${esc(heading)}</h1><p>${esc(description)}</p></article></main>`;
  const editorialData = caseStudy || solution || problem || resource || {};
  if (path === 'planes') {
    const money = (value) => new Intl.NumberFormat(market.locale, { style: 'currency', currency: market.currency, maximumFractionDigits: 0 }).format(value);
    const priceCell = (plan, field) => { const value = getPrice(marketCode, plan.id)[field]; return Number.isFinite(value) ? money(value) : 'Bajo consulta'; };
    const comparison = `<h2>Comparación de planes</h2><div class="plan-comparison"><table><caption>Alcance comercial aprobado por plan</caption><thead><tr><th>Criterio</th>${plans.map((plan) => `<th>${esc(plan.name)}</th>`).join('')}</tr></thead><tbody><tr><th>Mensualidad</th>${plans.map((plan) => `<td>${esc(priceCell(plan, 'monthly'))}</td>`).join('')}</tr><tr><th>Onboarding</th>${plans.map((plan) => `<td>${esc(priceCell(plan, 'onboarding'))}</td>`).join('')}</tr><tr><th>Unidades operativas</th>${plans.map((plan) => `<td>${plan.units} al mes</td>`).join('')}</tr><tr><th>Permanencia mínima</th>${plans.map((plan) => `<td>${plan.minimum} meses</td>`).join('')}</tr></tbody></table></div>`;
    body = body.replace('<h2>Antes de elegir un plan</h2>', `${comparison}<h2>Antes de elegir un plan</h2>`);
  }
  const editorialSections = getEditorialExpansion({ pageType: seoEntity?.page_type, marketCode, data: editorialData });
  if (editorialSections.length) body = body.replace('</article></main>', `${editorialExpansionHtml(editorialSections)}</article></main>`);
  body = body.replace('<main data-prerendered="true">', `<main data-prerendered="true">${breadcrumbHtml(breadcrumbItems)}`);
  if (pageFaqs.length) body = body.replace('</article></main>', `${faqHtml(pageFaqs)}</article></main>`);
  return { title, description, canonical, lang: market.locale, type: article || resource ? 'article' : 'website', image: pageImage, imageWidth, imageHeight, robots: path === 'gracias-diagnostico' ? 'noindex,follow' : 'index,follow', schema: schemas, alternates: marketAlternates(path), alternateLocales: Object.values(markets).map((item) => item.locale).filter((locale) => locale !== market.locale), author: article?.author, publishedTime: article?.publishedAt, modifiedTime: article?.updatedAt || article?.publishedAt, body: marketShell(marketCode, body) };
}

for (const [market, marketPaths] of Object.entries(paths)) {
  for (const path of marketPaths) {
    const file = join('dist', market, path, 'index.html');
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, render(marketPage(market, path)));
  }
}

const rootAlternates = `${Object.entries(markets).map(([code, market]) => `<link data-static-seo rel="alternate" hreflang="${market.locale}" href="${domain}/${code}/">`).join('')}<link data-static-seo rel="alternate" hreflang="x-default" href="${domain}/">`;
await writeFile('dist/index.html', render({ title: 'Pixvo | Elige tu mercado', description: 'Selecciona México, Argentina o España para conocer las soluciones de Pixvo disponibles en tu mercado.', canonical: `${domain}/`, alternates: rootAlternates, schema: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Pixvo', url: domain }, { '@context': 'https://schema.org', '@type': 'Organization', name: 'Pixvo', url: domain }], body: globalShell(`<main data-prerendered="true"><h1>Pixvo Growth System</h1><p>Selecciona tu mercado para consultar referencias geográficas y condiciones comerciales.</p><ul>${Object.entries(markets).map(([code, market]) => `<li><a href="/${code}/">Pixvo en ${esc(market.name)}</a></li>`).join('')}</ul></main>`) }));

const articleUrls = [];
for (const summary of posts) {
  const full = postBySlug[summary.slug];
  const path = `/blog/${summary.slug}/`;
  const canonical = `${domain}${path}`;
  const title = `${full.title} | Pixvo`;
  const sections = full.content || [
    { title: 'Contexto', paragraphs: [full.overview || full.excerpt], blocks: [{ type: 'list', items: full.topics || [] }] },
    { title: 'Aplicación práctica', paragraphs: [full.application || ''] },
    { title: 'Conclusión', paragraphs: [full.conclusion || ''] },
  ];
  const classification = getArticleCommercialData(full);
  const caseStudySlug = full.caseStudySlug || classification.caseStudySlug;
  const globalArticleCrumbs = [{ name: 'Inicio', path: '/' }, { name: 'Blog', path: '/blog/' }, { name: full.title, path }];
  const body = globalShell(`<main data-prerendered="true">${breadcrumbHtml(globalArticleCrumbs)}<article><h1>${esc(full.title)}</h1><p>${esc(full.excerpt)}</p>${articlePicture(full)}${caseStudySlug ? `<p>Ver el caso principal: ${Object.keys(markets).map((market) => `<a href="/${market}/casos-de-exito/${caseStudySlug}/">${esc(markets[market].name)}</a>`).join(' · ')}</p>` : ''}${sections.map((section) => `<section><h2>${esc(section.title)}</h2>${(section.paragraphs || []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}${(section.blocks || []).map((block) => block.type === 'list' ? `<ul>${(block.items || []).map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : '').join('')}</section>`).join('')}${articleCommercialHtml(full)}</article></main>`);
  const schema = { '@context': 'https://schema.org', '@type': 'Article', headline: full.title, description: full.excerpt, ...(full.publishedAt ? { datePublished: full.publishedAt, dateModified: full.updatedAt || full.publishedAt } : {}), image: absolute(full.featuredImage), ...(full.author ? { author: { '@type': 'Person', name: full.author } } : {}), publisher: { '@type': 'Organization', name: 'Pixvo', url: domain }, mainEntityOfPage: canonical };
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: globalArticleCrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absolute(item.path) })) };
  const file = join('dist', 'blog', summary.slug, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, render({ title, description: full.excerpt, canonical, type: 'article', image: full.featuredImage, imageWidth: full.image?.width, imageHeight: full.image?.height, alternates: globalBlogAlternates(`blog/${summary.slug}`), alternateLocales: Object.values(markets).map((item) => item.locale), author: full.author, publishedTime: full.publishedAt, modifiedTime: full.updatedAt || full.publishedAt, schema: [schema, breadcrumb], body }));
  articleUrls.push(canonical);
}
const blogBody = globalShell(`<main data-prerendered="true">${breadcrumbHtml([{ name: 'Inicio', path: '/' }, { name: 'Blog', path: '/blog/' }])}<h1>Blog de Pixvo</h1><p>Guías sobre SEO, automatización, analítica y desarrollo.</p><ul>${posts.map((post) => `<li><a href="/blog/${post.slug}/">${esc(post.title)}</a></li>`).join('')}</ul></main>`);
await mkdir('dist/blog', { recursive: true });
await writeFile('dist/blog/index.html', render({ title: 'Blog de SEO, automatización y tecnología | Pixvo', description: 'Guías prácticas de Pixvo sobre SEO, automatización, analítica, WordPress y crecimiento digital.', canonical: `${domain}/blog/`, alternates: globalBlogAlternates('blog'), schema: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Blog de Pixvo', url: `${domain}/blog/`, publisher: { '@type': 'Organization', name: 'Pixvo' } }], body: blogBody }));

const projects = [
  { slug: 'shortcodes-en-pestanas', title: 'Shortcodes en pestañas para WordPress', description: 'Plugin reutilizable para integrar shortcodes en pestañas de Elementor.', image: '/images/projects/shortcodes-en-pestanas-wordpress.png', imageAlt: 'Panel de edición del plugin de shortcodes en pestañas para WordPress', imageWidth: 295, imageHeight: 831 },
];
const projectUrls = [];
for (const project of projects) {
  const canonical = `${domain}/proyectos/${project.slug}/`;
  const projectCrumbs = [{ name: 'Inicio', path: '/' }, { name: project.title, path: `/proyectos/${project.slug}/` }];
  const serviceLinks = Object.keys(markets).flatMap((market) => [
    `<a href="/${market}/soluciones/seo-wordpress/">SEO técnico para WordPress en ${esc(markets[market].name)}</a>`,
    `<a href="/${market}/soluciones/optimizacion-wordpress/">Rendimiento y estabilidad de WordPress en ${esc(markets[market].name)}</a>`,
  ]).join(' · ');
  const body = globalShell(`<main data-prerendered="true">${breadcrumbHtml(projectCrumbs)}<article><h1>${esc(project.title)}</h1><p>${esc(project.description)}</p><p>Este contenido documenta un proyecto técnico de portfolio; no se presenta como caso de éxito ni atribuye resultados comerciales.</p><figure><img src="${project.image}" alt="${esc(project.imageAlt)}" width="${project.imageWidth}" height="${project.imageHeight}" loading="eager" decoding="async" fetchpriority="high"></figure><h2>Problema y solución</h2><p>${esc(project.description)}</p><h2>Servicios relacionados</h2><p>${serviceLinks}</p><h2>Aplicar una solución relacionada</h2><p>${Object.keys(markets).map((market) => `<a href="/${market}/solicitar-diagnostico/">Compartir el contexto para ${esc(markets[market].name)}</a>`).join(' · ')}</p></article></main>`);
  const imageObject = { '@type': 'ImageObject', url: absolute(project.image), width: project.imageWidth, height: project.imageHeight, caption: project.imageAlt };
  const creativeWork = { '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': `${canonical}#project`, name: project.title, description: project.description, image: imageObject, creator: { '@type': 'Organization', name: 'Pixvo' }, url: canonical };
  const webPage = { '@context': 'https://schema.org', '@type': 'WebPage', name: project.title, description: project.description, image: imageObject, url: canonical, mainEntity: { '@id': `${canonical}#project` } };
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: projectCrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absolute(item.path) })) };
  const file = join('dist', 'proyectos', project.slug, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, render({ title: `${project.title} | Proyecto Pixvo`, description: project.description, canonical, image: project.image, imageWidth: project.imageWidth, imageHeight: project.imageHeight, schema: [webPage, creativeWork, breadcrumb], body }));
  projectUrls.push(canonical);
}

await mkdir('dist/404', { recursive: true });
await writeFile('dist/404/index.html', render({ title: 'Página no encontrada | Pixvo', description: 'La página solicitada no existe.', canonical: `${domain}/404/`, robots: 'noindex,follow', body: globalShell('<main data-prerendered="true"><article><h1>Esta ruta no lleva a ningún sitio</h1><p>La página puede haber cambiado o la dirección no es correcta.</p><p><a href="/">Volver al selector internacional</a> · <a href="/mx/sistema-crecimiento-digital/">Ver Pixvo Growth System</a></p></article></main>') }));
for (const slug of ['aviso-legal', 'politica-de-privacidad', 'politica-de-cookies', 'condiciones-del-servicio']) {
  const file = join('dist', 'legal', slug, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  const legalTitle = slug.replaceAll('-', ' ');
  await writeFile(file, render({ title: `${legalTitle} | Pixvo`, description: 'Información legal de Pixvo.', canonical: `${domain}/legal/${slug}/`, robots: 'noindex,follow', body: globalShell(`<main data-prerendered="true"><article><h1>${esc(legalTitle)}</h1><p>Información legal de Pixvo. El contenido completo se muestra mediante la aplicación.</p><p><a href="/">Volver al inicio</a></p></article></main>`) }));
}

const xml = (urls) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
for (const [market, marketPaths] of Object.entries(paths)) {
  await writeFile(`dist/sitemap-${market}.xml`, xml(marketPaths.filter((path) => path !== 'gracias-diagnostico').map((path) => `${domain}/${market}/${path}${path ? '/' : ''}`)));
}
await writeFile('dist/sitemap-blog.xml', xml([`${domain}/blog/`, ...articleUrls]));
await writeFile('dist/sitemap-projects.xml', xml(projectUrls));
await writeFile('dist/sitemap-global.xml', xml([`${domain}/`]));
const sitemapNames = ['mx', 'ar', 'es', 'blog', 'projects', 'global'];
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapNames.map((name) => `<sitemap><loc>${domain}/sitemap-${name}.xml</loc></sitemap>`).join('')}</sitemapindex>\n`;
await writeFile('dist/sitemap_index.xml', sitemapIndex);
await writeFile('dist/sitemap.xml', sitemapIndex);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /buscar\nSitemap: ${domain}/sitemap_index.xml\n`);

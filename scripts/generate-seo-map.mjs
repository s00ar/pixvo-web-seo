import { readFile, writeFile } from 'node:fs/promises';
import { getArticleCommercialData, resolveCommercialTarget } from '../src/data/articleCommercial.js';
import { caseStudies } from '../src/data/caseStudies.js';
import { getSolutionConnections, markets, problemCatalog, resourceCatalog, solutionCatalog } from '../src/data/growthSystem.js';
import { buildSeoRegistry, seoColumns } from '../src/data/seoRegistry.js';

const posts = JSON.parse(await readFile('public/posts/index.json', 'utf8'));
const rows = buildSeoRegistry(posts);
const marketCodes = Object.keys(markets);
const csv = (value = '') => {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const expandedKeywordRows = rows.flatMap((row) => row.url.includes('{pais}')
  ? marketCodes.map((market) => ({
    ...row,
    url: row.url.replaceAll('{pais}', market),
    country: market,
    parent_url: row.parent_url.replaceAll('{pais}', market),
    title: `${row.title} — ${markets[market].name}`,
  }))
  : [row]);
const contents = [seoColumns.join(','), ...expandedKeywordRows.map((row) => seoColumns.map((column) => csv(row[column])).join(','))].join('\n') + '\n';
await writeFile('docs/seo/keyword-url-map.csv', contents, 'utf8');

const marketUrl = (path = '') => `/{pais}/${path}${path ? '/' : ''}`;
const destinationFor = (target) => solutionCatalog[target] ? marketUrl(`soluciones/${target}`) : marketUrl(target);
const internalLinks = [];
const addLink = (source, destination, relationship, cluster, funnelRole, placement) => internalLinks.push({ source_url: source, destination_url: destination, relationship, cluster, funnel_role: funnelRole, placement, status: 'published' });

addLink(marketUrl(), marketUrl('sistema-crecimiento-digital'), 'parent-to-hub', 'growth-system', 'BOFU', 'hero');
addLink(marketUrl(), marketUrl('planes'), 'home-to-pricing', 'conversion', 'BOFU', 'content');
addLink(marketUrl(), marketUrl('solicitar-diagnostico'), 'home-to-conversion', 'conversion', 'BOFU', 'cta');
for (const slug of Object.keys(solutionCatalog)) addLink(marketUrl('sistema-crecimiento-digital'), marketUrl(`soluciones/${slug}`), 'hub-to-solution', rows.find((item) => item.url === marketUrl(`soluciones/${slug}`))?.cluster || 'solution', 'BOFU', 'solution-grid');
for (const target of ['auditoria-crecimiento-digital', 'planes', 'solicitar-diagnostico']) addLink(marketUrl('sistema-crecimiento-digital'), marketUrl(target), 'hub-to-conversion', 'conversion', 'BOFU', target === 'solicitar-diagnostico' ? 'cta' : 'content');

for (const [slug, solution] of Object.entries(solutionCatalog)) {
  const source = marketUrl(`soluciones/${slug}`);
  const connections = getSolutionConnections(slug);
  addLink(source, marketUrl('sistema-crecimiento-digital'), 'solution-to-parent', 'growth-system', 'BOFU', 'hero');
  addLink(source, marketUrl('auditoria-crecimiento-digital'), 'solution-to-audit', 'conversion', 'BOFU', 'scope');
  addLink(source, marketUrl('planes'), 'solution-to-pricing', 'conversion', 'BOFU', 'scope');
  addLink(source, marketUrl('solicitar-diagnostico'), 'solution-to-diagnosis', 'conversion', 'BOFU', 'cta');
  for (const related of solution.related.slice(0, 3)) addLink(source, marketUrl(`soluciones/${related}`), 'related-solution', rows.find((item) => item.url === marketUrl(`soluciones/${related}`))?.cluster || 'solution', 'BOFU', 'related-solutions');
  for (const item of connections.problems) addLink(source, marketUrl(`problemas/${item.slug}`), 'solution-to-problem', 'problem', 'MOFU', 'problem-context');
  for (const item of connections.resources) addLink(source, marketUrl(`recursos/${item.slug}`), 'solution-to-resource', 'research', 'MOFU', 'decision-support');
  for (const item of connections.cases) addLink(source, marketUrl(`casos-de-exito/${item.slug}`), 'solution-to-case', 'proof', 'MOFU', 'evidence');
}

for (const [slug, problem] of Object.entries(problemCatalog)) {
  const source = marketUrl(`problemas/${slug}`);
  addLink(source, marketUrl(`soluciones/${problem.primary}`), 'problem-to-primary-solution', 'solution', 'MOFU-to-BOFU', 'solution');
  addLink(source, marketUrl(`soluciones/${problem.secondary}`), 'problem-to-secondary-solution', 'solution', 'MOFU-to-BOFU', 'solution');
  addLink(source, marketUrl('auditoria-crecimiento-digital'), 'problem-to-audit', 'conversion', 'BOFU', 'diagnosis');
  addLink(source, destinationFor(problem.conversion), 'problem-to-next-step', 'conversion', 'BOFU', 'diagnosis');
  addLink(source, marketUrl('solicitar-diagnostico'), 'problem-to-diagnosis', 'conversion', 'BOFU', 'cta');
}

for (const [slug, resource] of Object.entries(resourceCatalog)) {
  const source = marketUrl(`recursos/${slug}`);
  addLink(source, marketUrl('recursos'), 'resource-to-parent', 'research', 'MOFU', 'hero');
  addLink(source, destinationFor(resource.primary), 'resource-to-primary-solution', 'solution', 'MOFU-to-BOFU', 'commercial-recommendation');
  addLink(source, destinationFor(resource.secondary), 'resource-to-secondary-solution', 'solution', 'MOFU-to-BOFU', 'commercial-recommendation');
  addLink(source, destinationFor(resource.nextStep), 'resource-to-next-step', 'conversion', 'BOFU', 'next-step');
  addLink(source, marketUrl('planes'), 'resource-to-pricing', 'conversion', 'BOFU', 'next-step');
  addLink(source, marketUrl('solicitar-diagnostico'), 'resource-to-diagnosis', 'conversion', 'BOFU', 'cta');
}

for (const item of caseStudies) {
  const source = marketUrl(`casos-de-exito/${item.slug}`);
  for (const service of item.services) addLink(source, marketUrl(`soluciones/${service}`), 'case-to-solution', 'solution', 'MOFU-to-BOFU', 'related-capabilities');
  for (const link of item.commercialLinks || []) if (!link.target.startsWith('soluciones/')) addLink(source, marketUrl(link.target), 'case-to-commercial-step', 'conversion', 'BOFU', 'related-capabilities');
  for (const related of item.relatedCases) addLink(source, marketUrl(`casos-de-exito/${related}`), 'related-case', 'proof', 'MOFU', 'related-cases');
  addLink(source, marketUrl('solicitar-diagnostico'), 'case-to-diagnosis', 'conversion', 'BOFU', 'cta');
}

for (const post of posts) {
  const classification = getArticleCommercialData(post);
  const targets = [classification.commercialTarget, ...(classification.relatedTargets || [])];
  for (const targetId of targets) {
    const target = resolveCommercialTarget(targetId);
    addLink(`/blog/${post.slug}/`, marketUrl(target.route), targetId === classification.commercialTarget ? 'global-article-to-primary-commercial' : 'global-article-to-related-commercial', classification.cluster, 'TOFU-to-BOFU', 'article-conversion');
    addLink(marketUrl(`blog/${post.slug}`), marketUrl(target.route), targetId === classification.commercialTarget ? 'market-article-to-primary-commercial' : 'market-article-to-related-commercial', classification.cluster, 'TOFU-to-BOFU', 'article-conversion');
  }
  if (classification.projectSlug) {
    addLink(`/blog/${post.slug}/`, `/proyectos/${classification.projectSlug}/`, 'article-to-technical-project', classification.cluster, 'TOFU-to-MOFU', 'related-project');
    addLink(marketUrl(`blog/${post.slug}`), `/proyectos/${classification.projectSlug}/`, 'market-article-to-technical-project', classification.cluster, 'TOFU-to-MOFU', 'related-project');
  }
}

for (const [source, targets] of [
  ['planes', ['sistema-crecimiento-digital', 'auditoria-crecimiento-digital', 'recursos/seo-mensual-vs-auditoria', 'casos-de-exito/microcuotas', 'solicitar-diagnostico']],
  ['auditoria-crecimiento-digital', ['sistema-crecimiento-digital', 'soluciones/seo-para-pymes', 'soluciones/automatizacion-de-procesos', 'soluciones/seguimiento-de-leads', 'recursos/seo-mensual-vs-auditoria', 'planes', 'casos-de-exito/microcuotas', 'solicitar-diagnostico']],
]) for (const target of targets) addLink(marketUrl(source), marketUrl(target), 'commercial-journey', 'conversion', 'BOFU', 'content');

const linkColumns = ['source_url', 'destination_url', 'relationship', 'cluster', 'funnel_role', 'placement', 'status'];
const uniqueLinks = [...new Map(internalLinks.map((item) => [`${item.source_url}|${item.destination_url}`, item])).values()];
const linkContents = [linkColumns.join(','), ...uniqueLinks.map((row) => linkColumns.map((column) => csv(row[column])).join(','))].join('\n') + '\n';
await writeFile('docs/seo/internal-link-map.csv', linkContents, 'utf8');
console.log(`Registros generados: ${rows.length} entidades SEO, ${expandedKeywordRows.length} URLs en el keyword map y ${uniqueLinks.length} relaciones internas.`);

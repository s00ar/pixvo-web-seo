import { caseStudies } from './caseStudies.js';
import { getArticleCommercialData } from './articleCommercial.js';
import { problemCatalog, resourceCatalog, solutionCatalog } from './growthSystem.js';

export const seoColumns = [
  'url', 'country', 'cluster', 'primary_keyword', 'secondary_keywords', 'intent', 'funnel',
  'page_type', 'priority', 'conversion', 'parent_url', 'status', 'ownership_key', 'indexability',
  'title', 'h1',
];

const marketUrl = (path = '') => `/{pais}/${path}${path ? '/' : ''}`;
const record = (value) => ({
  secondary_keywords: '',
  priority: 'P2',
  conversion: 'diagnosis',
  status: 'published',
  indexability: 'index,follow',
  ...value,
});

const staticMarketRecords = [
  record({ url: marketUrl(), country: 'all', cluster: 'brand', primary_keyword: 'Pixvo', secondary_keywords: 'SEO automatización y analítica; crecimiento para PyMEs', intent: 'branded commercial', funnel: 'BOFU', page_type: 'home', priority: 'P1', conversion: 'diagnosis', parent_url: '/', ownership_key: 'market-home', title: 'Pixvo | SEO, automatización y crecimiento para PyMEs', h1: 'Pixvo: SEO, automatización y analítica para PyMEs' }),
  record({ url: marketUrl('sistema-crecimiento-digital'), country: 'all', cluster: 'growth-system', primary_keyword: 'sistema de crecimiento digital para PyMEs', secondary_keywords: 'sistema de crecimiento para empresas; consultoría de crecimiento digital; estrategia de crecimiento digital; SEO y automatización para PyMEs; sistema de captación digital', intent: 'commercial', funnel: 'MOFU/BOFU', page_type: 'commercial_hub', priority: 'P1', conversion: 'diagnosis', parent_url: marketUrl(), ownership_key: 'growth-system', title: 'Sistema de crecimiento digital para PyMEs | Pixvo', h1: 'Sistema de crecimiento digital para PyMEs' }),
  record({ url: marketUrl('planes'), country: 'all', cluster: 'conversion', primary_keyword: 'precios Pixvo Growth System', secondary_keywords: 'planes de crecimiento digital; precio SEO para PyMEs', intent: 'transactional', funnel: 'BOFU', page_type: 'pricing', priority: 'P1', conversion: 'diagnosis', parent_url: marketUrl('sistema-crecimiento-digital'), ownership_key: 'plans', title: 'Planes y precios de Pixvo Growth System', h1: 'Planes y precios de Pixvo Growth System' }),
  record({ url: marketUrl('auditoria-crecimiento-digital'), country: 'all', cluster: 'conversion', primary_keyword: 'auditoría de crecimiento digital', secondary_keywords: 'auditoría SEO y conversión; auditoría de marketing digital', intent: 'transactional', funnel: 'BOFU', page_type: 'audit', priority: 'P1', conversion: 'diagnosis', parent_url: marketUrl('sistema-crecimiento-digital'), ownership_key: 'audit', title: 'Auditoría de crecimiento digital, SEO y conversión | Pixvo', h1: 'Auditoría de crecimiento digital, SEO y conversión' }),
  record({ url: marketUrl('solicitar-diagnostico'), country: 'all', cluster: 'conversion', primary_keyword: 'solicitar diagnóstico Pixvo', secondary_keywords: 'diagnóstico de crecimiento digital', intent: 'transactional', funnel: 'BOFU', page_type: 'lead_form', priority: 'P1', conversion: 'lead', parent_url: marketUrl('sistema-crecimiento-digital'), ownership_key: 'diagnosis-form', title: 'Solicitar diagnóstico de crecimiento digital | Pixvo', h1: 'Solicita un diagnóstico de crecimiento digital' }),
  record({ url: marketUrl('nosotros'), country: 'all', cluster: 'brand', primary_keyword: 'sobre Pixvo', secondary_keywords: 'equipo Pixvo', intent: 'navigational', funnel: 'BOFU', page_type: 'about', priority: 'P3', conversion: 'contact', parent_url: marketUrl(), ownership_key: 'about', title: 'Sobre Pixvo Growth System', h1: 'Un sistema operado con criterio y supervisión humana' }),
  record({ url: marketUrl('contacto'), country: 'all', cluster: 'brand', primary_keyword: 'contacto Pixvo', secondary_keywords: 'contactar Pixvo', intent: 'navigational', funnel: 'BOFU', page_type: 'contact', priority: 'P3', conversion: 'contact', parent_url: marketUrl(), ownership_key: 'contact', title: 'Contacto Pixvo', h1: 'Cuéntanos qué está frenando tu sistema comercial' }),
];

const solutionSeo = {
  'seo-para-pymes': ['seo', 'SEO para PyMEs', 'consultoría SEO para PyMEs; servicio SEO para empresas', 'P1', marketUrl('sistema-crecimiento-digital')],
  'seo-wordpress': ['seo', 'SEO para WordPress', 'consultoría SEO WordPress; optimización SEO WordPress', 'P2', marketUrl('soluciones/seo-para-pymes')],
  'contenido-seo': ['seo', 'servicio de contenido SEO', 'estrategia de contenidos SEO; creación de landings SEO', 'P2', marketUrl('soluciones/seo-para-pymes')],
  'automatizacion-de-procesos': ['automation', 'automatización de procesos para PyMEs', 'automatización empresarial; automatización con n8n', 'P1', marketUrl('sistema-crecimiento-digital')],
  'automatizacion-de-marketing': ['automation', 'automatización de marketing para PyMEs', 'marketing automation; automatizar marketing', 'P2', marketUrl('soluciones/automatizacion-de-procesos')],
  'seguimiento-de-leads': ['leads', 'automatización del seguimiento de leads', 'seguimiento de leads; automatizar prospectos', 'P1', marketUrl('sistema-crecimiento-digital')],
  'analitica-digital': ['analytics', 'consultoría de analítica digital', 'analítica web para empresas; GA4 para empresas', 'P2', marketUrl('sistema-crecimiento-digital')],
  'optimizacion-wordpress': ['wordpress', 'optimización WordPress para empresas', 'rendimiento WordPress; Core Web Vitals; UX', 'P2', marketUrl('sistema-crecimiento-digital')],
  'optimizacion-de-conversion': ['cro', 'optimización de conversión web', 'CRO para PyMEs; mejorar conversiones web', 'P2', marketUrl('sistema-crecimiento-digital')],
};

const solutionRecords = Object.entries(solutionSeo).map(([slug, [cluster, primary, secondary, priority, parent]]) => record({
  url: marketUrl(`soluciones/${slug}`), country: 'all', cluster, primary_keyword: primary,
  secondary_keywords: secondary, intent: 'transactional', funnel: 'BOFU', page_type: 'solution',
  priority, conversion: cluster === 'analytics' || cluster === 'wordpress' || cluster === 'cro' ? 'audit' : 'diagnosis',
  parent_url: parent, ownership_key: `solution:${slug}`, title: `${solutionCatalog[slug].title} | Pixvo`, h1: solutionCatalog[slug].h1,
}));

const problemSeo = {
  'leads-no-convierten': ['leads', 'por qué mis leads no convierten', 'follow-up', 'seguimiento-de-leads'],
  'reducir-tareas-manuales': ['automation', 'automatizar tareas repetitivas', 'automation', 'automatizacion-de-procesos'],
  'web-no-convierte': ['cro', 'mi web recibe visitas pero no vende', 'cro', 'optimizacion-de-conversion'],
  'dependencia-publicidad-paga': ['seo', 'reducir dependencia de publicidad pagada', 'seo', 'seo-para-pymes'],
  'medir-resultados-marketing': ['analytics', 'medir resultados de marketing', 'analytics', 'analitica-digital'],
  'conectar-marketing-y-ventas': ['leads', 'conectar marketing y ventas', 'follow-up', 'seguimiento-de-leads'],
  'wordpress-lento': ['wordpress', 'WordPress lento', 'wordpress-optimization', 'optimizacion-wordpress'],
  'contenido-no-genera-clientes': ['seo', 'contenido que no genera clientes', 'seo-content', 'contenido-seo'],
};

const problemRecords = Object.entries(problemSeo).map(([slug, [cluster, primary, conversion, solution]]) => record({
  url: marketUrl(`problemas/${slug}`), country: 'all', cluster, primary_keyword: primary, intent: 'commercial', funnel: 'MOFU',
  page_type: 'problem', priority: 'P1', conversion, parent_url: marketUrl(`soluciones/${solution}`), ownership_key: `problem:${slug}`,
  title: `${problemCatalog[slug].h1.replace(/[¿?]/g, '')} | Pixvo`, h1: problemCatalog[slug].h1,
}));

const caseSeo = {
  microcuotas: ['automation', 'caso de éxito de automatización de leads: Microcuotas', 'precalificación de leads; integración de leads con CRM', 'P1', 'follow-up'],
  'hospital-metropolitano': ['automation', 'plataforma de eventos Hospital Metropolitano', 'software para eventos médicos', 'P2', 'automation'],
  'sanidad-web': ['wordpress', 'caso Sanidad Web', 'plataforma georreferenciada WordPress', 'P2', 'wordpress-seo'],
  'paola-informa': ['product', 'caso Paola Informa', 'aplicación de información ciudadana', 'P2', 'automation'],
  arpitools: ['product', 'caso Arpitools', 'aplicación mobile y reporting web', 'P2', 'automation'],
};

const caseRecords = [
  record({ url: marketUrl('casos-de-exito'), country: 'all', cluster: 'proof', primary_keyword: 'casos de éxito Pixvo', secondary_keywords: 'proyectos Pixvo; resultados Pixvo; casos de clientes Pixvo', intent: 'commercial', funnel: 'MOFU', page_type: 'case_index', priority: 'P1', conversion: 'diagnosis', parent_url: marketUrl('sistema-crecimiento-digital'), ownership_key: 'case-index', title: 'Casos, proyectos y transformaciones verificables | Pixvo', h1: 'Transformaciones explicadas desde el problema y la evidencia' }),
  ...caseStudies.map((item) => {
    const [cluster, primary, secondary, priority, conversion] = caseSeo[item.slug];
    return record({ url: marketUrl(`casos-de-exito/${item.slug}`), country: 'all', cluster, primary_keyword: primary, secondary_keywords: secondary, intent: 'commercial', funnel: 'MOFU', page_type: 'case_study', priority, conversion, parent_url: marketUrl('casos-de-exito'), ownership_key: `case:${item.slug}`, title: `Caso: ${item.title} | Pixvo`, h1: item.title });
  }),
];

const resourceSeo = {
  'seo-vs-google-ads': 'seo',
  'agencia-seo-vs-consultor-seo': 'seo',
  'seo-mensual-vs-auditoria': 'seo',
  'n8n-vs-zapier': 'automation',
  'crm-vs-automatizacion-de-leads': 'leads',
  'rediseno-web-vs-optimizacion-cro': 'cro',
  'seo-vs-sistema-de-crecimiento': 'growth-system',
};

const resourceRecords = [
  record({ url: marketUrl('recursos'), country: 'all', cluster: 'research', primary_keyword: 'recursos de crecimiento digital', secondary_keywords: 'comparativas SEO; automatización; analítica', intent: 'commercial research', funnel: 'MOFU', page_type: 'resource_index', priority: 'P2', conversion: 'diagnosis', parent_url: marketUrl('sistema-crecimiento-digital'), ownership_key: 'resource-index', title: 'Recursos para decidir cómo crecer | Pixvo', h1: 'Decisiones de crecimiento con contexto' }),
  ...Object.entries(resourceSeo).map(([slug, cluster]) => record({
    url: marketUrl(`recursos/${slug}`), country: 'all', cluster, primary_keyword: resourceCatalog[slug].title, intent: 'commercial research', funnel: 'MOFU', page_type: 'comparison', priority: 'P2', conversion: cluster, parent_url: marketUrl('recursos'), ownership_key: `resource:${slug}`, title: `${resourceCatalog[slug].title} | Guía de decisión de Pixvo`, h1: resourceCatalog[slug].title,
  })),
];

const articleRecord = (post, scope) => {
  const commercial = getArticleCommercialData(post);
  return record({
    url: scope === 'market' ? marketUrl(`blog/${post.slug}`) : `/blog/${post.slug}/`,
    country: scope === 'market' ? 'all' : 'global', cluster: `editorial:${commercial.cluster}`,
    primary_keyword: post.title, secondary_keywords: (post.tags || []).join('; '), intent: commercial.primaryIntent, funnel: 'TOFU',
    page_type: 'article', priority: post.featured ? 'P2' : 'P3', conversion: commercial.commercialTarget,
    parent_url: scope === 'market' ? marketUrl('blog') : '/blog/', ownership_key: `article:${post.slug}`,
    title: `${post.title} | Pixvo`, h1: post.title,
  });
};

export function buildSeoRegistry(posts = []) {
  const marketBlog = record({ url: marketUrl('blog'), country: 'all', cluster: 'editorial', primary_keyword: 'blog de Pixvo', secondary_keywords: 'SEO; automatización; analítica; desarrollo', intent: 'informational', funnel: 'TOFU', page_type: 'blog_index', priority: 'P2', conversion: 'read', parent_url: marketUrl(), ownership_key: 'blog-index', title: 'Blog de tecnología y crecimiento | Pixvo', h1: 'Blog de Pixvo' });
  const globalBlog = record({ url: '/blog/', country: 'global', cluster: 'editorial', primary_keyword: 'blog de Pixvo internacional', secondary_keywords: 'SEO; automatización; analítica; desarrollo', intent: 'informational', funnel: 'TOFU', page_type: 'blog_index', priority: 'P3', conversion: 'read', parent_url: '/', ownership_key: 'blog-index', title: 'Blog de SEO, automatización y tecnología | Pixvo', h1: 'Blog de Pixvo' });
  return [
    record({ url: '/', country: 'global', cluster: 'brand', primary_keyword: 'Pixvo mercados', secondary_keywords: 'Pixvo Growth System; México; Argentina; España', intent: 'navigational', funnel: 'BOFU', page_type: 'market_selector', priority: 'P1', conversion: 'market selection', parent_url: '', ownership_key: 'market-selector', title: 'Pixvo | Elige tu mercado', h1: 'Pixvo Growth System' }),
    ...staticMarketRecords, ...solutionRecords, ...problemRecords, ...caseRecords, ...resourceRecords,
    marketBlog, ...posts.map((post) => articleRecord(post, 'market')),
    globalBlog, ...posts.map((post) => articleRecord(post, 'global')),
    record({ url: '/proyectos/shortcodes-en-pestanas/', country: 'global', cluster: 'wordpress', primary_keyword: 'shortcodes en pestañas para WordPress', secondary_keywords: 'plugin pestañas Elementor; integrar shortcodes', intent: 'informational commercial', funnel: 'MOFU', page_type: 'project', priority: 'P3', conversion: 'contact', parent_url: '/', ownership_key: 'project:shortcodes-tabs', title: 'Shortcodes en pestañas para WordPress | Proyecto Pixvo', h1: 'Shortcodes en pestañas para WordPress' }),
  ];
}

export function marketRoutePaths(posts = []) {
  return buildSeoRegistry(posts)
    .filter(({ url, indexability }) => url.startsWith('/{pais}/') && indexability === 'index,follow')
    .map(({ url }) => url.replace('/{pais}/', '').replace(/\/$/, ''));
}

export function seoRecordByMarketPath(posts = []) {
  return new Map(buildSeoRegistry(posts)
    .filter(({ url }) => url.startsWith('/{pais}/'))
    .map((item) => [item.url.replace('/{pais}/', '').replace(/\/$/, ''), item]));
}

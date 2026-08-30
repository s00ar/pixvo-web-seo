export const commercialTargets = {
  growthSystem: { route: 'sistema-crecimiento-digital', label: 'Pixvo Growth System', anchor: 'conectar esta estrategia con un sistema de crecimiento' },
  seoForSmes: { route: 'soluciones/seo-para-pymes', label: 'SEO para PyMEs', anchor: 'convertir esta idea en una estrategia SEO para PyMEs' },
  wordpressSeo: { route: 'soluciones/seo-wordpress', label: 'SEO para WordPress', anchor: 'mejorar el rastreo y la indexación de WordPress' },
  wordpressOptimization: { route: 'soluciones/optimizacion-wordpress', label: 'Optimización WordPress', anchor: 'mejorar rendimiento y estabilidad en WordPress' },
  contentSeo: { route: 'soluciones/contenido-seo', label: 'Contenido SEO', anchor: 'conectar el contenido con intención comercial' },
  automationProcesses: { route: 'soluciones/automatizacion-de-procesos', label: 'Automatización de procesos', anchor: 'reducir tareas manuales con automatización' },
  automationMarketing: { route: 'soluciones/automatizacion-de-marketing', label: 'Automatización de marketing', anchor: 'organizar captación y comunicaciones automatizadas' },
  leadFollowUp: { route: 'soluciones/seguimiento-de-leads', label: 'Seguimiento de leads', anchor: 'automatizar el seguimiento de tus leads' },
  analytics: { route: 'soluciones/analitica-digital', label: 'Analítica digital', anchor: 'medir qué acciones generan oportunidades' },
  cro: { route: 'soluciones/optimizacion-de-conversion', label: 'Optimización de conversión', anchor: 'mejorar la conversión de tu web' },
  growthAudit: { route: 'auditoria-crecimiento-digital', label: 'Auditoría de crecimiento digital', anchor: 'auditar el proceso de captación y conversión' },
};

export const articleCommercialRegistry = {
  'ataque-real-en-npm-como-el-compromiso-de-axios-expuso-miles-de-entornos-sin-que-nadie-lo-notara': { primaryIntent: 'informational', cluster: 'security', commercialTarget: 'growthSystem', relatedTargets: ['wordpressOptimization'], opportunity: 'Seguridad de dependencias y cadena de suministro: no existe una landing comercial específica.' },
  'matriz-objetivo-icp-canal-lead-magnet-pagina-evento-de-conversion-metricas': { primaryIntent: 'informational-commercial', cluster: 'analytics-conversion', commercialTarget: 'analytics', relatedTargets: ['cro', 'leadFollowUp'] },
  'por-que-un-sitio-wordpress-no-puede-quedar-librado-a-la-suerte-y-como-evitar-dolores-de-cabeza-despues': { primaryIntent: 'informational-commercial', cluster: 'wordpress', commercialTarget: 'wordpressOptimization', relatedTargets: ['wordpressSeo', 'growthAudit'], projectSlug: 'shortcodes-en-pestanas' },
  'como-una-buena-automatizacion-puede-cambiar-por-completo-el-flujo-de-trabajo-de-tu-empresa': { primaryIntent: 'informational-commercial', cluster: 'automation', commercialTarget: 'automationProcesses', relatedTargets: ['leadFollowUp', 'analytics'] },
  'por-que-geeksy-shop-es-hoy-una-de-las-mejores-fuentes-para-comprar-productos-del-fandom-y-como-aprovecharlo-desde-pixvo-tech': { primaryIntent: 'informational-commercial', cluster: 'seo-content', commercialTarget: 'seoForSmes', relatedTargets: ['contentSeo', 'cro'] },
  'black-friday-y-cyber-week-el-momento-del-ano-donde-tu-negocio-no-puede-improvisar': { primaryIntent: 'informational-commercial', cluster: 'conversion-campaigns', commercialTarget: 'cro', relatedTargets: ['analytics', 'automationMarketing'] },
  'el-mal-uso-de-la-ia-y-sus-consecuencias-reales-el-ejemplo-critico-de-los-libros-de-foraging-en-amazon': { primaryIntent: 'informational', cluster: 'content-governance', commercialTarget: 'contentSeo', relatedTargets: ['seoForSmes'], opportunity: 'Gobernanza y validación editorial con IA: no existe una landing comercial específica.' },
  'por-que-necesitas-un-sitio-web-profesional-en-2025-y-como-conseguir-hosting-premium-con-descuento': { primaryIntent: 'informational-commercial', cluster: 'wordpress-conversion', commercialTarget: 'wordpressOptimization', relatedTargets: ['wordpressSeo', 'cro'] },
  'la-importancia-de-las-decisiones-y-resoluciones-eficientes-en-la-gestion-de-pequenas-y-medianas-empresas': { primaryIntent: 'informational-commercial', cluster: 'growth-operations', commercialTarget: 'growthSystem', relatedTargets: ['automationProcesses', 'analytics'] },
  'crear-un-sitio-web-rapido-con-las-herramientas-de-ia-de-hostinger': { primaryIntent: 'informational-commercial', cluster: 'website-builders', commercialTarget: 'wordpressOptimization', relatedTargets: ['seoForSmes', 'cro'] },
  'la-ia-esta-matando-la-creatividad': { primaryIntent: 'informational', cluster: 'content-strategy', commercialTarget: 'contentSeo', relatedTargets: ['seoForSmes'] },
  'redactar-sin-ia-reduce-productividad-evidencia-limites-y-como-implementarlo-en-marketing': { primaryIntent: 'informational-commercial', cluster: 'content-automation', commercialTarget: 'contentSeo', relatedTargets: ['automationMarketing', 'seoForSmes'] },
  'caso-de-exito-microcuotas-y-como-google-ads-desarrollo-a-medida-le-cambiaron-el-juego': { primaryIntent: 'informational-commercial', cluster: 'automation-leads', commercialTarget: 'automationProcesses', relatedTargets: ['leadFollowUp', 'analytics', 'growthAudit'], caseStudySlug: 'microcuotas' },
};

export function getArticleCommercialData(post) {
  return articleCommercialRegistry[post.slug] || {
    primaryIntent: 'informational',
    cluster: 'growth',
    commercialTarget: 'growthSystem',
    relatedTargets: ['growthAudit'],
    opportunity: 'Artículo pendiente de clasificación comercial explícita.',
  };
}

export function resolveCommercialTarget(id) {
  return commercialTargets[id] || commercialTargets.growthSystem;
}

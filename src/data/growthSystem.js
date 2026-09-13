import { caseStudies, caseStudySlugs } from './caseStudies.js';

const runtimeEnv = import.meta.env || {};
export const DOMAIN = runtimeEnv.VITE_SITE_URL || 'https://pixvo.tech';

// Mapeo de imágenes OG específicas por tipo de página
export const ogImagesByType = {
  'solution': '/images/og/solutions-default.png',
  'problem': '/images/og/problems-default.png',
  'case_study': '/images/og/cases-default.png',
  'article': '/images/og/articles-default.png',
  'resource': '/images/og/resources-default.png',
  'commercial_hub': '/images/og/growth-system.png',
  'pricing': '/images/og/growth-system.png',
  'audit': '/images/og/growth-system.png',
};

export const markets = {
  mx: { code: 'mx', name: 'México', flag: '🇲🇽', locale: 'es-MX', currency: 'MXN', currencyLabel: 'pesos mexicanos' },
  ar: { code: 'ar', name: 'Argentina', flag: '🇦🇷', locale: 'es-AR', currency: 'USD', currencyLabel: 'dólares estadounidenses' },
  es: { code: 'es', name: 'España', flag: '🇪🇸', locale: 'es-ES', currency: 'EUR', currencyLabel: 'euros' },
};

export const contactConfig = {
  whatsappPhone: '+39 392 142 5033',
  whatsappUrl: 'https://wa.me/393921425033?text=Hola%2C%20quiero%20solicitar%20informaci%C3%B3n%20sobre%20Pixvo%20Growth%20System',
  phones: [
    { label: 'Italia y Europa', display: '+39 392 142 5033', href: 'tel:+393921425033' },
    { label: 'Argentina y Latinoamérica', display: '+54 11 66837387', href: 'tel:+541166837387' },
  ],
};

export const trafficGuarantee = {
  title: 'Garantía de tráfico y KPI de captación',
  summary: 'Pixvo acuerda por escrito un volumen objetivo de tráfico medible a partir de la línea base, el mercado y el alcance contratado. Si el objetivo no se alcanza dentro del periodo inicial y se cumplen las condiciones de medición y colaboración, bonificamos la continuidad del servicio para trabajar hasta alcanzar el KPI acordado.',
  periods: { core: 3, growth: 3, scale: 6 },
};

const envPrice = (key) => {
  const value = runtimeEnv[key];
  return value && /^\d+(?:[.,]\d{1,2})?$/.test(value) ? Number(value.replace(',', '.')) : null;
};

export const plans = [
  {
    id: 'core', name: 'Pixvo Core', audience: 'Empresas que necesitan ordenar su SEO, medición y estrategia de crecimiento.', units: 2, minimum: 3,
    included: ['Auditoría inicial', 'Revisión de Search Console y GA4', 'Dashboard básico', 'Monitoreo e informe mensual', 'Reunión mensual de hasta 30 minutos', 'Dos unidades operativas', 'Roadmap trimestral', 'Auditoría integral semestral', 'Recomendaciones de captación y leads'],
    limits: ['Una persona de contacto', 'Una ronda de revisión', 'Respuesta en hasta dos días hábiles', 'Unidades no acumulables', 'Sin automatización mensual garantizada'],
  },
  {
    id: 'growth', name: 'Pixvo Growth', audience: 'Empresas que quieren mejorar su crecimiento orgánico e incorporar automatizaciones progresivamente.', units: 4, minimum: 3, recommended: 6,
    included: ['Todo Core', 'Cuatro unidades mensuales', 'Plan editorial e investigación de oportunidades', 'SEO técnico y optimización de contenidos', 'Automatizaciones pequeñas con n8n', 'Reunión mensual de hasta 45 minutos', 'Revisión trimestral del embudo', 'Roadmap trimestral'],
    limits: ['Hasta una automatización pequeña mensual', 'Una ronda de revisión', 'Los cambios de criterio consumen una unidad', 'Sin gestión comercial de leads'],
  },
  {
    id: 'scale', name: 'Pixvo Scale', audience: 'Empresas que ya generan oportunidades y necesitan optimizar marketing, web, automatizaciones y seguimiento comercial.', units: 6, minimum: 6,
    included: ['Todo Growth', 'Seis unidades mensuales', 'Reunión de hasta 60 minutos', 'Priorización mensual', 'Dos automatizaciones pequeñas o una mediana', 'Dashboard ampliado', 'Evaluación de landings y CRO', 'Auditoría estratégica trimestral', 'Revisión del tratamiento de leads', 'Documentación y roadmap de seis meses'],
    limits: ['Sin disponibilidad inmediata', 'Sin desarrollo completo de software', 'Sin administración diaria de CRM', 'Sin atención de clientes finales'],
  },
];

const esPrices = { core: { monthly: 550, onboarding: 700 }, growth: { monthly: 800, onboarding: 1000 }, scale: { monthly: 1200, onboarding: 1500 } };
export function getPrice(market, plan) {
  if (market === 'es') return esPrices[plan];
  const prefix = market === 'mx' ? 'VITE_MX' : 'VITE_AR';
  return { monthly: envPrice(`${prefix}_${plan.toUpperCase()}_MONTHLY`), onboarding: envPrice(`${prefix}_${plan.toUpperCase()}_ONBOARDING`) };
}
export const hasCompletePrices = (market) => plans.every(({ id }) => Object.values(getPrice(market, id)).every(Number.isFinite));

export const primarySolutions = ['seo-para-pymes', 'automatizacion-de-procesos', 'seguimiento-de-leads'];
export const solutionCatalog = {
  'seo-para-pymes': { title: 'SEO para PyMEs orientado a captar clientes', h1: 'SEO para PyMEs orientado a captar oportunidades comerciales', lead: 'Una consultoría SEO para PyMEs que conecta demanda, arquitectura, contenido y medición para atraer búsquedas con intención comercial.', description: 'Servicio SEO para empresas: estrategia, arquitectura, contenido y optimización continua para captar búsquedas con intención comercial, no tráfico vanidoso.', items: ['Diagnóstico de demanda y competencia', 'Keyword research transaccional', 'Arquitectura y control de canibalización', 'SEO técnico', 'Landings y contenido comercial', 'Enlazado interno por clúster e intención', 'Search Console', 'Conversiones y mejora continua'], related: ['contenido-seo', 'seo-wordpress', 'analitica-digital'] },
  'seo-wordpress': { title: 'SEO para WordPress', h1: 'SEO para WordPress: rastreo, indexación y arquitectura', lead: 'Trabajamos el SEO técnico de WordPress para que los buscadores puedan rastrear, interpretar e indexar correctamente sus páginas propietarias.', description: 'SEO para WordPress centrado en rastreo, indexación, arquitectura, canonical, schema, contenido y Search Console.', items: ['Rastreo y cobertura', 'Indexación', 'Arquitectura de información', 'Canonical y control de duplicados', 'Schema y datos estructurados', 'Contenido e intención', 'Search Console', 'SEO técnico de plantillas'], related: ['seo-para-pymes', 'contenido-seo', 'optimizacion-wordpress'] },
  'contenido-seo': { title: 'Servicio de contenido SEO', h1: 'Contenido SEO diseñado para atraer y convertir', lead: 'Creamos rutas de contenido conectadas con páginas comerciales y revisadas por personas.', items: ['Investigación', 'Briefs', 'Artículos', 'Landings', 'Actualización', 'Intención', 'Revisión humana', 'Enlazado comercial'], related: ['seo-para-pymes', 'optimizacion-de-conversion', 'analitica-digital'] },
  'automatizacion-de-procesos': { title: 'Automatización de procesos para PyMEs', h1: 'Automatización de procesos para PyMEs', lead: 'Conectamos herramientas y automatizamos tareas repetitivas para reducir trabajo manual, errores y tiempos de respuesta.', description: 'Reduce tareas manuales, conecta herramientas y mejora tus procesos con automatizaciones progresivas y supervisión humana.', items: ['Registro de formularios', 'Notificaciones y alertas', 'Creación de tareas', 'Actualización de hojas', 'Clasificación inicial', 'Registro UTM', 'Recordatorios', 'Dashboards e integraciones'], excluded: ['Aplicación personalizada', 'CRM completo', 'Agente autónomo sin supervisión', 'Integración compleja', 'Soporte permanente', 'Desarrollo ilimitado'], related: ['seguimiento-de-leads', 'analitica-digital', 'automatizacion-de-marketing'] },
  'automatizacion-de-marketing': { title: 'Automatización de marketing', h1: 'Automatización de marketing para PyMEs', lead: 'Organizamos la captación y las comunicaciones sin convertirlas en una caja negra.', items: ['Formularios', 'Notificaciones', 'Email', 'Segmentación', 'Captación', 'Reporting'], related: ['seguimiento-de-leads', 'contenido-seo', 'analitica-digital'] },
  'seguimiento-de-leads': { title: 'Automatización del seguimiento de leads', h1: 'Automatización y seguimiento de leads para no perder oportunidades', lead: 'Conectamos formularios, notificaciones, registros y recordatorios para automatizar prospectos sin ocultar el control al equipo comercial.', description: 'Registra, clasifica y da seguimiento a las oportunidades generadas por tu web para reducir pérdidas y mejorar el tiempo de respuesta.', items: ['Registro y fuente', 'Notificación', 'Clasificación', 'Asignación y responsable', 'Recordatorios', 'Estado y alertas', 'CRM o Sheets', 'Correo, WhatsApp y dashboard'], related: ['automatizacion-de-procesos', 'analitica-digital', 'optimizacion-de-conversion'] },
  'analitica-digital': { title: 'Consultoría de analítica digital', h1: 'Analítica digital para tomar decisiones, no acumular informes', lead: 'Medimos acciones y oportunidades sin enviar datos personales a las plataformas analíticas.', items: ['GA4', 'GTM', 'Search Console', 'Eventos', 'Conversiones', 'Dashboards', 'Fuentes', 'Trazabilidad'], related: ['seguimiento-de-leads', 'seo-para-pymes', 'optimizacion-de-conversion'] },
  'optimizacion-wordpress': { title: 'Optimización WordPress para empresas', h1: 'Optimización WordPress para rendimiento, estabilidad y conversión', lead: 'Mejoramos Core Web Vitals, experiencia, estabilidad y capacidad de conversión sin confundir rendimiento web con SEO técnico.', description: 'Optimización WordPress para empresas centrada en rendimiento, Core Web Vitals, estabilidad, UX, conversión y mejoras técnicas.', items: ['Rendimiento de carga', 'Core Web Vitals', 'Estabilidad y errores', 'Experiencia de usuario', 'Conversión y fricción', 'Mejoras técnicas', 'Dependencias y recursos pesados', 'Mantenimiento evolutivo'], related: ['optimizacion-de-conversion', 'seo-wordpress', 'analitica-digital'] },
  'optimizacion-de-conversion': { title: 'Optimización de conversión web', h1: 'Optimización de conversión para transformar visitas en oportunidades', lead: 'Detectamos fricciones y mejoramos la ruta hacia una solicitud cualificada.', items: ['Propuesta de valor', 'Jerarquía', 'CTAs', 'Formularios', 'Objeciones', 'Prueba respaldada', 'Experimentos', 'Medición'], related: ['analitica-digital', 'optimizacion-wordpress', 'contenido-seo'] },
};

export const problemCatalog = {
  'leads-no-convierten': { h1: '¿Por qué tus leads no se convierten en clientes?', lead: 'Una consulta sin registro, responsable o siguiente paso puede perderse aunque la captación funcione.', symptoms: ['Consultas que quedan sin respuesta', 'Contactos sin estado ni responsable', 'Ventas desconoce el origen y el contexto'], causes: ['Respuesta tardía', 'Falta de clasificación', 'Responsabilidades difusas'], diagnosis: ['Reconstruir el recorrido desde el formulario', 'Medir asignación y primer contacto', 'Revisar estados, pérdidas y fuentes'], primary: 'seguimiento-de-leads', secondary: 'analitica-digital', conversion: 'auditoria-crecimiento-digital' },
  'reducir-tareas-manuales': { h1: 'Automatiza tareas repetitivas que frenan a tu equipo', lead: 'Copiar datos y enviar avisos a mano consume tiempo y aumenta errores evitables.', symptoms: ['Datos copiados entre herramientas', 'Avisos y recordatorios manuales', 'Errores o registros duplicados'], causes: ['Herramientas desconectadas', 'Registros duplicados', 'Procesos no documentados'], diagnosis: ['Documentar entradas, decisiones y salidas', 'Identificar reglas repetibles y excepciones', 'Priorizar un flujo acotado y medible'], primary: 'automatizacion-de-procesos', secondary: 'seguimiento-de-leads', conversion: 'solicitar-diagnostico' },
  'web-no-convierte': { h1: 'Mi web recibe visitas, pero no vende ni genera oportunidades', lead: 'Más tráfico no compensa una propuesta confusa, una ruta débil o un formulario con fricción.', symptoms: ['Visitas sin consultas', 'Abandono antes del formulario', 'CTAs que no reflejan una decisión clara'], causes: ['Propuesta poco clara', 'CTAs dispersos', 'Falta de medición'], diagnosis: ['Separar problemas de tráfico y conversión', 'Recorrer la propuesta y el formulario', 'Validar eventos, fuentes y puntos de abandono'], primary: 'optimizacion-de-conversion', secondary: 'optimizacion-wordpress', conversion: 'auditoria-crecimiento-digital' },
  'dependencia-publicidad-paga': { h1: 'Reduce la dependencia de la publicidad pagada', lead: 'Construye activos orgánicos que complementen tus campañas sin prometer resultados inmediatos.', symptoms: ['Las oportunidades caen al pausar campañas', 'El coste de captación condiciona el crecimiento', 'La web no captura búsquedas existentes'], causes: ['Sin demanda orgánica capturada', 'Landings insuficientes', 'Contenido desconectado'], diagnosis: ['Identificar demanda orgánica relevante', 'Comparar cobertura SEO y campañas', 'Priorizar páginas comerciales sostenibles'], primary: 'seo-para-pymes', secondary: 'contenido-seo', conversion: 'auditoria-crecimiento-digital' },
  'medir-resultados-marketing': { h1: 'Mide qué acciones generan oportunidades', lead: 'Los informes solo son útiles cuando conectan fuentes, acciones y resultados comerciales.', symptoms: ['Canales con cifras incompatibles', 'Conversiones sin origen fiable', 'Informes que no cambian decisiones'], causes: ['Eventos incompletos', 'UTM inconsistentes', 'Dashboards sin decisiones'], diagnosis: ['Definir eventos y fuentes de verdad', 'Auditar UTM y trazabilidad', 'Conectar acciones con oportunidades'], primary: 'analitica-digital', secondary: 'seguimiento-de-leads', conversion: 'auditoria-crecimiento-digital' },
  'conectar-marketing-y-ventas': { h1: 'Conecta marketing y ventas sin perder contexto', lead: 'Marketing y ventas necesitan un registro compartido y próximos pasos visibles.', symptoms: ['Leads entregados sin contexto', 'Responsables que trabajan en herramientas distintas', 'Estados comerciales que no vuelven a marketing'], causes: ['Información aislada', 'Asignación manual', 'Estados sin actualizar'], diagnosis: ['Mapear la entrega entre equipos', 'Acordar estados y responsables', 'Definir automatizaciones y retroalimentación'], primary: 'seguimiento-de-leads', secondary: 'automatizacion-de-marketing', conversion: 'solicitar-diagnostico' },
  'wordpress-lento': { h1: 'WordPress lento: rendimiento, estabilidad y conversión', lead: 'El rendimiento afecta a la experiencia y a la capacidad de convertir; el diagnóstico debe separar velocidad, estabilidad y SEO.', symptoms: ['Carga lenta en móvil', 'Saltos visuales o interacción tardía', 'Errores después de cambios y actualizaciones'], causes: ['Recursos pesados', 'Configuración deficiente', 'Deuda técnica'], diagnosis: ['Medir Core Web Vitals y recursos', 'Revisar tema, plugins y servidor', 'Separar incidencias de rendimiento y rastreo'], primary: 'optimizacion-wordpress', secondary: 'seo-wordpress', conversion: 'auditoria-crecimiento-digital' },
  'contenido-no-genera-clientes': { h1: 'Contenido que no genera clientes: intención, rutas y conversión', lead: 'El contenido sin intención ni enlaces comerciales puede atraer visitas sin crear demanda útil.', symptoms: ['Tráfico informativo sin siguiente paso', 'Artículos que compiten entre sí', 'Páginas comerciales sin autoridad interna'], causes: ['Temas informativos aislados', 'Sin siguiente paso', 'Canibalización'], diagnosis: ['Clasificar intención y etapa del funnel', 'Detectar canibalización y páginas huérfanas', 'Conectar contenido, solución y conversión'], primary: 'contenido-seo', secondary: 'seo-para-pymes', conversion: 'solicitar-diagnostico' },
};

export const resourceCatalog = {
  'seo-vs-google-ads': { title: 'SEO vs Google Ads', lead: 'El SEO construye visibilidad orgánica progresiva; Google Ads compra exposición mientras existe inversión. Pueden complementarse según demanda, plazo y capacidad de conversión.', decision: 'La elección depende de cuánto tardas en necesitar demanda, qué búsquedas existen y si tu web puede convertir ese tráfico.', criteria: ['Plazo para captar demanda', 'Inversión sostenida disponible', 'Competencia y coste por clic', 'Capacidad de convertir y medir'], options: [{ title: 'Elegir SEO', text: 'Cuando buscas construir cobertura orgánica sobre consultas relevantes y puedes sostener implementación y medición.' }, { title: 'Elegir Google Ads', text: 'Cuando necesitas validar demanda o captar exposición inmediata con presupuesto y trazabilidad suficientes.' }], primary: 'seo-para-pymes', secondary: 'analitica-digital', nextStep: 'auditoria-crecimiento-digital' },
  'agencia-seo-vs-consultor-seo': { title: 'Agencia SEO vs consultor SEO', lead: 'Compara coordinación, capacidad, especialización y responsabilidad. La decisión depende del alcance y del sistema interno, no solo del formato del proveedor.', decision: 'El criterio central es quién puede asumir el problema completo y coordinar la implementación con tu equipo.', criteria: ['Amplitud del alcance', 'Interlocución y responsabilidad', 'Capacidad interna de ejecución', 'Especialización necesaria'], options: [{ title: 'Elegir una agencia', text: 'Cuando necesitas varias especialidades y una capacidad operativa mayor dentro de un alcance coordinado.' }, { title: 'Elegir un consultor', text: 'Cuando necesitas criterio especializado, acompañamiento directo y tu equipo puede ejecutar parte del roadmap.' }], primary: 'seo-para-pymes', secondary: 'sistema-crecimiento-digital', nextStep: 'auditoria-crecimiento-digital' },
  'seo-mensual-vs-auditoria': { title: 'SEO mensual vs auditoría SEO', lead: 'Una auditoría identifica y prioriza; el trabajo mensual implementa, mide y ajusta. Elige según tu capacidad real de ejecutar el roadmap.', decision: 'Una auditoría aislada solo crea valor si alguien puede implementar sus prioridades; el servicio mensual incorpora ese ciclo de ejecución.', criteria: ['Problema conocido o por descubrir', 'Capacidad interna para implementar', 'Necesidad de seguimiento', 'Horizonte de medición'], options: [{ title: 'Elegir una auditoría', text: 'Cuando necesitas una línea base, causas priorizadas y un roadmap que tu equipo puede ejecutar.' }, { title: 'Elegir trabajo mensual', text: 'Cuando necesitas investigar, implementar, medir y ajustar con continuidad.' }], primary: 'seo-para-pymes', secondary: 'auditoria-crecimiento-digital', nextStep: 'planes' },
  'n8n-vs-zapier': { title: 'n8n vs Zapier', lead: 'Ambas herramientas conectan aplicaciones. Evalúa mantenimiento, control, hosting, conectores y complejidad antes de decidir.', decision: 'La mejor herramienta es la que el equipo puede operar con seguridad y mantener cuando cambien las aplicaciones o las reglas.', criteria: ['Conectores necesarios', 'Control y alojamiento', 'Complejidad de los flujos', 'Mantenimiento disponible'], options: [{ title: 'Elegir n8n', text: 'Cuando necesitas más control del flujo, lógica flexible y puedes asumir su operación técnica.' }, { title: 'Elegir Zapier', text: 'Cuando priorizas rapidez, conectores gestionados y flujos que encajan en su modelo operativo.' }], primary: 'automatizacion-de-procesos', secondary: 'analitica-digital', nextStep: 'auditoria-crecimiento-digital' },
  'crm-vs-automatizacion-de-leads': { title: 'CRM vs automatización de leads', lead: 'Un CRM organiza relaciones y etapas; una automatización mueve información y activa tareas. No son equivalentes y suelen colaborar.', decision: 'Primero define qué información, estados y responsables necesita el proceso; después decide qué debe almacenar el CRM y qué debe automatizarse.', criteria: ['Estados comerciales', 'Asignación y responsables', 'Acciones repetitivas', 'Integraciones y fuente de verdad'], options: [{ title: 'Priorizar un CRM', text: 'Cuando falta una vista común de contactos, oportunidades, responsables y etapas.' }, { title: 'Priorizar automatización', text: 'Cuando el proceso está definido, pero copiar datos, avisar y crear tareas sigue dependiendo de trabajo manual.' }], primary: 'seguimiento-de-leads', secondary: 'automatizacion-de-procesos', nextStep: 'solicitar-diagnostico' },
  'rediseno-web-vs-optimizacion-cro': { title: 'Rediseño web vs optimización CRO', lead: 'Un rediseño cambia la interfaz; CRO parte de problemas y medición para reducir fricción. No toda web necesita reconstruirse.', decision: 'Si el problema no está diagnosticado, rediseñar puede cambiar la apariencia sin corregir la causa de la baja conversión.', criteria: ['Calidad de la propuesta actual', 'Datos sobre abandono', 'Deuda técnica y UX', 'Coste y riesgo del cambio'], options: [{ title: 'Elegir rediseño', text: 'Cuando la estructura, identidad o tecnología impiden cambios incrementales razonables.' }, { title: 'Elegir CRO', text: 'Cuando existe una base operativa y conviene diagnosticar y reducir fricciones de forma progresiva.' }], primary: 'optimizacion-de-conversion', secondary: 'analitica-digital', nextStep: 'auditoria-crecimiento-digital' },
  'seo-vs-sistema-de-crecimiento': { title: 'SEO vs sistema de crecimiento digital', lead: 'SEO mejora la captación orgánica. Un sistema de crecimiento conecta esa captación con conversión, automatización, seguimiento y medición.', decision: 'Elige SEO cuando el cuello de botella está en la visibilidad; amplía al sistema cuando captar demanda no basta para convertirla y gestionarla.', criteria: ['Cuello de botella principal', 'Conversión de la web', 'Seguimiento comercial', 'Medición entre canales y ventas'], options: [{ title: 'Priorizar SEO', text: 'Cuando la oferta y el proceso comercial funcionan, pero la empresa no aparece ante búsquedas relevantes.' }, { title: 'Priorizar el sistema', text: 'Cuando visibilidad, conversión, automatización y seguimiento deben mejorar de forma coordinada.' }], primary: 'seo-para-pymes', secondary: 'sistema-crecimiento-digital', nextStep: 'auditoria-crecimiento-digital' },
};

const solutionResourceRelations = {
  'seo-para-pymes': ['seo-vs-google-ads', 'agencia-seo-vs-consultor-seo'],
  'seo-wordpress': ['seo-mensual-vs-auditoria', 'seo-vs-sistema-de-crecimiento'],
  'contenido-seo': ['seo-vs-sistema-de-crecimiento', 'seo-mensual-vs-auditoria'],
  'automatizacion-de-procesos': ['n8n-vs-zapier', 'crm-vs-automatizacion-de-leads'],
  'automatizacion-de-marketing': ['crm-vs-automatizacion-de-leads', 'n8n-vs-zapier'],
  'seguimiento-de-leads': ['crm-vs-automatizacion-de-leads', 'n8n-vs-zapier'],
  'analitica-digital': ['seo-vs-google-ads', 'n8n-vs-zapier'],
  'optimizacion-wordpress': ['rediseno-web-vs-optimizacion-cro', 'seo-mensual-vs-auditoria'],
  'optimizacion-de-conversion': ['rediseno-web-vs-optimizacion-cro'],
};

export function getSolutionConnections(slug) {
  return {
    problems: Object.entries(problemCatalog).filter(([, item]) => item.primary === slug || item.secondary === slug).map(([problemSlug, item]) => ({ slug: problemSlug, ...item })).slice(0, 2),
    resources: (solutionResourceRelations[slug] || []).map((resourceSlug) => ({ slug: resourceSlug, ...resourceCatalog[resourceSlug] })).filter((item) => item.title).slice(0, 2),
    cases: caseStudies.filter((item) => item.services.includes(slug)).slice(0, 2),
  };
}

export const commonFaqs = [
  ['¿Qué garantiza Pixvo Growth System?', 'Garantizamos el volumen de tráfico definido por escrito para el proyecto a partir de una línea base verificable, el mercado, la estacionalidad y el alcance contratado. Cuando corresponde, también acordamos un KPI de captación o leads atribuibles. No utilizamos una cifra universal ni prometemos posiciones concretas en buscadores.'],
  ['¿Qué ocurre si no se alcanza el volumen de tráfico acordado?', 'Si no alcanzamos el KPI de tráfico dentro del periodo inicial y se han mantenido los accesos, la medición, las aprobaciones y la implementación acordada, bonificamos la continuidad del servicio: tres meses para Pixvo Core y Pixvo Growth, y seis meses para Pixvo Scale, con el objetivo de alcanzar el KPI pactado. Las condiciones exactas quedan documentadas en la propuesta y el contrato.'],
  ['¿Pixvo garantiza ventas?', 'No. Las ventas dependen también de factores en los que Pixvo no participa, como la oferta, el precio, la disponibilidad, la atención comercial, la negociación y el cierre. Sí trabajamos y medimos el tráfico relevante y, cuando existe trazabilidad suficiente, los leads atribuibles al sistema.'],
  ['¿Cómo se mide el tráfico y la generación de leads?', 'Antes de comenzar validamos la línea base, las fuentes de datos y el periodo de comparación. La medición puede utilizar Google Search Console, GA4, analítica del sitio, formularios y parámetros UTM, sin enviar datos personales a Analytics. El KPI y su fuente de verdad quedan definidos por escrito.'],
  ['¿Qué condiciones debe cumplir la empresa para aplicar la garantía?', 'La web y la medición deben permanecer operativas; Pixvo necesita los accesos, contenidos, aprobaciones e implementaciones previstos dentro de los plazos acordados. Pausas, migraciones, caídas, cambios de dominio, restricciones técnicas o alteraciones relevantes del alcance obligan a revisar la línea base y el KPI.'],
  ['¿Pixvo reemplaza al equipo comercial?', 'No. Mejora sus procesos, información y automatizaciones; la atención, negociación y cierre siguen siendo responsabilidad de la empresa.'],
  ['¿El trabajo es ilimitado?', 'No. Cada plan define unidades operativas, revisiones y límites para mantener calidad y capacidad de respuesta.'],
  ['¿Cuándo empiezan a verse resultados de SEO y crecimiento orgánico?', 'El plazo depende de la situación técnica, la autoridad del dominio, la competencia y la capacidad de implementar. Por eso el diagnóstico establece una línea base y un roadmap; Pixvo informa el avance con datos y evita presentar estimaciones como resultados confirmados.'],
  ['¿La inteligencia artificial trabaja sin supervisión?', 'No. La inteligencia artificial ayuda en investigación, análisis y producción, pero las decisiones, revisiones y entregables relevantes mantienen supervisión humana.'],
];

export const systemFaqs = [
  commonFaqs[0],
  commonFaqs[2],
  commonFaqs[5],
  commonFaqs[7],
  commonFaqs[8],
];

export const planFaqs = [
  ['¿Qué es una unidad operativa?', 'Es una medida de capacidad para priorizar e implementar una acción acotada. La complejidad, las dependencias y el criterio de finalización se validan antes de comenzar.'],
  ['¿Las unidades se acumulan?', 'No. Las unidades no utilizadas no se trasladan al mes siguiente, porque la capacidad y la planificación se reservan para cada periodo.'],
  ['¿El onboarding se paga aparte?', 'Sí. Cuando el precio está aprobado, el onboarding se muestra separado de la mensualidad e incluye la configuración inicial necesaria para comenzar a medir y priorizar.'],
  ['¿Existe permanencia mínima?', 'Sí. Pixvo Core y Pixvo Growth tienen una permanencia mínima de tres meses; Pixvo Scale, de seis meses. Growth recomienda seis meses para disponer de un ciclo más amplio de implementación y medición.'],
  ['¿Se incluyen campañas de publicidad pagada?', 'No dentro del plan base. La garantía se refiere al volumen de tráfico y a los KPI de captación expresamente definidos en la propuesta, no a resultados comprados mediante inversión publicitaria.'],
];

export const auditFaqs = [
  ['¿Qué revisa la auditoría de crecimiento digital?', 'Revisa la captación, la arquitectura y conversión de la web, la medición, los formularios, el seguimiento comercial y las automatizaciones disponibles para localizar cuellos de botella.'],
  ['¿Qué se necesita para realizarla?', 'El alcance depende de los accesos y datos disponibles. Antes de comenzar se acuerdan las fuentes que pueden revisarse y se identifican expresamente las lagunas de medición.'],
  ['¿La auditoría garantiza ventas o posiciones SEO?', 'No. Entrega un diagnóstico y un roadmap priorizado; no sustituye la implementación ni permite garantizar ventas o posiciones concretas.'],
];

export function getSolutionFaqs(slug) {
  const solution = solutionCatalog[slug];
  if (!solution) return [];
  const included = solution.items.slice(0, 4).join(', ');
  const excluded = solution.excluded?.slice(0, 3).join(', ');
  return [
    [`¿Qué incluye ${solution.title}?`, `${solution.lead} El alcance puede priorizar ${included}, según el diagnóstico y las dependencias disponibles.`],
    ['¿Cómo se integra con Pixvo Growth System?', 'La solución se prioriza dentro del recorrido de captación, conversión, medición y seguimiento; no se implementa como una tarea aislada sin un resultado comercial definido.'],
    ['¿Qué límites se acuerdan antes de comenzar?', excluded ? `No equivale automáticamente a ${excluded}. La propuesta define entregables, accesos, revisiones, responsabilidades y criterios de finalización.` : 'La propuesta define entregables, accesos, revisiones, responsabilidades, dependencias y criterios de finalización antes de implementar.'],
  ];
}

const problemCtas = {
  'leads-no-convierten': 'Auditar por qué tus leads no avanzan',
  'reducir-tareas-manuales': 'Detectar qué tareas conviene automatizar',
  'web-no-convierte': 'Auditar por qué tu web no convierte',
  'dependencia-publicidad-paga': 'Evaluar una ruta orgánica sostenible',
  'medir-resultados-marketing': 'Revisar la trazabilidad de tu marketing',
  'conectar-marketing-y-ventas': 'Diagnosticar la entrega entre marketing y ventas',
  'wordpress-lento': 'Auditar rendimiento y estabilidad de WordPress',
  'contenido-no-genera-clientes': 'Auditar intención, enlaces y conversión del contenido',
};

export const getProblemCta = (slug) => problemCtas[slug] || 'Solicitar diagnóstico';

export const marketPaths = [
  '',
  'sistema-crecimiento-digital',
  'planes',
  'auditoria-crecimiento-digital',
  'solicitar-diagnostico',
  'gracias-diagnostico',
  'nosotros',
  'contacto',
  ...Object.keys(solutionCatalog).map((slug) => `soluciones/${slug}`),
  ...Object.keys(problemCatalog).map((slug) => `problemas/${slug}`),
  'casos-de-exito',
  ...caseStudySlugs.map((slug) => `casos-de-exito/${slug}`),
  'recursos',
  ...Object.keys(resourceCatalog).map((slug) => `recursos/${slug}`),
];
export const publishedPaths = Object.fromEntries(Object.keys(markets).map((market) => [market, marketPaths]));
export const localPath = (market, path = '') => `/${market}/${path}${path ? '/' : ''}`;
export const isEquivalentPublished = (path) => path !== 'gracias-diagnostico' && (path === 'blog' || path.startsWith('blog/') || Object.values(publishedPaths).every((paths) => paths.includes(path)));

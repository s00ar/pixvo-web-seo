export const legacyRedirects = [
  { source: '/servicios', destination: '/mx/sistema-crecimiento-digital/', topic: 'Índice de servicios anterior', reason: 'La oferta se consolidó en el hub comercial', risk: 'medium' },
  { source: '/servicios/seo', destination: '/mx/soluciones/seo-para-pymes/', topic: 'Servicio SEO anterior', reason: 'La intención se consolidó en la money page de SEO para PyMEs', risk: 'low' },
  { source: '/servicios/automatizacion', destination: '/mx/soluciones/automatizacion-de-procesos/', topic: 'Automatización anterior', reason: 'La intención se consolidó en automatización de procesos', risk: 'low' },
  { source: '/proyectos', destination: '/mx/casos-de-exito/', topic: 'Índice de proyectos anterior', reason: 'Los casos verificables tienen un índice localizado propio', risk: 'low' },
  { source: '/proyectos/microcuotas', destination: '/mx/casos-de-exito/microcuotas/', topic: 'Proyecto Microcuotas', reason: 'El caso consolidado conserva evidencia y limitaciones', risk: 'low' },
  { source: '/proyectos/sanidad-web', destination: '/mx/casos-de-exito/sanidad-web/', topic: 'Proyecto Sanidad Web', reason: 'El caso consolidado conserva la transformación funcional', risk: 'low' },
  { source: '/proyectos/paola-informa', destination: '/mx/casos-de-exito/paola-informa/', topic: 'Proyecto Paola Informa', reason: 'El caso consolidado conserva la transformación funcional', risk: 'low' },
  { source: '/nosotros', destination: '/mx/nosotros/', topic: 'Página corporativa anterior', reason: 'La página corporativa actual está localizada', risk: 'low' },
  { source: '/contacto', destination: '/mx/contacto/', topic: 'Contacto anterior', reason: 'El contacto actual está localizado', risk: 'low' },
  { source: '/politica-de-privacidad', destination: '/legal/politica-de-privacidad/', topic: 'Privacidad anterior', reason: 'La URL legal se normalizó', risk: 'low' },
  { source: '/legal/privacidad', destination: '/legal/politica-de-privacidad/', topic: 'Alias de privacidad', reason: 'La URL legal se normalizó', risk: 'low' },
  { source: '/legal/cookies', destination: '/legal/politica-de-cookies/', topic: 'Alias de cookies', reason: 'La URL legal se normalizó', risk: 'low' },
  { source: '/mx/soluciones/c/', destination: '/mx/soluciones/optimizacion-de-conversion/', topic: 'Slug CRO incompleto', reason: 'La money page de CRO es el destino propietario', risk: 'low' },
];

export const legacyGone = [
  { source: '/official-site/', topic: 'Contenido ajeno asociado a casino/apuestas', reason: 'No pertenece a Pixvo y no tiene sustituto legítimo', risk: 'high' },
];

export const legacyManualReview = [
  { source: '/servicios/desarrollo-web/', topic: 'Desarrollo web anterior', reason: 'Optimización WordPress no es una sustitución exacta; requiere GSC/backlinks y oferta histórica.', risk: 'medium' },
  { source: '/servicios/aplicaciones/', topic: 'Aplicaciones a medida', reason: 'No existe una oferta independiente equivalente publicada.', risk: 'high' },
  { source: '/servicios/google-ads/', topic: 'Servicio Google Ads anterior', reason: 'Una comparativa editorial no sustituye un servicio de publicidad.', risk: 'high' },
  { source: '/servicios/meta-ads/', topic: 'Servicio Meta Ads anterior', reason: 'No existe una oferta independiente equivalente publicada.', risk: 'high' },
  { source: '/referidos/', topic: 'Programa de referidos anterior', reason: 'El diagnóstico no sustituye la intención de un programa de referidos.', risk: 'high' },
  { source: 'URLs antiguas de casino/apuestas no enumeradas', topic: 'Spam histórico', reason: 'Faltan export de URLs, backlinks y datos de Search Console para enumerarlas sin omisiones', risk: 'high' },
  { source: 'Publicaciones antiguas no presentes en el repositorio', topic: 'Contenido editorial legacy', reason: 'Requieren export de WordPress y validación de tráfico/backlinks antes de decidir', risk: 'high' },
];

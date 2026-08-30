import { localPath } from './growthSystem.js';

export const navigationItems = [
  { id: 'system', label: 'Sistema de crecimiento', path: 'sistema-crecimiento-digital', scope: 'market', placements: ['header', 'footer-system'] },
  { id: 'seo', label: 'SEO para PyMEs', path: 'soluciones/seo-para-pymes', scope: 'market', placements: ['header', 'footer-solutions'] },
  { id: 'audit', label: 'Auditoría', path: 'auditoria-crecimiento-digital', scope: 'market', placements: ['header', 'footer-system'] },
  { id: 'plans', label: 'Planes', path: 'planes', scope: 'market', placements: ['header', 'footer-system'] },
  { id: 'cases', label: 'Casos de éxito', path: 'casos-de-exito', scope: 'market', placements: ['header', 'footer-system'] },
  { id: 'resources', label: 'Recursos', path: 'recursos', scope: 'market', placements: ['header', 'footer-system'] },
  { id: 'blog', label: 'Blog', path: 'blog', scope: 'market', placements: ['header'] },
  { id: 'diagnosis', label: 'Solicitar diagnóstico', path: 'solicitar-diagnostico', scope: 'market', placements: ['cta', 'footer-system'] },
  { id: 'automation', label: 'Automatización', path: 'soluciones/automatizacion-de-procesos', scope: 'market', placements: ['footer-solutions'] },
  { id: 'lead-follow-up', label: 'Seguimiento de leads', path: 'soluciones/seguimiento-de-leads', scope: 'market', placements: ['footer-solutions'] },
  { id: 'about', label: 'Nosotros', path: 'nosotros', scope: 'market', placements: ['footer-company'] },
  { id: 'contact', label: 'Contacto', path: 'contacto', scope: 'market', placements: ['footer-company'] },
  { id: 'legal-notice', label: 'Aviso legal', path: 'legal/aviso-legal', scope: 'global', placements: ['footer-legal'] },
  { id: 'privacy', label: 'Privacidad', path: 'legal/politica-de-privacidad', scope: 'global', placements: ['footer-legal'] },
  { id: 'cookies', label: 'Cookies', path: 'legal/politica-de-cookies', scope: 'global', placements: ['footer-legal'] },
  { id: 'terms', label: 'Condiciones', path: 'legal/condiciones-del-servicio', scope: 'global', placements: ['footer-legal'] },
];

export const footerNavigationGroups = [
  { id: 'system', title: 'Sistema', placement: 'footer-system' },
  { id: 'solutions', title: 'Soluciones', placement: 'footer-solutions' },
];

export const getNavigationItems = (placement) => navigationItems.filter((item) => item.placements.includes(placement));
export const getNavigationItem = (id) => navigationItems.find((item) => item.id === id);
export const resolveNavigationUrl = (item, market) => item.scope === 'market' ? localPath(market, item.path) : `/${item.path}/`;

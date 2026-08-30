import { caseStudies } from './caseStudies.js';
import { problemCatalog, resourceCatalog, solutionCatalog } from './growthSystem.js';

const hubs = {
  'sistema-crecimiento-digital': { label: 'Pixvo Growth System', description: 'Conecta captación, conversión, automatización y seguimiento.', route: 'sistema-crecimiento-digital' },
  'auditoria-crecimiento-digital': { label: 'Auditoría de crecimiento digital', description: 'Identifica cuellos de botella y prioriza el siguiente paso.', route: 'auditoria-crecimiento-digital' },
  planes: { label: 'Planes y precios', description: 'Compara alcance, capacidad operativa, permanencia y límites.', route: 'planes' },
  'solicitar-diagnostico': { label: 'Solicitar diagnóstico', description: 'Comparte el contexto necesario para valorar el encaje.', route: 'solicitar-diagnostico' },
};

const entities = {
  ...Object.fromEntries(Object.entries(solutionCatalog).map(([id, item]) => [id, { label: item.title, description: item.lead, route: `soluciones/${id}`, kind: 'solution' }])),
  ...Object.fromEntries(Object.entries(problemCatalog).map(([id, item]) => [id, { label: item.h1, description: item.lead, route: `problemas/${id}`, kind: 'problem' }])),
  ...Object.fromEntries(Object.entries(resourceCatalog).map(([id, item]) => [id, { label: item.title, description: item.decision, route: `recursos/${id}`, kind: 'resource' }])),
  ...Object.fromEntries(caseStudies.map((item) => [item.slug, { label: item.title, description: item.summary, route: `casos-de-exito/${item.slug}`, kind: 'case-study' }])),
  ...Object.fromEntries(Object.entries(hubs).map(([id, item]) => [id, { ...item, kind: 'hub' }])),
};

export function getEntityPresentation(id) {
  return entities[id] || null;
}

export function entityPath(id, market) {
  const entity = getEntityPresentation(id);
  return entity ? `/${market}/${entity.route}/` : null;
}

export const entityPresentations = Object.freeze(entities);

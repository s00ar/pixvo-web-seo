import { siteConfig } from '../../data/siteConfig';
import { SchemaScript } from './SchemaScript';

export function ServiceSchema({ service }) {
  return <SchemaScript data={{ '@context': 'https://schema.org', '@type': 'Service', name: service.title, description: service.description, url: `${siteConfig.domain}/servicios/${service.slug}`, provider: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.domain }, areaServed: 'ES' }} />;
}

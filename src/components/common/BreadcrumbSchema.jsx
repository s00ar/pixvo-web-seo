import { siteConfig } from '../../data/siteConfig';
import { SchemaScript } from './SchemaScript';

export function BreadcrumbSchema({ items }) {
  return <SchemaScript data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: new URL(item.to || '', siteConfig.domain).toString() })) }} />;
}

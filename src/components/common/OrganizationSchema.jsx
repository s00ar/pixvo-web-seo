import { siteConfig } from '../../data/siteConfig';
import logo from '../../assets/logos/pixvo-logo.png';
import { SchemaScript } from './SchemaScript';

export function OrganizationSchema() {
  return <SchemaScript data={{ '@context': 'https://schema.org', '@type': 'Organization', name: siteConfig.name, url: siteConfig.domain, logo: new URL(logo, siteConfig.domain).toString(), email: siteConfig.email, telephone: siteConfig.phone, contactPoint: siteConfig.contacts.map((contact) => ({ '@type': 'ContactPoint', telephone: contact.phone, contactType: 'customer service', areaServed: contact.country, availableLanguage: ['Spanish', 'Italian'] })), sameAs: Object.values(siteConfig.socialLinks).filter(Boolean) }} />;
}

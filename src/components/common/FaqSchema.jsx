import { SchemaScript } from './SchemaScript';

export function FaqSchema({ items }) {
  return <SchemaScript data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }} />;
}

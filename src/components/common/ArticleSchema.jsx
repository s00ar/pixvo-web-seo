import { siteConfig } from '../../data/siteConfig';
import { SchemaScript } from './SchemaScript';

export function ArticleSchema({ article, path = `/blog/${article.slug}` }) {
  return <SchemaScript data={{ '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.excerpt, image: new URL(article.featuredImage, siteConfig.domain).toString(), datePublished: article.publishedAt || undefined, dateModified: article.updatedAt || article.publishedAt || undefined, author: article.author ? { '@type': 'Person', name: article.author, description: article.authorBio || undefined, image: article.authorImage ? new URL(article.authorImage, siteConfig.domain).toString() : undefined } : undefined, publisher: { '@type': 'Organization', name: siteConfig.name }, mainEntityOfPage: new URL(path, siteConfig.domain).toString() }} />;
}

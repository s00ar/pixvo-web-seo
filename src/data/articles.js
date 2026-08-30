import { media } from './media';
import { commercialTargets, getArticleCommercialData } from './articleCommercial';

const mapPost = (p) => {
  const commercial = getArticleCommercialData(p);
  return ({
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  category: p.category,
  tags: p.tags || [],
  author: p.author || null,
  authorBio: p.authorBio || null,
  authorImage: p.authorImage || null,
  publishedAt: p.publishedAt,
  updatedAt: p.updatedAt || p.publishedAt,
  readingTime: p.readingTime || '',
  featuredImage: (p.featuredImage && media[p.featuredImage]) || p.featuredImage || null,
  image: p.image ? { ...p.image, src: (p.image.src && media[p.image.src]) || p.image.src } : null,
  featured: !!p.featured,
  popular: !!p.popular,
  faq: Array.isArray(p.faq) ? p.faq : [],
  content: p.content || [
    { id: 'contexto', title: 'Contexto', paragraphs: [p.overview || ''], blocks: [{ type: 'list', items: p.topics || [] }] },
    { id: 'aplicacion-practica', title: 'Aplicación práctica', paragraphs: [p.application || ''], blocks: [{ type: 'cta', title: '¿Querés aplicarlo a tu negocio?', text: 'Podemos revisar el contexto y definir un siguiente paso concreto.' }] },
    { id: 'conclusion', title: 'Conclusión', paragraphs: [p.conclusion || ''], blocks: [] },
  ],
  ctas: p.ctas || [{ title: 'Solicitar diagnóstico', url: '/contact' }],
  related: (p.related || []).map((r) => ({
    ...r,
    featuredImage: (r.featuredImage && media[r.featuredImage]) || r.featuredImage || null,
  })),
  caseStudySlug: p.caseStudySlug || commercial.caseStudySlug || null,
  seo: { ...commercial, ...(p.seo || {}) },
  });
};

export const commercialRoutes = Object.fromEntries(Object.entries(commercialTargets).map(([id, item]) => [id, item.route]));

export async function fetchArticles() {
  try {
    const res = await fetch('/posts/index.json');
    if (!res.ok) return [];
    const list = await res.json();
    return Array.isArray(list) ? list.map(mapPost) : [];
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug) {
  if (!/^[a-z0-9-]+$/.test(slug || '')) return null;
  try {
    const res = await fetch(`/posts/${slug}.json`);
    if (!res.ok) return null;
    const p = await res.json();
    return mapPost(p);
  } catch {
    return null;
  }
}

export async function fetchArticleCategories() {
  const articles = await fetchArticles();
  return ['Todos', ...new Set(articles.map((a) => a.category))];
}

import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ArticleContent } from '../components/blog/ArticleContent';
import { ArticleCommercialCta } from '../components/blog/ArticleCommercialCta';
import { ArticleCard } from '../components/blog/ArticleCard';
import { TableOfContents } from '../components/blog/TableOfContents';
import { ArticleSchema } from '../components/common/ArticleSchema';
import { BreadcrumbSchema } from '../components/common/BreadcrumbSchema';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Container } from '../components/common/Container';
import { FaqAccordion } from '../components/common/FaqAccordion';
import { FaqSchema } from '../components/common/FaqSchema';
import { Icon } from '../components/common/Icon';
import { LoadingState } from '../components/common/LoadingState';
import { SectionHeader } from '../components/common/SectionHeader';
import { SeoHead } from '../components/common/SeoHead';
import { SmartImage } from '../components/common/SmartImage';
import { fetchArticles, getArticleBySlug } from '../data/articles';
import { localPath, markets } from '../data/growthSystem';
import { formatDate } from '../utils/formatDate';
import { CtaSection } from '../sections/CtaSection';

export default function ArticlePage() {
  const { market: marketParam, slug } = useParams();
  const market = markets[marketParam] ? marketParam : null;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    Promise.all([getArticleBySlug(slug), fetchArticles()])
      .then(([currentArticle, articles]) => {
        if (!mounted || !currentArticle) return;
        const relatedSlugs = new Set((currentArticle.related || []).map((item) => item.slug));
        setArticle({
          ...currentArticle,
          related: articles.filter((item) => relatedSlugs.has(item.slug)),
        });
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [slug]);
  if (loading) return <LoadingState label="Cargando artículo" />;
  if (!loading && !article) return <Navigate to="/404" replace />;

  const blogPath = market ? localPath(market, 'blog') : '/blog/';
  const articlePath = market ? localPath(market, `blog/${article.slug}`) : `/blog/${article.slug}/`;
  const crumbs = [
    { label: 'Inicio', to: '/' },
    ...(market ? [{ label: markets[market].name, to: localPath(market) }] : []),
    { label: 'Blog', to: blogPath },
    { label: article.title, to: articlePath },
  ];
  const related = article.related || [];

  const shareArticle = async () => {
    try {
      if (navigator.share) await navigator.share({ title: article.title, text: article.excerpt, url: window.location.href });
      else await navigator.clipboard.writeText(window.location.href);
      setShareMessage(navigator.share ? 'Compartido.' : 'Enlace copiado.');
    } catch {
      setShareMessage('No se pudo compartir.');
    }
  };

  return (
    <>
      <SeoHead title={article.title} path={articlePath} market={market || undefined} routePath={market ? `blog/${article.slug}` : ''} description={article.excerpt} image={article.featuredImage} imageWidth={article.image?.width} imageHeight={article.image?.height} type="article" author={article.author} publishedTime={article.publishedAt} modifiedTime={article.updatedAt} />
      <ArticleSchema article={article} path={articlePath} /><BreadcrumbSchema items={crumbs} />{article.faq.length > 0 && <FaqSchema items={article.faq} />}
      <article>
        <header className="article-hero"><Container size="narrow"><Breadcrumbs items={crumbs} /><span className="eyebrow">{article.category}</span><h1>{article.title}</h1><p className="article-hero__excerpt">{article.excerpt}</p><div className="article-meta article-meta--large">{article.author && <span><Icon name="user" />{article.author}</span>}<span><Icon name="calendar" />{formatDate(article.publishedAt)}</span><span><Icon name="calendar" />Actualizado {formatDate(article.updatedAt)}</span><span><Icon name="clock" />{article.readingTime}</span></div><div className="tag-list">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></Container></header>
        <Container className="article-cover"><SmartImage image={article.image} src={article.featuredImage} alt={article.image?.alt || `Imagen destacada del artículo: ${article.title}`} width={article.image?.width || 1200} height={article.image?.height || 628} sizes="(max-width: 720px) 100vw, 1200px" loading="eager" decoding="async" fetchpriority="high" /></Container>
        <Container className="article-layout"><aside><TableOfContents content={article.content} /></aside><div><ArticleContent content={article.content} />{article.faq.length > 0 && <section className="article-faq"><SectionHeader align="left" title="Preguntas frecuentes" /><FaqAccordion items={article.faq} /></section>}{article.author && <div className="author-box"><div className="author-box__avatar">{article.authorImage ? <SmartImage src={article.authorImage} alt={`Retrato de ${article.author}`} width="62" height="62" /> : 'PX'}</div><div><span>Escrito por</span><h2>{article.author}</h2>{article.authorBio && <p>{article.authorBio}</p>}</div></div>}<div className="share-row"><strong>Compartir artículo</strong><button type="button" onClick={shareArticle}><Icon name="share" />Compartir</button><span aria-live="polite">{shareMessage}</span></div></div></Container>
      </article>
      {related.length > 0 && <section className="section section--muted"><Container><SectionHeader eyebrow="Sigue leyendo" title="Artículos relacionados" /><div className="article-grid">{related.map((item) => <ArticleCard key={item.slug} article={item} basePath={blogPath.replace(/\/$/, '')} />)}</div></Container></section>}
      {article.caseStudySlug && <section className="section section--muted"><Container size="narrow"><SectionHeader eyebrow="Caso principal" title="Problema, transformación, métricas y límites de evidencia" /><p>Esta lectura técnica amplía una parte de la implementación. La narrativa comercial y la evidencia completa se mantienen en una única página principal.</p><div className="hero-actions">{(market ? [market] : Object.keys(markets)).map((code) => <a className="button button--secondary" key={code} href={localPath(code, `casos-de-exito/${article.caseStudySlug}`)}>Ver caso en {markets[code].name}</a>)}</div></Container></section>}
      <ArticleCommercialCta seo={article.seo} market={market} />
      <CtaSection market={market || undefined} />
    </>
  );
}

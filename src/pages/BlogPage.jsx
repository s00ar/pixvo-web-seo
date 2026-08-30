import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArticleCard } from '../components/blog/ArticleCard';
import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { EmptyState } from '../components/common/EmptyState';
import { Icon } from '../components/common/Icon';
import { SectionHeader } from '../components/common/SectionHeader';
import { SeoHead } from '../components/common/SeoHead';
import { fetchArticles, fetchArticleCategories } from '../data/articles';
import { localPath, markets } from '../data/growthSystem';
import { siteConfig } from '../data/siteConfig';
import { CtaSection } from '../sections/CtaSection';

export default function BlogPage() {
  const { market: marketParam } = useParams();
  const market = markets[marketParam] ? marketParam : null;
  const blogPath = market ? localPath(market, 'blog') : '/blog/';
  const blogBase = blogPath.replace(/\/$/, '');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [articles, setArticles] = useState([]);
  const [articleCategories, setArticleCategories] = useState(['Todos']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchArticles(), fetchArticleCategories()]).then(([list, cats]) => {
      if (!mounted) return;
      setArticles(list);
      setArticleCategories(cats || ['Todos']);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { mounted = false; };
  }, []);
  const featuredArticle = articles.find((item) => item.featured) || articles[0];
  const popularArticles = articles.filter((item) => item.popular);
  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es');
    return articles.filter((item) => {
      const matchesCategory = category === 'Todos' || item.category === category;
      const haystack = [item.title, item.excerpt, item.category, ...(item.tags || [])].join(' ').toLocaleLowerCase('es');
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });
  }, [articles, category, query]);

  return (
    <>
      <SeoHead title="Blog de tecnología y crecimiento" path={blogPath} market={market || undefined} routePath={market ? 'blog' : ''} description="Archivo editorial de Pixvo.Tech sobre desarrollo, seguridad, marketing digital, inteligencia artificial y automatización." />
      <section className="page-hero page-hero--blog"><Container size="narrow"><span className="eyebrow">Pixvo Insights</span><h1>Ideas para construir, medir y crecer mejor</h1><p>El archivo editorial de Pixvo.Tech, ahora organizado y disponible para buscar por tema, categoría o etiqueta.</p><form className="blog-search" role="search" onSubmit={(event) => event.preventDefault()}><label htmlFor="blog-search">Buscar artículos</label><div><Icon name="search" /><input id="blog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por título, categoría o etiqueta…" /></div></form></Container></section>
      <section className="section section--first"><Container><SectionHeader align="left" eyebrow="Selección editorial" title="Artículo destacado" />{loading ? <p>Cargando artículos…</p> : <ArticleCard article={featuredArticle} featured basePath={blogBase} />}</Container></section>
      <section className="section section--muted"><Container><div className="blog-layout"><div><div className="section-heading-row"><SectionHeader align="left" title="Todos los artículos" /><span className="result-count" aria-live="polite">{filteredArticles.length} resultados</span></div><div className="filter-bar" role="group" aria-label="Filtrar artículos por categoría">{articleCategories.map((item) => <button key={item} type="button" className={category === item ? 'is-active' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>{loading ? <p>Cargando…</p> : (filteredArticles.length ? <div className="article-grid article-grid--two">{filteredArticles.map((item) => <ArticleCard key={item.slug} article={item} basePath={blogBase} />)}</div> : <EmptyState />)}</div><aside className="blog-sidebar"><div className="popular-list"><h2>Más leídos</h2>{popularArticles.map((item, index) => <Link key={item.slug} to={`${blogBase}/${item.slug}`}><span>0{index + 1}</span><strong>{item.title}</strong><small>{item.readingTime}</small></Link>)}</div><div className="newsletter-panel"><span className="eyebrow eyebrow--light">Hablemos</span><h2>¿Tenés una idea o un desafío?</h2><p>Escribinos y contanos en qué podemos ayudarte. Te responderemos personalmente.</p><Button href={`mailto:${siteConfig.email}?subject=Consulta%20desde%20el%20blog%20de%20Pixvo.Tech`} variant="outline-light" icon="arrow">Escribir por correo</Button></div></aside></div></Container></section>
      <CtaSection market={market || undefined} title="¿Quieres aplicar una de estas ideas?" description="Te ayudamos a convertir el diagnóstico en una hoja de ruta realista y medible." />
    </>
  );
}

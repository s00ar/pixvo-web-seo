import { Helmet } from 'react-helmet-async';
import { DOMAIN, isEquivalentPublished, markets } from '../../data/growthSystem';
import defaultSocialImage from '../../assets/images/services-workspace.jpg';

export function SeoHead({ title, description = 'Pixvo integra SEO, automatización y analítica en un sistema de crecimiento digital para PyMEs.', path = '/', market, routePath = '', type = 'website', image = defaultSocialImage, imageWidth, imageHeight, robots = 'index,follow', schema = [], rootAlternates = false, author, publishedTime, modifiedTime }) {
  const canonical = new URL(path, DOMAIN).toString();
  const absoluteImage = new URL(image || '/favicon.png', DOMAIN).toString();
  const resolvedImageWidth = imageWidth || (image === defaultSocialImage ? 512 : 1200);
  const resolvedImageHeight = imageHeight || (image === defaultSocialImage ? 279 : 630);
  const baseTitle = title.includes('Pixvo') ? title : `${title} | Pixvo`;
  const pageTitle = market ? `${baseTitle} — ${markets[market].name}` : baseTitle;
  const locale = market ? markets[market].locale.replace('-', '_') : 'es_ES';
  const globalBlogRoute = !market && /^\/blog(?:\/|$)/.test(path) ? path.replace(/^\/+|\/+$/g, '') : '';
  const alternates = market && isEquivalentPublished(routePath)
    ? Object.values(markets).map((item) => ({ lang: item.locale, href: new URL(`/${item.code}/${routePath}${routePath ? '/' : ''}`, DOMAIN).toString() }))
    : globalBlogRoute
      ? Object.values(markets).map((item) => ({ lang: item.locale, href: new URL(`/${item.code}/${globalBlogRoute}/`, DOMAIN).toString() }))
      : [];
  const xDefaultHref = globalBlogRoute
    ? canonical
    : market && (routePath === 'blog' || routePath.startsWith('blog/'))
      ? new URL(`/${routePath}/`, DOMAIN).toString()
      : DOMAIN + '/';
  return (
    <Helmet>
      <html lang={market ? markets[market].locale : 'es'} />
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {author && <meta name="author" content={author} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      <link rel="canonical" href={canonical} />
      {alternates.map((alt) => <link key={alt.lang} rel="alternate" hrefLang={alt.lang} href={alt.href} />)}
      {alternates.length > 0 && <link rel="alternate" hrefLang="x-default" href={xDefaultHref} />}
      {rootAlternates && Object.values(markets).map((item) => <link key={item.code} rel="alternate" hrefLang={item.locale} href={`${DOMAIN}/${item.code}/`} />)}
      {rootAlternates && <link rel="alternate" hrefLang="x-default" href={DOMAIN + '/'} />}
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      {alternates.filter((alt) => alt.lang !== (market ? markets[market].locale : '')).map((alt) => <meta key={`og-${alt.lang}`} property="og:locale:alternate" content={alt.lang.replace('-', '_')} />)}
      <meta property="og:site_name" content="Pixvo" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={absoluteImage} />
      {resolvedImageWidth && <meta property="og:image:width" content={String(resolvedImageWidth)} />}
      {resolvedImageHeight && <meta property="og:image:height" content={String(resolvedImageHeight)} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      {schema.map((item, index) => <script key={index} type="application/ld+json">{JSON.stringify(item)}</script>)}
    </Helmet>
  );
}

/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../common/Container';
import { commonFaqs, DOMAIN, getPrice, localPath, markets, plans, solutionCatalog, trafficGuarantee } from '../../data/growthSystem';
import { track } from '../../utils/tracking';
import workspaceImage from '../../assets/images/services-workspace.jpg';

export function CtaLink({ market, location, children = 'Solicitar diagnóstico', className = 'button button--primary', plan, target = 'solicitar-diagnostico' }) {
  return <Link className={className} to={localPath(market, target)} onClick={() => { track('cta_click', { country: market, currency: markets[market].currency, cta_location: location, plan, target }); if (plan) track('plan_select', { country: market, currency: markets[market].currency, plan }); }}>{children}</Link>;
}

export function Hero({ market, eyebrow = 'Pixvo Growth System', title, lead, secondary, visual }) {
  const sources = visual?.detailSources || [];
  return <section className="growth-hero"><Container className="growth-hero__grid"><div className="growth-hero__copy"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{lead}</p><div className="hero-actions"><CtaLink market={market} location="hero" />{secondary && <Link className="button button--ghost" to={secondary.to}>{secondary.label}</Link>}</div></div><div className="growth-hero__visual"><div className="growth-hero__shape growth-hero__shape--cyan" aria-hidden="true" /><div className="growth-hero__shape growth-hero__shape--navy" aria-hidden="true" /><div className={`growth-hero__media${visual?.imageFit === 'contain' ? ' is-contain' : ''}`}>{visual ? <picture>{sources.map((source) => <source key={`${source.media}-${source.srcSet}`} media={source.media} srcSet={source.srcSet} sizes={source.sizes} width={source.width} height={source.height} />)}<img src={visual.image} srcSet={visual.imageSrcSet} sizes={visual.detailSizes || '(max-width: 700px) 92vw, 46vw'} alt={visual.imageAlt} width={visual.imageWidth} height={visual.imageHeight} loading="eager" decoding="async" fetchPriority="high" /></picture> : <img src={workspaceImage} alt="Equipo de Pixvo trabajando con analítica y desarrollo" width="512" height="279" loading="eager" decoding="async" fetchPriority="high" />}<div className="growth-hero__media-label"><span>{visual ? 'Caso documentado' : 'Pixvo Growth System'}</span><strong>{visual?.title || 'Captación · Conversión · Seguimiento'}</strong></div></div>{!visual && <><span className="growth-hero__chip growth-hero__chip--one">SEO</span><span className="growth-hero__chip growth-hero__chip--two">Automatización</span><span className="growth-hero__chip growth-hero__chip--three">Analítica</span></>}</div></Container></section>;
}

export function Section({ title, intro, children, tone = '' }) {
  return <section className={`growth-section ${tone}`}><Container><h2>{title}</h2>{intro && <p className="section-lead">{intro}</p>}{children}</Container></section>;
}

export function CardGrid({ items, columns = 3 }) {
  return <div className={`growth-grid growth-grid--${columns}`}>{items.map((item, index) => <article className={`growth-card${item.to ? ' is-linked' : ''}`} key={item.title || item}><span className="card-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{item.title || item}</h3>{item.text && <p>{item.text}</p>}{item.to && <Link className="growth-card__link" to={item.to} aria-label={`${item.link || 'Explorar'}: ${item.title || item}`}>{item.link || 'Explorar esta solución'}</Link>}</article>)}</div>;
}

function CaseStudyImage({ item, context = 'card' }) {
  const sources = context === 'detail' ? item.detailSources || [] : [];
  return <picture>{sources.map((source) => <source key={`${source.media}-${source.srcSet}`} media={source.media} srcSet={source.srcSet} sizes={source.sizes} width={source.width} height={source.height} />)}<img src={item.image} srcSet={item.imageSrcSet} sizes={context === 'detail' ? item.detailSizes : item.cardSizes} alt={item.imageAlt} width={item.imageWidth} height={item.imageHeight} loading="lazy" decoding="async" fetchPriority="auto" /></picture>;
}

export function CaseStudyGrid({ items, market }) {
  return <div className="case-study-grid">{items.map((item) => <article className="case-study-card" key={item.slug}><Link className="case-study-card__link" to={localPath(market, `casos-de-exito/${item.slug}`)} aria-label={`Leer caso de éxito: ${item.title}`}><div className={`case-study-card__media${item.imageFit === 'contain' ? ' is-contain' : ''}`}><CaseStudyImage item={item} /></div><div className="case-study-card__content"><span className="eyebrow">{item.label}</span><h3>{item.title}</h3><p>{item.summary}</p><strong>Leer caso <span aria-hidden="true">→</span></strong></div></Link></article>)}</div>;
}

export function CaseStudyMedia({ item }) {
  return <section className="case-study-media"><Container><figure className={item.imageFit === 'contain' ? 'is-contain' : undefined}><CaseStudyImage item={item} context="detail" /><figcaption>{item.caption || item.imageAlt}</figcaption></figure></Container></section>;
}

export function CaseStudyProcess({ items }) {
  return <ol className="case-process">{items.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></li>)}</ol>;
}

export function BeforeAfter({ items }) {
  return <div className="before-after" role="table" aria-label="Comparación antes y después"><div className="before-after__head" role="row"><strong role="columnheader">Antes</strong><strong role="columnheader">Después</strong></div>{items.map((item) => <div className="before-after__row" role="row" key={item.before}><p role="cell">{item.before}</p><p role="cell">{item.after}</p></div>)}</div>;
}

export function VerifiedMetrics({ items }) {
  return <div className="verified-metrics">{items.map((item) => <article key={`${item.value}-${item.label}`}><strong>{item.value}</strong><h3>{item.label}</h3><p>{item.context}</p></article>)}</div>;
}

export function EvidenceList({ items }) {
  return <ul className="evidence-list">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function CaseCommercialLinks({ market, links = [] }) {
  return <div className="growth-grid growth-grid--3">{links.map((item) => <article className="growth-card is-linked" key={item.target}><h3>{item.anchor}</h3><Link className="growth-card__link" to={localPath(market, item.target)}>{item.anchor}</Link></article>)}</div>;
}

export function Breadcrumbs({ market, items = [] }) {
  const all = [{ label: 'Inicio', to: '/' }, { label: markets[market].name, to: localPath(market) }, ...items];
  return <Container><nav className="growth-breadcrumbs" aria-label="Migas de pan"><ol>{all.map((item, i) => <li key={`${item.label}-${i}`}>{item.to && i < all.length - 1 ? <Link to={item.to}>{item.label}</Link> : <span aria-current={i === all.length - 1 ? 'page' : undefined}>{item.label}</span>}</li>)}</ol></nav></Container>;
}

export function breadcrumbSchema(market, items) {
  const all = [{ label: 'Inicio', path: '/' }, { label: markets[market].name, path: localPath(market) }, ...items];
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: all.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.label, item: new URL(item.path, DOMAIN).toString() })) };
}

export function Faqs({ items = commonFaqs }) {
  return <div className="growth-faqs">{items.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>;
}
export const faqSchema = (items = commonFaqs) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) });

export function GuaranteeBlock() {
  return <div className="guarantee-block"><div><span className="eyebrow">Compromiso medible</span><h3>{trafficGuarantee.title}</h3><p>{trafficGuarantee.summary}</p><p className="guarantee-block__note">No garantizamos ventas: la oferta, el precio, la atención, la negociación y el cierre dependen también de la empresa.</p></div><div className="guarantee-periods">{plans.map((plan) => <article key={plan.id}><strong>{trafficGuarantee.periods[plan.id]} meses</strong><span>{plan.name}</span><p>de continuidad bonificada si no se alcanza el KPI acordado y se cumplen sus condiciones.</p></article>)}</div></div>;
}

function money(value, market) { return new Intl.NumberFormat(markets[market].locale, { style: 'currency', currency: markets[market].currency, maximumFractionDigits: 0 }).format(value); }
export function Pricing({ market }) {
  const observed = useRef(false);
  useEffect(() => {
    if (observed.current) return undefined;
    const node = document.querySelector('[data-pricing]');
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !observed.current) { observed.current = true; track('pricing_view', { country: market, currency: markets[market].currency, page_type: 'pricing' }); observer.disconnect(); } });
    const selectPlan = (event) => {
      if (!event.target.closest('.plan-card .button')) return;
      const title = event.target.closest('.plan-card')?.querySelector('h2')?.textContent || '';
      const selected = plans.find((item) => item.name === title);
      if (selected) track('plan_select', { country: market, currency: markets[market].currency, plan: selected.id });
    };
    node.addEventListener('click', selectPlan);
    observer.observe(node); return () => { observer.disconnect(); node.removeEventListener('click', selectPlan); };
  }, [market]);
  return <div className="pricing-grid" data-pricing>{plans.map((plan) => { const price = getPrice(market, plan.id); const visible = Number.isFinite(price.monthly) && Number.isFinite(price.onboarding); return <article className={`plan-card ${plan.id === 'growth' ? 'is-featured' : ''}`} key={plan.id}>{plan.id === 'growth' && <span className="plan-badge">Plan central</span>}<h2>{plan.name}</h2><p>{plan.audience}</p>{visible ? <div className="price"><strong>{money(price.monthly, market)}</strong><span>/ mes</span><small>Onboarding: {money(price.onboarding, market)}</small></div> : <div className="price price--private"><strong>Precio bajo consulta</strong><span>Importe en {markets[market].currency} pendiente de aprobación comercial.</span></div>}<p><strong>{plan.units} unidades operativas al mes</strong><br />Permanencia mínima: {plan.minimum} meses{plan.recommended ? ` · recomendada: ${plan.recommended} meses` : ''}</p><h3>Incluye</h3><ul>{plan.included.map((item) => <li key={item}>{item}</li>)}</ul><h3>Límites</h3><ul>{plan.limits.map((item) => <li key={item}>{item}</li>)}</ul><CtaLink market={market} location="pricing" className="button button--primary" onClick={() => track('plan_select', { country: market, currency: markets[market].currency, plan: plan.id })}>Seleccionar este plan</CtaLink></article>; })}</div>;
}

export function RelatedSolutions({ market, slugs }) {
  const hubPages = {
    'sistema-crecimiento-digital': { title: 'Pixvo Growth System', text: 'Conecta captación, conversión, automatización y seguimiento.' },
    'auditoria-crecimiento-digital': { title: 'Auditoría de crecimiento digital', text: 'Identifica cuellos de botella y prioriza el siguiente paso.' },
    planes: { title: 'Planes y precios', text: 'Compara alcance, unidades operativas, permanencia y límites.' },
    'solicitar-diagnostico': { title: 'Solicitar diagnóstico', text: 'Comparte el contexto necesario para valorar el encaje y el siguiente paso.' },
  };
  return <CardGrid items={slugs.map((slug) => ({ title: solutionCatalog[slug]?.title || hubPages[slug]?.title || 'Pixvo Growth System', text: solutionCatalog[slug]?.lead || hubPages[slug]?.text || 'Conecta captación, conversión y seguimiento.', to: solutionCatalog[slug] ? localPath(market, `soluciones/${slug}`) : localPath(market, slug), link: 'Ver cómo funciona' }))} />;
}

export function FinalCta({ market, title = 'Identifiquemos qué está frenando tu crecimiento digital', description = 'Cuéntanos cómo funciona actualmente tu captación. Revisaremos si Pixvo encaja con tu situación y cuál debería ser el siguiente paso.', actionLabel = 'Solicitar diagnóstico', target = 'solicitar-diagnostico' }) {
  return <section className="final-cta"><Container><h2>{title}</h2><p>{description}</p><CtaLink market={market} location="final" target={target}>{actionLabel}</CtaLink></Container></section>;
}

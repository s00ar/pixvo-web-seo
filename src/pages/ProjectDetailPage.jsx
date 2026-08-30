import { Link, Navigate, useParams } from 'react-router-dom';
import { BreadcrumbSchema } from '../components/common/BreadcrumbSchema';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { Icon } from '../components/common/Icon';
import { SeoHead } from '../components/common/SeoHead';
import { SmartImage } from '../components/common/SmartImage';
import { TechnologyBadge } from '../components/common/TechnologyBadge';
import { getProjectBySlug } from '../data/projects';
import { DOMAIN, localPath, markets } from '../data/growthSystem';
import { CtaSection } from '../sections/CtaSection';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  if (!project) return <Navigate to="/404" replace />;
  const projectPath = `/proyectos/${project.slug}/`;
  const crumbs = [{ label: 'Inicio', to: '/' }, { label: project.title, to: projectPath }];
  const canonical = new URL(projectPath, DOMAIN).toString();
  const imageObject = { '@type': 'ImageObject', url: new URL(project.image, DOMAIN).toString(), width: project.imageWidth, height: project.imageHeight, caption: project.imageAlt };
  const creativeWorkSchema = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title, description: project.summary, image: imageObject, creator: { '@type': 'Organization', name: 'Pixvo' }, url: canonical };
  const webPageSchema = { '@context': 'https://schema.org', '@type': 'WebPage', name: project.title, description: project.summary, url: canonical, image: imageObject, mainEntity: { '@id': `${canonical}#project` } };

  return (
    <>
      <SeoHead title={project.title} path={projectPath} description={project.summary} image={project.image} imageWidth={project.imageWidth} imageHeight={project.imageHeight} schema={[webPageSchema, { ...creativeWorkSchema, '@id': `${canonical}#project` }]} />
      <BreadcrumbSchema items={crumbs} />
      <section className="case-hero"><Container><Breadcrumbs items={crumbs} /><div className="case-hero__grid"><div><span className="eyebrow">{project.industry} · Proyecto real</span><h1>{project.title}</h1><p>{project.summary}</p><div className="tag-list">{project.services.map((service) => <span key={service}>{service}</span>)}</div></div><dl><div><dt>Cliente</dt><dd>{project.client}</dd></div><div><dt>Industria</dt><dd>{project.industry}</dd></div><div><dt>Servicios</dt><dd>{project.services.join(', ')}</dd></div></dl></div><div className="case-hero__image"><SmartImage src={project.image} alt={project.imageAlt} width={project.imageWidth || 512} height={project.imageHeight || 279} loading="eager" fetchpriority="high" /></div></Container></section>
      <section className="section"><Container className="case-story"><aside><span className="eyebrow">El reto</span><h2>De una necesidad compleja a un plan comprensible</h2></aside><div><h2>Problema</h2><p>{project.problem}</p><h2>Objetivos</h2><ul className="check-list">{project.objectives.map((item) => <li key={item}><Icon name="check" size={17} />{item}</li>)}</ul></div></Container></section>
      <section className="section section--muted"><Container className="strategy-grid"><article><span className="step-label">01</span><h2>Estrategia</h2><p>{project.strategy}</p></article><article><span className="step-label">02</span><h2>Solución</h2><p>{project.solution}</p></article></Container></section>
      <section className="section"><Container><p className="overline-center">Tecnologías utilizadas</p><div className="technology-row">{project.technologies.map((technology) => <TechnologyBadge key={technology} technology={technology} />)}</div><div className="results-panel"><div><span className="eyebrow eyebrow--light">Resultados</span><h2>Lo que puede verificarse en el caso publicado</h2></div><ul>{project.results.map((result) => <li key={result}><Icon name="check" />{result}</li>)}</ul></div></Container></section>
      <section className="section section--muted"><Container><div className="gallery-grid">{project.gallery.map((image, index) => <SmartImage key={image} src={image} alt={`Galería de ${project.title}, vista ${index + 1}`} width="512" height="279" />)}</div><blockquote className="case-quote"><span>“</span><p>{project.testimonial}</p><cite>Nota editorial · Pixvo.Tech</cite></blockquote></Container></section>
      {project.relatedServices?.length > 0 && <section className="section"><Container size="narrow"><h2>Servicios relacionados con este proyecto técnico</h2><p>El proyecto documenta una herramienta de portfolio. Si la necesidad es comercial, consulta el alcance específico de WordPress para tu mercado.</p><div className="button-row">{Object.values(markets).flatMap((market) => project.relatedServices.map((service) => <Link className="button button--secondary" key={`${market.code}-${service.slug}`} to={localPath(market.code, `soluciones/${service.slug}`)}>{service.label} en {market.name}</Link>))}</div></Container></section>}
      <section className="section section--compact"><Container size="narrow" className="center"><h2>¿Quieres revisar un reto similar?</h2><p>Selecciona el mercado correspondiente para compartir el contexto sin una georedirección automática.</p><div className="button-row">{Object.values(markets).map((market) => <Button key={market.code} to={localPath(market.code, 'solicitar-diagnostico')}>{market.name}</Button>)}</div></Container></section>
      <CtaSection title="Construyamos el siguiente caso con datos reales" description="La primera conversación sirve para entender el problema, no para empujarte una solución predeterminada." secondary={false} />
    </>
  );
}

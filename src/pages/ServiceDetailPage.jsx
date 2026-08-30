import { Navigate, useParams } from 'react-router-dom';
import { BreadcrumbSchema } from '../components/common/BreadcrumbSchema';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { FaqAccordion } from '../components/common/FaqAccordion';
import { FaqSchema } from '../components/common/FaqSchema';
import { Icon } from '../components/common/Icon';
import { SectionHeader } from '../components/common/SectionHeader';
import { SeoHead } from '../components/common/SeoHead';
import { ServiceSchema } from '../components/common/ServiceSchema';
import { SmartImage } from '../components/common/SmartImage';
import { TechnologyBadge } from '../components/common/TechnologyBadge';
import { getServiceBySlug } from '../data/services';
import { CtaSection } from '../sections/CtaSection';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);
  if (!service) return <Navigate to="/404" replace />;

  const breadcrumbItems = [{ label: 'Inicio', to: '/' }, { label: 'Servicios', to: '/servicios' }, { label: service.navLabel, to: `/servicios/${service.slug}` }];

  return (
    <>
      <SeoHead title={service.title} path={`/servicios/${service.slug}`} description={service.description} image={service.image} />
      <ServiceSchema service={service} /><BreadcrumbSchema items={breadcrumbItems} /><FaqSchema items={service.faq} />
      <section className="hero hero--service">
        <Container><Breadcrumbs items={breadcrumbItems} /><div className="hero__grid"><div className="hero__content"><span className="eyebrow">{service.eyebrow}</span><h1>{service.title}</h1><p>{service.description}</p><div className="button-row"><Button to="/contacto" icon="arrow">Cuéntanos tu proyecto</Button><Button href="#metodologia" variant="ghost">Ver metodología</Button></div></div><div className="image-frame"><SmartImage src={service.image} alt={service.imageAlt} width="512" height="279" loading="eager" fetchpriority="high" /></div></div></Container>
      </section>

      <section className="section">
        <Container className="intro-problems-grid"><div><span className="eyebrow">Contexto</span><h2>Una solución conectada con el negocio</h2><p className="lead">{service.introduction}</p></div><div className="problem-panel"><h2>Problemas que resolvemos</h2><ul className="check-list">{service.problems.map((problem) => <li key={problem}><Icon name="check" size={17} />{problem}</li>)}</ul></div></Container>
      </section>

      <section className="section section--muted">
        <Container><SectionHeader eyebrow="Impacto" title="Beneficios que guían la implementación" /><div className="benefit-grid">{service.benefits.map((benefit, index) => <article key={benefit}><span>0{index + 1}</span><h3>{benefit}</h3><p>Esta capacidad se diseña, implementa y valida de acuerdo con el alcance y los datos disponibles.</p></article>)}</div></Container>
      </section>

      <section className="section">
        <Container><SectionHeader eyebrow="Alcance" title={`Qué podemos construir con ${service.navLabel}`} description="El alcance final se prioriza durante el descubrimiento y queda documentado antes de comenzar." /><div className="scope-grid">{service.scope.map((item) => <div key={item}><Icon name={service.icon} size={22} /><span>{item}</span></div>)}</div></Container>
      </section>

      <section className="section section--navy" id="metodologia">
        <Container><SectionHeader eyebrow="Metodología" title="Un proceso visible de principio a fin" description="Iteraciones cortas, decisiones documentadas y validaciones proporcionadas al riesgo." /><div className="process-cards">{service.process.map((step, index) => <article key={step.title}><span>{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></Container>
      </section>

      <section className="section section--compact"><Container><p className="overline-center">Tecnologías y herramientas</p><div className="technology-row">{service.technologies.map((technology) => <TechnologyBadge key={technology} technology={technology} />)}</div></Container></section>

      <section className="section section--muted"><Container className="case-preview"><div><span className="eyebrow">{service.caseStudy.label}</span><h2>{service.caseStudy.title}</h2><p>{service.caseStudy.description}</p><Button to={`/proyectos/${service.caseStudy.slug}`} variant="ghost" icon="arrow">Ver caso de estudio</Button></div><SmartImage src={service.caseStudy.image} alt={`Vista del caso ${service.caseStudy.title}`} width="512" height="279" /></Container></section>

      <section className="section"><Container size="narrow"><SectionHeader eyebrow="Preguntas frecuentes" title={`Dudas habituales sobre ${service.navLabel}`} /><FaqAccordion items={service.faq} /></Container></section>
      <CtaSection title={`¿Hablamos de ${service.navLabel.toLowerCase()}?`} description="Cuéntanos el punto de partida. Te responderemos con preguntas concretas y un siguiente paso claro." />
    </>
  );
}

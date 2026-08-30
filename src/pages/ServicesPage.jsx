import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { Icon } from '../components/common/Icon';
import { SectionHeader } from '../components/common/SectionHeader';
import { SeoHead } from '../components/common/SeoHead';
import { SmartImage } from '../components/common/SmartImage';
import { ServiceCard } from '../components/services/ServiceCard';
import { homeMetrics } from '../data/homeContent';
import { media } from '../data/media';
import { serviceList } from '../data/services';
import { CtaSection } from '../sections/CtaSection';

const reasons = [
  { icon: 'target', title: 'Velocidad y agilidad', text: 'Entregas incrementales para validar decisiones sin perder calidad técnica.' },
  { icon: 'workflow', title: 'Soberanía tecnológica', text: 'Bases claras y mantenibles para conservar el control de tu stack y tus datos.' },
  { icon: 'analytics', title: 'Partnership estratégico', text: 'Tecnología, experiencia y crecimiento conectados con una misma hoja de ruta.' },
];

export default function ServicesPage() {
  return (
    <>
      <SeoHead title="Servicios digitales integrales" path="/servicios" description="Desarrollo, aplicaciones, SEO, publicidad digital y automatización coordinados en un único equipo." image={media.servicesWorkspace} />
      <section className="hero hero--image">
        <Container className="hero__grid">
          <div className="hero__content"><span className="eyebrow">Expertos en transformación digital</span><h1>Un enfoque integrado para tu éxito digital.</h1><p>Combinamos ingeniería lógica con marketing creativo para construir soluciones de alto rendimiento que impulsan el crecimiento real de tu negocio.</p><div className="button-row"><Button href="#areas" icon="arrow">Explorar áreas de servicio</Button><Button to="/proyectos" variant="ghost">Ver casos de éxito</Button></div></div>
          <div className="image-frame image-frame--tilted"><SmartImage src={media.servicesWorkspace} alt="Espacio de trabajo tecnológico con paneles de datos" width="512" height="279" loading="eager" fetchpriority="high" /></div>
        </Container>
      </section>
      <section className="section" id="areas">
        <Container><SectionHeader eyebrow="Capacidades" title="Nuestras áreas de especialidad" description="Soluciones end-to-end diseñadas para escalar empresas en la era de los datos." /><div className="service-grid">{serviceList.map((service) => <ServiceCard key={service.slug} service={service} />)}</div></Container>
      </section>
      <section className="section section--muted">
        <Container className="why-grid"><div><SectionHeader align="left" title="¿Por qué elegirnos?" /><div className="reason-list">{reasons.map((reason) => <div key={reason.title}><span className="icon-box"><Icon name={reason.icon} /></span><div><h3>{reason.title}</h3><p>{reason.text}</p></div></div>)}</div></div><div className="metric-cards">{homeMetrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span><small>{metric.note}</small></div>)}</div></Container>
      </section>
      <CtaSection title="¿Listo para escalar tu visión?" description="Agendemos una conversación para entender tus retos y elegir una primera acción útil." />
    </>
  );
}

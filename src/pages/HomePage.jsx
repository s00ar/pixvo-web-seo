import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '../components/blog/ArticleCard';
import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { Icon } from '../components/common/Icon';
import { OrganizationSchema } from '../components/common/OrganizationSchema';
import { SectionHeader } from '../components/common/SectionHeader';
import { SeoHead } from '../components/common/SeoHead';
import { TechnologyBadge } from '../components/common/TechnologyBadge';
import { TestimonialCard } from '../components/common/TestimonialCard';
import { ProjectCard } from '../components/portfolio/ProjectCard';
import { ServiceCard } from '../components/services/ServiceCard';
import { fetchArticles } from '../data/articles';
import { homeMetrics, valueSteps, workProcess } from '../data/homeContent';
import { media } from '../data/media';
import { projects } from '../data/projects';
import { serviceList } from '../data/services';
import { technologies } from '../data/technologies';
import { testimonials } from '../data/testimonials';
import { CtaSection } from '../sections/CtaSection';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    let mounted = true;
    fetchArticles().then((list) => { if (mounted) setArticles(list); }).catch(() => {});
    return () => { mounted = false; };
  }, []);
  return (
    <>
      <SeoHead title="Desarrollo web, mobile y Google Ads de alto impacto" path="/" description="Potenciamos empresas y emprendedores con soluciones web, apps mobile, Google Ads, inteligencia artificial, automatización y SEO." image={media.webHero} />
      <OrganizationSchema />

      <section className="hero hero--home">
        <Container className="hero__grid">
          <div className="hero__content">
            <span className="eyebrow">Desarrollo · Marketing · Automatización</span>
            <h1>Impulsá tu negocio con desarrollo web, mobile y <span>Google Ads de alto impacto</span></h1>
            <p>En Pixvo.Tech potenciamos empresas y emprendedores con soluciones web, desarrollo de apps mobile y campañas en Google Ads diseñadas a medida. Sumamos inteligencia artificial, automatización y SEO para que tu marca crezca de verdad.</p>
            <div className="button-row"><Button to="/contacto" icon="arrow">Solicitar una consultoría</Button><Button to="/servicios" variant="ghost">Ver nuestros servicios</Button></div>
          </div>
          <div className="hero-visual" aria-label="Indicador visual de rendimiento y arquitectura">
            <div className="hero-visual__orb"></div>
            <div className="hero-visual__screen"><Icon name="workflow" size={38} /><strong>High-Performance Core</strong><span>Diseño · Tecnología · Crecimiento</span></div>
            <div className="floating-stat"><span>✓</span><strong>Arquitectura escalable</strong><small>Preparada para medir y crecer</small></div>
          </div>
        </Container>
      </section>

      <section className="metrics-strip" aria-label="Datos editables de validación">
        <Container><div className="metrics-grid">{homeMetrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span><small>{metric.note}</small></div>)}</div></Container>
      </section>

      <section className="section">
        <Container>
          <SectionHeader eyebrow="Soluciones integrales" title="Nuestra infraestructura de servicios" description="Un ecosistema coordinado para cubrir cada punto de contacto digital de tu empresa con claridad y escalabilidad." />
          <div className="service-grid">{serviceList.map((service) => <ServiceCard key={service.slug} service={service} />)}</div>
        </Container>
      </section>

      <section className="section section--muted">
        <Container className="value-grid">
          <div>
            <SectionHeader align="left" eyebrow="Lógica antes que ruido" title="No hacemos tecnología por hacer tecnología" description="Creamos soluciones con intención: cada decisión debe mejorar una experiencia, un proceso o un resultado medible." />
            <div className="numbered-list">{valueSteps.map((step) => <div key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></div>)}</div>
          </div>
          <div className="logic-panel"><div><Icon name="workflow" size={40} /><strong>Iteración continua</strong><span>Medimos → Optimizamos → Crecemos</span></div></div>
        </Container>
      </section>

      <section className="section process-section">
        <Container>
          <SectionHeader eyebrow="Nuestro proceso" title="Una metodología ágil para resultados excepcionales" />
          <div className="process-line">{workProcess.map((step, index) => <div key={step.number}><span style={{ '--step-color': ['#0a192f', '#ff5722', '#00bcd4', '#008b99'][index] }}>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></div>)}</div>
        </Container>
      </section>

      <section className="section section--navy">
        <Container>
          <div className="section-heading-row"><SectionHeader align="left" eyebrow="Proyectos destacados" title="Nuestra ingeniería en acción" description="Productos reales que conectan desarrollo, experiencia, integraciones y crecimiento." /><Link className="text-link text-link--light" to="/proyectos">Ver todos <Icon name="arrow" size={15} /></Link></div>
          <div className="project-grid project-grid--featured">{projects.slice(0, 3).map((project) => <ProjectCard key={project.slug} project={project} dark />)}</div>
        </Container>
      </section>

      <section className="section section--compact">
        <Container><p className="overline-center">Tecnologías que dominamos</p><div className="technology-row">{technologies.map((technology) => <TechnologyBadge key={technology.name} technology={technology} />)}</div></Container>
      </section>

      <section className="section section--muted">
        <Container>
          <SectionHeader eyebrow="Colaboración" title="Lo que debe sentirse al trabajar juntos" description="Testimonios demostrativos que deben sustituirse por citas autorizadas antes de publicar." />
          <div className="testimonial-grid">{testimonials.map((testimonial) => <TestimonialCard key={testimonial.author} testimonial={testimonial} />)}</div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="section-heading-row"><SectionHeader align="left" eyebrow="Ideas aplicables" title="Últimos artículos" description="Contenido publicado por Pixvo.Tech sobre tecnología, marketing, seguridad, IA y operaciones digitales." /><Link className="text-link" to="/blog">Ver blog <Icon name="arrow" size={15} /></Link></div>
          <div className="article-grid">{articles.slice(0, 3).map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}

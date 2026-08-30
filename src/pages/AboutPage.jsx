import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { Icon } from '../components/common/Icon';
import { SectionHeader } from '../components/common/SectionHeader';
import { SeoHead } from '../components/common/SeoHead';
import { SmartImage } from '../components/common/SmartImage';
import { valueSteps } from '../data/homeContent';
import { media } from '../data/media';
import { CtaSection } from '../sections/CtaSection';

const values = [
  { icon: 'target', title: 'Claridad', text: 'Hacemos visibles las decisiones, el alcance y las dependencias.' },
  { icon: 'shield', title: 'Responsabilidad', text: 'No presentamos supuestos o resultados de ejemplo como hechos reales.' },
  { icon: 'workflow', title: 'Evolución', text: 'Construimos sistemas que puedan aprender y cambiar con el negocio.' },
];

export default function AboutPage() {
  return (
    <>
      <SeoHead title="Nosotros" path="/nosotros" description="Conocé el enfoque remoto de Pixvo.Tech para conectar desarrollo web y mobile, experiencia, automatización y marketing digital." image={media.techConsultant} />
      <section className="hero hero--image"><Container className="hero__grid"><div className="hero__content"><span className="eyebrow">Pixvo.Tech</span><h1>Tecnología a medida, con una mirada integral</h1><p>Somos un estudio especializado en desarrollo web y mobile, Google Ads, inteligencia artificial, automatización y SEO. Creamos productos claros, seguros y preparados para evolucionar.</p><Button to="/contacto" icon="arrow">Conocer nuestro enfoque</Button></div><div className="image-frame"><SmartImage src={media.techConsultant} alt="Profesional de consultoría tecnológica en una oficina" width="512" height="382" loading="eager" fetchpriority="high" /></div></Container></section>
      <section className="section"><Container size="narrow"><SectionHeader eyebrow="Nuestro enfoque" title="Calidad e innovación con sentido práctico" description="Producto, tecnología y crecimiento son partes del mismo sistema de decisiones." /><div className="manifesto"><p>Desarrollamos soluciones web personalizadas, e-commerce, aplicaciones y herramientas internas. Sumamos IA, machine learning, automatización y datos cuando aportan una ventaja concreta.</p><p>Nuestro criterio es pragmático: resolver el problema correcto, elegir la tecnología adecuada y construir una base sostenible, mantenible y segura.</p></div></Container></section>
      <section className="section section--muted"><Container><SectionHeader eyebrow="Principios" title="Cómo queremos trabajar" /><div className="value-card-grid">{values.map((value) => <article key={value.title}><span className="icon-box"><Icon name={value.icon} /></span><h3>{value.title}</h3><p>{value.text}</p></article>)}</div></Container></section>
      <section className="section"><Container className="value-grid"><div><SectionHeader align="left" eyebrow="Cultura remota" title="Talento distribuido, comunicación cercana" description="Trabajamos de forma remota con clientes internacionales y una metodología transparente." /><div className="numbered-list">{valueSteps.map((step) => <div key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></div>)}</div></div><div className="logic-panel"><div><Icon name="analytics" size={42} /><strong>Decisiones conectadas</strong><span>Negocio · Experiencia · Tecnología · Datos</span></div></div></Container></section>
      <CtaSection title="¿Encaja este enfoque con tu forma de trabajar?" description="Conversemos sobre el contexto, los riesgos y la oportunidad antes de hablar de entregables." />
    </>
  );
}

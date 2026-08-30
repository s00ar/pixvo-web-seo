import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { Icon } from '../components/common/Icon';
import { SectionHeader } from '../components/common/SectionHeader';
import { SeoHead } from '../components/common/SeoHead';
import { siteConfig } from '../data/siteConfig';

const steps = [
  { number: '01', title: 'Compartí el contacto', text: 'Enviá la referencia por el formulario o por WhatsApp con los datos necesarios para iniciar la conversación.' },
  { number: '02', title: 'Evaluamos el proyecto', text: 'Pixvo.Tech contacta al referido, entiende la necesidad y prepara una propuesta si existe encaje.' },
  { number: '03', title: 'Activamos el beneficio', text: 'Cuando el contacto se convierte en cliente con un proyecto confirmado, el beneficio se habilita automáticamente.' },
];

const rewards = [
  { title: '1 referido confirmado', items: ['1 mes de mantenimiento web', 'o auditoría técnica SEO'] },
  { title: '2 o 3 referidos confirmados', items: ['2 meses de mantenimiento', 'optimización de rendimiento', 'o configuración/mejora de Google Ads'] },
  { title: '4 o más referidos confirmados', items: ['3 meses de mantenimiento', 'rediseño de una landing', 'o auditoría SEO con plan de acción'] },
];

export default function ReferralPage() {
  return (
    <>
      <SeoHead title="Programa de referidos" path="/referidos" description="Referí nuevos clientes a Pixvo.Tech y accedé a beneficios profesionales para tu negocio." />
      <section className="page-hero page-hero--center"><Container size="narrow"><span className="eyebrow">Programa de referidos</span><h1>Convertí tus contactos en beneficios reales</h1><p>Referí empresas o emprendedores que necesiten una web, Google Ads, automatización o desarrollo a medida y recibí trabajo profesional para tu propio negocio.</p><div className="button-row button-row--center"><Button href={siteConfig.whatsapp} target="_blank" rel="noreferrer" icon="arrow">Enviar un referido</Button><Button to="/contacto" variant="ghost">Usar el formulario</Button></div></Container></section>
      <section className="section"><Container><SectionHeader eyebrow="Cómo funciona" title="Tres pasos, sin complicaciones" /><div className="process-line">{steps.map((step, index) => <div key={step.number}><span style={{ '--step-color': ['#0a192f', '#ff5722', '#00bcd4'][index] }}>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div></Container></section>
      <section className="section section--muted"><Container><SectionHeader eyebrow="Beneficios" title="Elegí el aporte más útil para tu negocio" description="Los beneficios no se entregan en dinero ni como descuento: se aplican como servicios profesionales de Pixvo.Tech." /><div className="value-card-grid">{rewards.map((reward) => <article key={reward.title}><span className="icon-box"><Icon name="check" /></span><h3>{reward.title}</h3><ul className="check-list">{reward.items.map((item) => <li key={item}><Icon name="check" size={16} />{item}</li>)}</ul></article>)}</div></Container></section>
      <section className="section"><Container size="narrow"><SectionHeader align="left" eyebrow="Condiciones" title="Qué debe cumplirse" /><ul className="check-list"><li><Icon name="check" />El referido debe ser un cliente nuevo.</li><li><Icon name="check" />El beneficio se activa con un proyecto confirmado.</li><li><Icon name="check" />Aplica a servicios de desarrollo, marketing digital o software.</li><li><Icon name="check" />Pixvo.Tech puede validar la calidad y pertinencia del contacto.</li></ul></Container></section>
    </>
  );
}

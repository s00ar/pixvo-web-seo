import { Container } from '../components/common/Container';
import { Icon } from '../components/common/Icon';
import { SeoHead } from '../components/common/SeoHead';
import { ContactForm } from '../components/forms/ContactForm';
import { siteConfig } from '../data/siteConfig';

export default function ContactPage() {
  return (
    <>
      <SeoHead title="Contacto" path="/contacto" description="Contactá con Pixvo.Tech desde Italia o Argentina para conversar sobre desarrollo, marketing digital y automatización." />
      <section className="contact-page">
        <Container className="contact-layout">
          <aside>
            <span className="eyebrow eyebrow--light">Contacto</span>
            <h1>Hablemos de cómo hacer crecer tu negocio</h1>
            <p>Contanos qué querés mejorar. Podemos ayudarte con desarrollo web y mobile, campañas, SEO, inteligencia artificial e integraciones.</p>
            <div className="contact-methods">
              {siteConfig.emails.map((email) => (
                <a key={email} href={`mailto:${email}`}>
                  <span><Icon name="mail" /></span>
                  <div><small>Correo</small><strong>{email}</strong></div>
                </a>
              ))}
              {siteConfig.contacts.map((contact) => (
                <a key={contact.country} href={contact.whatsapp} target="_blank" rel="noreferrer">
                  <span><Icon name="phone" /></span>
                  <div><small>WhatsApp · {contact.country}</small><strong>{contact.phone}</strong></div>
                </a>
              ))}
              <div>
                <span><Icon name="location" /></span>
                <div><small>Modalidad</small><strong>{siteConfig.address}</strong></div>
              </div>
            </div>
            <div className="contact-note">
              <strong>Horario de atención</strong>
              <p>{siteConfig.officeHours.weekdays}<br />{siteConfig.officeHours.weekend}</p>
            </div>
          </aside>
          <ContactForm />
        </Container>
      </section>
    </>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { Container } from '../common/Container';
import { Logo } from '../common/Logo';
import { contactConfig, localPath, markets } from '../../data/growthSystem';
import { footerNavigationGroups, getNavigationItems, resolveNavigationUrl } from '../../data/navigation';

export function Footer() {
  const market = useLocation().pathname.match(/^\/(mx|ar|es)(?:\/|$)/)?.[1] || 'mx';
  const companyItems = getNavigationItems('footer-company');
  const legalItems = getNavigationItems('footer-legal');
  return <footer className="growth-footer"><Container><div className="growth-footer__grid">
    <div className="growth-footer__brand"><Logo footer /><p>SEO, automatización, inteligencia artificial con supervisión humana y analítica dentro de un mismo sistema de crecimiento para PyMEs.</p></div>
    <div><h2>Contacto</h2><a href={contactConfig.whatsappUrl} target="_blank" rel="noreferrer">WhatsApp: {contactConfig.whatsappPhone}</a>{contactConfig.phones.map((phone) => <a key={phone.href} href={phone.href}>{phone.label}: {phone.display}</a>)}</div>
    <div><h2>Empresa</h2>{companyItems.map((item) => <Link key={item.id} to={resolveNavigationUrl(item, market)}>{item.label}</Link>)}</div>
    {footerNavigationGroups.map((group) => <div key={group.id}><h2>{group.title}</h2>{getNavigationItems(group.placement).map((item) => <Link key={item.id} to={resolveNavigationUrl(item, market)}>{item.label}</Link>)}</div>)}
    <div><h2>Mercados y legal</h2>{Object.values(markets).map((item) => <Link key={item.code} to={localPath(item.code)}><span aria-hidden="true">{item.flag}</span> {item.name}</Link>)}{legalItems.map((item) => <Link key={item.id} to={resolveNavigationUrl(item, market)}>{item.label}</Link>)}</div>
  </div><div className="growth-footer__bottom">© {new Date().getFullYear()} Pixvo. Alcance y condiciones sujetos a validación comercial.</div></Container></footer>;
}

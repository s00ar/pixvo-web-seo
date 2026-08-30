import { Link } from 'react-router-dom';
import { resolveCommercialTarget } from '../../data/articleCommercial';
import { localPath, markets } from '../../data/growthSystem';
import { Container } from '../common/Container';

export function ArticleCommercialCta({ seo, market }) {
  const marketCodes = market ? [market] : Object.keys(markets);
  const primary = resolveCommercialTarget(seo.commercialTarget);
  const related = [...new Set(seo.relatedTargets || [])].map(resolveCommercialTarget).filter((item) => item.route !== primary.route);
  return <section className="section section--muted article-commercial-cta" data-commercial-cluster={seo.cluster}><Container size="narrow"><span className="eyebrow">Aplicación práctica</span><h2>¿Quieres aplicar esta estrategia en tu empresa?</h2><p>Consulta la capacidad comercial relacionada y sus condiciones para el mercado que corresponda. No realizamos georedirecciones automáticas.</p><h3>{primary.label}</h3><div className="hero-actions">{marketCodes.map((code) => <Link className="button button--secondary" key={code} to={localPath(code, primary.route)}>{markets[code].name}</Link>)}</div>{related.length > 0 && <div className="article-commercial-related"><h3>Capacidades relacionadas</h3><ul>{related.flatMap((target) => marketCodes.map((code) => <li key={`${target.route}-${code}`}><Link to={localPath(code, target.route)}>{target.anchor}{market ? '' : ` en ${markets[code].name}`}</Link></li>))}</ul></div>}{seo.projectSlug && <p><Link to={`/proyectos/${seo.projectSlug}/`}>Ver el proyecto técnico relacionado, separado de los casos de éxito</Link></p>}</Container></section>;
}

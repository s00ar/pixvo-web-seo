import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { SeoHead } from '../components/common/SeoHead';
import isotipo from '../assets/logos/pixvo-isotipo.png';

export default function NotFoundPage() {
  return <><SeoHead title="Página no encontrada" path="/404" robots="noindex,follow" /><section className="not-found"><Container size="narrow"><img src={isotipo} alt="Isotipo de Pixvo.Tech" width="423" height="422" /><span>404</span><h1>Esta ruta no lleva a ningún sitio</h1><p>La página puede haber cambiado o la dirección no es correcta. Puedes volver al selector internacional o consultar el sistema de crecimiento para México.</p><div className="button-row"><Button to="/">Volver al inicio</Button><Button to="/mx/sistema-crecimiento-digital/" variant="ghost">Ver el sistema</Button></div></Container></section></>;
}

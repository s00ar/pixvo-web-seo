import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { localPath, markets } from '../data/growthSystem';

export function CtaSection({ title = '¿Listo para llevar tu empresa al siguiente nivel digital?', description = 'Cuéntanos qué quieres mejorar y trazaremos contigo el siguiente paso más útil.', secondary = true, market }) {
  return (
    <section className="cta-section section">
      <Container>
        <div className="cta-panel">
          <span className="eyebrow eyebrow--light">Próximo paso</span>
          <h2>{title}</h2>
          <p>{description}</p>
          <div className="button-row">{market ? <><Button to={localPath(market, 'solicitar-diagnostico')} icon="arrow">Solicitar una consultoría</Button>{secondary && <Button to={localPath(market, 'sistema-crecimiento-digital')} variant="outline-light">Explorar servicios</Button>}</> : Object.values(markets).map((item) => <Button key={item.code} to={localPath(item.code, 'solicitar-diagnostico')} variant="outline-light">{item.name}</Button>)}</div>
        </div>
      </Container>
    </section>
  );
}

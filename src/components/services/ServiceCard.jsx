import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';

export function ServiceCard({ service }) {
  return (
    <Card className="service-card">
      <span className="icon-box"><Icon name={service.icon} /></span>
      <h3>{service.navLabel}</h3>
      <p>{service.description}</p>
      <ul className="mini-list">
        {service.scope.slice(0, 2).map((item) => <li key={item}><Icon name="check" size={13} />{item}</li>)}
      </ul>
      <Link className="text-link" to={`/servicios/${service.slug}`}>Saber más <Icon name="arrow" size={15} /></Link>
    </Card>
  );
}

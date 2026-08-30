import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Migas de pan">
      <ol>
        {items.map((item, index) => (
          <li key={item.label}>
            {index > 0 && <Icon name="chevron" size={14} />}
            {item.to && index !== items.length - 1 ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

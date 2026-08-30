import { Icon } from './Icon';

export function EmptyState({ title = 'No hay resultados', description = 'Prueba a cambiar la búsqueda o los filtros.' }) {
  return <div className="state"><Icon name="search" size={34} /><h2>{title}</h2><p>{description}</p></div>;
}

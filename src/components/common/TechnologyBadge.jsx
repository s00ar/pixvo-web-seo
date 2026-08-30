export function TechnologyBadge({ technology }) {
  return <span className="technology-badge"><span aria-hidden="true">{technology.short || technology.slice(0, 2)}</span>{technology.name || technology}</span>;
}

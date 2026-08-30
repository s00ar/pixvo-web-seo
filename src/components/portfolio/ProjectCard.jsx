import { Link } from 'react-router-dom';
import { Icon } from '../common/Icon';
import { SmartImage } from '../common/SmartImage';

export function ProjectCard({ project, dark = false }) {
  return (
    <article className={`project-card${dark ? ' project-card--dark' : ''}`}>
      <Link className="project-card__image" to={`/proyectos/${project.slug}`} aria-label={`Ver caso de estudio ${project.title}`}>
        <SmartImage src={project.image} alt={project.imageAlt} width="512" height="279" />
      </Link>
      <div className="project-card__body">
        <span className="eyebrow">{project.industry}</span>
        <h3><Link to={`/proyectos/${project.slug}`}>{project.title}</Link></h3>
        <p>{project.summary}</p>
        <div className="tag-list">{project.services.map((service) => <span key={service}>{service}</span>)}</div>
        <Link className="text-link" to={`/proyectos/${project.slug}`}>Ver caso <Icon name="arrow" size={15} /></Link>
      </div>
    </article>
  );
}

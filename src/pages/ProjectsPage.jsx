import { useState } from 'react';
import { Container } from '../components/common/Container';
import { EmptyState } from '../components/common/EmptyState';
import { SeoHead } from '../components/common/SeoHead';
import { ProjectCard } from '../components/portfolio/ProjectCard';
import { projects, projectFilters } from '../data/projects';
import { CtaSection } from '../sections/CtaSection';

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const filteredProjects = activeFilter === 'Todos' ? projects : projects.filter((project) => project.services.includes(activeFilter));

  return (
    <>
      <SeoHead title="Nuestros proyectos" path="/proyectos" description="Desarrollos, herramientas y productos de Pixvo.Tech para mejorar experiencias digitales y procesos de empresas y organizaciones." />
      <section className="page-hero page-hero--center"><Container size="narrow"><span className="eyebrow">Trabajo seleccionado</span><h1>Nuestros proyectos</h1><p>Explorá desarrollos, herramientas y productos creados por Pixvo.Tech con una mirada integral: diseño centrado en las personas, arquitectura sólida y tecnología sostenible.</p></Container></section>
      <section className="section section--first"><Container><div className="filter-bar" role="group" aria-label="Filtrar proyectos por servicio">{projectFilters.map((filter) => <button key={filter} className={activeFilter === filter ? 'is-active' : ''} type="button" onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter}>{filter}</button>)}</div><p className="result-count" aria-live="polite">{filteredProjects.length} {filteredProjects.length === 1 ? 'proyecto' : 'proyectos'}</p>{filteredProjects.length ? <div className="project-grid">{filteredProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div> : <EmptyState title="No hay proyectos con este filtro" />}</Container></section>
      <CtaSection title="¿Tu reto podría ser nuestro próximo caso?" description="Empecemos por entenderlo. Después decidiremos juntos la mejor forma de abordarlo." />
    </>
  );
}

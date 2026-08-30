import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingState } from '../components/common/LoadingState';
import { SiteLayout } from '../layouts/SiteLayout';
import { AboutGrowthPage, AuditPage, CasesPage, CaseStudyPage, ContactGrowthPage, LegacyRedirect, MarketHome, PlansPage, ProblemPage, ResourcePage, ResourcesIndex, RootMarketSelector, SolutionPage, SystemPage, ThankYouPage } from '../pages/growth/MarketPages';
import { legacyRedirects } from '../data/legacyRoutes';

const DiagnosisForm = lazy(() => import('../components/forms/DiagnosisForm'));
const BlogPage = lazy(() => import('../pages/BlogPage'));
const ArticlePage = lazy(() => import('../pages/ArticlePage'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage'));
const LegalPage = lazy(() => import('../pages/LegalPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export function AppRoutes() {
  return <Suspense fallback={<LoadingState label="Cargando Pixvo" />}><Routes><Route element={<SiteLayout />}>
    <Route index element={<RootMarketSelector />} />
    <Route path=":market" element={<MarketHome />} />
    <Route path=":market/sistema-crecimiento-digital" element={<SystemPage />} />
    <Route path=":market/planes" element={<PlansPage />} />
    <Route path=":market/auditoria-crecimiento-digital" element={<AuditPage />} />
    <Route path=":market/solicitar-diagnostico" element={<DiagnosisForm />} />
    <Route path=":market/gracias-diagnostico" element={<ThankYouPage />} />
    <Route path=":market/soluciones/:slug" element={<SolutionPage />} />
    <Route path=":market/problemas/:slug" element={<ProblemPage />} />
    <Route path=":market/recursos" element={<ResourcesIndex />} />
    <Route path=":market/recursos/:slug" element={<ResourcePage />} />
    <Route path=":market/nosotros" element={<AboutGrowthPage />} />
    <Route path=":market/contacto" element={<ContactGrowthPage />} />
    <Route path=":market/casos-de-exito" element={<CasesPage />} />
    <Route path=":market/casos-de-exito/:slug" element={<CaseStudyPage />} />
    <Route path="blog" element={<BlogPage />} />
    <Route path=":market/blog" element={<BlogPage />} />
    <Route path="blog/:slug" element={<ArticlePage />} />
    <Route path=":market/blog/:slug" element={<ArticlePage />} />
    {legacyRedirects.map(({ source, destination }) => <Route key={source} path={source.replace(/^\//, '').replace(/\/$/, '')} element={<LegacyRedirect to={destination} />} />)}
    <Route path="proyectos/:slug" element={<ProjectDetailPage />} />
    <Route path="legal/:slug" element={<LegalPage />} />
    <Route path="404" element={<NotFoundPage />} /><Route path="*" element={<NotFoundPage />} />
  </Route></Routes></Suspense>;
}

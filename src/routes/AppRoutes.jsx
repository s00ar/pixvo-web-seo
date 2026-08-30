import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingState } from '../components/common/LoadingState';
import { SiteLayout } from '../layouts/SiteLayout';
import { AboutGrowthPage, AuditPage, CasesPage, CaseStudyPage, ContactGrowthPage, LegacyRedirect, MarketHome, PlansPage, ProblemPage, ResourcePage, ResourcesIndex, RootMarketSelector, SolutionPage, SystemPage, ThankYouPage } from '../pages/growth/MarketPages';

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
    <Route path="mx/soluciones/c" element={<LegacyRedirect to="/mx/soluciones/optimizacion-de-conversion/" />} />
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
    <Route path="proyectos/microcuotas" element={<LegacyRedirect to="/mx/casos-de-exito/microcuotas/" />} />
    <Route path="proyectos/sanidad-web" element={<LegacyRedirect to="/mx/casos-de-exito/sanidad-web/" />} />
    <Route path="proyectos/paola-informa" element={<LegacyRedirect to="/mx/casos-de-exito/paola-informa/" />} />
    <Route path="proyectos/:slug" element={<ProjectDetailPage />} />
    <Route path="legal/:slug" element={<LegalPage />} /><Route path="politica-de-privacidad" element={<LegacyRedirect to="/legal/politica-de-privacidad/" />} />
    <Route path="servicios" element={<LegacyRedirect to="/mx/sistema-crecimiento-digital/" />} /><Route path="servicios/seo" element={<LegacyRedirect to="/mx/soluciones/seo-para-pymes/" />} /><Route path="servicios/automatizacion" element={<LegacyRedirect to="/mx/soluciones/automatizacion-de-procesos/" />} /><Route path="servicios/:slug" element={<LegacyRedirect to="/mx/sistema-crecimiento-digital/" />} />
    <Route path="nosotros" element={<LegacyRedirect to="/mx/nosotros/" />} /><Route path="contacto" element={<LegacyRedirect to="/mx/contacto/" />} /><Route path="proyectos" element={<LegacyRedirect to="/mx/casos-de-exito/" />} /><Route path="referidos" element={<LegacyRedirect to="/mx/solicitar-diagnostico/" />} />
    <Route path="404" element={<NotFoundPage />} /><Route path="*" element={<NotFoundPage />} />
  </Route></Routes></Suspense>;
}

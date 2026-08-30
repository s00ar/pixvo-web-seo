import { Outlet } from 'react-router-dom';
import { ScrollToTop } from '../components/common/ScrollToTop';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { AnalyticsObserver } from '../components/common/AnalyticsObserver';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export function SiteLayout() {
  return (
    <>
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <Header />
      <main id="main-content"><Outlet /></main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
      <AnalyticsObserver />
    </>
  );
}

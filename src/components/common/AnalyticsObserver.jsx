import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '../../utils/tracking';
import { markets } from '../../data/growthSystem';

export function AnalyticsObserver() {
  const location = useLocation();
  useEffect(() => {
    const market = location.pathname.match(/^\/(mx|ar|es)(?:\/|$)/)?.[1];
    if (market && /^\/(?:mx|ar|es)\/casos-de-exito\/[^/]+\/$/.test(location.pathname)) track('case_study_view', { country: market, currency: markets[market].currency, page_type: 'case_study' });
  }, [location.pathname]);
  useEffect(() => {
    const handler = (event) => {
      const anchor = event.target.closest('a'); if (!anchor) return;
      const market = location.pathname.match(/^\/(mx|ar|es)(?:\/|$)/)?.[1];
      const common = { country: market, currency: market ? markets[market].currency : undefined, page_type: location.pathname.includes('/recursos/') ? 'resource' : 'commercial' };
      if (anchor.classList.contains('nav-cta')) track('cta_click', { ...common, cta_location: 'header' });
      if (anchor.href.startsWith('mailto:')) { track('email_click', common); track('contact_click', { ...common, service: 'email' }); }
      else if (anchor.href.startsWith('tel:')) { track('phone_click', common); track('contact_click', { ...common, service: 'phone' }); }
      else if (/wa\.me|whatsapp\.com/.test(anchor.href)) { track('whatsapp_click', common); track('contact_click', { ...common, service: 'whatsapp' }); }
      else if (anchor.hasAttribute('download') || /\.pdf(?:$|\?)/i.test(anchor.href)) track('resource_download', common);
      else if (anchor.origin !== window.location.origin) track('outbound_click', common);
      else {
        const targetPath = new URL(anchor.href).pathname;
        if (/\/planes\/$/.test(targetPath)) track('plans_navigation', common);
        if (/\/(?:blog)\//.test(location.pathname) && /\/(?:soluciones|auditoria-crecimiento-digital|sistema-crecimiento-digital)\//.test(targetPath)) track('article_to_money_click', common);
      }
    };
    document.addEventListener('click', handler); return () => document.removeEventListener('click', handler);
  }, [location.pathname]);
  return null;
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const revealSelector = [
  '.section-header',
  '.service-card',
  '.project-card',
  '.article-card',
  '.testimonial-card',
  '.growth-card',
  '.plan-card',
  '.contact-option',
  '.metric-cards > div',
  '.process-cards > article',
  '.value-card-grid > article',
  '.case-preview',
  '.author-box',
  '.faq-list',
  '.contact-form',
  '.form-shell',
].join(',');

export function RevealObserver() {
  const location = useLocation();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) return undefined;

    document.documentElement.classList.add('motion-ready');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    const register = (root = document) => {
      root.querySelectorAll(revealSelector).forEach((element, index) => {
        element.classList.add('reveal', ['reveal--fade', 'reveal--slide', 'reveal--scale'][index % 3]);
        if (!element.classList.contains('is-visible')) observer.observe(element);
      });
    };

    register();
    const mutations = new MutationObserver(() => register());
    const main = document.querySelector('main');
    if (main) mutations.observe(main, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((element) => element.classList.add('is-visible'));
    };
  }, [location.pathname]);

  return null;
}

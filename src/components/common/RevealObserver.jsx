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

    let index = 0;
    const register = (root = document) => {
      root.querySelectorAll(revealSelector).forEach((element) => {
        if (!element.classList.contains('reveal')) {
          element.classList.add('reveal', ['reveal--fade', 'reveal--slide', 'reveal--scale'][index % 3]);
          index += 1;
          if (!element.classList.contains('is-visible')) observer.observe(element);
        }
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => register());
    } else {
      register();
    }

    let mutationTimeout;
    const mutations = new MutationObserver(() => {
      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(() => register(), 150);
    });
    const main = document.querySelector('main');
    if (main) mutations.observe(main, { childList: true, subtree: true });

    return () => {
      clearTimeout(mutationTimeout);
      mutations.disconnect();
      observer.disconnect();
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((element) => element.classList.add('is-visible'));
    };
  }, [location.pathname]);

  return null;
}

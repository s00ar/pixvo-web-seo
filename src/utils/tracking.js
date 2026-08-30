const allowed = ['country', 'currency', 'plan', 'page_type', 'cta_location', 'service', 'lead_problem', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
export function track(event, parameters = {}) {
  if (typeof window === 'undefined') return;
  const safe = Object.fromEntries(Object.entries(parameters).filter(([key, value]) => allowed.includes(key) && value != null && value !== ''));
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...safe });
}
export function getUtms(search = window.location.search) {
  const params = new URLSearchParams(search);
  return Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].map((key) => [key, params.get(key) || '']));
}

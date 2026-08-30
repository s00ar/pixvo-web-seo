const base = process.env.SITE_URL || 'https://pixvo.tech';

const indexResponse = await fetch(`${base}/sitemap_index.xml`);
const index = await indexResponse.text();
const maps = [...index.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const urlGroups = await Promise.all(maps.map(async (url) => {
  const response = await fetch(url);
  if (response.status !== 200) throw new Error(`Sitemap ${url} respondió ${response.status}.`);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}));
const urls = [...new Set(urlGroups.flat())];
const rows = [];

for (let index = 0; index < urls.length; index += 16) {
  rows.push(...await Promise.all(urls.slice(index, index + 16).map(async (url) => {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      const html = await response.text();
      const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1] || '';
      return {
        url,
        status: response.status,
        canonical,
        h1: (html.match(/<h1\b/g) || []).length,
        noindex: /name="robots" content="[^"]*noindex/i.test(html),
        prerender: html.includes('data-prerendered="true"'),
      };
    } catch (error) {
      return { url, status: 0, error: error.message };
    }
  })));
}

const failures = rows.filter((row) => row.status !== 200 || row.canonical !== row.url || row.h1 !== 1 || row.noindex || !row.prerender);
console.log(`Producción: sitemap index ${indexResponse.status}, ${maps.length} sitemaps, ${urls.length} URLs, ${rows.length - failures.length} correctas.`);
if (failures.length) {
  console.error(failures.slice(0, 20).map((row) => `${row.url}: status=${row.status}, canonical=${row.canonical}, h1=${row.h1}, noindex=${row.noindex}, prerender=${row.prerender}`).join('\n'));
  process.exit(1);
}

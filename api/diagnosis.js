const required = ['name', 'company', 'email', 'country', 'companyType', 'problem', 'channels', 'monthlyLeads', 'leadCapacity', 'budget', 'startDate', 'responsible', 'interest', 'consent'];
const allowedMarkets = ['mx', 'ar', 'es'];
const clean = (value, max = 250) => typeof value === 'string' ? value.trim().slice(0, max) : value;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body || body.website_confirm || Date.now() - Number(body.startedAt) < 2500) return res.status(400).json({ error: 'No se pudo validar la solicitud.' });
    if (!allowedMarkets.includes(body.market) || required.some((key) => !body[key] || (Array.isArray(body[key]) && !body[key].length))) return res.status(400).json({ error: 'Revisa los campos obligatorios.' });
    if (!/^\S+@\S+\.\S+$/.test(body.email) || clean(body.name).length < 2) return res.status(400).json({ error: 'Revisa el nombre y el correo.' });
    const payload = {
      source: 'pixvo_growth_system', submittedAt: new Date().toISOString(), market: body.market,
      contact: { name: clean(body.name, 100), company: clean(body.company, 150), email: clean(body.email, 200), website: clean(body.website, 300) },
      qualification: { companyType: clean(body.companyType), problem: clean(body.problem), channels: body.channels.slice(0, 10).map((x) => clean(x, 50)), monthlyLeads: clean(body.monthlyLeads), tools: clean(body.tools, 500), crm: clean(body.crm, 100), leadCapacity: clean(body.leadCapacity), budget: clean(body.budget), startDate: clean(body.startDate), responsible: clean(body.responsible), interest: clean(body.interest) },
      utms: Object.fromEntries(Object.entries(body.utms || {}).filter(([key]) => /^utm_(source|medium|campaign|content|term)$/.test(key)).map(([key, value]) => [key, clean(value, 150)])), consent: true,
      events: [{ name: 'form_submit' }, ...(body.interest === 'Auditoría' ? [{ name: 'audit_request' }] : [])],
      qualificationStatus: 'pending_private_evaluation',
    };
    const webhook = process.env.DIAGNOSIS_WEBHOOK_URL;
    if (!webhook) return res.status(503).json({ error: 'El canal de recepción todavía no está configurado.' });
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(process.env.DIAGNOSIS_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.DIAGNOSIS_WEBHOOK_TOKEN}` } : {}) }, body: JSON.stringify(payload), signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return res.status(502).json({ error: 'No se pudo entregar la solicitud. Inténtalo de nuevo más tarde.' });
    return res.status(202).json({ success: true });
  } catch { return res.status(400).json({ error: 'Solicitud no válida.' }); }
}

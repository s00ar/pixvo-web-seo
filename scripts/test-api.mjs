import assert from 'node:assert/strict';
import handler from '../api/diagnosis.js';

async function call(body, method = 'POST') {
  const output = { code: 200, body: null };
  const res = { status(code) { output.code = code; return this; }, json(value) { output.body = value; return this; } };
  await handler({ method, body }, res); return output;
}
assert.equal((await call({}, 'GET')).code, 405);
assert.equal((await call({ website_confirm: 'spam' })).code, 400);
const valid = { name: 'Ana', company: 'Empresa', email: 'ana@example.com', country: 'México', companyType: 'PyME B2B', problem: 'Falta de medición', channels: ['SEO'], monthlyLeads: '6–20', leadCapacity: 'Sí, actualmente', budget: 'Presupuesto aprobado', startDate: 'En 1–3 meses', responsible: 'Soy responsable de la decisión', interest: 'Pixvo Growth', consent: true, website_confirm: '', startedAt: Date.now() - 5000, market: 'mx', utms: {} };
assert.equal((await call(valid)).code, 503, 'Sin webhook no debe fingir un envío correcto');
assert.equal((await call({ ...valid, email: 'correo-invalido' })).code, 400);
console.log('API: método, antispam, validación y fallo seguro sin webhook validados.');

import { cloneElement, useState } from 'react';
import { serviceList } from '../../data/services';
import { submitContactForm } from '../../services/contactService';
import { Button } from '../common/Button';
import { ErrorState } from '../common/ErrorState';
import { Icon } from '../common/Icon';

const initialValues = {
  name: '', company: '', email: '', phone: '', country: '', service: '', budget: '', description: '', privacy: false,
};

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Escribe tu nombre.';
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Introduce un correo válido.';
  if (values.phone && !/^[+\d\s()-]{7,20}$/.test(values.phone)) errors.phone = 'Revisa el formato del teléfono.';
  if (!values.country) errors.country = 'Selecciona un país o región.';
  if (!values.service) errors.service = 'Selecciona un servicio.';
  if (!values.budget) errors.budget = 'Selecciona un presupuesto aproximado.';
  if (values.description.trim().length < 20) errors.description = 'Cuéntanos un poco más (mínimo 20 caracteres).';
  if (!values.privacy) errors.privacy = 'Debes aceptar la política de privacidad.';
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const updateValue = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'submitting') return;
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus('invalid');
      const firstInvalid = event.currentTarget.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`);
      firstInvalid?.focus();
      return;
    }
    setStatus('submitting');
    try {
      const result = await submitContactForm(values);
      setStatus(result.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return <div className="form-success" role="status"><span><Icon name="check" size={28} /></span><h2>Mensaje preparado correctamente</h2><p>El envío es una simulación local. Tus datos no se han enviado a ningún servidor.</p><Button variant="ghost" onClick={() => { setValues(initialValues); setStatus('idle'); }}>Enviar otra consulta</Button></div>;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading"><span className="eyebrow">Cuéntanos tu proyecto</span><h2>Empecemos por el contexto</h2><p>Los campos con * son obligatorios. Esta versión simula el envío y no almacena datos.</p></div>
      {status === 'error' && <ErrorState title="No se ha podido simular el envío" description="Revisa los datos o utiliza un correo que no contenga +error." />}
      {status === 'invalid' && <p className="form-alert" role="alert">Revisa los campos indicados.</p>}
      <div className="form-grid">
        <Field label="Nombre *" name="name" error={errors.name}><input id="name" name="name" type="text" autoComplete="name" value={values.name} onChange={updateValue} /></Field>
        <Field label="Empresa" name="company" error={errors.company}><input id="company" name="company" type="text" autoComplete="organization" value={values.company} onChange={updateValue} /></Field>
        <Field label="Correo electrónico *" name="email" error={errors.email}><input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={updateValue} /></Field>
        <Field label="Teléfono" name="phone" error={errors.phone}><input id="phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={updateValue} /></Field>
        <Field label="País o región *" name="country" error={errors.country}><select id="country" name="country" value={values.country} onChange={updateValue}><option value="">Selecciona una opción</option><option>España</option><option>Italia</option><option>Portugal</option><option>México</option><option>Argentina</option><option>Colombia</option><option>Otro</option></select></Field>
        <Field label="Servicio de interés *" name="service" error={errors.service}><select id="service" name="service" value={values.service} onChange={updateValue}><option value="">Selecciona un servicio</option>{serviceList.map((service) => <option key={service.slug} value={service.slug}>{service.navLabel}</option>)}</select></Field>
        <Field label="Presupuesto estimado *" name="budget" error={errors.budget} full><select id="budget" name="budget" value={values.budget} onChange={updateValue}><option value="">Selecciona un rango</option><option value="pending">Pendiente de definir</option><option value="under-5k">Hasta 5.000 €</option><option value="5k-15k">5.000 € – 15.000 €</option><option value="15k-40k">15.000 € – 40.000 €</option><option value="40k-plus">Más de 40.000 €</option></select></Field>
        <Field label="Descripción del proyecto *" name="description" error={errors.description} full><textarea id="description" name="description" rows="6" value={values.description} onChange={updateValue} placeholder="Punto de partida, objetivo, plazos y cualquier restricción relevante." /></Field>
      </div>
      <div className={`checkbox-field${errors.privacy ? ' has-error' : ''}`}><input id="privacy" name="privacy" type="checkbox" checked={values.privacy} onChange={updateValue} aria-invalid={Boolean(errors.privacy)} aria-describedby={errors.privacy ? 'privacy-error' : undefined} /><label htmlFor="privacy">He leído y acepto la <a href="/politica-de-privacidad">política de privacidad</a>. *</label>{errors.privacy && <small id="privacy-error">{errors.privacy}</small>}</div>
      <Button type="submit" disabled={status === 'submitting'} icon={status === 'submitting' ? undefined : 'arrow'}>{status === 'submitting' ? 'Enviando…' : 'Enviar solicitud'}</Button>
      <p className="form-note" aria-live="polite">{status === 'submitting' ? 'Simulando el envío. No cierres esta página.' : 'Respondemos lo antes posible dentro del horario de atención.'}</p>
    </form>
  );
}

function Field({ label, name, error, full = false, children }) {
  const control = cloneElement(children, {
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${name}-error` : undefined,
  });
  return (
    <div className={`field${error ? ' has-error' : ''}${full ? ' field--full' : ''}`}>
      <label htmlFor={name}>{label}</label>
      <div className="field__control">{control}</div>
      {error && <small id={`${name}-error`}>{error}</small>}
    </div>
  );
}

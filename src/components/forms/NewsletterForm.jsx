import { useState } from 'react';
import { Icon } from '../common/Icon';

export function NewsletterForm({ dark = false }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage('Introduce un correo válido.');
      return;
    }
    setMessage('Suscripción demostrativa registrada.');
    setEmail('');
  };

  return (
    <form className={`newsletter-form${dark ? ' newsletter-form--dark' : ''}`} onSubmit={handleSubmit} noValidate>
      <label htmlFor={`newsletter-email-${dark ? 'dark' : 'light'}`}>Correo electrónico</label>
      <div>
        <input id={`newsletter-email-${dark ? 'dark' : 'light'}`} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@empresa.com" aria-describedby={`newsletter-message-${dark ? 'dark' : 'light'}`} />
        <button type="submit" aria-label="Suscribirse"><Icon name="arrow" /></button>
      </div>
      <small id={`newsletter-message-${dark ? 'dark' : 'light'}`} aria-live="polite">{message || 'Sin spam. Solo ideas útiles y la opción de darte de baja.'}</small>
    </form>
  );
}

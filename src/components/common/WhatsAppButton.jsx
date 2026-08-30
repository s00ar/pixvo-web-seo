import { contactConfig } from '../../data/growthSystem';

export function WhatsAppButton() {
  return <a className="whatsapp-float" href={contactConfig.whatsappUrl} target="_blank" rel="noreferrer" aria-label={`Contactar con Pixvo por WhatsApp al ${contactConfig.whatsappPhone}`}><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3a12 12 0 0 0-10.3 18.2L4 28l7-1.6A12 12 0 1 0 16 3Zm0 21.7a9.6 9.6 0 0 1-4.9-1.3l-.5-.3-3.4.8.9-3.3-.3-.5A9.7 9.7 0 1 1 16 24.7Zm5.3-7.2c-.3-.2-1.7-.9-2-.9-.3-.1-.5-.2-.7.2l-1 1.2c-.2.3-.4.3-.7.1-1.8-.9-3-1.7-4.2-3.8-.3-.5.3-.5.9-1.7.1-.2.1-.4 0-.6l-.9-2.2c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.3 1.3-1.3 3.2s1.4 3.7 1.6 4c.2.2 2.7 4.2 6.7 5.7 2.5 1.1 3.5 1.2 4.8 1 .8-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3Z"/></svg><span>WhatsApp</span></a>;
}

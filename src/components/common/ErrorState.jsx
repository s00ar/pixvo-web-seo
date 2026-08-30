import { Button } from './Button';

export function ErrorState({ title = 'No hemos podido cargar el contenido', description = 'Vuelve a intentarlo o regresa al inicio.' }) {
  return <div className="state" role="alert"><span className="state__symbol">!</span><h2>{title}</h2><p>{description}</p><Button to="/" variant="ghost">Volver al inicio</Button></div>;
}

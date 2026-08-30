import isotipo from '../../assets/logos/pixvo-isotipo.png';

export function LoadingState({ label = 'Cargando contenido' }) {
  return <div className="state state--loading" role="status"><img src={isotipo} alt="" width="56" height="56" /><span>{label}</span></div>;
}

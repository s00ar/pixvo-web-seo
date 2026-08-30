import { Link } from 'react-router-dom';
import logo from '../../assets/logos/pixvo-logo.png';

export function Logo({ footer = false }) {
  return (
    <Link className={`brand-logo${footer ? ' brand-logo--footer' : ''}`} to="/" aria-label="Pixvo.Tech, ir al inicio">
      <img src={logo} width="150" height="150" alt="" />
      <span>Pixvo.Tech</span>
    </Link>
  );
}

import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Container } from '../common/Container';
import { Logo } from '../common/Logo';
import { localPath, markets } from '../../data/growthSystem';
import { getNavigationItem, getNavigationItems, resolveNavigationUrl } from '../../data/navigation';
import { track } from '../../utils/tracking';

export function Header() {
  const location = useLocation(); const market = location.pathname.match(/^\/(mx|ar|es)(?:\/|$)/)?.[1]; const active = market || 'mx'; const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [location.pathname]);
  const routePath = market ? location.pathname.replace(/^\/(mx|ar|es)\/?/, '').replace(/\/$/, '') : '';
  const headerItems = getNavigationItems('header');
  const diagnosisItem = getNavigationItem('diagnosis');
  return <header className="growth-header"><Container className="growth-header__inner"><Logo /><button className="growth-menu" type="button" aria-expanded={open} aria-controls="growth-navigation" onClick={() => setOpen(!open)}>{open ? 'Cerrar' : 'Menú'}</button><nav id="growth-navigation" className={open ? 'is-open' : ''} aria-label="Navegación principal">{market && headerItems.map((item) => <NavLink key={item.id} to={resolveNavigationUrl(item, active)}>{item.label}</NavLink>)}<label className="country-select"><span className="sr-only">Cambiar país</span><select value={market || ''} onChange={(e) => { const next = e.target.value; track('country_select', { country: next, currency: markets[next].currency }); window.location.assign(localPath(next, routePath)); }}><option value="" disabled>País</option>{Object.values(markets).map((item) => <option value={item.code} key={item.code}>{item.name}</option>)}</select></label>{market && <Link className="button button--primary nav-cta" to={resolveNavigationUrl(diagnosisItem, active)}>{diagnosisItem.label}</Link>}</nav></Container></header>;
}

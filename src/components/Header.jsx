import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(10px)', background: 'rgba(11,15,20,0.65)' }}>
      <div className="topbar-inner">
        <div className="brand">
          <img src="/assets/blogo.png" alt="Holoptic logo" />
        </div>

        <nav>
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            {t('navHome')}
          </Link>
          <Link to="/pricing" className={isActive('/pricing') ? 'active' : ''}>
            {t('navPricing')}
          </Link>
          <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
            {t('navContact')}
          </Link>
          <Link to="/contact" className="btn primary">
            {t('navQuote')}
          </Link>

          <div className="lang" aria-label="Language switcher">
            <label htmlFor="langSelect">{t('langLabel')}</label>
            <select id="langSelect" value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="en">EN</option>
              <option value="hu">HU</option>
              <option value="sv">SV</option>
              <option value="de">DE</option>
              <option value="fr">FR</option>
              <option value="it">IT</option>
            </select>
          </div>
        </nav>
      </div>
    </div>
  );
}

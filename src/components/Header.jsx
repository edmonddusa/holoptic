import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hu', label: 'HU' },
    { code: 'sv', label: 'SV' },
    { code: 'de', label: 'DE' },
    { code: 'fr', label: 'FR' },
    { code: 'it', label: 'IT' },
    { code: 'es', label: 'ES' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (code) => {
    setLang(code);
    setIsOpen(false);
  };

  return (
    <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(10px)', background: 'rgba(11,15,20,0.65)' }}>
      <div className="topbar-inner">
        <div className="brand">
          <img src="/assets/logo.png" alt="Holoptic logo" />
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

          <div 
            ref={dropdownRef}
            className="lang" 
            aria-label="Language switcher"
            onClick={() => setIsOpen(!isOpen)}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <label style={{ cursor: 'pointer', userSelect: 'none' }}>{t('langLabel')}</label>
            <span style={{ fontWeight: 500 }}>{lang.toUpperCase()}</span>
            
            {isOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'rgba(11,15,20,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '8px',
                minWidth: '80px',
                boxShadow: 'var(--shadow)',
                zIndex: 100
              }}>
                {languages.map((l) => (
                  <div
                    key={l.code}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageSelect(l.code);
                    }}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      background: lang === l.code ? 'rgba(255,255,255,0.1)' : 'transparent',
                      color: lang === l.code ? 'var(--text)' : 'var(--muted)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (lang !== l.code) {
                        e.target.style.background = 'rgba(255,255,255,0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (lang !== l.code) {
                        e.target.style.background = 'transparent';
                      }
                    }}
                  >
                    {l.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

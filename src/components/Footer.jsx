import { useI18n } from '../context/I18nContext';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer style={{ 
      flexShrink: 0, 
      padding: '12px 0', 
      borderTop: '1px solid var(--border)',
      backdropFilter: 'blur(10px)',
      background: 'rgba(11,15,20,0.65)'
    }}>
      <div className="container" style={{ padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--muted)' }}>
          <div>© {year} {t('footerLeft')}</div>
          <div style={{ marginRight: '12px' }}>
            <a 
              onClick={scrollToTop} 
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              {t('backToTop')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

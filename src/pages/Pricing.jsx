import { useI18n } from '../context/I18nContext';

export default function Pricing() {
  const { t } = useI18n();

  return (
    <main className="container">
      <section className="section" id="top">
        <h1 className="headline" style={{ fontSize: '44px' }}>{t('pricingTitle')}</h1>
        <p className="section-lead">{t('pricingLead')}</p>

        <div className="grid-2">
          <div className="card">
            <h3>{t('pricingP1Title')}</h3>
            <p>{t('pricingP1Lead')}</p>
            <ul className="list">
              <li>{t('pricingP1L1')}</li>
              <li>{t('pricingP1L2')}</li>
              <li>{t('pricingP1L3')}</li>
              <li>{t('pricingP1L4')}</li>
              <li>{t('pricingP1L5')}</li>
            </ul>
            <div style={{ marginTop: '14px' }}>
              <a className="btn primary" href="/contact">{t('navQuote')}</a>
            </div>
          </div>

          <div className="card">
            <h3>{t('pricingP2Title')}</h3>
            <p>{t('pricingP2Lead')}</p>
            <ul className="list">
              <li>{t('pricingP2L1')}</li>
              <li>{t('pricingP2L2')}</li>
              <li>{t('pricingP2L3')}</li>
              <li>{t('pricingP2L4')}</li>
            </ul>
            <div style={{ marginTop: '14px' }}>
              <a className="btn" href="/#models">{t('modelsTitle')}</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

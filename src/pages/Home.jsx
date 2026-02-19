import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';

export default function Home() {
  const { t } = useI18n();

  return (
    <main className="container">
      <header className="hero" id="top">
        <div className="hero-grid">
          <div>
            <div className="pill-row">
              <div className="pill">{t('heroPill1')}</div>
              <div className="pill">{t('heroPill2')}</div>
              <div className="pill">{t('heroPill3')}</div>
              <div className="pill">{t('heroPill4')}</div>
            </div>

            <h1 className="headline">{t('homeTitle')}</h1>
            <p className="subhead">{t('homeLead')}</p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '22px 0 6px' }}>
              <Link to="/contact" className="btn primary">{t('homeCta1')}</Link>
              <Link to="/pricing" className="btn">{t('homeCta2')}</Link>
            </div>
            <p className="subhead" style={{ fontSize: '12px', marginTop: '10px' }}>
              {t('homeNote')}
            </p>
          </div>

          <aside className="card" aria-label="Hardware package">
            <h3>{t('homeCardTitle')}</h3>
            <ul className="spec">
              <li>{t('homeSpec1')}</li>
              <li>{t('homeSpec2')}</li>
              <li>{t('homeSpec3')}</li>
              <li>{t('homeSpec4')}</li>
            </ul>

            <div className="price">
              <strong>~€3,000</strong>
              <span>{t('homePriceHw')}</span>
            </div>
            <div className="price">
              <strong>+€600</strong>
              <span>{t('homePriceSetup')}</span>
            </div>
            <p className="subhead" style={{ fontSize: '12px', marginTop: '10px' }}>
              {t('homeCardFoot')}
            </p>
          </aside>
        </div>
      </header>

      <section className="section" id="why">
        <h2 className="section-title">{t('whyTitle')}</h2>
        <p className="section-lead">{t('whyLead')}</p>

        <div className="grid-3">
          <div className="card">
            <h4>{t('whyC1Title')}</h4>
            <p>{t('whyC1Body')}</p>
          </div>
          <div className="card">
            <h4>{t('whyC2Title')}</h4>
            <p>{t('whyC2Body')}</p>
          </div>
          <div className="card">
            <h4>{t('whyC3Title')}</h4>
            <p>{t('whyC3Body')}</p>
          </div>
        </div>
      </section>

      <section className="section" id="models">
        <h2 className="section-title">{t('modelsTitle')}</h2>
        <p className="section-lead">{t('modelsLead')}</p>

        <div className="grid-3">
          <div className="card">
            <h4>{t('modelsC1Title')}</h4>
            <p>{t('modelsC1Body')}</p>
            <ul className="list">
              <li>DeepSeek Coder (family)</li>
              <li>Qwen2.5 Coder (family)</li>
              <li>Llama code tuned variants</li>
            </ul>
          </div>

          <div className="card">
            <h4>{t('modelsC2Title')}</h4>
            <p>{t('modelsC2Body')}</p>
            <ul className="list">
              <li>Llama 3 (family)</li>
              <li>Qwen2.5 (family)</li>
              <li>Mistral or Mixtral (family)</li>
            </ul>
          </div>

          <div className="card">
            <h4>{t('modelsC3Title')}</h4>
            <p>{t('modelsC3Body')}</p>
            <ul className="list">
              <li>Local embeddings</li>
              <li>Vector search</li>
              <li>Role based access</li>
            </ul>
          </div>
        </div>

        <p className="subhead" style={{ fontSize: '12px', marginTop: '12px' }}>
          {t('modelsNote')}
        </p>
      </section>
    </main>
  );
}

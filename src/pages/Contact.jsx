import { useState } from 'react';
import { useI18n } from '../context/I18nContext';

export default function Contact() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);

      setSubmitted(true);
      form.reset();
    } catch (err) {
      console.error(err);
      alert('Sorry—something went wrong sending the form. Please try again or email us directly.');
    }
  };

  return (
    <main className="container">
      <section className="section" id="top">
        <h1 className="headline" style={{ fontSize: '44px' }}>{t('contactTitle')}</h1>
        <p className="section-lead">{t('contactLead')}</p>

        <div className="card">
          <form id="leadForm" action="https://formspree.io/f/maqdeebp" method="POST" onSubmit={handleSubmit}>
            <div>
              <input name="name" required placeholder={t('formName')} />
            </div>
            <div>
              <input name="company" placeholder={t('formCompany')} />
            </div>
            <div>
              <input name="email" type="email" required placeholder={t('formEmail')} />
            </div>
            <div>
              <input name="phone" placeholder={t('formPhone')} />
            </div>
            <div className="full">
              <textarea name="message" placeholder={t('formMsg')}></textarea>
            </div>
            <div className="full form-actions">
              <button className="btn primary" type="submit">{t('formSend')}</button>
              <a
                className="btn"
                href="mailto:eddie@holoptic.org?subject=Local%20AI%20Inquiry"
              >
                {t('formEmailDirect')}
              </a>
            </div>
          </form>

          {submitted && (
            <div className="card" style={{ marginTop: '12px' }}>
              <h4>{t('formThanksTitle')}</h4>
              <p>{t('formThanksBody')}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

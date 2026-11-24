import { Link } from "react-router-dom";
import WaveField from "../components/WaveField";
import { Lines, useI18n } from "../i18n/I18n";

const COMPANIES = ["SAP", "Jaguar Land Rover", "Nasdaq"];

export default function About() {
  const { d, lp } = useI18n();
  const t = d.about;
  return (
    <>
      <section className="page-hero about-hero">
        <div className="container">
          <p className="kicker">{t.kicker}</p>
          <h1>
            <Lines lines={t.title} emLast />
          </h1>
          <p>{t.lead}</p>
        </div>
      </section>

      <section className="section section-light">
        <div className="container about-grid">
          <div>
            <p className="kicker">{t.whoKicker}</p>
            <h2>
              <Lines lines={t.whoTitle} />
            </h2>
          </div>

          <div>
            {t.whoText.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="container about-facts">
          {t.facts.map((fact) => (
            <div className="about-fact" key={fact.value}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-dark about-principles">
        <WaveField className="about-principles-wave" tone="dark" />
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="kicker">{t.principlesKicker}</p>
              <h2>
                <Lines lines={t.principlesTitle} emLast />
              </h2>
            </div>
            <p>{t.principlesLead}</p>
          </div>

          <div className="service-grid">
            {t.principles.map((principle, i) => (
              <article className="service-card" key={principle.title}>
                <div className="service-number">0{i + 1}</div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container about-grid">
          <div>
            <p className="kicker">{t.enterpriseKicker}</p>
            <h2>
              <Lines lines={t.enterpriseTitle} />
            </h2>
          </div>

          <div>
            {t.enterpriseText.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="container">
          <div className="about-companies">
            {COMPANIES.map((name, i) => (
              <div className="about-company" key={name}>
                <strong>{name}</strong>
                <span>{t.sectors[i]}</span>
              </div>
            ))}
          </div>
          <p className="about-companies-note">{t.companiesNote}</p>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <p className="kicker">{t.ctaKicker}</p>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaText}</p>
          </div>

          <Link className="button button-gold" to={lp("/contact")}>
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}

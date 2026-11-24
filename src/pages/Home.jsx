import { Link } from "react-router-dom";
import { Lines, useI18n } from "../i18n/I18n";
import EnterpriseExperience from "../components/EnterpriseExperience";
import WaveField from "../components/WaveField";
import EmblemParticles from "../components/EmblemParticles";

// Which Expertise section each "What we do" card links to.
const SERVICE_SLUGS = ["cloud", "databases", "software", "private-ai"];

// Feeds the cursor position to the card's CSS spotlight.
function trackPointer(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function Home() {
  const { d, lp } = useI18n();
  const t = d.home;
  return (
    <>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-content">
          <div className="eyebrow">
            <span className="eyebrow-line" /> {t.eyebrow}
          </div>
          <h1>
            <Lines lines={t.title} emLast />
          </h1>
          <p className="hero-lead">{t.lead}</p>
          <div className="hero-actions">
            <Link className="button button-gold" to={lp("/expertise")}>
              {t.ctaExpertise} <span>↗</span>
            </Link>
            <Link className="button button-outline" to={lp("/contact")}>
              {t.ctaContact} <span>→</span>
            </Link>
          </div>
          <div className="hero-foot">
            {t.foot.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        </div>
        <div className="hero-ornament" aria-hidden="true">
          H
        </div>
      </section>
      <section className="section section-light section-wave">
        <WaveField className="section-wave-canvas" tone="light" />
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="kicker">{t.whatKicker}</p>
              <h2>
                <Lines lines={t.whatTitle} />
              </h2>
            </div>
            <p>{t.whatLead}</p>
          </div>
          <div className="service-grid">
            {t.services.map((s, i) => (
              <Link
                className="service-card"
                key={SERVICE_SLUGS[i]}
                to={lp(`/expertise#${SERVICE_SLUGS[i]}`)}
                onPointerMove={trackPointer}
              >
                <div className="service-number">
                  0{i + 1} <span>↗</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="service-tech">{s.tech}</div>
              </Link>
            ))}
          </div>
          <div className="section-link">
            <Link to={lp("/expertise")}>
              {t.viewAll} <span>→</span>
            </Link>
          </div>
        </div>
      </section>
      <EnterpriseExperience />
      <section className="section section-dark">
        <div className="container statement">
          <div>
            <p className="kicker">{t.approachKicker}</p>
            <h2>
              <Lines lines={t.approachTitle} emLast />
            </h2>
          </div>
          <div>
            <p>{t.approachText}</p>
            <ul className="principles">
              {t.principles.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link className="text-link" to={lp("/about")}>
              {t.moreAbout}
            </Link>
          </div>
        </div>
      </section>
      <section className="section section-light">
        <div className="container ai-feature">
          <div>
            <p className="kicker">{t.aiKicker}</p>
            <h2>
              <Lines lines={t.aiTitle} />
            </h2>
            <p>{t.aiText}</p>
            <a className="button button-dark" href="https://ai.holoptic.org/">
              {t.aiCta}
            </a>
          </div>
          <div className="ai-visual" aria-hidden="true">
            <span>{t.aiVisual[0]}</span>
            <EmblemParticles className="ai-emblem" />
            <span>{t.aiVisual[1]}</span>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <p className="kicker">{t.ctaKicker}</p>
            <h2>{t.ctaTitle}</h2>
          </div>
          <Link className="button button-gold" to={lp("/contact")}>
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}

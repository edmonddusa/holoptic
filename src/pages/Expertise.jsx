import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Lines, useI18n } from "../i18n/I18n";

// Section anchors, in page order (Home cards link to these).
const ids = ["cloud", "databases", "software", "private-ai"];

// The section being read: the last one whose top has passed just below the
// sticky header. At the very bottom of the page, the last section wins.
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 180) current = id;
      }
      setActive(atBottom ? ids[ids.length - 1] : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);
  return active;
}

export default function Expertise() {
  const location = useLocation();
  const arrivedAt = location.hash.slice(1);
  const active = useActiveSection(ids);
  const { d, lp } = useI18n();
  const t = d.expertise;
  const groups = t.groups.map((group, i) => ({ ...group, id: ids[i] }));

  return (
    <>
      <section className="page-hero expertise-hero">
        <div className="container">
          <p className="kicker">{t.kicker}</p>
          <h1>
            <Lines lines={t.title} emLast />
          </h1>
          <p>{t.lead}</p>
        </div>
      </section>
      <section className="section section-light">
        <div className="container expertise-layout">
          <nav className="expertise-index-nav" aria-label={t.indexLabel}>
            {groups.map((group, i) => (
              <Link
                key={group.id}
                to={`#${group.id}`}
                className={group.id === active ? "is-active" : undefined}
                aria-current={group.id === active ? "true" : undefined}
              >
                <span>0{i + 1}</span>
                {group.short}
              </Link>
            ))}
          </nav>
          <div className="expertise-list">
            {groups.map((group, i) => (
              <article
                className={`expertise-item${group.id === arrivedAt ? " is-arrived" : ""}`}
                id={group.id}
                // A new key restarts the arrival highlight on every visit.
                key={
                  group.id === arrivedAt
                    ? `${group.id}-${location.key}`
                    : group.id
                }
              >
                <span className="expertise-index">0{i + 1}</span>
                <div>
                  <h2>{group.title}</h2>
                  <p>{group.desc}</p>
                  <ul className="tech-tags" aria-label={t.techLabel}>
                    {group.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
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

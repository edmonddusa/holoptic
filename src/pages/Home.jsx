import { Link } from "react-router-dom";
import EnterpriseExperience from "../components/EnterpriseExperience";
import WaveField from "../components/WaveField";

const services = [
  {
    n: "01",
    slug: "cloud",
    title: "Cloud & Infrastructure",
    desc: "Cloud architecture, migrations, infrastructure as code, container platforms, and reliable delivery pipelines.",
    tech: "AWS · Terraform · Kubernetes · CI/CD",
  },
  {
    n: "02",
    slug: "databases",
    title: "Database Engineering",
    desc: "Performance, resilience, observability, and hands-on operational expertise for business-critical data systems.",
    tech: "PostgreSQL · Cassandra · MySQL · DynamoDB",
  },
  {
    n: "03",
    slug: "software",
    title: "Software Engineering",
    desc: "Well-architected applications, robust backend services, modern interfaces, and maintainable integrations.",
    tech: "Java · Kotlin · Node.js · React · TypeScript",
  },
  {
    n: "04",
    slug: "private-ai",
    title: "Private AI Systems",
    desc: "On-premises inference, privacy-conscious AI deployment, and practical integration into existing workflows.",
    tech: "Local inference · Linux · Data sovereignty",
  },
];
// Feeds the cursor position to the card's CSS spotlight.
function trackPointer(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-content">
          <div className="eyebrow">
            <span className="eyebrow-line" /> INDEPENDENT EUROPEAN ENGINEERING
          </div>
          <h1>
            Engineering
            <br />
            <em>built to endure.</em>
          </h1>
          <p className="hero-lead">
            We design, modernize, and maintain the systems businesses depend on
            — from cloud infrastructure and critical databases to modern
            software and private AI.
          </p>
          <div className="hero-actions">
            <Link className="button button-gold" to="/expertise">
              Explore our expertise <span>↗</span>
            </Link>
            <Link className="button button-outline" to="/contact">
              Discuss a project <span>→</span>
            </Link>
          </div>
          <div className="hero-foot">
            <span>25+ YEARS OF ENGINEERING EXPERIENCE</span>
            <span>BASED IN EUROPE · WORKING INTERNATIONALLY</span>
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
              <p className="kicker">WHAT WE DO</p>
              <h2>
                Deep expertise.
                <br />
                Practical outcomes.
              </h2>
            </div>
            <p>
              Complex systems require more than fashionable tools. We bring
              experienced engineering judgment to architecture, delivery,
              performance, and long-term operation.
            </p>
          </div>
          <div className="service-grid">
            {services.map((s) => (
              <Link
                className="service-card"
                key={s.n}
                to={`/expertise#${s.slug}`}
                onPointerMove={trackPointer}
              >
                <div className="service-number">
                  {s.n} <span>↗</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="service-tech">{s.tech}</div>
              </Link>
            ))}
          </div>
          <div className="section-link">
            <Link to="/expertise">
              View all capabilities <span>→</span>
            </Link>
          </div>
        </div>
      </section>
      <EnterpriseExperience />
      <section className="section section-dark">
        <div className="container statement">
          <div>
            <p className="kicker">OUR APPROACH</p>
            <h2>
              Architecture matters.
              <br />
              <em>Execution matters more.</em>
            </h2>
          </div>
          <div>
            <p>
              From first design decisions to production incidents, our focus is
              on systems that remain understandable, secure, and operational
              long after launch.
            </p>
            <ul className="principles">
              <li>Engineering-led decisions</li>
              <li>Production-minded delivery</li>
              <li>Long-term maintainability</li>
            </ul>
            <Link className="text-link" to="/about">
              More about Holoptic →
            </Link>
          </div>
        </div>
      </section>
      <section className="section section-light">
        <div className="container ai-feature">
          <div>
            <p className="kicker">SPECIALIST CAPABILITY</p>
            <h2>
              Private AI.
              <br />
              On your terms.
            </h2>
            <p>
              Explore secure, locally deployed AI infrastructure designed for
              organizations that value control over their data and systems.
            </p>
            <a className="button button-dark" href="https://ai.holoptic.org/">
              Explore Holoptic AI ↗
            </a>
          </div>
          <div className="ai-visual" aria-hidden="true">
            <span>PRIVATE</span>
            <div className="ai-core">◇</div>
            <span>BY DESIGN</span>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <p className="kicker">LET'S BUILD SOMETHING RELIABLE</p>
            <h2>Have a difficult engineering challenge?</h2>
          </div>
          <Link className="button button-gold" to="/contact">
            Start a conversation →
          </Link>
        </div>
      </section>
    </>
  );
}

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const groups = [
  {
    id: "cloud",
    title: "Cloud & Infrastructure",
    short: "Cloud & Infrastructure",
    desc: "Cloud migration and modernization, AWS architecture, Terraform, Kubernetes, Docker, delivery automation, observability, and operational resilience.",
    stack: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "GitHub Actions", "GitLab CI/CD"],
  },
  {
    id: "databases",
    title: "Database Engineering",
    short: "Database Engineering",
    desc: "Database design, production troubleshooting, incident resolution, monitoring, administration, configuration, and performance optimization.",
    stack: ["PostgreSQL", "Cassandra", "MySQL", "DynamoDB", "SQL"],
  },
  {
    id: "software",
    title: "Software Engineering",
    short: "Software Engineering",
    desc: "Backend services, APIs, distributed systems, frontend applications, integration engineering, testing, and maintainable software architecture.",
    stack: ["Java", "Kotlin", "Node.js", "React", "TypeScript", "REST APIs"],
  },
  {
    id: "private-ai",
    title: "Private AI Infrastructure",
    short: "Private AI",
    desc: "Local AI deployments, secure Linux environments, inference infrastructure, private knowledge workflows, and system integration.",
    stack: ["On-premises AI", "Linux", "Private inference", "Data control"],
  },
];

// The section being read: the last one whose top has passed just below the
// sticky header. At the very bottom of the page, the last section wins.
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
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

const ids = groups.map((group) => group.id);

export default function Expertise() {
  const location = useLocation();
  const arrivedAt = location.hash.slice(1);
  const active = useActiveSection(ids);

  return (
    <>
      <section className="page-hero expertise-hero">
        <div className="container">
          <p className="kicker">OUR EXPERTISE</p>
          <h1>
            Engineering across
            <br />
            <em>the entire stack.</em>
          </h1>
          <p>
            Specialist capabilities, grounded in decades of hands-on software
            and infrastructure work.
          </p>
        </div>
      </section>
      <section className="section section-light">
        <div className="container expertise-layout">
          <nav className="expertise-index-nav" aria-label="Expertise areas">
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
                key={group.id === arrivedAt ? `${group.id}-${location.key}` : group.id}
              >
                <span className="expertise-index">0{i + 1}</span>
                <div>
                  <h2>{group.title}</h2>
                  <p>{group.desc}</p>
                  <ul className="tech-tags" aria-label="Technologies">
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
            <p className="kicker">WORK WITH HOLOPTIC</p>
            <h2>Need an experienced engineering partner?</h2>
            <p>
              Tell us about the system you need designed, modernized, or kept
              running.
            </p>
          </div>
          <Link className="button button-gold" to="/contact">
            Get in touch →
          </Link>
        </div>
      </section>
    </>
  );
}

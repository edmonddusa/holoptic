import { Link } from "react-router-dom";
const groups = [
  [
    "Cloud & Infrastructure",
    "Cloud migration and modernization, AWS architecture, Terraform, Kubernetes, Docker, delivery automation, observability, and operational resilience.",
    "AWS · Azure · GCP · Terraform · Kubernetes · GitHub Actions · GitLab CI/CD",
  ],
  [
    "Database Engineering",
    "Database design, production troubleshooting, incident resolution, monitoring, administration, configuration, and performance optimization.",
    "PostgreSQL · Cassandra · MySQL · DynamoDB · SQL",
  ],
  [
    "Software Engineering",
    "Backend services, APIs, distributed systems, frontend applications, integration engineering, testing, and maintainable software architecture.",
    "Java · Kotlin · Node.js · React · TypeScript · REST APIs",
  ],
  [
    "Private AI Infrastructure",
    "Local AI deployments, secure Linux environments, inference infrastructure, private knowledge workflows, and system integration.",
    "On-premises AI · Linux · Private inference · Data control",
  ],
];
export default function Expertise() {
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
        <div className="container expertise-list">
          {groups.map(([title, desc, stack], i) => (
            <article className="expertise-item" key={title}>
              <span className="expertise-index">0{i + 1}</span>
              <div>
                <h2>{title}</h2>
                <p>{desc}</p>
                <div className="service-tech">{stack}</div>
              </div>
            </article>
          ))}
          <div className="page-cta">
            <h2>Need an experienced engineering partner?</h2>
            <Link className="button button-dark" to="/contact">
              Get in touch →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

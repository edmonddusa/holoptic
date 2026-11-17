import { Link } from "react-router-dom";

const principles = [
  {
    number: "01",
    title: "Engineering judgment",
    description:
      "Technology choices should follow real requirements, not trends. We favor proven architectures, clear trade-offs, and solutions appropriate to the problem.",
  },
  {
    number: "02",
    title: "Production responsibility",
    description:
      "Engineering does not end at deployment. Performance, security, observability, and operational resilience are part of the design from the beginning.",
  },
  {
    number: "03",
    title: "Long-term thinking",
    description:
      "Maintainable systems are built through deliberate decisions. We value clarity, simplicity, and the ability to evolve without unnecessary complexity.",
  },
];

export default function About() {
  return (
    <>
      <section className="page-hero about-hero">
        <div className="container">
          <p className="kicker">ABOUT HOLOPTIC</p>
          <h1>
            Independent thinking.
            <br />
            <em>Engineering discipline.</em>
          </h1>
          <p>
            European roots. International experience. Engineering built to
            endure.
          </p>
        </div>
      </section>

      <section className="section section-light">
        <div className="container about-grid">
          <div>
            <p className="kicker">WHO WE ARE</p>
            <h2>
              Technology is a means.
              <br />
              Reliability is the goal.
            </h2>
          </div>

          <div>
            <p>
              Holoptic is an independent technology engineering consultancy
              based in Budapest, Hungary, serving organizations across
              international markets.
            </p>

            <p>
              Our expertise spans cloud infrastructure, software architecture,
              enterprise databases, DevOps, and privately deployed artificial
              intelligence systems.
            </p>

            <p>
              Built on more than 25 years of hands-on engineering experience,
              Holoptic combines deep technical knowledge with the practical
              judgment developed through designing, delivering, and operating
              business-critical systems.
            </p>

            <p>
              We believe successful engineering is measured not merely by what
              can be built, but by what continues to work reliably years after
              delivery.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-dark about-principles">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="kicker">OUR PRINCIPLES</p>
              <h2>
                Built with purpose.
                <br />
                <em>Designed for longevity.</em>
              </h2>
            </div>
            <p>
              Our approach is grounded in practical experience, engineering
              discipline, and responsibility for the systems we create.
            </p>
          </div>

          <div className="service-grid">
            {principles.map((principle) => (
              <article className="service-card" key={principle.number}>
                <div className="service-number">{principle.number}</div>
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
            <p className="kicker">ENTERPRISE EXPERIENCE</p>
            <h2>
              Experience across
              <br />
              demanding industries.
            </h2>
          </div>

          <div>
            <p>
              Our professional engineering background includes engagements
              involving internationally recognized organizations such as SAP,
              Jaguar Land Rover, and Nasdaq.
            </p>

            <p>
              These environments have shaped an engineering approach that
              emphasizes reliability, scalability, disciplined delivery, and an
              understanding of the operational demands placed on enterprise
              technology.
            </p>

            <p>
              From financial technology to automotive and enterprise software,
              we bring experience gained in complex technical environments to
              every new engagement.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <p className="kicker">WORK WITH HOLOPTIC</p>
            <h2>Let's build something that lasts.</h2>
            <p>
              Discuss your engineering challenges directly with an experienced
              technical partner.
            </p>
          </div>

          <Link className="button button-gold" to="/contact">
            Start a conversation →
          </Link>
        </div>
      </section>
    </>
  );
}

const companies = [
  { name: "SAP" },
  { name: "Jaguar Land Rover" },
  { name: "Nasdaq" },
];

export default function EnterpriseExperience() {
  return (
    <section className="enterprise-experience">
      <div className="enterprise-inner">
        <p className="enterprise-eyebrow">ENTERPRISE EXPERIENCE</p>

        <h2>Experience earned in demanding environments.</h2>

        <p className="enterprise-description">
          Professional engineering experience spanning internationally
          recognized organizations in enterprise technology, automotive
          engineering, and financial markets.
        </p>

        <div className="enterprise-companies">
          {companies.map((company) => (
            <div className="enterprise-company" key={company.name}>
              {company.name}
            </div>
          ))}
        </div>

        <p className="enterprise-disclaimer">
          Selected organizations from previous professional engineering
          engagements.
        </p>
      </div>
    </section>
  );
}

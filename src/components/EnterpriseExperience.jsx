import { useI18n } from "../i18n/I18n";

const companies = ["SAP", "Jaguar Land Rover", "Nasdaq"];

export default function EnterpriseExperience() {
  const { d } = useI18n();
  const t = d.enterprise;
  return (
    <section className="enterprise-experience">
      <div className="enterprise-inner">
        <p className="enterprise-eyebrow">{t.eyebrow}</p>

        <h2>{t.title}</h2>

        <p className="enterprise-description">{t.description}</p>

        <div className="enterprise-companies">
          {companies.map((name) => (
            <div className="enterprise-company" key={name}>
              {name}
            </div>
          ))}
        </div>

        <p className="enterprise-disclaimer">{t.disclaimer}</p>
      </div>
    </section>
  );
}

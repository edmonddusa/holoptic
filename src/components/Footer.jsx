import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18n";

export default function Footer() {
  const { d, lp } = useI18n();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">HOLOPTIC</div>
          <p>
            {d.footer.about}
            <br />
            {d.footer.based}
          </p>
        </div>
        <div className="footer-links">
          <Link to={lp("/expertise")}>{d.nav.expertise}</Link>
          <Link to={lp("/about")}>{d.nav.about}</Link>
          <Link to={lp("/contact")}>{d.nav.contact}</Link>
          <a href="https://ai.holoptic.org/">Private AI ↗</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Holoptic. {d.footer.rights}
        </span>
        <span>{d.footer.motto}</span>
      </div>
    </footer>
  );
}

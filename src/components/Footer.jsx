import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">HOLOPTIC</div>
          <p>
            Independent European technology engineering.
            <br />
            Budapest, Hungary · Serving clients internationally.
          </p>
        </div>
        <div className="footer-links">
          <Link to="/expertise">Expertise</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <a href="https://ai.holoptic.org/">Private AI ↗</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Holoptic. All rights reserved.</span>
        <span>Engineering built to endure.</span>
      </div>
    </footer>
  );
}

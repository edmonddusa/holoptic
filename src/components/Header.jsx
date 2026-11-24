import { NavLink, Link } from "react-router-dom";
import Emblem from "./Emblem";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "../i18n/I18n";
import { useEffect, useRef, useState } from "react";

const links = [
  ["/", "home"],
  ["/expertise", "expertise"],
  ["/about", "about"],
  ["/contact", "contact"],
];

export default function Header() {
  const { d, lp } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  // Turn the emblem's dial with the scroll position, and slim the header down.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      headerRef.current?.style.setProperty(
        "--spin",
        `${(y * 0.12).toFixed(1)}deg`,
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`site-header${scrolled ? " is-scrolled" : ""}`}
    >
      <div className="container header-inner">
        <Link
          to={lp("/")}
          className="brand"
          onClick={() => setOpen(false)}
          aria-label={d.nav.homeLink}
        >
          <Emblem className="brand-emblem" intro />

          <span>
            HOLOPTIC
            <small>TECHNOLOGY ENGINEERING</small>
          </span>
        </Link>

        <button
          className="menu-toggle"
          aria-label={d.nav.toggle}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? d.nav.close : d.nav.menu} <span aria-hidden="true">☰</span>
        </button>

        <nav className={open ? "nav open" : "nav"} aria-label={d.nav.main}>
          {links.map(([url, key]) => (
            <NavLink
              key={url}
              to={lp(url)}
              end={url === "/"}
              onClick={() => setOpen(false)}
            >
              {d.nav[key]}
            </NavLink>
          ))}

          <a className="nav-ai" href="https://ai.holoptic.org/">
            Private AI ↗
          </a>

          <LanguageSwitcher onChoose={() => setOpen(false)} />
        </nav>
      </div>
    </header>
  );
}

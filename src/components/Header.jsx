import { NavLink, Link } from "react-router-dom";
import Emblem from "./Emblem";
import { useEffect, useRef, useState } from "react";

const links = [
  ["/", "Home"],
  ["/expertise", "Expertise"],
  ["/about", "About"],
  ["/contact", "Contact"],
];

export default function Header() {
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
          to="/"
          className="brand"
          onClick={() => setOpen(false)}
          aria-label="Holoptic home"
        >
          <Emblem className="brand-emblem" intro />

          <span>
            HOLOPTIC
            <small>TECHNOLOGY ENGINEERING</small>
          </span>
        </Link>

        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"} <span aria-hidden="true">☰</span>
        </button>

        <nav className={open ? "nav open" : "nav"} aria-label="Main navigation">
          {links.map(([url, name]) => (
            <NavLink
              key={url}
              to={url}
              end={url === "/"}
              onClick={() => setOpen(false)}
            >
              {name}
            </NavLink>
          ))}

          <a className="nav-ai" href="https://ai.holoptic.org/">
            Private AI ↗
          </a>
        </nav>
      </div>
    </header>
  );
}

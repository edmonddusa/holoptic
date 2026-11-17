import { NavLink, Link } from "react-router-dom";
import { useState } from "react";

const links = [
  ["/", "Home"],
  ["/expertise", "Expertise"],
  ["/about", "About"],
  ["/contact", "Contact"],
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          to="/"
          className="brand"
          onClick={() => setOpen(false)}
          aria-label="Holoptic home"
        >
          <img
            src="/images/holoptic-algiz.svg"
            alt=""
            className="brand-emblem"
            aria-hidden="true"
          />

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

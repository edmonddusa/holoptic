import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/I18n";
import {
  LANGUAGES,
  localize,
  rememberLanguage,
  stripLang,
} from "../i18n/languages";

// Header language menu. Each option is a real link to the same page in that
// language, so search engines can follow them too. On small screens the
// options show as a row inside the open navigation instead of a dropdown.
export default function LanguageSwitcher({ onChoose }) {
  const { lang, d } = useI18n();
  const { pathname, search, hash } = useLocation();
  const page = stripLang(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find((l) => l.code === lang);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector(".lang-toggle")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`lang-switch${open ? " is-open" : ""}`} ref={ref}>
      <button
        type="button"
        className="lang-toggle"
        aria-expanded={open}
        aria-controls="lang-menu"
        aria-label={`${d.nav.language}: ${current.name}`}
        onClick={() => setOpen((o) => !o)}
      >
        <svg className="lang-globe" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" />
          <path d="M1.5 8h13M8 1.5c2 2 2.8 4.2 2.8 6.5S10 12.5 8 14.5M8 1.5C6 3.5 5.2 5.7 5.2 8S6 12.5 8 14.5" />
        </svg>
        <span>{current.short}</span>
        <svg className="lang-caret" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>
      <ul id="lang-menu" className="lang-menu" aria-label={d.nav.language}>
        {LANGUAGES.map((l) => (
          <li key={l.code}>
            <Link
              to={localize(l.code, page) + search + hash}
              lang={l.code}
              hrefLang={l.code}
              aria-current={l.code === lang ? "true" : undefined}
              onClick={() => {
                rememberLanguage(l.code);
                setOpen(false);
                onChoose?.();
              }}
            >
              <span className="lang-code">{l.short}</span>
              <span className="lang-name">{l.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

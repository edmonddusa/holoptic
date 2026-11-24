import { createContext, useContext, useEffect, useMemo } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import {
  DEFAULT_LANG,
  LANGUAGES,
  isLang,
  localize,
  preferredLanguage,
  stripLang,
} from "./languages";
import en from "./en";
import hu from "./hu";
import sv from "./sv";
import de from "./de";
import fr from "./fr";
import it from "./it";
import es from "./es";

const SITE = "https://holoptic.org";

// Fill anything a translation leaves out with the English text.
// Arrays merge item by item, so a translation can override just some fields.
function withFallback(base, over) {
  if (over === undefined) return base;
  if (Array.isArray(base))
    return base.map((item, i) => withFallback(item, over?.[i]));
  if (base && typeof base === "object") {
    return Object.fromEntries(
      Object.keys(base).map((k) => [k, withFallback(base[k], over?.[k])]),
    );
  }
  return over;
}

const DICTS = Object.fromEntries(
  Object.entries({ en, hu, sv, de, fr, it, es }).map(([code, dict]) => [
    code,
    withFallback(en, dict),
  ]),
);

const I18nContext = createContext(null);

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside a language route");
  return value;
}

// Replaces "{email}" in a translated sentence with a mailto link.
export function withEmail(text, email) {
  const [before, after = ""] = text.split("{email}");
  return (
    <>
      {before}
      <a href={`mailto:${email}`}>{email}</a>
      {after}
    </>
  );
}

// Two-line headings: ["Engineering", "built to endure."], last line optionally in <em>.
export function Lines({ lines, emLast = false }) {
  return lines.map((line, i) => {
    const last = i === lines.length - 1;
    return (
      <span key={line}>
        {last && emLast ? <em>{line}</em> : line}
        {!last && <br />}
      </span>
    );
  });
}

function setMeta(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

// Title, description, <html lang>, canonical URL and hreflang alternates.
function useDocumentLanguage(lang, dict, basePath) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = dict.meta.title;
    setMeta('meta[name="description"]', "content", dict.meta.description);
    setMeta('link[rel="canonical"]', "href", SITE + localize(lang, basePath));

    document
      .querySelectorAll("link[data-hreflang]")
      .forEach((el) => el.remove());
    const alternates = [
      ...LANGUAGES.map((l) => [l.code, localize(l.code, basePath)]),
      ["x-default", basePath],
    ];
    for (const [code, path] of alternates) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = code;
      link.href = SITE + path;
      link.dataset.hreflang = "";
      document.head.appendChild(link);
    }
  }, [lang, dict, basePath]);
}

// Detection runs once per page load, on the first English URL a visitor opens.
let detectionDone = false;

// The element for every route: works out the language from the URL prefix,
// redirects where needed, and provides the dictionary to the page.
export function LangLayout() {
  const { lang: prefix } = useParams();
  const { pathname, search, hash } = useLocation();
  const basePath = stripLang(pathname);
  const lang = prefix === undefined ? DEFAULT_LANG : prefix;
  const valid =
    prefix === undefined || (isLang(prefix) && prefix !== DEFAULT_LANG);

  // A visitor arriving on an English URL with a different saved or browser
  // language is sent to that language before anything renders. Only the very
  // first render of the page load checks, so choosing English later sticks.
  let detected = null;
  if (!detectionDone && prefix === undefined) {
    const preferred = preferredLanguage();
    if (preferred !== DEFAULT_LANG) detected = preferred;
  }
  useEffect(() => {
    detectionDone = true;
  }, []);

  const dict = DICTS[valid ? lang : DEFAULT_LANG];
  const value = useMemo(
    () => ({ lang, d: dict, en: DICTS.en, lp: (path) => localize(lang, path) }),
    [lang, dict],
  );
  useDocumentLanguage(valid ? lang : DEFAULT_LANG, dict, basePath);

  if (prefix === DEFAULT_LANG) {
    // /en/about -> /about
    return (
      <Navigate
        to={
          stripLang(pathname.replace(/^\/en(?=\/|$)/, "") || "/") +
          search +
          hash
        }
        replace
      />
    );
  }
  if (!valid) return <Navigate to="/" replace />;
  if (detected)
    return (
      <Navigate to={localize(detected, basePath) + search + hash} replace />
    );

  return (
    <I18nContext.Provider value={value}>
      <Layout />
    </I18nContext.Provider>
  );
}

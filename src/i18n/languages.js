// Supported languages. English lives at the site root (/about); every other
// language gets a URL prefix (/hu/about).
export const DEFAULT_LANG = "en";

export const LANGUAGES = [
  { code: "en", short: "EN", name: "English" },
  { code: "hu", short: "HU", name: "Magyar" },
  { code: "sv", short: "SV", name: "Svenska" },
  { code: "de", short: "DE", name: "Deutsch" },
  { code: "fr", short: "FR", name: "Français" },
  { code: "it", short: "IT", name: "Italiano" },
  { code: "es", short: "ES", name: "Español" },
];

const CODES = new Set(LANGUAGES.map((l) => l.code));
export const isLang = (code) => CODES.has(code);

// "/hu/about" -> "/about"; "/about" -> "/about"; "/hu" -> "/"
export function stripLang(pathname) {
  const match = pathname.match(/^\/([a-z]{2})(?=\/|$)/);
  if (!match || !isLang(match[1]) || match[1] === DEFAULT_LANG) return pathname;
  return pathname.slice(3) || "/";
}

// ("hu", "/about") -> "/hu/about"; ("en", "/about") -> "/about"
export function localize(lang, path) {
  if (lang === DEFAULT_LANG) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

const STORAGE_KEY = "holoptic-lang";

// Saved choice first, then the browser's languages, then English.
export function preferredLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // Storage blocked: fall through to the browser language.
  }
  const tags = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const tag of tags) {
    const code = (tag || "").slice(0, 2).toLowerCase();
    if (isLang(code)) return code;
  }
  return DEFAULT_LANG;
}

export function rememberLanguage(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Storage blocked: the choice still applies to this page via the URL.
  }
}

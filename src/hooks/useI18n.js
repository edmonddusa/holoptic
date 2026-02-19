import { useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const SUPPORTED = ['en', 'hu', 'sv'];

function getLangFromStorage() {
  const lang = (localStorage.getItem('lang') || '').toLowerCase();
  return SUPPORTED.includes(lang) ? lang : 'en';
}

export function useI18n() {
  const [lang, setLangState] = useState(getLangFromStorage);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (newLang) => {
    localStorage.setItem('lang', newLang);
    setLangState(newLang);
  };

  const t = (key) => {
    const dict = translations[lang] || translations.en;
    return dict[key] ?? translations.en[key] ?? key;
  };

  return { t, lang, setLang };
}

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const I18nContext = createContext();

const SUPPORTED = ['en', 'hu', 'sv', 'de', 'fr', 'it'];

function getBrowserLanguage() {
  // Get browser language (e.g., "en-US" or "en")
  const browserLang = navigator.language || navigator.userLanguage;
  // Extract just the language code (e.g., "en" from "en-US")
  const langCode = browserLang.split('-')[0].toLowerCase();
  // Return if supported, otherwise null
  return SUPPORTED.includes(langCode) ? langCode : null;
}

function getLangFromStorage() {
  const lang = (localStorage.getItem('lang') || '').toLowerCase();
  return SUPPORTED.includes(lang) ? lang : null;
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    // Priority: localStorage > browser language > default to English
    return getLangFromStorage() || getBrowserLanguage() || 'en';
  });

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

  return (
    <I18nContext.Provider value={{ t, lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

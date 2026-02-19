import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const I18nContext = createContext();

const SUPPORTED = ['en', 'hu', 'sv', 'de'];

function getLangFromStorage() {
  const lang = (localStorage.getItem('lang') || '').toLowerCase();
  return SUPPORTED.includes(lang) ? lang : 'en';
}

export function I18nProvider({ children }) {
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

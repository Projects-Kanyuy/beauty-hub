import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/translation.json";
import frTranslation from "./locales/fr/translation.json";

const defaultLang = "en"; // default language

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    fr: { translation: frTranslation },
  },
  lng: defaultLang,
  fallbackLng: defaultLang,
  interpolation: { escapeValue: false },
});

export default i18n;
export const supportedLanguages = ["en", "fr"];

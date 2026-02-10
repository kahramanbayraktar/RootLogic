import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import tr from './locales/tr.json';

i18n
  // Detects the user's language from browser settings
  .use(LanguageDetector)
  // Initializes React integration
  .use(initReactI18next)
  // Loads settings
  .init({
    debug: true, // Logs information to the console during development, we'll turn it off in production
    fallbackLng: 'tr', // Falls back to Turkish if the language is not found
    interpolation: {
      escapeValue: false, // React already handles XSS protection, so we don't need this
    },
    resources: {
      en: {
        translation: en
      },
      tr: {
        translation: tr
      }
    }
  });

// Set initial language attribute
document.documentElement.lang = i18n.language;

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

// Export the i18n instance
export default i18n;
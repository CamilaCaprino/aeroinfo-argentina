import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import es from './locales/es';
import en from './locales/en';
import pt from './locales/pt';
import de from './locales/de';

export const supportedLanguages = [
    {
        code: 'es',
        label: 'Español',
        shortLabel: 'ES',
    },
    {
        code: 'en',
        label: 'English',
        shortLabel: 'EN',
    },
    {
        code: 'pt',
        label: 'Português',
        shortLabel: 'PT',
    },
    {
        code: 'de',
        label: 'Deutsch',
        shortLabel: 'DE',
    },
] as const;

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            es: {
                translation: es,
            },
            en: {
                translation: en,
            },
            pt: {
                translation: pt,
            },
            de: {
                translation: de,
            },
        },

        supportedLngs: [
            'es',
            'en',
            'pt',
            'de',
        ],

        fallbackLng: 'en',

        nonExplicitSupportedLngs: true,

        interpolation: {
            escapeValue: false,
        },

        detection: {
            order: [
                'localStorage',
                'navigator',
            ],

            lookupLocalStorage:
                'aeroinfo_locale',

            caches: [
                'localStorage',
            ],
        },

        react: {
            useSuspense: false,
        },
    });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'node_modules/react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
        // Set default language
        lng: 'en',
        fallbackLng: 'en',

        // Define namespaces
        ns: ['auth'],
        defaultNS: 'auth',

        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
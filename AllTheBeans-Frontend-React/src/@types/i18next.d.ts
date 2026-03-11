import 'i18next';

// Import language JSON files
import common from '../../public/locales/en/common.json';
import auth from '../../public/locales/en/auth.json';
import order from '../../public/locales/en/order.json';

declare module 'i18next' {
    interface CustomTypeOptions {
        // Specify the default namespace
        defaultNS: 'common';
        // Specify the default namespace for fallbacks
        fallbackNS: 'common';
        // Define the type of your resources
        resources: {
            common: typeof common;
            auth: typeof auth;
            order: typeof order;
        };
    }
} i;
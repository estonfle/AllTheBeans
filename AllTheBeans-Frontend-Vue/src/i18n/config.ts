import { createI18n } from 'vue-i18n';
import common from '../locales/en/common.json';

export type MessageSchema = typeof common;

const i18n = createI18n<[MessageSchema], 'en'>({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: common
    }
});

export default i18n;
import { createI18n } from 'vue-i18n';
import { merge } from 'lodash';

// Importaciones de idiomas globales
import enGlobal from '../locales/en.json';
import esGlobal from '../locales/es.json';

// Importaciones de idiomas del módulo de seguridad
import enSecurity from '@/operational-security-management/locales/en.json';
import esSecurity from '@/operational-security-management/locales/es.json';

// Fusión profunda de los mensajes
const messages = {
  en: merge({}, enGlobal, enSecurity),
  es: merge({}, esGlobal, esSecurity)
};

const i18n = createI18n({
    legacy: false,
    locale: 'es',
    fallbackLocale: 'en',
    messages,
});

export default i18n;

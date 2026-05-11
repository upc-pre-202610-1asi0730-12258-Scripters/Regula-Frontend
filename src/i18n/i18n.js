import { createI18n } from 'vue-i18n';

// Importaciones de idiomas globales
import enGlobal from '../locales/en.json';
import esGlobal from '../locales/es.json';

// Importaciones de idiomas del módulo de seguridad
import enSecurity from '@/operational-security-management/locales/en.json';
import esSecurity from '@/operational-security-management/locales/es.json';

/**
 * Función simple para fusionar dos objetos (reemplaza a lodash.merge para evitar dependencias extra)
 */
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

// Fusión profunda de los mensajes
const messages = {
  en: deepMerge({ ...enGlobal }, enSecurity),
  es: deepMerge({ ...esGlobal }, esSecurity)
};

const i18n = createI18n({
    legacy: false,
    locale: 'es',
    fallbackLocale: 'en',
    messages,
});

export default i18n;

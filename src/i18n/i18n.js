import { createI18n } from 'vue-i18n';

// Importaciones de idiomas globales
import enGlobal from '../locales/en.json';
import esGlobal from '../locales/es.json';

// Importaciones de idiomas del módulo de seguridad
import enSecurity from '@/operational-security-management/locales/en.json';
import esSecurity from '@/operational-security-management/locales/es.json';

import enUs from '../locales/en_US.json'
import esLatam from '../locales/es_419.json'

/**
 * Función simple para fusionar dos objetos (reemplaza a lodash.merge para evitar dependencias extra)
 */
function mergeDeep(target, source) {
    if (!source) return target
    for (const [key, value] of Object.entries(source)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            if (!target[key] || typeof target[key] !== 'object') {
                target[key] = {}
            }
            mergeDeep(target[key], value)
        } else {
            target[key] = value
        }
    }
    return target
}

// Fusión profunda de los mensajes
const en = mergeDeep(structuredClone(enUs), mergeDeep(structuredClone(enGlobal), enSecurity))
const es = mergeDeep(structuredClone(esLatam), mergeDeep(structuredClone(esGlobal), esSecurity))

const messages = {
  en: en,
  es: es
};


const i18n = createI18n({
    legacy: false,
    locale: 'es',
    fallbackLocale: 'en',
    messages,
});

export default i18n;
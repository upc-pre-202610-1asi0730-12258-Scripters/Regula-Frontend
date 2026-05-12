import { createI18n } from 'vue-i18n'

import enInventory from '../locales/en.json'
import esInventory from '../locales/es.json'
import enUs from '../locales/en_US.json'
import esLatam from '../locales/es_419.json'

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

const en = mergeDeep(structuredClone(enUs), enInventory)
const es = mergeDeep(structuredClone(esLatam), esInventory)

const i18n = createI18n({
    legacy: false,
    locale: 'es',
    fallbackLocale: 'en',
    messages: { en, es },
})

export default i18n

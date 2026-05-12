import { createI18n } from 'vue-i18n'

import enUS from '@/locales/en_US.json'
import es419 from '@/locales/es_419.json'

export type AppLocale = 'en-US' | 'es-419'

export const i18n = createI18n({
  legacy: false,
  locale: 'es-419',
  fallbackLocale: 'en-US',
  globalInjection: true,
  messages: {
    'en-US': enUS,
    'es-419': es419,
  },
})

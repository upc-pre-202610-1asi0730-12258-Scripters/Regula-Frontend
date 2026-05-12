import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { AppLocale } from '@/presentation/plugins/i18n'
import { i18n } from '@/presentation/plugins/i18n'

const STORAGE_KEY = 'regula.locale'

function readStoredLocale(): AppLocale {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === 'en-US' || raw === 'es-419') {
    return raw
  }
  return 'es-419'
}

export const useAppLocaleStore = defineStore('app-locale', () => {
  const current = ref<AppLocale>(readStoredLocale())

  function applyLocale(next: AppLocale) {
    current.value = next
    i18n.global.locale.value = next
    localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.lang = next === 'es-419' ? 'es' : 'en'
  }

  function hydrateFromStorage() {
    applyLocale(readStoredLocale())
  }

  return {
    current,
    setLocale: applyLocale,
    hydrateFromStorage,
  }
})

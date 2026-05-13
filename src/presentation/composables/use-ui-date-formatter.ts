import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useUiDateFormatter() {
  const { locale } = useI18n()

  const intlLocale = computed(() => (locale.value === 'es-419' ? 'es-419' : 'en-US'))

  function formatIsoDate(isoDay: string): string {
    const d = new Date(`${isoDay}T12:00:00`)
    return new Intl.DateTimeFormat(intlLocale.value, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d)
  }

  function formatLongDateTime(isoDay: string, time: string): string {
    const d = new Date(`${isoDay}T${time}:00`)
    return new Intl.DateTimeFormat(intlLocale.value, {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(d)
  }

  return {
    formatIsoDate,
    formatLongDateTime,
  }
}

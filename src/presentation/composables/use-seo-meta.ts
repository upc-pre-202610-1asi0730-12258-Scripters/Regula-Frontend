import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export function useSeoMeta() {
  const route = useRoute()
  const { t, te } = useI18n()

  function apply() {
    const titleKey = route.meta.titleKey
    const descriptionKey = route.meta.descriptionKey

    const title =
      typeof titleKey === 'string' && te(titleKey) ? String(t(titleKey)) : String(t('meta.appTitle'))
    const description =
      typeof descriptionKey === 'string' && te(descriptionKey)
        ? String(t(descriptionKey))
        : String(t('meta.appDescription'))

    document.title = title

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)
  }

  watch(
    () => [route.fullPath, route.meta.titleKey, route.meta.descriptionKey],
    () => {
      apply()
    },
    { immediate: true },
  )
}

import { onMounted, onUnmounted, ref } from 'vue'

const DEFAULT_MAX_WIDTH_PX = 767

export function useIsMobile(maxWidthPx: number = DEFAULT_MAX_WIDTH_PX) {
  const mq = `(max-width: ${maxWidthPx}px)`
  const isMobile = ref(typeof window !== 'undefined' ? window.matchMedia(mq).matches : false)

  let media: MediaQueryList | null = null

  function sync() {
    isMobile.value = window.matchMedia(mq).matches
  }

  onMounted(() => {
    media = window.matchMedia(mq)
    sync()
    media.addEventListener('change', sync)
  })

  onUnmounted(() => {
    media?.removeEventListener('change', sync)
  })

  return {
    isMobile,
    sync,
  }
}

import { createApp } from 'vue'

import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Aura from '@primeuix/themes/aura'

import '@/styles/style.css'
import 'primeicons/primeicons.css'

import App from '@/app.vue'
import { i18n } from '@/i18n'
import router from '@/router'
import { useAppLocaleStore } from '@/pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(i18n)
useAppLocaleStore(pinia).hydrateFromStorage()
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(ToastService)

app.mount('#app')

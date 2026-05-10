import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import App from './app.vue'
import i18n from './i18n/i18n.js'
import pinia from './pinia/pinia.js'
import router from './router/index.js'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './style.css'

const app = createApp(App)

app.directive('tooltip', Tooltip)

app.use(ToastService)

app.use(pinia)
app.use(i18n)
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false,
        },
    },
})

app.mount('#app')

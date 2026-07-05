<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useBillingStore } from '../../application/billing.store.js'
import { VueStripeProvider, VueStripeElements } from '@vue-stripe/vue-stripe'
import PaymentForm from '../components/payment-form.vue'

const { t } = useI18n()
const router = useRouter()
const store = useBillingStore()

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

const loadingCheckout = ref(true)
const confirming = ref(false)
const errorMessage = ref(null)

onMounted(async () => {
  try {
    await store.createCheckout()

    if (store.isActive) {
      // Ya tenía una suscripción activa (nada que cobrar) — al Dashboard directo.
      await router.push({ name: 'distributor-dashboard' })
      return
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.error || error.message
  } finally {
    loadingCheckout.value = false
  }
})

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * El pago se confirma en el navegador (Stripe.js) de forma inmediata, pero el
 * webhook que marca la suscripción como Active en NUESTRA base de datos llega
 * unos instantes después, de forma asíncrona. Reintenta un par de segundos
 * antes de rendirse — evita mostrar un falso error justo en ese hueco.
 */
async function handlePaymentSuccess() {
  errorMessage.value = null
  confirming.value = true

  const maxAttempts = 8
  const delayMs = 1000

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await store.refreshAfterPayment()

    if (store.isActive) {
      confirming.value = false
      await router.push({ name: 'distributor-dashboard' })
      return
    }

    await wait(delayMs)
  }

  confirming.value = false
  errorMessage.value = t('billing.subscribe.notActiveYet')
}

function handlePaymentError(message) {
  errorMessage.value = message
}
</script>

<template>
  <div class="subscribe-view">
    <div class="subscribe-view__card">
      <h1 class="subscribe-view__title">{{ t('billing.subscribe.title') }}</h1>
      <p class="subscribe-view__subtitle">{{ t('billing.subscribe.subtitle') }}</p>

      <div v-if="loadingCheckout" class="subscribe-view__loading">
        {{ t('billing.subscribe.loading') }}
      </div>

      <div v-else-if="confirming" class="subscribe-view__loading">
        {{ t('billing.subscribe.confirming') }}
      </div>

      <template v-else-if="store.clientSecret">
        <VueStripeProvider :publishable-key="publishableKey">
          <VueStripeElements :client-secret="store.clientSecret">
            <PaymentForm @success="handlePaymentSuccess" @error="handlePaymentError" />
          </VueStripeElements>
        </VueStripeProvider>

        <p v-if="errorMessage" class="subscribe-view__error">{{ errorMessage }}</p>
      </template>

      <p v-else class="subscribe-view__error">
        {{ errorMessage || t('billing.subscribe.genericError') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.subscribe-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--regula-gray-light, #e8ecf0);
  padding: 1.5rem;
}

.subscribe-view__card {
  background: var(--regula-white, #fff);
  border-radius: var(--regula-radius-card, 12px);
  box-shadow: var(--regula-shadow-card, 0 2px 12px rgba(23, 45, 64, 0.1));
  padding: 2rem;
  width: 100%;
  max-width: 460px;
}

.subscribe-view__title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--regula-navy, #172d40);
  margin: 0 0 0.4rem;
}

.subscribe-view__subtitle {
  font-size: 0.9rem;
  color: var(--regula-gray-mid, #555f6e);
  margin: 0 0 1.5rem;
}

.subscribe-view__loading {
  padding: 2rem 0;
  text-align: center;
  color: var(--regula-gray-mid, #555f6e);
}

.subscribe-view__error {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 1rem;
}
</style>

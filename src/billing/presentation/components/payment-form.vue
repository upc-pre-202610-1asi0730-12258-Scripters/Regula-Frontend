<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { VueStripePaymentElement, usePaymentIntent } from '@vue-stripe/vue-stripe'
import { useBillingStore } from '../../application/billing.store.js'

const { t } = useI18n()
const store = useBillingStore()
const emit = defineEmits(['success', 'error'])

const paying = ref(false)
const { confirmPayment } = usePaymentIntent()

async function handlePay() {
  if (!store.clientSecret) return

  paying.value = true

  try {
    const result = await confirmPayment({
      clientSecret: store.clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/distribuidor`,
      },
      redirect: 'if_required',
    })

    if (result.error) {
      emit('error', result.error.message)
    } else {
      emit('success')
    }
  } catch (error) {
    emit('error', error.message)
  } finally {
    paying.value = false
  }
}
</script>

<template>
  <VueStripePaymentElement />

  <button
      type="button"
      class="subscribe-view__pay-btn"
      :disabled="paying"
      @click="handlePay"
  >
    {{ paying ? t('billing.subscribe.paying') : t('billing.subscribe.payButton') }}
  </button>
</template>

<style scoped>
.subscribe-view__pay-btn {
  width: 100%;
  margin-top: 1.25rem;
  padding: 0.75rem;
  border: none;
  border-radius: var(--regula-radius-btn, 8px);
  background: var(--regula-orange, #f26e22);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
}

.subscribe-view__pay-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

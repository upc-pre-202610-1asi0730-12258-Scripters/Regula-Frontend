import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BillingApi } from '../infrastructure/billing-api.js'

const billingApi = new BillingApi()

export const useBillingStore = defineStore('billing', () => {
  // 'Unknown' hasta que se resuelva la primera consulta real.
  const status = ref('Unknown')
  const currentPeriodEnd = ref(null)
  const checked = ref(false)

  const clientSecret = ref(null)
  const creatingCheckout = ref(false)
  const errors = ref([])

  const isActive = computed(() => status.value === 'Active')

  /** Se llama una vez por sesión (el router guard la cachea via `checked`). */
  function fetchStatus() {
    return billingApi.getMySubscription()
      .then((response) => {
        status.value = response.data.status
        currentPeriodEnd.value = response.data.currentPeriodEnd
        checked.value = true
      })
      .catch((error) => {
        errors.value.push(error)
        checked.value = true
      })
  }

  function createCheckout() {
    creatingCheckout.value = true
    return billingApi.createCheckout()
      .then((response) => {
        clientSecret.value = response.data.clientSecret
        // Si ya estaba activa, la API no manda clientSecret — no hay nada que pagar.
        if (response.data.alreadyActive) {
          status.value = 'Active'
        }
        return response.data
      })
      .catch((error) => {
        errors.value.push(error)
        throw error
      })
      .finally(() => {
        creatingCheckout.value = false
      })
  }

  /** Tras confirmar el pago con éxito, refresca el estado real desde el backend. */
  function refreshAfterPayment() {
    checked.value = false
    return fetchStatus()
  }

  /**
   * El estado de suscripción vive en memoria mientras la pestaña sigue abierta.
   * Sin este reset, cerrar sesión e iniciar con OTRO usuario en la misma pestaña
   * reutilizaría el `checked`/`status` del usuario anterior — el guard nunca
   * volvería a preguntarle al backend por la sesión nueva.
   */
  function reset() {
    status.value = 'Unknown'
    currentPeriodEnd.value = null
    checked.value = false
    clientSecret.value = null
    errors.value = []
  }

  return {
    status,
    currentPeriodEnd,
    checked,
    clientSecret,
    creatingCheckout,
    errors,
    isActive,
    fetchStatus,
    createCheckout,
    refreshAfterPayment,
    reset,
  }
})

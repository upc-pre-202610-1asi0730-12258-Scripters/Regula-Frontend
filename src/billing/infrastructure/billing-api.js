import { BaseApi } from '@/shared/infrastructure/base-api.js'

const subscriptionsPath = '/api/v1/billing/subscriptions'

export class BillingApi extends BaseApi {
  /** GET /api/v1/billing/subscriptions/me -> { status, currentPeriodEnd } */
  getMySubscription() {
    return this.http.get(`${subscriptionsPath}/me`)
  }

  /** POST /api/v1/billing/subscriptions/checkout -> { clientSecret, alreadyActive } */
  createCheckout() {
    return this.http.post(`${subscriptionsPath}/checkout`)
  }
}

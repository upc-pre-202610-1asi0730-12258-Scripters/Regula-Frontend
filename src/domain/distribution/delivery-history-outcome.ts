export const DeliveryHistoryOutcome = {
  Completed: 'COMPLETED',
  NotDelivered: 'NOT_DELIVERED',
} as const

export type DeliveryHistoryOutcome =
  (typeof DeliveryHistoryOutcome)[keyof typeof DeliveryHistoryOutcome]

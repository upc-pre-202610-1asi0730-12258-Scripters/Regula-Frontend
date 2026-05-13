/** Delivery lifecycle on the operational board */
export const DeliveryBoardStatus = {
  InRoute: 'IN_ROUTE',
  Completed: 'COMPLETED',
  Failed: 'FAILED',
} as const

export type DeliveryBoardStatus = (typeof DeliveryBoardStatus)[keyof typeof DeliveryBoardStatus]

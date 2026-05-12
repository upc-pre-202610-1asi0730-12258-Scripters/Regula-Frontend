import type { DeliveryBoardStatus } from './delivery-board-status'
import type { DriverAssignment } from './driver-assignment'

/**
 * Aggregate root for a scheduled delivery on the day board.
 * Pure domain model — persistence shape is mapped in infrastructure.
 */
export interface Delivery {
  readonly id: string
  readonly humanCode: string
  /** i18n key for destination / customer line */
  readonly destinationLineKey: string
  readonly destinationLineParams?: Record<string, string | number>
  readonly boardStatus: DeliveryBoardStatus
  readonly driver: DriverAssignment
  readonly loadDescriptionKey: string
  readonly loadDescriptionParams?: Record<string, string | number>
  readonly etaLocalTime: string
  readonly punctualityKey?: 'onTime' | 'delayed'
  readonly delayMinutes?: number
  /** Present when the delivery is finished the same day (compact card). */
  readonly completedAtLocalTime?: string
  readonly completedItemsCount?: number
}

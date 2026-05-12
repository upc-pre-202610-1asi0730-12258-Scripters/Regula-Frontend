import { DeliveryBoardStatus } from '@/domain/distribution/delivery-board-status'
import type { Delivery } from '@/domain/distribution/delivery'

export function filterDeliveriesByBoardStatus(
  items: readonly Delivery[],
  status: DeliveryBoardStatus,
): Delivery[] {
  return items.filter((d) => d.boardStatus === status)
}

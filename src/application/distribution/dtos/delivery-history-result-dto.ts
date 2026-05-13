import type { DeliveryHistoryEntry } from '@/domain/distribution/delivery-history-entry'

export type DeliveryHistoryResultDto = Readonly<{
  entries: ReadonlyArray<DeliveryHistoryEntry>
}>

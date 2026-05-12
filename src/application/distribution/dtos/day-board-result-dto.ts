import type { Delivery } from '@/domain/distribution/delivery'

export type DayBoardResultDto = Readonly<{
  deliveries: ReadonlyArray<Delivery>
}>

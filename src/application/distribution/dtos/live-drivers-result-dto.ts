import type { LiveDriverLocation } from '@/domain/distribution/live-driver-location'

export type LiveDriversResultDto = Readonly<{
  drivers: ReadonlyArray<LiveDriverLocation>
}>

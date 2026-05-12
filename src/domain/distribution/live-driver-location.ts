import type { VehicleType } from './vehicle-type'

export const DriverLiveStatus = {
  InRoute: 'IN_ROUTE',
  Completed: 'COMPLETED',
  NoSignal: 'NO_SIGNAL',
} as const

export type DriverLiveStatus = (typeof DriverLiveStatus)[keyof typeof DriverLiveStatus]

export interface LiveDriverLocation {
  readonly driverId: string
  readonly driverDisplayKey: string
  readonly driverDisplayParams?: Record<string, string | number>
  readonly vehiclePlate: string
  readonly vehicleType: VehicleType
  readonly status: DriverLiveStatus
  readonly latitude: number
  readonly longitude: number
  readonly activeDeliveryHumanCode?: string
  readonly loadDescriptionKey?: string
  readonly loadDescriptionParams?: Record<string, string | number>
  readonly destinationLineKey?: string
  readonly destinationLineParams?: Record<string, string | number>
  readonly etaLocalTime?: string
  readonly noSignalSinceLocalTime?: string
}

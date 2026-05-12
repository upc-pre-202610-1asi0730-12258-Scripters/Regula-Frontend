import type { VehicleType } from './vehicle-type'

export interface DriverAssignment {
  readonly driverId: string
  /** i18n message key for the driver display name */
  readonly driverDisplayKey: string
  readonly driverDisplayParams?: Record<string, string | number>
  readonly vehiclePlate: string
  readonly vehicleType: VehicleType
  readonly isOwnerOperator: boolean
}

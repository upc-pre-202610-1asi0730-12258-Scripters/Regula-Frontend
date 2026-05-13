import type { DeliveryHistoryOutcome } from './delivery-history-outcome'
import type { VehicleType } from './vehicle-type'

export interface DeliveryHistoryEntry {
  readonly id: string
  readonly humanCode: string
  readonly dateIso: string
  readonly driverRecordId: string
  readonly driverDisplayKey: string
  readonly driverDisplayParams?: Record<string, string | number>
  readonly driverInitials: string
  readonly vehiclePlate: string
  readonly vehicleType: VehicleType
  readonly isOwnerOperator: boolean
  readonly loadDescriptionKey: string
  readonly loadDescriptionParams?: Record<string, string | number>
  readonly destinationLineKey: string
  readonly destinationLineParams?: Record<string, string | number>
  readonly outcome: DeliveryHistoryOutcome
  readonly etaLocalTime: string
  readonly actualLocalTime: string
  readonly deltaMinutes: number
}

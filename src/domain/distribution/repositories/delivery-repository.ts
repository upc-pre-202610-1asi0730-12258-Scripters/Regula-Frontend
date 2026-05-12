import type { Delivery } from '../delivery'
import type { DeliveryHistoryEntry } from '../delivery-history-entry'
import type { LiveDriverLocation } from '../live-driver-location'

export interface DayBoardQuery {
  readonly dayIso: string
}

export interface HistoryQuery {
  readonly dayIso: string
  readonly driverRecordId?: string
  readonly plateSearch?: string
}

export interface IDeliveryRepository {
  getDayBoard(query: DayBoardQuery): Promise<Delivery[]>
  getHistory(query: HistoryQuery): Promise<DeliveryHistoryEntry[]>
  getLiveDrivers(): Promise<LiveDriverLocation[]>
}

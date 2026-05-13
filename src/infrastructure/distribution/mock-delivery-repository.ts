import { DeliveryBoardStatus } from '@/domain/distribution/delivery-board-status'
import { DeliveryHistoryOutcome } from '@/domain/distribution/delivery-history-outcome'
import type { Delivery } from '@/domain/distribution/delivery'
import type { DeliveryHistoryEntry } from '@/domain/distribution/delivery-history-entry'
import { DriverLiveStatus } from '@/domain/distribution/live-driver-location'
import type { LiveDriverLocation } from '@/domain/distribution/live-driver-location'
import { VehicleType } from '@/domain/distribution/vehicle-type'
import type {
  DayBoardQuery,
  HistoryQuery,
  IDeliveryRepository,
} from '@/domain/distribution/repositories/delivery-repository'

const MOCK_DAY = '2023-10-24'

const dayBoard: Delivery[] = [
  {
    id: 'del-881',
    humanCode: '#881',
    destinationLineKey: 'distribution.mock.destination.centerDelivery',
    boardStatus: DeliveryBoardStatus.InRoute,
    driver: {
      driverId: 'drv-1',
      driverDisplayKey: 'distribution.mock.driver.juanLopez',
      vehiclePlate: 'A3B-210',
      vehicleType: VehicleType.Motorcycle,
      isOwnerOperator: false,
    },
    loadDescriptionKey: 'distribution.load.cylindersKg',
    loadDescriptionParams: { count: 3, sizeKg: 10 },
    etaLocalTime: '14:30',
    punctualityKey: 'delayed',
    delayMinutes: 20,
  },
  {
    id: 'del-882',
    humanCode: '#882',
    destinationLineKey: 'distribution.mock.destination.northHub',
    boardStatus: DeliveryBoardStatus.InRoute,
    driver: {
      driverId: 'drv-2',
      driverDisplayKey: 'distribution.mock.driver.mariaRojas',
      vehiclePlate: 'K9L-441',
      vehicleType: VehicleType.Van,
      isOwnerOperator: false,
    },
    loadDescriptionKey: 'distribution.load.cylindersKg',
    loadDescriptionParams: { count: 2, sizeKg: 15 },
    etaLocalTime: '15:10',
    punctualityKey: 'onTime',
  },
  {
    id: 'del-883',
    humanCode: '#883',
    destinationLineKey: 'distribution.mock.destination.southStore',
    boardStatus: DeliveryBoardStatus.InRoute,
    driver: {
      driverId: 'drv-3',
      driverDisplayKey: 'distribution.mock.driver.luisVargas',
      vehiclePlate: 'M2N-778',
      vehicleType: VehicleType.Motorcycle,
      isOwnerOperator: false,
    },
    loadDescriptionKey: 'distribution.load.cylindersKg',
    loadDescriptionParams: { count: 4, sizeKg: 10 },
    etaLocalTime: '16:00',
    punctualityKey: 'onTime',
  },
  {
    id: 'del-701',
    humanCode: '#701',
    destinationLineKey: 'distribution.mock.customer.pedroSalas',
    boardStatus: DeliveryBoardStatus.Completed,
    driver: {
      driverId: 'drv-4',
      driverDisplayKey: 'distribution.mock.driver.anaTorres',
      vehiclePlate: 'B2C-102',
      vehicleType: VehicleType.Motorcycle,
      isOwnerOperator: false,
    },
    loadDescriptionKey: 'distribution.load.cylindersShort',
    loadDescriptionParams: { count: 2 },
    etaLocalTime: '11:00',
    completedAtLocalTime: '13:45',
    completedItemsCount: 2,
  },
  {
    id: 'del-702',
    humanCode: '#702',
    destinationLineKey: 'distribution.mock.customer.luciaPrado',
    boardStatus: DeliveryBoardStatus.Completed,
    driver: {
      driverId: 'drv-5',
      driverDisplayKey: 'distribution.mock.driver.carlosIbanez',
      vehiclePlate: 'D4E-330',
      vehicleType: VehicleType.Van,
      isOwnerOperator: false,
    },
    loadDescriptionKey: 'distribution.load.cylindersShort',
    loadDescriptionParams: { count: 5 },
    etaLocalTime: '12:15',
    completedAtLocalTime: '12:05',
    completedItemsCount: 5,
  },
  {
    id: 'del-703',
    humanCode: '#703',
    destinationLineKey: 'distribution.mock.customer.jorgeNunez',
    boardStatus: DeliveryBoardStatus.Completed,
    driver: {
      driverId: 'drv-6',
      driverDisplayKey: 'distribution.mock.driver.patriciaGomez',
      vehiclePlate: 'F8G-901',
      vehicleType: VehicleType.Motorcycle,
      isOwnerOperator: false,
    },
    loadDescriptionKey: 'distribution.load.cylindersShort',
    loadDescriptionParams: { count: 1 },
    etaLocalTime: '10:30',
    completedAtLocalTime: '10:28',
    completedItemsCount: 1,
  },
  {
    id: 'del-704',
    humanCode: '#704',
    destinationLineKey: 'distribution.mock.customer.ricardoPaz',
    boardStatus: DeliveryBoardStatus.Completed,
    driver: {
      driverId: 'drv-7',
      driverDisplayKey: 'distribution.mock.driver.fernandaLima',
      vehiclePlate: 'H0J-554',
      vehicleType: VehicleType.Van,
      isOwnerOperator: false,
    },
    loadDescriptionKey: 'distribution.load.cylindersShort',
    loadDescriptionParams: { count: 3 },
    etaLocalTime: '09:45',
    completedAtLocalTime: '09:50',
    completedItemsCount: 3,
  },
  {
    id: 'del-705',
    humanCode: '#705',
    destinationLineKey: 'distribution.mock.customer.martaQuispe',
    boardStatus: DeliveryBoardStatus.Completed,
    driver: {
      driverId: 'drv-8',
      driverDisplayKey: 'distribution.mock.driver.oscarReyes',
      vehiclePlate: 'J1K-667',
      vehicleType: VehicleType.Motorcycle,
      isOwnerOperator: false,
    },
    loadDescriptionKey: 'distribution.load.cylindersShort',
    loadDescriptionParams: { count: 2 },
    etaLocalTime: '13:00',
    completedAtLocalTime: '12:58',
    completedItemsCount: 2,
  },
  {
    id: 'del-706',
    humanCode: '#706',
    destinationLineKey: 'distribution.mock.customer.danielFlores',
    boardStatus: DeliveryBoardStatus.Completed,
    driver: {
      driverId: 'drv-9',
      driverDisplayKey: 'distribution.mock.driver.raulMendez',
      vehiclePlate: 'X1W-445',
      vehicleType: VehicleType.Motorcycle,
      isOwnerOperator: false,
    },
    loadDescriptionKey: 'distribution.load.cylindersShort',
    loadDescriptionParams: { count: 6 },
    etaLocalTime: '14:00',
    completedAtLocalTime: '14:02',
    completedItemsCount: 6,
  },
  {
    id: 'del-707',
    humanCode: '#707',
    destinationLineKey: 'distribution.mock.customer.elenaRios',
    boardStatus: DeliveryBoardStatus.Completed,
    driver: {
      driverId: 'drv-10',
      driverDisplayKey: 'distribution.mock.driver.juanLopez',
      vehiclePlate: 'A3B-210',
      vehicleType: VehicleType.Motorcycle,
      isOwnerOperator: false,
    },
    loadDescriptionKey: 'distribution.load.cylindersShort',
    loadDescriptionParams: { count: 2 },
    etaLocalTime: '15:30',
    completedAtLocalTime: '15:22',
    completedItemsCount: 2,
  },
  {
    id: 'del-708',
    humanCode: '#708',
    destinationLineKey: 'distribution.mock.customer.pabloSoto',
    boardStatus: DeliveryBoardStatus.Completed,
    driver: {
      driverId: 'drv-11',
      driverDisplayKey: 'distribution.mock.driver.pedroSalas',
      vehiclePlate: 'C5R-902',
      vehicleType: VehicleType.Van,
      isOwnerOperator: false,
    },
    loadDescriptionKey: 'distribution.load.cylindersShort',
    loadDescriptionParams: { count: 4 },
    etaLocalTime: '16:10',
    completedAtLocalTime: '16:05',
    completedItemsCount: 4,
  },
]

const historyEntries: DeliveryHistoryEntry[] = [
  {
    id: 'del-001',
    humanCode: '#001',
    dateIso: '2023-10-24',
    driverRecordId: 'drv-1',
    driverDisplayKey: 'distribution.mock.driver.juanLopez',
    driverInitials: 'JL',
    vehiclePlate: 'A3B-210',
    vehicleType: VehicleType.Motorcycle,
    isOwnerOperator: false,
    loadDescriptionKey: 'distribution.load.cylindersShort',
    loadDescriptionParams: { count: 3 },
    destinationLineKey: 'distribution.mock.address.pinos',
    outcome: DeliveryHistoryOutcome.Completed,
    etaLocalTime: '14:30',
    actualLocalTime: '14:25',
    deltaMinutes: -5,
  },
  {
    id: 'del-002',
    humanCode: '#002',
    dateIso: '2023-10-24',
    driverRecordId: 'drv-2',
    driverDisplayKey: 'distribution.mock.driver.pedroSalas',
    driverInitials: 'PS',
    vehiclePlate: 'C5R-902',
    vehicleType: VehicleType.Van,
    isOwnerOperator: true,
    loadDescriptionKey: 'distribution.load.cylindersShort',
    loadDescriptionParams: { count: 2 },
    destinationLineKey: 'distribution.mock.address.miraflores',
    outcome: DeliveryHistoryOutcome.NotDelivered,
    etaLocalTime: '15:00',
    actualLocalTime: '15:10',
    deltaMinutes: 10,
  },
]

const liveDrivers: LiveDriverLocation[] = [
  {
    driverId: 'drv-1',
    driverDisplayKey: 'distribution.mock.driver.juanLopez',
    vehiclePlate: 'A3B-218',
    vehicleType: VehicleType.Motorcycle,
    status: DriverLiveStatus.InRoute,
    latitude: -12.0561,
    longitude: -77.0377,
    activeDeliveryHumanCode: '#005',
    loadDescriptionKey: 'distribution.load.cylindersKg',
    loadDescriptionParams: { count: 2, sizeKg: 10 },
    destinationLineKey: 'distribution.mock.address.pinos',
    etaLocalTime: '15:20',
  },
  {
    driverId: 'drv-2',
    driverDisplayKey: 'distribution.mock.driver.pedroSalas',
    vehiclePlate: 'C5R-902',
    vehicleType: VehicleType.Van,
    status: DriverLiveStatus.Completed,
    latitude: -12.12,
    longitude: -77.03,
  },
  {
    driverId: 'drv-3',
    driverDisplayKey: 'distribution.mock.driver.raulMendez',
    vehiclePlate: 'X1W-445',
    vehicleType: VehicleType.Motorcycle,
    status: DriverLiveStatus.NoSignal,
    latitude: -12.08,
    longitude: -77.05,
    noSignalSinceLocalTime: '14:10',
  },
  {
    driverId: 'drv-4',
    driverDisplayKey: 'distribution.mock.driver.mariaRojas',
    vehiclePlate: 'K9L-441',
    vehicleType: VehicleType.Van,
    status: DriverLiveStatus.InRoute,
    latitude: -12.04,
    longitude: -77.06,
    activeDeliveryHumanCode: '#012',
    loadDescriptionKey: 'distribution.load.cylindersKg',
    loadDescriptionParams: { count: 1, sizeKg: 15 },
    destinationLineKey: 'distribution.mock.address.miraflores',
    etaLocalTime: '16:40',
  },
  {
    driverId: 'drv-5',
    driverDisplayKey: 'distribution.mock.driver.luisVargas',
    vehiclePlate: 'M2N-778',
    vehicleType: VehicleType.Motorcycle,
    status: DriverLiveStatus.InRoute,
    latitude: -12.09,
    longitude: -77.04,
    activeDeliveryHumanCode: '#018',
    etaLocalTime: '17:05',
  },
]

function plateMatches(plate: string, search: string): boolean {
  return plate.toLowerCase().includes(search.trim().toLowerCase())
}

export class MockDeliveryRepository implements IDeliveryRepository {
  async getDayBoard(query: DayBoardQuery): Promise<Delivery[]> {
    void query
    return dayBoard.map((d) => ({ ...d, driver: { ...d.driver } }))
  }

  async getHistory(query: HistoryQuery): Promise<DeliveryHistoryEntry[]> {
    let rows = historyEntries.filter((e) => e.dateIso === query.dayIso)
    if (query.driverRecordId) {
      rows = rows.filter((e) => e.driverRecordId === query.driverRecordId)
    }
    if (query.plateSearch) {
      const search = query.plateSearch
      rows = rows.filter((e) => plateMatches(e.vehiclePlate, search))
    }
    return rows.map((e) => ({ ...e }))
  }

  async getLiveDrivers(): Promise<LiveDriverLocation[]> {
    return liveDrivers.map((d) => ({ ...d }))
  }
}

export function getMockBoardReferenceDay(): string {
  return MOCK_DAY
}

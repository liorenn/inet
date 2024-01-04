/* eslint-disable @typescript-eslint/no-unused-vars */
import similarity from 'compute-cosine-similarity'

type property =
  | 'releaseDate'
  | 'screenSize'
  | 'batterySize'
  | 'price'
  | 'storage'
  | 'memory'
  | 'weight'
  | 'cpu'
  | 'gpu'

//number is between 1 to 3
type preference = Partial<Record<property, number>>
const userPreferences: preference = {
  releaseDate: 1,
  screenSize: 2,
  batterySize: 3,
  price: 1,
}

const weightsValues: Record<property, number[] | Date[]> = {
  releaseDate: [
    new Date('2021-06-01'),
    new Date('2022-03-15'),
    new Date('2023-01-01'),
  ],
  screenSize: [5, 6.2, 6.4],
  batterySize: [3500, 3800, 4100],
  price: [600, 900, 1100],
  memory: [8, 16, 32],
  cpu: [2, 4, 6],
  gpu: [2, 4, 6],
  weight: [2, 4, 6],
  storage: [8, 16, 32],
}

type Device = Partial<Record<property | 'name', string | number | Date>>
const devices: Device[] = [
  {
    name: 'Device A',
    releaseDate: '2021-06-01',
    screenSize: 6.2,
    batterySize: 4100,
    price: 900,
  },
  {
    name: 'Device B',
    releaseDate: '2022-03-15',
    screenSize: 6.0,
    batterySize: 3800,
    price: 1100,
  },
  {
    name: 'Device C',
    releaseDate: '2022-03-15',
    screenSize: 5,
    batterySize: 3500,
    price: 600,
  },
]

type recommendedDevice = {
  name: string
  match: number
}

function isBothPropertiesExist(
  property: string,
  originalDevice: Record<string, unknown>,
  comparedDevice: Record<string, unknown>
): boolean {
  return (
    property in originalDevice &&
    property in comparedDevice &&
    originalDevice[property] !== null &&
    comparedDevice[property] !== null
  )
}

function getMatch(originalDevice: Device, comparedDevice: Device) {
  const match = 0
  Object.keys(originalDevice).map((property) => {
    if (isBothPropertiesExist(property, originalDevice, comparedDevice)) {
      return match
    }
  })
  return match
}

function getRecommendedDevices(device: Device, devices: Device[]) {
  const recommended: recommendedDevice[] = []
  devices.forEach((device) => {
    recommended.push({
      name: device.name as string,
      match: getMatch(device, device),
    })
  })
  return { device: device.name, recommended: recommended }
}

function matchDevices(userPreferences: preference, devices: Device[]) {
  return devices
}

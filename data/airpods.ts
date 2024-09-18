import { colorQuery, createColorsObjects, createEnumObject } from '~/data/utils'

type airpodsType = {
  model: string
  name: string
  releaseDate: Date
  chipset: string
  releasePrice: number
  imageAmount: number
  depth: number
  height: number
  width: number
  weight: number
  batterySize: number
  magsafe?: boolean
  resistanceRating: string
  biometricFeature: {
    connect: {
      name: string
    }
  }
  deviceConnector: {
    connect: {
      name: string
    }
  }
  deviceType: {
    connect: {
      name: string
    }
  }
  devicesColors: colorQuery
}

export const airpods: airpodsType[] = [
  {
    model: 'airpods3',
    name: 'Airpods 3',
    batterySize: 345,
    releaseDate: new Date('2021-10-10'),
    chipset: 'H1',
    imageAmount: 3,
    releasePrice: 169,
    resistanceRating: 'IP68',
    height: 46.4,
    width: 54.4,
    depth: 21.38,
    weight: 42.19,
    magsafe: true,
    biometricFeature: createEnumObject('none'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('airpods'),
    devicesColors: createColorsObjects(['White'])
  },
  {
    model: 'airpods2',
    name: 'Airpods 2',
    batterySize: 398,
    releaseDate: new Date('2019-03-20'),
    chipset: 'H1',
    imageAmount: 3,
    releasePrice: 159,
    resistanceRating: 'IPX4',
    height: 53.5,
    width: 44.3,
    depth: 21.3,
    weight: 42.2,
    biometricFeature: createEnumObject('none'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('airpods'),
    devicesColors: createColorsObjects(['White'])
  },
  {
    model: 'airpodspro',
    name: 'Airpods Pro',
    batterySize: 523,
    releaseDate: new Date('2022-09-23'),
    chipset: 'H1',
    imageAmount: 3,
    releasePrice: 249,
    resistanceRating: 'IP54',
    height: 45.2,
    width: 60.6,
    depth: 21.7,
    weight: 56.1,
    magsafe: true,
    biometricFeature: createEnumObject('none'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('airpods'),
    devicesColors: createColorsObjects(['White'])
  },
  {
    model: 'airpodsmax',
    name: 'Airpods Max',
    batterySize: 1328,
    releaseDate: new Date('2021-10-10'),
    chipset: 'H1',
    imageAmount: 5,
    releasePrice: 549,
    resistanceRating: 'IP68',
    height: 187.3,
    width: 168.6,
    depth: 83.4,
    weight: 519.3,
    biometricFeature: createEnumObject('none'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('airpods'),
    devicesColors: createColorsObjects(['White'])
  }
]

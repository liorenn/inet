import { colorQuery, createColorsObjects, createEnumObject } from '~/data/utils'

type MacType = {
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
  gpu: number
  cpu: number
  memory: number
  storage: number
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

export const Macs: MacType[] = [
  {
    model: 'macminim1',
    name: 'Mac Mini M1',
    releaseDate: new Date('2020-11-10'),
    chipset: 'M1',
    imageAmount: 4,
    releasePrice: 699,
    height: 3.6,
    width: 19.7,
    depth: 19.7,
    weight: 1200,
    cpu: 8,
    gpu: 8,
    memory: 16,
    storage: 2000,
    biometricFeature: createEnumObject('passcode'),
    deviceConnector: createEnumObject('ethernet'),
    deviceType: createEnumObject('mac'),
    devicesColors: createColorsObjects(['Silver'])
  },
  {
    model: 'macpro',
    name: 'Mac Pro',
    releaseDate: new Date('2023-06-13'),
    chipset: 'M2 Ultra',
    imageAmount: 3,
    releasePrice: 6999,
    height: 52.9,
    width: 21.8,
    depth: 45.0,
    weight: 16860,
    cpu: 24,
    gpu: 76,
    memory: 192,
    storage: 8000,
    biometricFeature: createEnumObject('passcode'),
    deviceConnector: createEnumObject('ethernet'),
    deviceType: createEnumObject('mac'),
    devicesColors: createColorsObjects(['Silver'])
  },
  {
    model: 'macstudio',
    name: 'Mac Studio',
    releaseDate: new Date('2022-03-18'),
    chipset: 'M1 Max',
    imageAmount: 4,
    releasePrice: 1999,
    height: 9.5,
    width: 19.7,
    depth: 19.7,
    weight: 2700,
    cpu: 20,
    gpu: 64,
    memory: 128,
    storage: 8000,
    biometricFeature: createEnumObject('passcode'),
    deviceConnector: createEnumObject('ethernet'),
    deviceType: createEnumObject('mac'),
    devicesColors: createColorsObjects(['Silver'])
  }
]

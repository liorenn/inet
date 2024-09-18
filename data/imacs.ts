import { colorQuery, createColorsObjects, createEnumObject } from '~/data/utils'

type iMacType = {
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
  screenSize: number
  screenType: string
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

export const iMacs: iMacType[] = [
  {
    model: 'imac24',
    name: 'iMac 24',
    releaseDate: new Date('2021-05-21'),
    chipset: 'M1',
    imageAmount: 7,
    releasePrice: 1299,
    height: 46.1,
    width: 54.7,
    depth: 14.7,
    weight: 4430,
    cpu: 8,
    gpu: 7,
    memory: 8,
    storage: 256,
    screenSize: 24,
    screenType: 'Retina display',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('ethernet'),
    deviceType: createEnumObject('imac'),
    devicesColors: createColorsObjects([
      'Silver',
      'Ocean Blue',
      'Turquoise',
      'Red',
      'Mustard',
      'Orange',
      'Purple'
    ])
  },
  {
    model: 'imac27',
    name: 'iMac 27',
    releaseDate: new Date('2021-05-21'),
    chipset: 'M1',
    imageAmount: 4,
    releasePrice: 1999,
    height: 51.6,
    width: 65.0,
    depth: 20.3,
    weight: 8920,
    cpu: 8,
    gpu: 7,
    memory: 8,
    storage: 512,
    screenSize: 27,
    screenType: 'Retina display',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('ethernet'),
    deviceType: createEnumObject('imac'),
    devicesColors: createColorsObjects(['Silver'])
  }
]

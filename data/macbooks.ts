import { colorQuery, createColorsObjects, createEnumObject } from '~/data/utils'

type MacbookType = {
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
  batterySize: number
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

export const Macbooks: MacbookType[] = [
  {
    model: 'macbookairm1',
    name: 'Macbook Air M1',
    releaseDate: new Date('2020-11-10'),
    chipset: 'M1',
    imageAmount: 6,
    releasePrice: 999,
    height: 1.61,
    width: 30.41,
    depth: 21.24,
    weight: 1290,
    cpu: 8,
    gpu: 7,
    memory: 16,
    storage: 2000,
    batterySize: 4379,
    screenSize: 13.3,
    screenType: 'Retina display',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('usb_c'),
    deviceType: createEnumObject('macbook'),
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
    model: 'macbookpro13',
    name: 'Macbook Pro 13',
    releaseDate: new Date('2020-11-10'),
    chipset: 'M1',
    imageAmount: 5,
    releasePrice: 1499,
    height: 1.56,
    width: 30.41,
    depth: 21.24,
    weight: 1400,
    cpu: 8,
    gpu: 8,
    memory: 16,
    storage: 2000,
    batterySize: 5152,
    screenSize: 13.3,
    screenType: 'Retina display',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('usb_c'),
    deviceType: createEnumObject('macbook'),
    devicesColors: createColorsObjects(['Silver'])
  },
  {
    model: 'macbookpro14',
    name: 'Macbook Pro 14',
    releaseDate: new Date('2021-10-26'),
    chipset: 'M1 Pro',
    imageAmount: 5,
    releasePrice: 1999,
    height: 1.55,
    width: 31.26,
    depth: 22.12,
    weight: 1600,
    cpu: 10,
    gpu: 32,
    memory: 64,
    storage: 8000,
    batterySize: 6100,
    screenSize: 14.2,
    screenType: 'Retina display',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('usb_c'),
    deviceType: createEnumObject('macbook'),
    devicesColors: createColorsObjects(['Silver'])
  }
]

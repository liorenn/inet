import {
  cameraQuery,
  colorQuery,
  createCamerasObject,
  createColorsObjects,
  createEnumObject
} from '~/data/utils'

type iPadType = {
  model: string
  name: string
  releaseDate: Date
  chipset: string
  releaseOS: string
  releasePrice: number
  imageAmount: number
  depth: number
  height: number
  width: number
  weight: number
  gpu: number
  cpu: number
  batterySize: number
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
  cameras: cameraQuery
  devicesColors: colorQuery
}

export const iPads: iPadType[] = [
  {
    model: 'ipad8',
    name: 'iPad 8',
    releaseDate: new Date('2020-09-15'),
    releaseOS: 'iPadOS 14',
    releasePrice: 329,
    chipset: 'A12 Bionic',
    imageAmount: 3,
    height: 250.6,
    width: 174.1,
    depth: 7.5,
    weight: 490,
    cpu: 6,
    gpu: 4,
    batterySize: 8686,
    storage: 32,
    screenSize: 10.2,
    screenType: 'Retina display',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('ipad'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 8 },
      { cameraType: 'selfie', megaPixel: 1.2 }
    ]),
    devicesColors: createColorsObjects(['Silver', 'Rose Pink', 'Space Black'])
  },
  {
    model: 'ipad9',
    name: 'iPad 9',
    releaseDate: new Date('2021-09-14'),
    releaseOS: 'iPadOS 15',
    releasePrice: 329,
    chipset: 'A13 Bionic',
    imageAmount: 2,
    height: 250.6,
    width: 174.1,
    depth: 7.5,
    weight: 487,
    cpu: 6,
    gpu: 4,
    batterySize: 8557,
    storage: 64,
    screenSize: 10.2,
    screenType: 'Retina display',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('ipad'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 8 },
      { cameraType: 'selfie', megaPixel: 12 }
    ]),
    devicesColors: createColorsObjects(['White', 'Space Black'])
  },
  {
    model: 'ipad10',
    name: 'iPad 10',
    releaseDate: new Date('2022-10-26'),
    releaseOS: 'iPadOS 16.1',
    releasePrice: 449,
    chipset: 'A14 Bionic',
    imageAmount: 4,
    height: 248.6,
    width: 179.5,
    depth: 7,
    weight: 477,
    cpu: 6,
    gpu: 4,
    batterySize: 7606,
    storage: 64,
    screenSize: 10.9,
    screenType: 'Liquid Retina display',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('usb_c'),
    deviceType: createEnumObject('ipad'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 8 },
      { cameraType: 'selfie', megaPixel: 12 }
    ]),
    devicesColors: createColorsObjects(['Silver', 'Yellow', 'Ocean Blue', 'Light Pink'])
  },
  {
    model: 'ipadair4',
    name: 'iPad Air 4',
    releaseDate: new Date('2020-09-15'),
    releaseOS: 'iPadOS 14.1',
    releasePrice: 599,
    chipset: 'A14 Bionic',
    imageAmount: 5,
    height: 247.6,
    width: 178.5,
    depth: 6.1,
    weight: 458,
    cpu: 6,
    gpu: 4,
    batterySize: 7606,
    storage: 64,
    screenSize: 10.9,
    screenType: 'Liquid Retina display',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('ipad'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'selfie', megaPixel: 7 }
    ]),
    devicesColors: createColorsObjects([
      'Light Green',
      'Space Black',
      'Silver',
      'Light Pink',
      'Light Blue'
    ])
  },
  {
    model: 'ipadair5',
    name: 'iPad Air 5',
    releaseDate: new Date('2022-03-8'),
    releaseOS: 'iPadOS 15',
    releasePrice: 599,
    chipset: 'M1',
    imageAmount: 5,
    height: 247.6,
    width: 178.5,
    depth: 6.1,
    weight: 458,
    cpu: 8,
    gpu: 8,
    batterySize: 7606,
    storage: 64,
    screenSize: 10.9,
    screenType: 'Liquid Retina display',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('ipad'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'selfie', megaPixel: 12 }
    ]),
    devicesColors: createColorsObjects([
      'Ocean Blue',
      'Space Black',
      'Gold',
      'Light Pink',
      'Light Purple'
    ])
  },
  {
    model: 'ipadmini5',
    name: 'iPad Mini 5',
    releaseDate: new Date('2019-03-18'),
    releaseOS: 'iOS 12',
    releasePrice: 400,
    chipset: 'A12 Bionic',
    imageAmount: 3,
    height: 203.2,
    width: 134.8,
    depth: 6.1,
    weight: 300.5,
    cpu: 6,
    gpu: 4,
    batterySize: 5124,
    storage: 64,
    screenSize: 7.9,
    screenType: 'Retina display',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('ipad'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 8 },
      { cameraType: 'selfie', megaPixel: 7 }
    ]),
    devicesColors: createColorsObjects(['Silver', 'Rose Pink', 'Space Black'])
  },
  {
    model: 'ipadmini6',
    name: 'iPad Mini 6',
    releaseDate: new Date('2021-09-14'),
    releaseOS: 'iPadOS 15',
    releasePrice: 499,
    chipset: 'A15 Bionic',
    imageAmount: 4,
    height: 146.6,
    width: 70.6,
    depth: 8.3,
    weight: 187,
    cpu: 6,
    gpu: 5,
    batterySize: 5124,
    storage: 64,
    screenSize: 8.3,
    screenType: 'Liquid Retina display',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('usb_c'),
    deviceType: createEnumObject('ipad'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'selfie', megaPixel: 12 }
    ]),
    devicesColors: createColorsObjects(['Gold', 'Space Black', 'Light Pink', 'Light Purple'])
  },
  {
    model: 'ipadpro3',
    name: 'iPad Pro 3',
    releaseDate: new Date('2018-11-7'),
    releaseOS: 'iOS 12',
    releasePrice: 999,
    chipset: 'A12X Bionic',
    imageAmount: 2,
    height: 280.6,
    width: 214.9,
    depth: 5.9,
    weight: 631,
    cpu: 8,
    gpu: 7,
    batterySize: 9720,
    storage: 64,
    screenSize: 12.9,
    screenType: 'Liquid Retina display',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('usb_c'),
    deviceType: createEnumObject('ipad'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'selfie', megaPixel: 7 }
    ]),
    devicesColors: createColorsObjects(['White', 'Space Black'])
  },
  {
    model: 'ipadpro4',
    name: 'iPad Pro 4',
    releaseDate: new Date('2020-03-24'),
    releaseOS: 'iPadOS 14	',
    releasePrice: 999,
    chipset: 'A12Z Bionic',
    imageAmount: 2,
    height: 280.6,
    width: 214.9,
    depth: 5.9,
    weight: 641,
    cpu: 8,
    gpu: 8,
    batterySize: 9720,
    storage: 128,
    screenSize: 12.9,
    screenType: 'Liquid Retina display',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('usb_c'),
    deviceType: createEnumObject('ipad'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'selfie', megaPixel: 7 },
      { cameraType: 'ultrawide', megaPixel: 10 }
    ]),
    devicesColors: createColorsObjects(['White', 'Space Black'])
  },
  {
    model: 'ipadpro5',
    name: 'iPad Pro 5',
    releaseDate: new Date('2021-05-21'),
    releaseOS: 'iPadOS 14',
    releasePrice: 1099,
    chipset: 'M1',
    imageAmount: 2,
    height: 280.6,
    width: 214.9,
    depth: 6.4,
    weight: 682,
    cpu: 8,
    gpu: 8,
    batterySize: 10758,
    storage: 64,
    screenSize: 12.9,
    screenType: 'Liquid Retina XDR display',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('usb_c'),
    deviceType: createEnumObject('ipad'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'selfie', megaPixel: 12 },
      { cameraType: 'ultrawide', megaPixel: 10 }
    ]),
    devicesColors: createColorsObjects(['White', 'Space Black'])
  },
  {
    model: 'ipadpro6',
    name: 'iPad Pro 6',
    releaseDate: new Date('2022-10-18'),
    releaseOS: 'iPadOS 16.1',
    releasePrice: 1099,
    chipset: 'M2',
    imageAmount: 2,
    height: 280.6,
    width: 214.9,
    depth: 6.4,
    weight: 682,
    cpu: 8,
    gpu: 10,
    batterySize: 10758,
    storage: 128,
    screenSize: 12.9,
    screenType: 'Liquid Retina XDR display',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('usb_c'),
    deviceType: createEnumObject('ipad'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'selfie', megaPixel: 12 },
      { cameraType: 'ultrawide', megaPixel: 10 }
    ]),
    devicesColors: createColorsObjects(['White', 'Space Black'])
  }
]

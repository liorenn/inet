import {
  cameraQuery,
  colorQuery,
  createCamerasObject,
  createColorsObjects,
  createEnumObject
} from '~/data/utils'

type iPhoneType = {
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
  batterySize: number
  magsafe: boolean
  storage: number
  memory: number
  screenSize: number
  screenType: string
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
  cameras: cameraQuery
  devicesColors: colorQuery
}

export const iPhones: iPhoneType[] = [
  {
    model: 'iphone15pro',
    name: 'iPhone 15 Pro',
    releaseDate: new Date('2023-09-22'),
    chipset: 'A17 Pro 3nm',
    releaseOS: 'iOS 17',
    releasePrice: 999,
    imageAmount: 4,
    depth: 8.3,
    height: 146.6,
    width: 70.6,
    weight: 187,
    batterySize: 3274,
    magsafe: true,
    memory: 8,
    storage: 128,
    screenSize: 6.1,
    screenType: 'OLED',
    resistanceRating: 'IP68',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('usb_c'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { megaPixel: 48, cameraType: 'wide' },
      { megaPixel: 12, cameraType: 'ultrawide' },
      { megaPixel: 12, cameraType: 'telephoto' },
      { megaPixel: 12, cameraType: 'selfie' }
    ]),
    devicesColors: createColorsObjects(['Blue Gray', 'Netural Gray', 'Silver', 'Space Black'])
  },
  {
    model: 'iphone15',
    name: 'iPhone 15',
    releaseDate: new Date('2023-09-22'),
    chipset: 'A16 4nm',
    releaseOS: 'iOS 17',
    releasePrice: 799,
    imageAmount: 5,
    height: 147.6,
    width: 71.6,
    depth: 7.8,
    weight: 171,
    batterySize: 3274,
    magsafe: true,
    memory: 6,
    storage: 128,
    screenSize: 6.1,
    screenType: 'OLED',
    resistanceRating: 'IP68',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('usb_c'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { megaPixel: 48, cameraType: 'wide' },
      { megaPixel: 12, cameraType: 'ultrawide' },
      { megaPixel: 12, cameraType: 'selfie' }
    ]),
    devicesColors: createColorsObjects([
      'Light Blue',
      'Light Green',
      'Space Black',
      'Light Yellow',
      'Light Pink'
    ])
  },
  {
    model: 'iphone14pro',
    name: 'iPhone 14 Pro',
    releaseDate: new Date('2022-09-16'),
    chipset: 'A16 4nm',
    releaseOS: 'iOS 16',
    releasePrice: 999,
    imageAmount: 4,
    height: 147.5,
    width: 71.5,
    depth: 7.85,
    weight: 206,
    batterySize: 3200,
    magsafe: true,
    memory: 6,
    storage: 128,
    screenSize: 6.1,
    screenType: 'OLED',
    resistanceRating: 'IP68',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { megaPixel: 48, cameraType: 'wide' },
      { megaPixel: 12, cameraType: 'ultrawide' },
      { megaPixel: 12, cameraType: 'telephoto' },
      { megaPixel: 12, cameraType: 'selfie' }
    ]),
    devicesColors: createColorsObjects(['Space Black', 'Silver', 'Dark Purple', 'Gold'])
  },
  {
    model: 'iphone14',
    name: 'iPhone 14',
    releaseDate: new Date('2022-09-16'),
    chipset: 'A15 5nm',
    releaseOS: 'iOS 16',
    releasePrice: 799,
    imageAmount: 6,
    height: 146.7,
    width: 71.5,
    depth: 7.8,
    weight: 172,
    batterySize: 3279,
    magsafe: true,
    memory: 6,
    storage: 128,
    screenSize: 6.1,
    screenType: 'OLED',
    resistanceRating: 'IP68',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { megaPixel: 12, cameraType: 'wide' },
      { megaPixel: 12, cameraType: 'ultrawide' },
      { megaPixel: 12, cameraType: 'selfie' }
    ]),
    devicesColors: createColorsObjects(['Light Blue', 'Light Purple', 'Midnight', 'Yellow', 'Red'])
  },
  {
    model: 'iphonese3',
    name: 'iPhone SE 3',
    releaseDate: new Date('2022-03-08'),
    chipset: 'A15 5nm',
    releaseOS: 'iOS 15',
    releasePrice: 799,
    imageAmount: 3,
    height: 138.4,
    width: 67.3,
    depth: 7.3,
    weight: 144,
    batterySize: 2018,
    magsafe: false,
    memory: 4,
    storage: 64,
    screenSize: 4.7,
    screenType: 'LCD',
    resistanceRating: 'IP67',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { megaPixel: 12, cameraType: 'wide' },
      { megaPixel: 7, cameraType: 'selfie' }
    ]),
    devicesColors: createColorsObjects(['Black', 'White', 'Red'])
  },
  {
    model: 'iphone13pro',
    name: 'iPhone 13 Pro',
    releaseDate: new Date('2021-09-14'),
    chipset: 'A15 5nm',
    releaseOS: 'iOS 15',
    releasePrice: 999,
    imageAmount: 5,
    height: 146.7,
    width: 71.5,
    depth: 7.4,
    weight: 189,
    batterySize: 3095,
    magsafe: true,
    memory: 6,
    storage: 128,
    screenSize: 6.1,
    screenType: 'OLED',
    resistanceRating: 'IP68',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'ultrawide', megaPixel: 12 },
      { cameraType: 'telephoto', megaPixel: 12 },
      { cameraType: 'selfie', megaPixel: 12 }
    ]),
    devicesColors: createColorsObjects([
      'Silver',
      'Space Black',
      'Gold',
      'Light Blue',
      'Dark Green'
    ])
  },
  {
    model: 'iphone12pro',
    name: 'iPhone 12 Pro',
    releaseDate: new Date('2020-10-23'),
    releaseOS: 'iOS 13',
    releasePrice: 999,
    chipset: 'A14 5nm',
    imageAmount: 4,
    height: 146.7,
    width: 71.5,
    depth: 7.65,
    weight: 204,
    batterySize: 2815,
    storage: 128,
    memory: 6,
    magsafe: true,
    screenSize: 6.1,
    screenType: 'OLED',
    resistanceRating: 'IP68',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'ultrawide', megaPixel: 12 },
      { cameraType: 'telephoto', megaPixel: 12 },
      { cameraType: 'selfie', megaPixel: 12 }
    ]),
    devicesColors: createColorsObjects(['Silver', 'Space Black', 'Gold', 'Ocean Blue'])
  },
  {
    model: 'iphone13',
    name: 'iPhone 13',
    releaseDate: new Date('2021-09-14'),
    chipset: 'A15 5nm',
    releaseOS: 'iOS 16',
    releasePrice: 799,
    imageAmount: 6,
    height: 146.7,
    width: 71.5,
    depth: 7.65,
    weight: 174,
    batterySize: 3227,
    magsafe: true,
    memory: 4,
    storage: 128,
    screenSize: 6.1,
    screenType: 'OLED',
    resistanceRating: 'IP68',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { megaPixel: 12, cameraType: 'wide' },
      { megaPixel: 12, cameraType: 'ultrawide' },
      { megaPixel: 12, cameraType: 'selfie' }
    ]),
    devicesColors: createColorsObjects(['Ocean Blue', 'Light Pink', 'Midnight', 'White', 'Red'])
  },
  {
    model: 'iphone12',
    name: 'iPhone 12',
    releaseDate: new Date('2020-10-23'),
    releaseOS: 'iOS 13',
    releasePrice: 799,
    chipset: 'A14 5nm',
    imageAmount: 6,
    height: 146.7,
    width: 71.5,
    depth: 7.4,
    weight: 164,
    batterySize: 2815,
    storage: 64,
    memory: 4,
    magsafe: true,
    screenSize: 6.1,
    screenType: 'OLED',
    resistanceRating: 'IP68',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'ultrawide', megaPixel: 12 }
    ]),
    devicesColors: createColorsObjects([
      'Ocean Blue',
      'Black',
      'White',
      'Purple',
      'Red',
      'Light Green'
    ])
  },
  {
    model: 'iphonese2',
    name: 'iPhone SE 2',
    releaseDate: new Date('2020-04-24'),
    releaseOS: 'iOS 13',
    releasePrice: 399,
    chipset: 'A13 7nm',
    imageAmount: 3,
    height: 138.4,
    width: 67.3,
    depth: 7.3,
    weight: 148,
    batterySize: 1821,
    storage: 64,
    memory: 4,
    magsafe: false,
    screenSize: 4.7,
    screenType: 'IPS LCD',
    resistanceRating: 'IP67',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([{ cameraType: 'wide', megaPixel: 12 }]),
    devicesColors: createColorsObjects(['Black', 'White', 'Dark Red'])
  },
  {
    model: 'iphone11pro',
    name: 'iPhone 11 pro',
    releaseDate: new Date('2019-09-20'),
    releaseOS: 'iOS 13',
    releasePrice: 999,
    chipset: 'A13 7nm',
    imageAmount: 4,
    height: 144.0,
    width: 71.4,
    depth: 8.1,
    weight: 188,
    batterySize: 3095,
    storage: 64,
    memory: 4,
    magsafe: false,
    screenSize: 5.8,
    screenType: 'OLED',
    resistanceRating: 'IP68',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'ultrawide', megaPixel: 12 },
      { cameraType: 'telephoto', megaPixel: 12 }
    ]),
    devicesColors: createColorsObjects(['Dark Green', 'Silver', 'Gold', 'Space Black'])
  },
  {
    model: 'iphone11',
    name: 'iPhone 11',
    releaseDate: new Date('2019-09-20'),
    releaseOS: 'iOS 13',
    releasePrice: 699,
    chipset: 'A13 7nm',
    imageAmount: 6,
    height: 150.9,
    width: 75.7,
    depth: 8.3,
    weight: 194,
    batterySize: 3110,
    storage: 64,
    memory: 4,
    magsafe: false,
    screenSize: 6.1,
    screenType: 'LCD',
    resistanceRating: 'IP68',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'ultrawide', megaPixel: 12 }
    ]),
    devicesColors: createColorsObjects([
      'White',
      'Black',
      'Yellow',
      'Dark Red',
      'Light Purple',
      'Light Green'
    ])
  },
  {
    model: 'iphonexs',
    name: 'iPhone xs',
    releaseDate: new Date('2018-09-21'),
    releaseOS: 'iOS 12',
    releasePrice: 999,
    chipset: 'A12 7nm',
    imageAmount: 3,
    height: 143.6,
    width: 70.9,
    depth: 7.7,
    weight: 177,
    batterySize: 2942,
    storage: 64,
    memory: 4,
    magsafe: false,
    screenSize: 6,
    screenType: 'OLED',
    resistanceRating: 'IP68',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'telephoto', megaPixel: 12 }
    ]),
    devicesColors: createColorsObjects(['Space Black', 'Silver', 'Light Pink'])
  },
  {
    model: 'iphonexr',
    name: 'iPhone xr',
    releaseDate: new Date('2018-010-26'),
    releaseOS: 'iOS 12',
    releasePrice: 749,
    chipset: 'A15 5nm',
    imageAmount: 6,
    height: 150.9,
    width: 75.7,
    depth: 8.3,
    weight: 194,
    batterySize: 3095,
    storage: 64,
    memory: 6,
    magsafe: false,
    screenSize: 6.1,
    screenType: 'OLED',
    resistanceRating: 'IP67',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'ultrawide', megaPixel: 12 },
      { cameraType: 'telephoto', megaPixel: 12 }
    ]),
    devicesColors: createColorsObjects([
      'Black',
      'White',
      'Orange',
      'Dark Red',
      'Yellow',
      'Light Blue'
    ])
  },
  {
    model: 'iphonex',
    name: 'iPhone x',
    releaseDate: new Date('2017-011-3'),
    releaseOS: 'iOS 11',
    releasePrice: 999,
    chipset: 'A11 10nm',
    imageAmount: 2,
    height: 143.6,
    width: 70.9,
    depth: 7.7,
    weight: 174,
    batterySize: 3095,
    storage: 64,
    memory: 3,
    magsafe: false,
    screenSize: 5.8,
    screenType: 'OLED',
    resistanceRating: 'IP68',
    biometricFeature: createEnumObject('face_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'ultrawide', megaPixel: 12 },
      { cameraType: 'telephoto', megaPixel: 12 }
    ]),
    devicesColors: createColorsObjects(['White', 'Space Black'])
  },
  {
    model: 'iphone8plus',
    name: 'iPhone 8 plus',
    releaseDate: new Date('2017-09-22'),
    releaseOS: 'iOS 11',
    releasePrice: 949,
    chipset: 'A11 10nm',
    imageAmount: 4,
    height: 158.4,
    width: 78.1,
    depth: 7.5,
    weight: 202,
    batterySize: 3095,
    storage: 64,
    memory: 3,
    magsafe: false,
    screenSize: 5.5,
    screenType: 'IPS LCD',
    resistanceRating: 'IP67',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'telephoto', megaPixel: 12 }
    ]),
    devicesColors: createColorsObjects(['Pink', 'Space Black', 'Dark Red', 'Silver'])
  },
  {
    model: 'iphone8',
    name: 'iPhone 8',
    releaseDate: new Date('2017-09-22'),
    releaseOS: 'iOS 11',
    releasePrice: 849,
    chipset: 'A11 10nm',
    imageAmount: 4,
    height: 138.4,
    width: 67.3,
    depth: 7.3,
    weight: 148,
    batterySize: 1821,
    storage: 64,
    memory: 2,
    magsafe: false,
    screenSize: 4.7,
    screenType: 'IPS LCD',
    resistanceRating: 'IP67',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([{ cameraType: 'wide', megaPixel: 12 }]),
    devicesColors: createColorsObjects(['Silver', 'Space Black', 'Dark Red', 'Pink'])
  },
  {
    model: 'iphone7plus',
    name: 'iPhone 7 plus',
    releaseDate: new Date('2016-09-16'),
    releaseOS: 'iOS 10',
    releasePrice: 969,
    chipset: 'A10 Fusion 16nm',
    imageAmount: 6,
    height: 158.2,
    width: 77.9,
    depth: 7.3,
    weight: 188,
    batterySize: 2900,
    storage: 32,
    memory: 3,
    magsafe: false,
    screenSize: 5.5,
    screenType: 'IPS LCD',
    resistanceRating: 'IP67',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([
      { cameraType: 'wide', megaPixel: 12 },
      { cameraType: 'telephoto', megaPixel: 12 }
    ]),
    devicesColors: createColorsObjects([
      'Silver',
      'Space Black',
      'Black',
      'Pink',
      'Dark Red',
      'Gold'
    ])
  },
  {
    model: 'iphone7',
    name: 'iPhone 7',
    releaseDate: new Date('2016-09-16'),
    releaseOS: 'iOS 9',
    releasePrice: 849,
    chipset: 'A10 Fusion 16nm',
    imageAmount: 6,
    height: 138.3,
    width: 67.1,
    depth: 7.1,
    weight: 138,
    batterySize: 1960,
    storage: 32,
    memory: 2,
    magsafe: false,
    screenSize: 4.7,
    screenType: 'IPS LCD',
    resistanceRating: 'IP67',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([{ cameraType: 'wide', megaPixel: 12 }]),
    devicesColors: createColorsObjects([
      'Space Black',
      'Black',
      'Silver',
      'Pink',
      'Dark Red',
      'Gold'
    ])
  },
  {
    model: 'iphonese1',
    name: 'iPhone SE 1',
    releaseDate: new Date('2016-03-31'),
    releaseOS: 'iOS 9',
    releasePrice: 499,
    chipset: 'A9',
    imageAmount: 4,
    height: 123.8,
    width: 58.6,
    depth: 7.6,
    weight: 113,
    batterySize: 1624,
    storage: 32,
    memory: 2,
    magsafe: false,
    screenSize: 4,
    screenType: 'IPS LCD',
    resistanceRating: 'IP67',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([{ cameraType: 'wide', megaPixel: 12 }]),
    devicesColors: createColorsObjects(['Gold', 'Pink', 'Space Black', 'Silver'])
  },
  {
    model: 'iphone6s',
    name: 'iPhone 6s',
    releaseDate: new Date('2015-09-25'),
    releaseOS: 'iOS 9',
    releasePrice: 849,
    chipset: 'A9',
    imageAmount: 4,
    height: 138.3,
    width: 67.1,
    depth: 7.1,
    weight: 143,
    batterySize: 1715,
    storage: 32,
    memory: 2,
    magsafe: false,
    screenSize: 4.7,
    screenType: 'IPS LCD',
    resistanceRating: 'IP67',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([{ cameraType: 'wide', megaPixel: 12 }]),
    devicesColors: createColorsObjects(['Pink', 'Silver', 'Space Black', 'Gold'])
  },
  {
    model: 'iphone6',
    name: 'iPhone 6',
    releaseDate: new Date('2014-09-19'),
    releaseOS: 'iOS 8',
    releasePrice: 849,
    chipset: 'A8',
    imageAmount: 3,
    height: 138.1,
    width: 67.0,
    depth: 6.9,
    weight: 129,
    batterySize: 1810,
    storage: 16,
    memory: 1,
    magsafe: false,
    screenSize: 4.7,
    screenType: 'IPS LCD',
    resistanceRating: 'IP67',
    biometricFeature: createEnumObject('touch_id'),
    deviceConnector: createEnumObject('lightning'),
    deviceType: createEnumObject('iphone'),
    cameras: createCamerasObject([{ cameraType: 'wide', megaPixel: 12 }]),
    devicesColors: createColorsObjects(['Space Black', 'Silver', 'Gold'])
  }
]

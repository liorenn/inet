import type { Device } from '@prisma/client'
import { FormatDate } from '@/utils/utils'

export type categoriesType = {
  name: string
  specs: specsArrayType
}[]

export type specsArrayType = specsDataType | mergedCameraType[]

export type specsDataType = {
  property: string
  values: (string | null)[] | colorsSpecsType[]
}[]

export type categoryType = {
  name: string
  specs: specsType
}

export type specsType = specDataType[] | camerasSpecsType[]

export type specDataType = {
  property: string
  value: (string | null) | colorsSpecsType
}

export type camerasSpecsType = {
  type: string
  megapixel: number
}

export type colorsSpecsType = {
  color: {
    name: string
    hex: string
  }
}[]

export type deviceSpecsType =
  | {
      cameras: camerasSpecsType[]
      colors: colorsSpecsType
    } & Device

export type mergedCameraType = {
  type: string
  megapixels: (number | null)[]
}

function mergeCameraTypes(arrays: camerasSpecsType[][]): mergedCameraType[] {
  const mergedMap = new Map<string, (number | null)[]>()
  arrays.forEach((array) => {
    array.forEach(({ type, megapixel }) => {
      if (!mergedMap.has(type)) {
        const nullArray = new Array(arrays.length).fill(null)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        mergedMap.set(type, nullArray)
      }
      const index = arrays.indexOf(array)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      mergedMap.get(type)![index] = megapixel
    })
  })
  const mergedArray: mergedCameraType[] = []
  mergedMap.forEach((megapixels, type) => {
    mergedArray.push({ type, megapixels })
  })
  return mergedArray
}

export function formatArrSpecs(devices: deviceSpecsType[]): categoriesType {
  const mergedCameras: categoriesType = [
    {
      name: 'name',
      specs: [{ property: 'name', values: devices.map((device) => device.name) }],
    },
    {
      name: 'display',
      specs: [
        {
          property: 'screenSize',
          values: devices.map((device) =>
            device.screenSize ? device.screenSize.toString() : null
          ),
        },
        {
          property: 'screenType',
          values: devices.map((device) =>
            device.screenType ? device.screenType.toString() : null
          ),
        },
      ],
    },
    {
      name: 'battery',
      specs: [
        {
          property: 'batterySize',
          values: devices.map((device) =>
            device.batterySize ? device.batterySize.toString() : null
          ),
        },
      ],
    },
    {
      name: 'hardware',
      specs: [
        {
          property: 'chipset',
          values: devices.map((device) => (device.chipset ? device.chipset.toString() : null)),
        },
        {
          property: 'memory',
          values: devices.map((device) => (device.memory ? device.memory.toString() : null)),
        },
        {
          property: 'storage',
          values: devices.map((device) => (device.storage ? device.storage.toString() : null)),
        },
        {
          property: 'releaseOS',
          values: devices.map((device) => (device.releaseOS ? device.releaseOS.toString() : null)),
        },
      ],
    },
    {
      name: 'dimensions',
      specs: [
        {
          property: 'weight',
          values: devices.map((device) => (device.weight ? device.weight.toString() : null)),
        },
        {
          property: 'height',
          values: devices.map((device) => (device.height ? device.height.toString() : null)),
        },
        {
          property: 'width',
          values: devices.map((device) => (device.width ? device.width.toString() : null)),
        },
        {
          property: 'depth',
          values: devices.map((device) => (device.depth ? device.depth.toString() : null)),
        },
      ],
    },
    {
      name: 'cameras',
      specs: mergeCameraTypes(devices.map((device) => device.cameras)),
    },
    {
      name: 'features',
      specs: [
        {
          property: 'biometrics',
          values: devices.map((device) =>
            device.biometrics ? device.biometrics.toString() : null
          ),
        },
        {
          property: 'resistanceRating',
          values: devices.map((device) =>
            device.resistanceRating ? device.resistanceRating.toString() : null
          ),
        },
      ],
    },
    {
      name: 'availability',
      specs: [
        {
          property: 'releaseDate',
          values: devices.map((device) =>
            device.releaseDate ? FormatDate(device.releaseDate) : null
          ),
        },
        {
          property: 'releasePrice',
          values: devices.map((device) =>
            device.releasePrice ? device.releasePrice.toString() : null
          ),
        },
        {
          property: 'price',
          values: devices.map((device) => (device.price >= 0 ? device.price.toString() : null)),
        },
        {
          property: 'colors',
          values: devices.map((device) => device.colors),
        },
      ],
    },
  ]
  return mergedCameras
}

export function formatSpecs(device: deviceSpecsType): categoryType[] {
  const categories: categoryType[] = [
    {
      name: 'display',
      specs: [
        {
          property: 'screenSize',
          value: device.screenSize ? device.screenSize.toString() : null,
        },
        {
          property: 'screenType',
          value: device.screenType ? device.screenType.toString() : null,
        },
      ],
    },
    {
      name: 'battery',
      specs: [
        {
          property: 'batterySize',
          value: device.batterySize ? device.batterySize.toString() : null,
        },
      ],
    },
    {
      name: 'hardware',
      specs: [
        {
          property: 'chipset',
          value: device.chipset ? device.chipset.toString() : null,
        },
        {
          property: 'memory',
          value: device.memory ? device.memory.toString() : null,
        },
        {
          property: 'storage',
          value: device.storage ? device.storage.toString() : null,
        },
        {
          property: 'releaseOS',
          value: device.releaseOS ? device.releaseOS.toString() : null,
        },
      ],
    },
    {
      name: 'dimensions',
      specs: [
        {
          property: 'weight',
          value: device.weight ? device.weight.toString() : null,
        },
        {
          property: 'height',
          value: device.height ? device.height.toString() : null,
        },
        {
          property: 'width',
          value: device.width ? device.width.toString() : null,
        },
        {
          property: 'depth',
          value: device.depth ? device.depth.toString() : null,
        },
      ],
    },
    {
      name: 'cameras',
      specs: device.cameras,
    },
    {
      name: 'features',
      specs: [
        {
          property: 'biometrics',
          value: device.biometrics ? device.biometrics.toString() : null,
        },
        {
          property: 'resistanceRating',
          value: device.resistanceRating ? device.resistanceRating.toString() : null,
        },
      ],
    },
    {
      name: 'availability',
      specs: [
        {
          property: 'releaseDate',
          value: device.releaseDate ? FormatDate(device.releaseDate) : null,
        },
        {
          property: 'releasePrice',
          value: device.releasePrice ? device.releasePrice.toString() : null,
        },
        {
          property: 'price',
          value: device.price > 0 ? device.price.toString() : null,
        },
        {
          property: 'colors',
          value: device.colors,
        },
      ],
    },
  ]

  return categories
}

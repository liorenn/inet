import type { Device } from '@prisma/client' // Define the type for the 'Device' imported from '@prisma/client'
import { FormatDate } from '@/utils/utils' // Import the date format function

// Define a type for an array of categories, each containing a name and an array of specs
type CategoriesType = {
  name: string
  specs: SpecsArrayType
}[]

// Define a union type for the specs array, which can be either of type 'specsDataType' or 'mergedCameraType'
export type SpecsArrayType = SpecsDataType | MergedCameraType[]

// Define a type for the specs data, which consists of a property and an array of values or color specs
export type SpecsDataType = {
  property: string
  values: (string | null)[] | ColorsSpecsType[]
}[]

// Define a type for a category, which contains a name and an array of specs
type CategoryType = {
  name: string
  specs: SpecsType
}

// Define a union type for the specs, which can be either of type 'specDataType' or 'camerasSpecsType'
export type SpecsType = SpecDataType[] | CamerasSpecsType[]

// Define a type for the spec data, which consists of a property and a value or color specs
export type SpecDataType = {
  property: string
  value: (string | null) | ColorsSpecsType
}

// Define a type for the camera specs, which contains the type and megapixel properties
export type CamerasSpecsType = {
  type: string
  megapixel: number
}

// Define a type for the color specs, which contains an array of color objects with name and hex properties
export type ColorsSpecsType = {
  color: {
    name: string
    hex: string
  }
}[]

// Define a type for the device specs, which is a union of camera specs, color specs, and the 'Device' type
export type DeviceSpecsType =
  | {
      cameras: CamerasSpecsType[]
      colors: ColorsSpecsType
    } & Device

// Define a type for the merged camera, which contains the type and an array of megapixels
export type MergedCameraType = {
  type: string
  megapixels: (number | null)[]
}

function mergeCameraTypes(arrays: CamerasSpecsType[][]): MergedCameraType[] {
  const mergedMap = new Map<string, (number | null)[]>() // Create a map to store the merged values
  arrays.forEach((array) => {
    array.forEach(({ type, megapixel }) => {
      if (!mergedMap.has(type)) {
        // Check if the type exists in the map
        const nullArray = new Array(arrays.length).fill(null) // Create an array of null values with the same length as the arrays
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        mergedMap.set(type, nullArray) // Set the value in the map
      }
      const index = arrays.indexOf(array) // Get the index of the array in the arrays array
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      mergedMap.get(type)![index] = megapixel // Set the value in the map
    })
  })
  const mergedArray: MergedCameraType[] = [] // Create an array to store the merged values
  mergedMap.forEach((megapixels, type) => {
    // Iterate over the map
    mergedArray.push({ type, megapixels }) // Push the values to the array
  })
  return mergedArray // Return the array
}

export function formatArrSpecs(devices: DeviceSpecsType[]): CategoriesType {
  // Define a function that takes an array of devices and returns an array of categories
  const mergedCameras: CategoriesType = [
    // Define an array of categories
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
  return mergedCameras // Return the array
}

export function formatSpecs(device: DeviceSpecsType): CategoryType[] {
  // Define a function that takes a device and returns an array of categories
  const categories: CategoryType[] = [
    // Define an array of categories
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
  return categories // Return the array of categories
}

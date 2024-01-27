// Define the device type enum
export const deviceType = {
  iphone: 'iphone',
  ipad: 'ipad',
  airpods: 'airpods',
  mac: 'mac',
  imac: 'imac',
  macbook: 'macbook',
}

// Define the device type enum type
export type DeviceType = keyof typeof deviceType

// Define the device properties type
export type DevicePropertiesType = {
  model: string
  name: string
  type: string
  imageAmount: number
}

// Define the DevicePropertiesType object to query
export const selectProprties = { model: true, name: true, type: true, imageAmount: true }

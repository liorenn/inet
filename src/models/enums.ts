export const deviceType = {
  iphone: 'iphone',
  ipad: 'ipad',
  airpods: 'airpods',
  mac: 'mac',
  imac: 'imac',
  macbook: 'macbook',
}

export type devicePropertiesType = {
  model: string
  name: string
  type: string
  imageAmount: number
}

export const selectProprties = { model: true, name: true, type: true, imageAmount: true }

export type DeviceType = keyof typeof deviceType

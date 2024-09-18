export const deviceTypes = [
  { name: 'iphone' },
  { name: 'ipad' },
  { name: 'airpods' },
  { name: 'mac' },
  { name: 'imac' },
  { name: 'macbook' },
] as const

export type deviceTypesNames = (typeof deviceTypes)[number]['name']

export const cameraTypes = [
  { name: 'ultrawide' },
  { name: 'wide' },
  { name: 'telephoto' },
  { name: 'selfie' },
] as const

export type cameraTypesNames = (typeof cameraTypes)[number]['name']

export const deviceConnectors = [
  { name: 'lightning' },
  { name: 'usb_c' },
  { name: 'ethernet' },
] as const

export type deviceConnectorsNames = (typeof deviceConnectors)[number]['name']

export const biometricFeatures = [
  { name: 'face_id' },
  { name: 'touch_id' },
  { name: 'passcode' },
  { name: 'none' },
] as const

export type biometricFeaturesNames = (typeof biometricFeatures)[number]['name']

export type enumValuesType = deviceTypesNames | deviceConnectorsNames | biometricFeaturesNames

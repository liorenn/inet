export const deviceType = {
  iphone: 'iphone',
  ipad: 'ipad',
  airpods: 'airpods',
  mac: 'mac',
  imac: 'imac',
  macbook: 'macbook',
}

export const cameraType = {
  ultrawide: 'ultrawide',
  wide: 'wide',
  telephoto: 'telephoto',
  selfie: 'selfie',
}

export const deviceConnector = {
  lightning: 'lightning',
  usb_c: 'usb_c',
  usb_30_pin: 'usb_30_pin',
}

export const biometricFeature = {
  face_id: 'face_id',
  touch_id: 'touch_id',
  passcode: 'passcode',
}

export type DeviceType = keyof typeof deviceType
export type CameraType = keyof typeof cameraType
export type DeviceConnector = keyof typeof deviceConnector
export type BiometricFeature = keyof typeof biometricFeature

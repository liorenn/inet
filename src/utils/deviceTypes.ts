import {
  ResistanceFeature,
  DeviceTypeValue,
  AirpodsFeature,
} from '@prisma/client'
import { BiometricFeature, ScreenType, Camera } from '@prisma/client'
import { Color, DeviceConnector, Comment } from '@prisma/client'

export interface deviceType {
  model: string
  deviceTypeValue: DeviceTypeValue
  name: string
  releaseDate: Date
  batterySize: number
  chipset: string
  operatingSystem: number
  weight: number
  description: string
  imageAmount: number
  biometrics: BiometricFeature
  resistanceRating: string
  resistance: ResistanceFeature[]
  releasePrice: number
  connectors: DeviceConnector[]
  cameras: Camera[]
  colors: {
    Color: Color
  }[]
}

export interface iphoneType extends deviceType {
  screenSize: number
  screenType: ScreenType
  wiredCharging: number
  wirelessCharging: number
  memory: number
  storage: number
}

export interface macType extends deviceType {
  cpu: number
  gpu: number
  unifiedMemory: number
  storage: number
}

export interface airpodsType extends deviceType {
  case: string
  features: AirpodsFeature[]
}

export interface imacType extends macType {
  screenSize: number
}

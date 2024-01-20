import { DeviceType } from '@/models/enums'
import { preprtiesSchemaType } from './schemas'

export type weight = {
  name: preprtiesSchemaType
  minValue: number
  maxValue: number
}

export const weightsValues: weight[] = [
  { name: 'screenSize', minValue: 5, maxValue: 6.8 },
  { name: 'batterySize', minValue: 2800, maxValue: 3300 },
  { name: 'releaseDate', minValue: 2020, maxValue: 2023 },
  { name: 'price', minValue: 600, maxValue: 1200 },
  { name: 'memory', minValue: 2, maxValue: 8 },
  { name: 'cpu', minValue: 2, maxValue: 8 },
  { name: 'gpu', minValue: 2, maxValue: 8 },
  { name: 'weight', minValue: 100, maxValue: 210 },
  { name: 'storage', minValue: 64, maxValue: 128 },
]

type PropertiesLabels = {
  property: preprtiesSchemaType
  labels: string[]
}

export const propertiesLabels: PropertiesLabels[] = [
  { property: 'screenSize', labels: ['small', 'medium', 'large', 'massive'] },
  { property: 'batterySize', labels: ['small', 'medium', 'large', 'massive'] },
  { property: 'releaseDate', labels: ['old', 'relativelyOld', 'lastGeneration', 'new'] },
  { property: 'price', labels: ['cheap', 'budget', 'affordable', 'expensive'] },
  { property: 'cpu', labels: ['bad', 'acceptable', 'good', 'excellent'] },
  { property: 'gpu', labels: ['bad', 'acceptable', 'good', 'excellent'] },
  { property: 'memory', labels: ['bad', 'acceptable', 'good', 'excellent'] },
  { property: 'storage', labels: ['small', 'medium', 'large', 'massive'] },
  { property: 'weight', labels: ['light', 'moderate', 'heavy', 'substantial'] },
]

export type deviceTypeProperties = {
  deviceType: DeviceType
  properties: preprtiesSchemaType[]
}

export const deviceTypeProperties: deviceTypeProperties[] = [
  {
    deviceType: 'iphone',
    properties: ['screenSize', 'batterySize', 'releaseDate', 'price'],
  },
  {
    deviceType: 'ipad',
    properties: ['screenSize', 'batterySize', 'releaseDate', 'price'],
  },
  {
    deviceType: 'mac',
    properties: ['price', 'storage', 'cpu', 'gpu', 'memory'],
  },
]

export const deviceSpecsCategories = [
  'display',
  'battery',
  'hardware',
  'dimensions',
  'cameras',
  'features',
  'availability',
]

export const devicesSpecsCategories = ['name', ...deviceSpecsCategories]

export const selectParams = {
  model: true,
  price: true,
  batterySize: true,
  weight: true,
  storage: true,
  cpu: true,
  gpu: true,
  memory: true,
  screenSize: true,
  releaseDate: true,
}

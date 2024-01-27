import { Device } from '@prisma/client'
import { DeviceType } from '@/models/enums'
import { z } from 'zod'

// Define the Weight type
export type Weight = {
  property: PropertiesSchemaType
  minValue: number
  maxValue: number
}

// Define for each property the min and max values that should be calculated in the match algorithm
export const weightsValues: Weight[] = [
  { property: 'screenSize', minValue: 5, maxValue: 6.8 },
  { property: 'batterySize', minValue: 2800, maxValue: 3300 },
  { property: 'releaseDate', minValue: 2020, maxValue: 2023 },
  { property: 'price', minValue: 600, maxValue: 1200 },
  { property: 'memory', minValue: 2, maxValue: 8 },
  { property: 'cpu', minValue: 2, maxValue: 8 },
  { property: 'gpu', minValue: 2, maxValue: 8 },
  { property: 'weight', minValue: 100, maxValue: 210 },
  { property: 'storage', minValue: 64, maxValue: 128 },
]

// Define the Property Labels type
type PropertyLabels = {
  property: PropertiesSchemaType
  labels: string[]
}

// Define each property labels that should be displayed in the form
export const propertiesLabels: PropertyLabels[] = [
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

// Define the deviceTypeProperties type
export type DeviceTypeProperties = {
  deviceType: DeviceType
  properties: PropertiesSchemaType[]
}

// Define the properties for each device type that should be displayed in the form and calculated
export const deviceTypesProperties: DeviceTypeProperties[] = [
  {
    deviceType: 'iphone',
    properties: ['screenSize', 'batterySize', 'releaseDate', 'price'],
  },
  {
    deviceType: 'ipad',
    properties: ['screenSize', 'batterySize', 'releaseDate', 'price'],
  },
  {
    deviceType: 'airpods',
    properties: ['batterySize', 'weight', 'releaseDate', 'price'],
  },
  {
    deviceType: 'mac',
    properties: ['cpu', 'gpu', 'memory', 'releaseDate', 'price'],
  },
  {
    deviceType: 'imac',
    properties: ['cpu', 'gpu', 'memory', 'screenSize', 'releaseDate', 'price'],
  },
  {
    deviceType: 'macbook',
    properties: ['cpu', 'gpu', 'memory', 'screenSize', 'weight', 'releaseDate', 'price'],
  },
]

// Define the device Specs Categories
export const deviceSpecsCategories = [
  'display',
  'battery',
  'hardware',
  'dimensions',
  'cameras',
  'features',
  'availability',
]

// Define the device Specs Categories with the 'name' property
export const devicesSpecsCategories = ['name', ...deviceSpecsCategories]

// Define the select params for the select query in the match algorithm
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
} // Define the properties schema

// Define the properties schema
export const PropertiesSchema = z.enum([
  'releaseDate',
  'screenSize',
  'batterySize',
  'price',
  'storage',
  'memory',
  'weight',
  'cpu',
  'gpu',
])

// Define the properties schema type
export type PropertiesSchemaType = z.infer<typeof PropertiesSchema>

// Define the match device type
export type MatchDeviceType = Pick<Device, PropertiesSchemaType | 'model'>

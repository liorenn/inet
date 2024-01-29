import { Device } from '@prisma/client'
import { DeviceType } from '@/models/enums'
import { z } from 'zod'

// Define the Weight type
export type Weight = {
  property: PropertiesSchemaType
  minValue: number
  maxValue: number
}

export type DeviceTypeWeight = {
  deviceType: DeviceType
  weights: Weight[]
}

// Define for each property the min and max values that should be calculated in the match algorithm
export const weightsValues: DeviceTypeWeight[] = [
  {
    deviceType: 'iphone',
    weights: [
      { property: 'screenSize', minValue: 5, maxValue: 6.8 },
      { property: 'batterySize', minValue: 2800, maxValue: 3300 },
      { property: 'releaseDate', minValue: 2016, maxValue: 2023 },
      { property: 'price', minValue: 600, maxValue: 1200 },
      { property: 'memory', minValue: 2, maxValue: 8 },
      { property: 'cpu', minValue: 2, maxValue: 8 },
      { property: 'gpu', minValue: 2, maxValue: 8 },
      { property: 'weight', minValue: 100, maxValue: 210 },
      { property: 'storage', minValue: 64, maxValue: 128 },
    ],
  },
  {
    deviceType: 'ipad',
    weights: [
      { property: 'screenSize', minValue: 8, maxValue: 13 },
      { property: 'batterySize', minValue: 5000, maxValue: 10000 },
      { property: 'releaseDate', minValue: 2018, maxValue: 2023 },
      { property: 'price', minValue: 300, maxValue: 1100 },
      { property: 'memory', minValue: 2, maxValue: 8 },
      { property: 'cpu', minValue: 6, maxValue: 8 },
      { property: 'gpu', minValue: 4, maxValue: 10 },
      { property: 'weight', minValue: 300, maxValue: 700 },
      { property: 'storage', minValue: 32, maxValue: 128 },
    ],
  },
  {
    deviceType: 'airpods',
    weights: [
      { property: 'batterySize', minValue: 350, maxValue: 1000 },
      { property: 'releaseDate', minValue: 2020, maxValue: 2023 },
      { property: 'price', minValue: 150, maxValue: 550 },
      { property: 'weight', minValue: 40, maxValue: 500 },
    ],
  },
  {
    deviceType: 'mac',
    weights: [
      { property: 'releaseDate', minValue: 2020, maxValue: 2023 },
      { property: 'price', minValue: 690, maxValue: 7000 },
      { property: 'memory', minValue: 16, maxValue: 192 },
      { property: 'cpu', minValue: 8, maxValue: 24 },
      { property: 'gpu', minValue: 8, maxValue: 76 },
      { property: 'storage', minValue: 64, maxValue: 128 },
    ],
  },
  {
    deviceType: 'imac',
    weights: [
      { property: 'screenSize', minValue: 8, maxValue: 13 },
      { property: 'releaseDate', minValue: 2021, maxValue: 2023 },
      { property: 'price', minValue: 1300, maxValue: 2000 },
      { property: 'memory', minValue: 8, maxValue: 8 },
      { property: 'cpu', minValue: 8, maxValue: 8 },
      { property: 'gpu', minValue: 7, maxValue: 7 },
      { property: 'storage', minValue: 256, maxValue: 512 },
    ],
  },
  {
    deviceType: 'macbook',
    weights: [
      { property: 'screenSize', minValue: 13.2, maxValue: 14.3 },
      { property: 'releaseDate', minValue: 2020, maxValue: 2023 },
      { property: 'batterySize', minValue: 4300, maxValue: 6200 },
      { property: 'price', minValue: 900, maxValue: 2000 },
      { property: 'memory', minValue: 8, maxValue: 8 },
      { property: 'cpu', minValue: 8, maxValue: 10 },
      { property: 'gpu', minValue: 7, maxValue: 32 },
      { property: 'storage', minValue: 2000, maxValue: 8000 },
      { property: 'weight', minValue: 1290, maxValue: 1600 },
    ],
  },
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
    properties: [
      'screenSize',
      'batterySize',
      'weight',
      'cpu',
      'gpu',
      'memory',
      'releaseDate',
      'price',
    ],
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
  releasePrice: true,
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

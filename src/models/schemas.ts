import { Device } from '@prisma/client'
import { z } from 'zod'

/* eslint-disable @typescript-eslint/no-unsafe-return */
export const deviceSchema = z.object({
  model: z.string(),
  name: z.string(),
  type: z.string(),
  releaseDate: z.date(),
  releaseOS: z.string().optional(),
  releasePrice: z.number(),
  price: z.number(),
  connector: z.string(),
  biometrics: z.string(),
  batterySize: z.number().optional(),
  chipset: z.string(),
  weight: z.number(),
  imageAmount: z.number(),
  height: z.number(),
  width: z.number(),
  depth: z.number(),
  storage: z.number().optional(),
  cpu: z.number().optional(),
  gpu: z.number().optional(),
  memory: z.number().optional(),
  magsafe: z.boolean().optional(),
  screenSize: z.number().optional(),
  screenType: z.string().optional(),
  resistanceRating: z.string().optional(),
})

export type DeviceSchemaType = z.infer<typeof deviceSchema>

export const userSchema = z.object({
  email: z.string(),
  username: z.string(),
  name: z.string(),
  password: z.string(),
  phone: z.string(),
  accessKey: z.number(),
})

export type UserSchemaType = z.infer<typeof userSchema>

export const commentSchema = z.object({
  message: z.string(),
  rating: z.number(),
  updatedAt: z.date(),
  createdAt: z.date(),
  model: z.string(),
  username: z.string(),
})

export const UpdateSchema = z.enum(['username', 'name', 'password', 'phone'])

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
export type PropertiesSchemaType = z.infer<typeof PropertiesSchema>
export type MatchDeviceType = Pick<Device, PropertiesSchemaType | 'model'>

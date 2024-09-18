import { z } from 'zod'

// Define the device schema
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
  resistanceRating: z.string().optional()
})

// Define the device schema type
export type DeviceSchemaType = z.infer<typeof deviceSchema>

// Define the user role enum
export const userRole = z.enum(['user', 'admin', 'manager'])

// Define the user role enum type
export type UserRole = z.infer<typeof userRole>

// Define the user schema
export const userSchema = z.object({
  email: z.string(),
  username: z.string(),
  name: z.string(),
  phone: z.string(),
  password: z.string(),
  role: userRole
})

// Define the user schema type
export type UserSchemaType = z.infer<typeof userSchema>

// Define the comment schema
export const commentSchema = z.object({
  message: z.string(),
  rating: z.number(),
  updatedAt: z.date(),
  createdAt: z.date(),
  model: z.string(),
  username: z.string()
})

// Define the update user function schema
export const UpdateSchema = z.enum(['username', 'name', 'password', 'phone'])

// Define the device type enum
export const deviceTypeSchema = z.enum(['iphone', 'ipad', 'airpods', 'mac', 'imac', 'macbook'])

// Define the device type enum type
export type DeviceType = z.infer<typeof deviceTypeSchema>

// Define the device properties type
export type DevicePropertiesType = {
  model: string
  name: string
  type: string
  imageAmount: number
}

// Define the DevicePropertiesType object to query
export const selectProprties = { model: true, name: true, type: true, imageAmount: true }

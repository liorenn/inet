import { z } from 'zod'

export const deviceSchema = z.object({
  model: z.string(),
  name: z.string(),
  type: z.string(),
  releaseDate: z.string(),
  releaseOS: z.optional(z.string()),
  releasePrice: z.number(),
  connector: z.string(),
  biometrics: z.string(),
  batterySize: z.number(),
  chipset: z.string(),
  weight: z.number(),
  description: z.string(),
  imageAmount: z.number(),
  height: z.number(),
  width: z.number(),
  depth: z.number(),
  storage: z.optional(z.number()),
  cpu: z.optional(z.number()),
  gpu: z.optional(z.number()),
  memory: z.optional(z.number()),
  wiredCharging: z.optional(z.number()),
  magsafe: z.boolean(),
  wirelessCharging: z.optional(z.number()),
  screenSize: z.optional(z.number()),
  screenType: z.optional(z.string()),
  resistanceRating: z.optional(z.string()),
})

export type deviceSchemaType = z.infer<typeof deviceSchema>

export const userSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  username: z.string(),
  password: z.string(),
  accessKey: z.number(),
})

export type userSchemaType = z.infer<typeof userSchema>

export const commentSchema = z.object({
  likes: z.number(),
  message: z.string(),
  rating: z.number(),
  updatedAt: z.date(),
  createdAt: z.date(),
  model: z.string(),
  username: z.string(),
})

export type commentSchemaType = z.infer<typeof commentSchema>

export const updatePropertiesSchema = z.enum([
  'username',
  'name',
  'password',
  'phone',
])
export type updatePropertiesType = z.infer<typeof updatePropertiesSchema>
export type updatePropertiesObjectType = {
  [K in updatePropertiesType]: string
}

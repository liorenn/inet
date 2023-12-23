import { z } from 'zod'

export const deviceSchema = z.object({
  model: z.string(),
  name: z.string(),
  type: z.string(),
  releaseDate: z.date(),
  releaseOS: z.optional(z.string()),
  releasePrice: z.number(),
  price: z.number(),
  connector: z.string(),
  biometrics: z.string(),
  batterySize: z.optional(z.number()),
  chipset: z.string(),
  weight: z.number(),
  imageAmount: z.number(),
  height: z.number(),
  width: z.number(),
  depth: z.number(),
  storage: z.optional(z.number()),
  cpu: z.optional(z.number()),
  gpu: z.optional(z.number()),
  memory: z.optional(z.number()),
  magsafe: z.optional(z.boolean()),
  screenSize: z.optional(z.number()),
  screenType: z.optional(z.string()),
  resistanceRating: z.optional(z.string()),
})

export type deviceSchemaType = z.infer<typeof deviceSchema>

export const userSchema = z.object({
  email: z.string(),
  username: z.string(),
  name: z.string(),
  password: z.string(),
  phone: z.string(),
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

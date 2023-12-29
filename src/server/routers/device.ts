import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { existsSync } from 'fs'
import { encodeEmail } from '../../misc/functions'
import { sendSoapRequest } from '../../../config'
import { deviceSchema } from '../../models/schemas'
import {
  deleteDeviceSoap,
  insertDeviceSoap,
  updateDeviceSoap,
} from '../soapFunctions'
import type { devicePropertiesType } from '../../models/deviceTypes'

export const DeviceRouter = router({
  insertDevice: publicProcedure
    .input(deviceSchema.merge(z.object({ FromAsp: z.boolean().optional() })))
    .mutation(async ({ ctx, input }) => {
      try {
        const { FromAsp, ...device } = input
        await ctx.prisma.device.create({
          data: {
            ...device,
          },
        })
        if (sendSoapRequest && FromAsp !== true) {
          await insertDeviceSoap({ input: device })
        }
        return true
      } catch {
        return false
      }
    }),
  updateDevice: publicProcedure
    .input(deviceSchema.merge(z.object({ FromAsp: z.boolean().optional() })))
    .mutation(async ({ ctx, input }) => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      try {
        const { FromAsp, ...device } = input
        await ctx.prisma.device.update({
          where: { model: device.model },
          data: {
            ...device,
          },
        })
        if (sendSoapRequest && FromAsp !== true) {
          await updateDeviceSoap({ input: device })
        }
        return true
      } catch {
        return false
      }
    }),
  deleteDevice: publicProcedure
    .input(z.object({ model: z.string(), FromAsp: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { FromAsp, model } = input
        await ctx.prisma.device.delete({
          where: { model },
        })
        if (sendSoapRequest && FromAsp !== true) {
          await deleteDeviceSoap({ model: input.model })
        }
        return true
      } catch {
        return false
      }
    }),
  getDevicesData: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.device.findMany()
  }),
  getDevices: publicProcedure
    .input(z.object({ deviceType: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.device.findMany({
        select: { model: true, name: true, type: true, imageAmount: true },
        where: {
          deviceType: {
            name: input.deviceType,
          },
        },
      })
    }),
  isImageExists: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(({ input }) => {
      const path = `public/users/${encodeEmail(input.email)}.png`
      return existsSync(path)
    }),
  getDevice: publicProcedure
    .input(z.object({ model: z.string() }))
    .query(async ({ ctx, input }) => {
      const device = await ctx.prisma.device.findFirst({
        where: { model: input.model },
        include: {
          cameras: { select: { type: true, megapixel: true } },
          colors: { select: { color: true } },
        },
      })
      return device
    }),
  getDevicesFromArr: publicProcedure
    .input(z.array(z.string()).optional())
    .query(async ({ ctx, input }) => {
      if (!input) return []
      const devices = await ctx.prisma.device.findMany({
        where: {
          model: {
            in: input,
          },
        },
        include: {
          cameras: { select: { type: true, megapixel: true } },
          colors: { select: { color: true } },
        },
      })
      return devices
    }),
  getModelsAndNames: publicProcedure.query(async ({ ctx }) => {
    const devices = await ctx.prisma.device.findMany({
      select: { model: true, name: true },
    })
    return devices
  }),
  isDeviceInUser: publicProcedure
    .input(z.object({ model: z.string(), email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { email: input.email },
        select: { deviceList: true },
      })
      return (
        user?.deviceList?.find(
          (device) => device.deviceModel === input.model
        ) !== undefined
      )
    }),
  addToFavorites: publicProcedure
    .input(z.object({ model: z.string(), email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: { email: input.email },
        data: {
          deviceList: {
            create: {
              deviceModel: input.model,
            },
          },
        },
      })
    }),
  deleteFromFavorites: publicProcedure
    .input(z.object({ model: z.string(), email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: { email: input.email },
        data: {
          deviceList: {
            delete: {
              deviceModel_userEmail: {
                deviceModel: input.model,
                userEmail: input.email,
              },
            },
          },
        },
      })
    }),
  getUserDevices: publicProcedure
    .input(
      z.object({
        email: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const devices = await ctx.prisma.deviceUser.findMany({
        where: {
          userEmail: input.email,
        },
      })
      const devicesArr: devicePropertiesType[] = []
      for (const device of devices) {
        const userDevice = await ctx.prisma.device.findFirst({
          where: { model: device.deviceModel },
          select: {
            model: true,
            name: true,
            imageAmount: true,
            type: true,
          },
        })
        if (userDevice) {
          devicesArr.push(userDevice)
        }
      }
      return devicesArr
    }),
  getUserDevicesFromUserTable: publicProcedure
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirst({
        where: { email: input.email },
        select: {
          deviceList: {
            select: {
              device: {
                select: {
                  model: true,
                  name: true,
                  type: true,
                  imageAmount: true,
                },
              },
            },
          },
        },
      })
    }),
})

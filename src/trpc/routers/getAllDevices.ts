import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { DeviceTypeValue } from '@prisma/client'

export const getAllDevicesRouter = router({
  getAllDevicesModels: publicProcedure.query(async ({ ctx }) => {
    const devices = await ctx.prisma.device.findMany({
      select: { model: true },
    })
    return devices
  }),
  getAllDevicesProperties: publicProcedure
    .input(z.object({ deviceType: z.nativeEnum(DeviceTypeValue) }))
    .query(async ({ ctx, input }) => {
      const iphones = await ctx.prisma.device.findMany({
        where: { deviceTypeValue: input.deviceType },
        select: { model: true, name: true, imageAmount: true },
      })
      return iphones
    }),
  getAllDevicesPropertiesExtra: publicProcedure
    .input(
      z.object({
        deviceType: z.nativeEnum(DeviceTypeValue),
        userId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const iphones = await ctx.prisma.device.findMany({
        where: { deviceTypeValue: input.deviceType },
        select: { model: true, name: true, imageAmount: true },
      })
      const areInList: boolean[] = []
      for (let i = 0; i < iphones.length; i++) {
        const device = await ctx.prisma.deviceUser.findFirst({
          where: {
            userId: input.userId,
            deviceModel: iphones[i].model,
          },
        })
        areInList[i] = device ? true : false
      }
      const devices: {
        model: string
        name: string
        imageAmount: number
        isInList: boolean
      }[] = []
      for (let i = 0; i < iphones.length; i++) {
        const device = {
          model: iphones[i].model,
          isInList: areInList[i],
          name: iphones[i].name,
          imageAmount: iphones[i].imageAmount,
        }
        devices.push(device)
      }
      return devices
    }),
  getAlliPhones: publicProcedure.query(async ({ ctx }) => {
    const iphones = await ctx.prisma.device.findMany({
      where: { deviceTypeValue: 'iphone' },
      select: { model: true, name: true, imageAmount: true },
    })
    return iphones
  }),
  getAlliMacs: publicProcedure.query(async ({ ctx }) => {
    const iphones = await ctx.prisma.device.findMany({
      where: { deviceTypeValue: 'imac' },
      select: { model: true, name: true, imageAmount: true },
    })
    return iphones
  }),
})
/*
    const iphones = await ctx.prisma.device.findMany({
      where: { deviceTypeValue: 'iphone' },
      include: {
        colors: {
          include: {
            Color: true,
          },
        },
        cameras: true,
        deviceType: {
          include: {
            touchDevice: {
              include: { iPhone: true },
            },
          },
        },
      },
    })
*/

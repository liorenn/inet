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

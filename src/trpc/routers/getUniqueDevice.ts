import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { Airpods, Device, Mac, TouchDevice, iMac } from '@prisma/client'
import { airpodsType, imacType, iphoneType } from '../../utils/deviceTypes'

export const getUniqueDeviceRouter = router({
  getiPhone: publicProcedure
    .input(z.object({ model: z.string() }))
    .query(async ({ ctx, input }) => {
      const device = (await ctx.prisma.device.findUnique({
        where: { model: input.model },
      })) as Device
      const touchDevice = (await ctx.prisma.touchDevice.findUnique({
        where: { model: input.model },
      })) as TouchDevice
      const colors = await ctx.prisma.deviceColor.findMany({
        where: { model: input.model },
        select: { Color: true },
      })
      const cameras = await ctx.prisma.camera.findMany({
        where: { model: input.model },
      })
      const iphoneObject: iphoneType = {
        ...device,
        ...touchDevice,
        colors,
        cameras,
      }
      return iphoneObject
    }),
  getiPhoneMutation: publicProcedure
    .input(z.object({ model: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const device = (await ctx.prisma.device.findUnique({
        where: { model: input.model },
      })) as Device
      const touchDevice = (await ctx.prisma.touchDevice.findUnique({
        where: { model: input.model },
      })) as TouchDevice
      const colors = await ctx.prisma.deviceColor.findMany({
        where: { model: input.model },
        select: { Color: true },
      })
      const cameras = await ctx.prisma.camera.findMany({
        where: { model: input.model },
      })
      const iphoneObject: iphoneType = {
        ...device,
        ...touchDevice,
        colors,
        cameras,
      }
      return iphoneObject
    }),
  getiMac: publicProcedure
    .input(z.object({ model: z.string() }))
    .query(async ({ ctx, input }) => {
      const device = (await ctx.prisma.device.findUnique({
        where: { model: input.model },
      })) as Device
      const mac = (await ctx.prisma.mac.findUnique({
        where: { model: input.model },
      })) as Mac
      const imac = (await ctx.prisma.iMac.findUnique({
        where: { model: input.model },
      })) as iMac
      const colors = await ctx.prisma.deviceColor.findMany({
        where: { model: input.model },
        select: { Color: true },
      })
      const cameras = await ctx.prisma.camera.findMany({
        where: { model: input.model },
      })

      const imacObject: imacType = {
        ...device,
        ...mac,
        ...imac,
        colors,
        cameras,
      }
      return imacObject
    }),
  getiMacMutation: publicProcedure
    .input(z.object({ model: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const device = (await ctx.prisma.device.findUnique({
        where: { model: input.model },
      })) as Device
      const mac = (await ctx.prisma.mac.findUnique({
        where: { model: input.model },
      })) as Mac
      const imac = (await ctx.prisma.iMac.findUnique({
        where: { model: input.model },
      })) as iMac
      const colors = await ctx.prisma.deviceColor.findMany({
        where: { model: input.model },
        select: { Color: true },
      })
      const cameras = await ctx.prisma.camera.findMany({
        where: { model: input.model },
      })

      const imacObject: imacType = {
        ...device,
        ...mac,
        ...imac,
        colors,
        cameras,
      }
      return imacObject
    }),
  getAirpods: publicProcedure
    .input(z.object({ model: z.string() }))
    .query(async ({ ctx, input }) => {
      const device = (await ctx.prisma.device.findUnique({
        where: { model: input.model },
      })) as Device
      const airpods = (await ctx.prisma.airpods.findUnique({
        where: { model: input.model },
      })) as Airpods
      const colors = await ctx.prisma.deviceColor.findMany({
        where: { model: input.model },
        select: { Color: true },
      })
      const cameras = await ctx.prisma.camera.findMany({
        where: { model: input.model },
      })
      const airpodsObject: airpodsType = {
        ...device,
        ...airpods,
        colors,
        cameras,
      }
      return airpodsObject
    }),
  getAirpodsMutation: publicProcedure
    .input(z.object({ model: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const device = (await ctx.prisma.device.findUnique({
        where: { model: input.model },
      })) as Device
      const airpods = (await ctx.prisma.airpods.findUnique({
        where: { model: input.model },
      })) as Airpods
      const colors = await ctx.prisma.deviceColor.findMany({
        where: { model: input.model },
        select: { Color: true },
      })
      const cameras = await ctx.prisma.camera.findMany({
        where: { model: input.model },
      })
      const airpodsObject: airpodsType = {
        ...device,
        ...airpods,
        colors,
        cameras,
      }
      return airpodsObject
    }),
})

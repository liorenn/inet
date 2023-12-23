import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { existsSync } from 'fs'
import { encodeEmail } from '../../misc/functions'

export const DeviceRouter = router({
  getUserDevices: publicProcedure
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
  isImageExists: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
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
  getDeviceMutation: publicProcedure
    .input(z.object({ model: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const device = await ctx.prisma.device.findFirst({
        where: { model: input.model },
        include: {
          cameras: { select: { type: true, megapixel: true } },
          colors: { select: { color: true } },
        },
      })
      return device
    }),
  getModelsAndNames: publicProcedure.query(async ({ ctx }) => {
    const devices = await ctx.prisma.device.findMany({
      select: { model: true, name: true },
    })
    return devices
  }),
})

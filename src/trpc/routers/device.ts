import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { fetchCurrentPrice } from '../../utils/functions'

export const DeviceRouter = router({
  getDevice: publicProcedure
    .input(z.object({ model: z.string() }))
    .query(async ({ ctx, input }) => {
      const device = await ctx.prisma.device.findFirst({
        where: { model: input.model },
        include: {
          cameras: { select: { type: true, megapixel: true } },
          colors: { select: { Color: true } },
        },
      })
      if (device?.price === 0) {
        const price = await fetchCurrentPrice(device.model)
        if (price) {
          device.price = price
        }
      }
      return device
    }),
  getDeviceMutation: publicProcedure
    .input(z.object({ model: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const device = await ctx.prisma.device.findFirst({
        where: { model: input.model },
        include: {
          cameras: { select: { type: true, megapixel: true } },
          colors: { select: { Color: true } },
        },
      })
      return device
    }),
  getAllDevicesModels: publicProcedure.query(async ({ ctx }) => {
    const devices = await ctx.prisma.device.findMany({
      select: { model: true },
    })
    return devices
  }),
  getAllDevices: publicProcedure.query(async ({ ctx }) => {
    const devices = await ctx.prisma.device.findMany({
      select: { model: true, name: true },
    })
    return devices
  }),
  getUserDevices: publicProcedure
    .input(
      z.object({
        deviceType: z.string(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const iphones = await ctx.prisma.device.findMany({
        where: { type: input.deviceType },
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
})

import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import type { Airpods, Device, Mac, TouchDevice, iMac } from '@prisma/client'
import type { airpodsType, imacType, iphoneType } from '../../utils/deviceTypes'

export const DevicesRouter = router({
  getDevice: publicProcedure
    .input(z.object({ model: z.string() }))
    .query(async ({ ctx, input }) => {
      const device = await ctx.prisma.device.findUnique({
        where: { model: input.model },
        include: {
          cameras: true,
          colors: true,
          usersList: true,
          deviceType: {
            include: {
              touchDevice: {
                include: { iPhone: true, iPad: true, deviceType: true },
              },
              airpods: true,
              mac: true,
            },
          },
        },
      })
      console.log(device)
      return device
    }),
})

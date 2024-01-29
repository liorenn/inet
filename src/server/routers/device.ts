import { convertPreferencesToValues, getRecommendedDevices } from '@/server/match'
import { deleteDeviceSoap, insertDeviceSoap, updateDeviceSoap } from '@/server/soapFunctions'
import { getMatchedDevices } from '@/server/match'
import { method, router } from '@/server/trpc'

import { selectProprties, type DevicePropertiesType } from '@/models/enums'
import { deviceSchema } from '@/models/schemas'
import { MatchDeviceType, PropertiesSchema } from '@/models/deviceProperties'
import { matchedDevicesLimit, sendSoapRequest } from 'config'
import { z } from 'zod'
import { selectParams } from '@/models/deviceProperties'
import { convertPrice, fetchCurrentPrice } from '@/server/price'

export const DeviceRouter = router({
  fetchDevicesPrices: method.mutation(async ({ ctx }) => {
    const devices = await ctx.prisma.device.findMany({
      where: {
        OR: [{ type: 'iphone' }, { type: 'ipad' }],
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    devices.forEach(async (device) => {
      await fetchCurrentPrice(device.model)
    })
  }),
  convertPrice: method
    .input(
      z.object({
        price: z.number(),
        currency: z.string(),
        targetCurrency: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return convertPrice(input.price, input.currency, input.targetCurrency)
    }),
  getRecommendedDevices: method
    .input(z.object({ model: z.string(), deviceType: z.string() }))
    .query(async ({ ctx, input }) => {
      const queriedDevice = await ctx.prisma.device.findFirst({
        select: selectParams,
        where: {
          model: input.model,
        },
      })
      if (!queriedDevice) return []
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { releasePrice, ...queriedDeviceWithoutReleasePrice } = queriedDevice
      const device = {
        ...queriedDeviceWithoutReleasePrice,
        price: queriedDevice.releasePrice,
      }
      const queriesDevices = await ctx.prisma.device.findMany({
        select: selectParams,
        where: {
          model: {
            not: input.model,
          },
          AND: {
            type: input.deviceType,
          },
        },
      })
      const devices: MatchDeviceType[] = queriesDevices.map((device) => {
        const { releasePrice, ...deviceWithoutReleasePrice } = device
        return {
          ...deviceWithoutReleasePrice,
          price: releasePrice,
        }
      })
      const matches = getRecommendedDevices(device, input.deviceType, devices)
      const query = await ctx.prisma.device.findMany({
        select: selectProprties,
        where: {
          model: {
            in: matches.map((device) => device.model),
          },
        },
      })
      query.sort((a, b) => {
        const modelAIndex = matches.map((device) => device.model).indexOf(a.model)
        const modelBIndex = matches.map((device) => device.model).indexOf(b.model)
        return modelAIndex - modelBIndex
      })
      const recommendedDevices = query.map((device, index) => {
        return { ...device, match: matches[index].match }
      })
      return recommendedDevices
    }),
  getMatchedDevices: method
    .input(
      z.object({
        deviceType: z.string(),
        userPreferences: z.array(z.object({ name: PropertiesSchema, value: z.number() })),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const queriesDevices = await ctx.prisma.device.findMany({
        select: selectParams,
        where: {
          type: input.deviceType,
        },
      })
      const devices: MatchDeviceType[] = queriesDevices.map((device) => {
        const { releasePrice, ...deviceWithoutReleasePrice } = device
        return {
          ...deviceWithoutReleasePrice,
          price: releasePrice,
        }
      })
      const preferencesValues = convertPreferencesToValues(input.userPreferences, input.deviceType)
      const matches = getMatchedDevices(
        preferencesValues,
        devices,
        input.deviceType,
        matchedDevicesLimit
      )
      const query = await ctx.prisma.device.findMany({
        select: selectProprties,
        where: {
          model: {
            in: matches.map((device) => device.model),
          },
        },
      })
      query.sort((a, b) => {
        const modelAIndex = matches.map((device) => device.model).indexOf(a.model)
        const modelBIndex = matches.map((device) => device.model).indexOf(b.model)
        return modelAIndex - modelBIndex
      })
      const matchedDevices = query.map((device, index) => {
        return { ...device, match: matches[index].match }
      })
      return matchedDevices.sort((a, b) => b.match - a.match)
    }),
  insertDevice: method
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
  updateDevice: method
    .input(deviceSchema.merge(z.object({ FromAsp: z.boolean().optional() })))
    .mutation(async ({ ctx, input }) => {
      try {
        const { FromAsp, ...device } = input
        await ctx.prisma.device.update({
          where: { model: device.model },
          data: {
            ...device,
          },
        })
        if (sendSoapRequest && FromAsp !== true) {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
          await updateDeviceSoap({ input: device })
        }
        return true
      } catch {
        return false
      }
    }),
  deleteDevice: method
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
  getDevicesData: method.query(async ({ ctx }) => {
    return await ctx.prisma.device.findMany()
  }),
  getDevices: method.input(z.object({ deviceType: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.prisma.device.findMany({
      select: selectProprties,
      where: {
        deviceType: {
          name: input.deviceType,
        },
      },
      orderBy: {
        releaseDate: 'desc',
      },
    })
  }),
  getDevice: method.input(z.object({ model: z.string() })).query(async ({ ctx, input }) => {
    const device = await ctx.prisma.device.findFirst({
      where: { model: input.model },
      include: {
        cameras: { select: { type: true, megapixel: true } },
        colors: { select: { color: true } },
      },
    })
    if (device?.price === 0) {
      const price = await fetchCurrentPrice(input.model)
      device.price = price ?? 0
      return device
    }
    return device
  }),
  getDevicesFromModelsArr: method
    .input(z.object({ modelsArr: z.array(z.string()).optional() }))
    .query(async ({ ctx, input }) => {
      const models = input.modelsArr
      if (!models) return []
      const devices = await ctx.prisma.device.findMany({
        where: {
          model: {
            in: models,
          },
        },
        include: {
          cameras: { select: { type: true, megapixel: true } },
          colors: { select: { color: true } },
        },
      })
      // for (const device of devices) {
      //   if (device) {
      //     const model = device.model
      //     const price = await fetchCurrentPrice(model)
      //     device.price = price ?? 0
      //   }
      // }
      devices.sort((a, b) => {
        const modelAIndex = models.indexOf(a.model)
        const modelBIndex = models.indexOf(b.model)
        return modelAIndex - modelBIndex
      })
      return devices
    }),
  getModelsAndNames: method.query(async ({ ctx }) => {
    const devices = await ctx.prisma.device.findMany({
      select: { model: true, name: true, type: true },
    })
    return devices
  }),
  isDeviceInUser: method
    .input(z.object({ model: z.string(), email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { email: input.email },
        select: { deviceList: true },
      })
      return user?.deviceList?.find((device) => device.deviceModel === input.model) !== undefined
    }),
  addToFavorites: method
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
  deleteFromFavorites: method
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
  getUserDevices: method
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
      const devicesArr: DevicePropertiesType[] = []
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
  getUserDevicesProperties: method
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

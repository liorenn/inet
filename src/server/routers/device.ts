import { convertPreferencesToValues, getRecommendedDevices } from '@/server/match'
import { getMatchedDevices } from '@/server/match'
import { createTRPCRouter, method } from '@/server/trpc'

import { selectProprties, type DevicePropertiesType } from '@/models/enums'
import { deviceSchema } from '@/models/schemas'
import { MatchDeviceType, PropertiesSchema } from '@/models/deviceProperties'
import { z } from 'zod'
import { selectParams } from '@/models/deviceProperties'
import { env } from '@/server/env'

// Create a device router
export const deviceRouter = createTRPCRouter({
  // Function to convert device price
  convertPrice: method
    .input(
      z.object({
        price: z.number(),
        currency: z.string(),
        targetCurrency: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const response = await fetch(
        `${env.currencyApiUrl}?apikey=${env.currencyApiKey}&currencies=${input.targetCurrency}&base_currency=${input.currency}`
      ) // Fetch the data from the API
      const data = await response.json() // Extract the data from the response
      return input.price * data.data[input.targetCurrency] // Convert and return the price
    }),
  // Function to get recommended devices
  getRecommendedDevices: method
    .input(z.object({ model: z.string(), deviceType: z.string() }))
    .query(async ({ ctx, input }) => {
      const queriedDevice = await ctx.db.device.findFirst({
        select: selectParams,
        where: {
          model: input.model
        }
      }) // Get queried device
      if (!queriedDevice) return [] // Return an empty array if the device is not found
      const { releasePrice, ...queriedDeviceWithoutReleasePrice } = queriedDevice // Remove release price
      const device = {
        ...queriedDeviceWithoutReleasePrice,
        price: queriedDevice.releasePrice
      } // Convert release price to price
      const queriesDevices = await ctx.db.device.findMany({
        select: selectParams,
        where: {
          model: {
            not: input.model
          },
          AND: {
            type: input.deviceType
          }
        }
      }) // Get devices that are not the queried device
      const devices: MatchDeviceType[] = queriesDevices.map((device) => {
        const { releasePrice, ...deviceWithoutReleasePrice } = device
        return {
          ...deviceWithoutReleasePrice,
          price: releasePrice
        }
      }) // Convert release price to price
      const matches = getRecommendedDevices(device, input.deviceType, devices)
      const query = await ctx.db.device.findMany({
        select: selectProprties,
        where: {
          model: {
            in: matches.map((device) => device.model)
          }
        }
      }) // Get devices that match the recommended devices
      // Sort devices by model
      query.sort((a, b) => {
        const modelAIndex = matches.map((device) => device.model).indexOf(a.model) // Get the index of the first model in the array
        const modelBIndex = matches.map((device) => device.model).indexOf(b.model) // Get the index of the second model in the array
        return modelAIndex - modelBIndex // Compare the indices to sort by model
      })
      const recommendedDevices = query.map((device, index) => {
        return { ...device, match: matches[index].match }
      }) // Add match to each device
      return recommendedDevices // Return the recommended devices
    }),
  // Function to get matched devices
  getMatchedDevices: method
    .input(
      z.object({
        deviceType: z.string(),
        userPreferences: z.array(z.object({ name: PropertiesSchema, value: z.number() })),
        matchedDevicesLimit: z.number().default(6)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const queriesDevices = await ctx.db.device.findMany({
        select: selectParams,
        where: {
          type: input.deviceType
        }
      }) // Get devices that match the device type
      const devices: MatchDeviceType[] = queriesDevices.map((device) => {
        const { releasePrice, ...deviceWithoutReleasePrice } = device // Remove release price
        return {
          ...deviceWithoutReleasePrice,
          price: releasePrice
        }
      })
      // Convert all of the preferences to values based on the device type
      const preferencesValues = convertPreferencesToValues(input.userPreferences, input.deviceType)
      const matches = getMatchedDevices(
        preferencesValues,
        devices,
        input.deviceType,
        input.matchedDevicesLimit
      ) // Get the matched devices
      const query = await ctx.db.device.findMany({
        select: selectProprties,
        where: {
          model: {
            in: matches.map((device) => device.model)
          }
        }
      }) // Query the matched devices data
      query.sort((a, b) => {
        const modelAIndex = matches.map((device) => device.model).indexOf(a.model) // Get the index of the first model in the array
        const modelBIndex = matches.map((device) => device.model).indexOf(b.model) // Get the index of the second model in the array
        return modelAIndex - modelBIndex // Compare the indices to sort by model
      })
      const matchedDevices = query.map((device, index) => {
        return { ...device, match: matches[index].match }
      }) // Add match to each device
      return matchedDevices.sort((a, b) => b.match - a.match) // Return the matched devices
    }),
  // Function to insert a device
  insertDevice: method.input(deviceSchema).mutation(async ({ ctx, input }) => {
    try {
      await ctx.db.device.create({
        data: {
          ...input
        }
      }) // Create the device
      return true // Return true to indicate operation success
    } catch {
      return false // Return false to indicate operation failure
    }
  }),
  // Function to update a device
  updateDevice: method.input(deviceSchema).mutation(async ({ ctx, input }) => {
    try {
      await ctx.db.device.update({
        where: { model: input.model },
        data: {
          ...input
        }
      }) // Update the device
      return true // Return true to indicate operation success
    } catch {
      return false // Return false to indicate operation failure
    }
  }),
  // Function to delete a device
  deleteDevice: method.input(z.object({ model: z.string() })).mutation(async ({ ctx, input }) => {
    try {
      await ctx.db.device.delete({
        where: { model: input.model }
      }) // Delete the device
      return true // Return true to indicate operation success
    } catch {
      return false // Return false to indicate operation failure
    }
  }),
  // Function to get all devices
  getDevicesData: method.query(async ({ ctx }) => {
    return await ctx.db.device.findMany() // Get all devices data
  }),
  // Function to get all devices
  getDevices: method.input(z.object({ deviceType: z.string() })).query(async ({ ctx, input }) => {
    const devices = await ctx.db.device.findMany({
      select: selectProprties,
      where: {
        deviceType: {
          name: input.deviceType
        }
      },
      orderBy: {
        releaseDate: 'desc' // Order by release date in descending order
      }
    }) // Get all devices
    return devices // Return all devices
  }),
  // Function to get a device
  getDevice: method.input(z.object({ model: z.string() })).query(async ({ ctx, input }) => {
    const device = await ctx.db.device.findFirst({
      where: { model: input.model },
      include: {
        cameras: { select: { type: true, megapixel: true } },
        colors: { select: { color: true } }
      }
    }) // Get the device with cameras and colors
    return device // Return the device
  }),
  // Function to get devices from an array of models
  getDevicesFromModelsArr: method
    .input(z.object({ modelsArr: z.array(z.string()).optional() }))
    .query(async ({ ctx, input }) => {
      const models = input.modelsArr
      if (!models) return [] // Return an empty array if there are no models
      const devices = await ctx.db.device.findMany({
        where: {
          model: {
            in: models
          }
        },
        include: {
          cameras: { select: { type: true, megapixel: true } },
          colors: { select: { color: true } }
        }
      }) // Get devices from the models
      // Sort devices by model
      devices.sort((a, b) => {
        const modelAIndex = models.indexOf(a.model) // Get the index of the first model in the array
        const modelBIndex = models.indexOf(b.model) // Get the index of the second model in the array
        return modelAIndex - modelBIndex // Compare the indices to sort by model
      })
      return devices // Return the sorted devices
    }),
  // Function to get all devices models and names
  getModelsAndNames: method.query(async ({ ctx }) => {
    const devices = await ctx.db.device.findMany({
      select: { model: true, name: true, type: true }
    }) // Get all devices models and names
    return devices // Return the devices models and names
  }),
  // Function to check if a device is in the user devices list
  isDeviceInUser: method
    .input(z.object({ model: z.string(), email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: { email: input.email },
        select: { deviceList: true }
      }) // Get the user
      // Check and return if the device is in the user devices list
      return user?.deviceList?.find((device) => device.deviceModel === input.model) !== undefined
    }),
  // Function to add a device to favorites
  addToFavorites: method
    .input(z.object({ model: z.string(), email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: { email: input.email },
        data: {
          deviceList: {
            create: {
              deviceModel: input.model
            }
          }
        }
      }) // Add the device to the user
    }),
  // Function to delete a device from favorites
  deleteFromFavorites: method
    .input(z.object({ model: z.string(), email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: { email: input.email },
        data: {
          deviceList: {
            delete: {
              deviceModel_userEmail: {
                deviceModel: input.model,
                userEmail: input.email
              }
            }
          }
        }
      }) // Delete the device from the user
    }),
  // Function to get user devices
  getUserDevices: method
    .input(
      z.object({
        email: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const devices = await ctx.db.deviceUser.findMany({
        where: {
          userEmail: input.email
        }
      }) // Get users devices
      const devicesArr: DevicePropertiesType[] = [] // Initialize an empty array
      // For each device in the devices array
      for (const device of devices) {
        const userDevice = await ctx.db.device.findFirst({
          where: { model: device.deviceModel },
          select: {
            model: true,
            name: true,
            imageAmount: true,
            type: true
          }
        }) // Get the users device
        // If the user device exists
        if (userDevice) {
          devicesArr.push(userDevice) // Push the user device to the devices array
        }
      }
      return devicesArr // Return the users devices
    }),
  // Function to get user devices properties
  getUserDevicesProperties: method
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findFirst({
        where: { email: input.email },
        select: {
          deviceList: {
            select: {
              device: {
                select: {
                  model: true,
                  name: true,
                  type: true,
                  imageAmount: true
                }
              }
            }
          }
        }
      })
    })
})

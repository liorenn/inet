import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { Prisma } from '@prisma/client'
import soapRequest from 'easy-soap-request'
import {
  createSoapRequestXml,
  getResultFromResponse,
  sendSoapRequest,
  soapRequestHeaders,
  soapServerUrl,
} from '../../utils/soap'

export const AdminRouter = router({
  getUserColumns: publicProcedure.query(() => {
    return Prisma.dmmf.datamodel.models.find((model) => model.name === 'User')
  }),
  getTablesColumns: publicProcedure.query(() => {
    return Prisma.dmmf.datamodel.models
  }),
  getUsersData: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany()
  }),
  getTableData: publicProcedure
    .input(z.object({ tableName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const query = `SELECT * FROM \"${input.tableName}\"`
      return await ctx.prisma.$queryRawUnsafe(query)
    }),
  deleteUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.supabase.auth.admin.deleteUser(input.id)
      await ctx.prisma.user.delete({
        where: { id: input.id },
      })
    }),
  updateUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        username: z.string(),
        password: z.string(),
        accessKey: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          ...input,
        },
      })
      if (sendSoapRequest) {
        const { response } = await soapRequest({
          url: soapServerUrl,
          headers: soapRequestHeaders,
          xml: createSoapRequestXml('UpsertUser', [
            { Name: 'username', Value: input.username },
            { Name: 'name', Value: input.name },
            { Name: 'password', Value: input.password },
            { Name: 'email', Value: input.email },
            { Name: 'phone', Value: input.phone },
            {
              Name: 'accessKey',
              Value: input.accessKey.toString(),
            },
          ]),
        })
        const { body } = response
        const result = getResultFromResponse('UpsertUser', body)
        return result
      }
    }),
  updateDevice: publicProcedure
    .input(
      z.object({
        model: z.string(),
        name: z.string(),
        type: z.string(),
        releaseDate: z.string(),
        releaseOS: z.optional(z.string()),
        releasePrice: z.number(),
        connector: z.string(),
        biometrics: z.string(),
        batterySize: z.number(),
        chipset: z.string(),
        weight: z.number(),
        description: z.string(),
        imageAmount: z.number(),
        height: z.number(),
        width: z.number(),
        depth: z.number(),
        storage: z.optional(z.number()),
        cpu: z.optional(z.number()),
        gpu: z.optional(z.number()),
        memory: z.optional(z.number()),
        wiredCharging: z.optional(z.number()),
        magsafe: z.boolean(),
        wirelessCharging: z.optional(z.number()),
        screenSize: z.optional(z.number()),
        screenType: z.optional(z.string()),
        resistanceRating: z.optional(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      await ctx.prisma.device.update({
        where: { model: input.model },
        data: {
          ...input,
        },
      })

      if (sendSoapRequest) {
        const { response } = await soapRequest({
          url: soapServerUrl,
          headers: soapRequestHeaders,
          xml: createSoapRequestXml('UpsertDevice', [
            { Name: 'model', Value: input.model },
            { Name: 'name', Value: input.name },
            { Name: 'type', Value: input.type },
            { Name: 'releaseDate', Value: input.releaseDate },
            { Name: 'releaseOS', Value: input.releaseOS ?? 'null' },
            { Name: 'releasePrice', Value: input.releasePrice.toString() },
            { Name: 'connector', Value: input.connector },
            { Name: 'biometrics', Value: input.biometrics },
            { Name: 'batterySize', Value: input.batterySize.toString() },
            { Name: 'chipset', Value: input.chipset },
            { Name: 'weight', Value: input.weight.toString() },
            { Name: 'description', Value: input.description },
            { Name: 'imageAmount', Value: input.imageAmount.toString() },
            { Name: 'height', Value: input.height.toString() },
            { Name: 'width', Value: input.width.toString() },
            { Name: 'depth', Value: input.depth.toString() },
            {
              Name: 'storage',
              Value: input.storage ? input.storage.toString() : 'null',
            },
            {
              Name: 'cpu',
              Value: input.cpu ? input.cpu.toString() : 'null',
            },
            {
              Name: 'gpu',
              Value: input.gpu ? input.gpu.toString() : 'null',
            },
            {
              Name: 'memory',
              Value: input.memory ? input.memory.toString() : 'null',
            },
            {
              Name: 'wiredCharging',
              Value: input.wiredCharging
                ? input.wiredCharging.toString()
                : 'null',
            },
            {
              Name: 'magsafe',
              Value: input.magsafe ? 'true' : 'false',
            },
            {
              Name: 'wirelessCharging',
              Value: input.wirelessCharging
                ? input.wirelessCharging.toString()
                : 'null',
            },
            {
              Name: 'screenSize',
              Value: input.screenSize ? input.screenSize.toString() : 'null',
            },
            {
              Name: 'screenType',
              Value: input.screenType ? input.screenType.toString() : 'null',
            },
            {
              Name: 'resistanceRating',
              Value: input.resistanceRating
                ? input.resistanceRating.toString()
                : 'null',
            },
          ]),
        })
        const { body } = response
        const result = getResultFromResponse('UpsertDevice', body)
        return result
      }
    }),
})

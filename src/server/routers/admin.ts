import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { Prisma } from '@prisma/client'
import { sendSoapRequest } from '../../../config'
import { deviceSchema, userSchema } from '../../models/schemas'
import { upsertDeviceSoap, upsertUserSoap } from '../soapFunctions'

export const AdminRouter = router({
  getUserColumns: publicProcedure.query(({ ctx }) => {
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
    .input(userSchema)
    .mutation(async ({ ctx, input }) => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          ...input,
        },
      })

      if (sendSoapRequest) {
        return await upsertUserSoap({ input })
      }
    }),
  updateDevice: publicProcedure
    .input(deviceSchema)
    .mutation(async ({ ctx, input }) => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      await ctx.prisma.device.update({
        where: { model: input.model },
        data: {
          ...input,
        },
      })

      if (sendSoapRequest) {
        return await upsertDeviceSoap({ input })
      }
    }),
})

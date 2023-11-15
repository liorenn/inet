import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { Prisma } from '@prisma/client'
import soapRequest from 'easy-soap-request'
import { XMLParser } from 'fast-xml-parser'
import {
  createSoapRequestXml,
  getResultFromResponse,
  sendSoapRequest,
  soapRequestHeaders,
  soapServerUrl,
} from '../../utils/soap'

export const AdminRouter = router({
  soapUpsertUser: publicProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {}),
  getUserColumns: publicProcedure.query(async ({ ctx }) => {
    return Prisma.dmmf.datamodel.models.find((model) => model.name === 'User')
  }),
  getTablesColumns: publicProcedure.query(async ({ ctx }) => {
    return Prisma.dmmf.datamodel.models
  }),
  getUsersData: publicProcedure.query(async ({ ctx, input }) => {
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
      }
    }),
})

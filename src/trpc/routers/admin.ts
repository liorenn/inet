import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { Prisma } from '@prisma/client'
import $ from 'jquery.soap'

export const AdminRouter = router({
  getSoap: publicProcedure.query(async ({ ctx }) => {
    const url = 'https://localhost:44394/Asp/WebService1.asmx?WSDL'
    $.soap({
      url: url,
      method: 'Add',

      data: {
        n1: '3',
        n2: '2',
      },

      success: function (soapResponse) {
        console.log(soapResponse)
        // do stuff with soapResponse
        // if you want to have the response as JSON use soapResponse.toJSON();
        // or soapResponse.toString() to get XML string
        // or soapResponse.toXML() to get XML DOM
      },
      error: function (SOAPResponse) {
        console.log(SOAPResponse)
        // show error
      },
    })
    return false
  }),
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
      console.log(typeof input.accessKey)
      await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          ...input,
        },
      })
    }),
})

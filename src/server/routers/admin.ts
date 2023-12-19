import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { Prisma } from '@prisma/client'
import { fromEmail, resendKey, sendSoapRequest } from '../../../config'
import { deviceSchema, userSchema } from '../../models/schemas'
import { upsertDeviceSoap, upsertUserSoap } from '../soapFunctions'
import { Resend } from 'resend'
import PriceDropEmail from '../../components/misc/PriceDropEmail'
import {
  fetchCurrentPrice,
  calculatePercentageDiff,
} from '../../misc/functions'

export const AdminRouter = router({
  example: publicProcedure.query(() => {
    return 'Hello world'
  }),
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
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const query = `SELECT id FROM auth.users WHERE email = '${input.email}';`
      const userId = await ctx.prisma.$queryRawUnsafe(query)
      if (typeof userId === 'string') {
        const { data, error } = await ctx.supabase.auth.admin.deleteUser(userId)
        await ctx.prisma.user.delete({
          where: { email: input.email },
        })
      }
    }),
  updateUser: publicProcedure
    .input(userSchema)
    .mutation(async ({ ctx, input }) => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      await ctx.prisma.user.update({
        where: { email: input.email },
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
  sendPriceDropsEmails: publicProcedure.mutation(async ({ ctx }) => {
    const devicesUsers = await ctx.prisma.deviceUser.findMany()
    devicesUsers.map(async (deviceUser) => {
      const device = await ctx.prisma.device.findFirst({
        where: { model: deviceUser.deviceModel },
      })
      const user = await ctx.prisma.user.findFirst({
        where: { email: deviceUser.userEmail },
        select: { name: true, email: true },
      })
      if (user && device) {
        const price = await fetchCurrentPrice(device.model)
        if (price && price != device.price) {
          await ctx.prisma.device.update({
            where: { model: device.model },
            data: { price: price },
          })
        }
        if (price && price < device.price) {
          const resend = new Resend(resendKey)
          resend.emails
            .send({
              from: fromEmail,
              to: user.email,
              subject: `${device.name} Price Drop`,
              react: PriceDropEmail({
                name: user.name,
                newPrice: price,
                device: device,
                precentage: calculatePercentageDiff(device.price, price),
              }),
            })
            .then((value) => {
              if (value.id) {
                return true
              }
            })
        } else {
          return false
        }
      }
    })
  }),
})

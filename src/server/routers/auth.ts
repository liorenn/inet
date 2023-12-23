import { Prisma } from '@prisma/client'
import { Resend } from 'resend'
import { sendSoapRequest, resendKey, fromEmail } from '../../../config'
import PriceDropEmail from '../../components/misc/PriceDropEmail'
import {
  fetchCurrentPrice,
  calculatePercentageDiff,
} from '../../misc/functions'
import {
  commentSchema,
  updatePropertiesSchema,
  userSchema,
} from '../../models/schemas'
import { upsertUserSoap } from '../soapFunctions'
import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const authRouter = router({
  example: publicProcedure.query(() => {
    return 'Hello world'
  }),
  getUserColumns: publicProcedure.query(() => {
    return Prisma.dmmf.datamodel.models.find((model) => model.name === 'User')
  }),
  getTablesColumns: publicProcedure.query(() => {
    return Prisma.dmmf.datamodel.models
  }),
  getTableData: publicProcedure
    .input(z.object({ tableName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const query = `SELECT * FROM \"${input.tableName}\"`
      return await ctx.prisma.$queryRawUnsafe(query)
    }),
  getUsersData: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany()
  }),
  insertUser: publicProcedure
    .input(userSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          phone: input.phone,
          password: input.password,
          username: input.username,
          accessKey: input.accessKey,
          comments: { create: [] },
          deviceList: { create: [] },
        },
      })
    }),
  deleteUser: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.delete({
        where: { email: input.email },
      })
      const query = `SELECT id FROM auth.users WHERE email = '${input.email}';`
      const userId = await ctx.prisma.$queryRawUnsafe(query)
      if (typeof userId === 'string') {
        await ctx.supabase.auth.admin.deleteUser(userId)
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
  editComment: publicProcedure
    .input(
      z.object({
        commentId: z.number(),
        message: z.string(),
        rating: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.update({
        where: { id: input.commentId },
        data: {
          message: input.message,
          rating: input.rating,
        },
      })
      return comments
    }),
  deleteComment: publicProcedure
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.delete({
        where: { id: input.commentId },
      })
      return comments
    }),
  addComment: publicProcedure
    .input(commentSchema)
    .mutation(async ({ ctx, input }) => {
      const { likes, createdAt, message, model, rating, updatedAt, username } =
        input
      const comment = await ctx.prisma.comment.create({
        data: {
          likes,
          message,
          rating,
          updatedAt,
          createdAt,
          model,
          username,
        },
      })
      return comment
    }),
  getAllComments: publicProcedure
    .input(z.object({ model: z.string() }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: { model: input.model },
        include: { user: true },
      })
      return comments
    }),
  updateUserDetails: publicProcedure
    .input(
      z.object({
        property: updatePropertiesSchema,
        email: z.string(),
        value: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const update = { [input.property]: input.value }
      const details = await ctx.prisma.user.update({
        where: { email: input.email },
        data: update,
      })
      return details
    }),
  getUserDetails: publicProcedure
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const details = await ctx.prisma.user.findFirst({
        where: { email: input.email },
        include: { comments: true },
      })
      return details
    }),
  getUserComments: publicProcedure
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const details = await ctx.prisma.user.findFirst({
        where: { email: input.email },
        select: {},
      })
      return details
    }),
  getAccessKey: publicProcedure
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const details = await ctx.prisma.user.findFirst({
        where: { email: input.email },
      })
      return details?.accessKey
    }),
  createUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.user.create({
          data: {
            email: input.email,
            name: input.name,
            phone: input.phone,
            password: input.password,
            username: input.username,
            comments: { create: [] },
            deviceList: { create: [] },
          },
        })
      } catch (e) {
        return e
      }
    }),
  IsUserExists: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        username: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const emailUser = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
          password: input.password,
        },
      })
      const usernameUser = await ctx.prisma.user.findFirst({
        where: { username: input?.username },
      })
      if (!emailUser && !usernameUser) {
        return { email: false, username: false }
      }
      if (!emailUser && usernameUser) {
        return { email: false, username: true }
      }
      if (emailUser && emailUser.username === input?.username) {
        return { email: true, username: true }
      }
      if (emailUser && emailUser.username !== input?.username) {
        return { email: true, username: false }
      }
    }),
})

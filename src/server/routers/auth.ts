import { devicePropertiesType } from '../../models/deviceTypes'
import { commentSchema, updatePropertiesSchema } from '../../models/schemas'
import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const authRouter = router({
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
  isDeviceInUser: publicProcedure
    .input(
      z.object({
        deviceModel: z.string(),
        userEmail: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const device = await ctx.prisma.deviceUser.findFirst({
        where: {
          userEmail: input.userEmail,
          deviceModel: input.deviceModel,
        },
      })
      return device ? { isInList: true } : { isInList: false }
    }),
  handleDeviceToUser: publicProcedure
    .input(
      z.object({
        deviceModel: z.string(),
        userId: z.string(),
        isInList: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.isInList) {
        await ctx.prisma.deviceUser.delete({
          where: {
            deviceModel_userEmail: {
              deviceModel: input.deviceModel,
              userEmail: input.userId,
            },
          },
        })
      } else {
        await ctx.prisma.deviceUser.create({
          data: { deviceModel: input.deviceModel, userEmail: input.userId },
        })
      }
    }),
  getUserDevices: publicProcedure
    .input(
      z.object({
        userEmail: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const devices = await ctx.prisma.deviceUser.findMany({
        where: {
          userEmail: input.userEmail,
        },
      })
      const devicesArr: devicePropertiesType[] = []
      for (let i = 0; i < devices.length; i++) {
        const device = await ctx.prisma.device.findFirst({
          where: { model: devices[i].deviceModel },
          select: {
            model: true,
            name: true,
            imageAmount: true,
            type: true,
          },
        })
        if (device) {
          devicesArr.push(device)
        }
      }
      return devicesArr
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

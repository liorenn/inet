import { router, publicProcedure } from '../trpc'
import { Resend } from 'resend'
import { z } from 'zod'
import { EmailTemplate } from '../../components/emailTemplates/welcome'

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session
  }),
  sendEmail: publicProcedure.mutation(() => {
    const resend = new Resend(process.env.RESEND_KEY)
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'lior.oren06@gmail.com',
      subject: 'Hello World Test',
      react: EmailTemplate({ firstName: 'John' }),
    })
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
    .input(
      z.object({
        likes: z.number(),
        message: z.string(),
        Rating: z.number(),
        updatedAt: z.date(),
        createdAt: z.date(),
        model: z.string(),
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { likes, createdAt, message, model, Rating, updatedAt, username } =
        input
      const comment = await ctx.prisma.comment.create({
        data: {
          likes,
          message,
          Rating,
          updatedAt,
          createdAt,
          model,
          username,
        },
      })
      return comment
    }),
  GetPublicUrl: publicProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { data } = await ctx.supabase.storage
        .from('pictures')
        .createSignedUrl(
          input.userId ? input.userId.toString() : '' + '/profile.png',
          60
        )
      if (data?.signedUrl) {
        return data?.signedUrl
      } else {
        return ''
      }
    }),
  GetPublicUrlArr: publicProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      const UrlArr: string[] = []
      for (let i = 0; i < input.length; i++) {
        const { data } = await ctx.supabase.storage
          .from('pictures')
          .createSignedUrl(input[i] + '/profile.png', 60 * 60 * 24 * 60)
        if (data?.signedUrl) {
          UrlArr.push(data.signedUrl)
        } else {
          UrlArr.push('')
        }
      }
      return UrlArr
    }),
  getUsersIds: publicProcedure
    .input(z.array(z.object({ username: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const arr: string[] = []
      for (let i = 0; i < input.length; i++) {
        const user = await ctx.prisma.user.findFirst({
          where: { username: input[i].username },
        })
        if (user) arr.push(user.id)
        else arr.push('error')
      }
      return arr
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
  areDevicesInUser: publicProcedure
    .input(
      z.object({
        deviceModels: z.array(z.string()),
        userId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const areInList: boolean[] = []
      for (let i = 0; i < input.deviceModels.length; i++) {
        const device = await ctx.prisma.deviceUser.findFirst({
          where: {
            userId: input.userId,
            deviceModel: input.deviceModels[i],
          },
        })
        areInList[i] = device ? true : false
      }
      return areInList
    }),
  isDeviceInUser: publicProcedure
    .input(
      z.object({
        deviceModel: z.string(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const device = await ctx.prisma.deviceUser.findFirst({
        where: {
          userId: input.userId,
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
            deviceModel_userId: {
              deviceModel: input.deviceModel,
              userId: input.userId,
            },
          },
        })
      } else {
        await ctx.prisma.deviceUser.create({
          data: { deviceModel: input.deviceModel, userId: input.userId },
        })
      }
    }),
  getUserDevices: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const devices = await ctx.prisma.deviceUser.findMany({
        where: {
          userId: input.userId,
        },
      })
      const devicesArr: devicesPropertiesArrType = []
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
  MutateUserDevices: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        deviceModel: z.string(),
        action: z.enum(['insert', 'remove']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.action === 'insert') {
        await ctx.prisma.deviceUser.create({
          data: {
            deviceModel: input.deviceModel,
            userId: input.userId,
          },
        })
      } else {
        await ctx.prisma.deviceUser.delete({
          where: {
            deviceModel_userId: {
              deviceModel: input.deviceModel,
              userId: input.userId,
            },
          },
        })
      }
    }),
  updateUserDetails: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const details = await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          ...input,
        },
      })
      return details
    }),
  getUserDetails: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const details = await ctx.prisma.user.findFirst({
        where: { id: input.id },
      })
      return details
    }),
  CreateUser: publicProcedure
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
            id: input.id,
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

export type devicesPropertiesArrType = {
  model: string
  name: string
  type: string
  imageAmount: number
}[]

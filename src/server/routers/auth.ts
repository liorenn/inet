import { calculatePercentageDiff, encodeEmail } from '@/utils/utils'
import { commentSchema, updateSchema, userSchema } from '@/models/schemas'
import { deleteUserSoap, insertUserSoap, updateUserSoap } from '../soapFunctions'
import { emailProvider, sendSoapRequest, websiteEmail } from 'config'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { method, router } from '@/server/trpc'

import PriceDropEmail from '@/components/misc/PriceDropEmail'
import { Prisma } from '@prisma/client'
import { Resend } from 'resend'
import { fetchCurrentPrice } from '@/utils/price'
import { z } from 'zod'

export const authRouter = router({
  getConfigs: method.query(() => {
    const filePath = 'config.ts'
    const fileContents = readFileSync(filePath, 'utf8')
    return fileContents
  }),
  saveConfigs: method.input(z.object({ configs: z.string() })).mutation(({ input }) => {
    const filePath = 'config.ts'
    writeFileSync(filePath, input.configs)
  }),
  insertUser: method
    .input(userSchema.merge(z.object({ FromAsp: z.boolean().optional() })))
    .mutation(async ({ ctx, input }) => {
      try {
        const { FromAsp, ...user } = input
        await ctx.prisma.user.create({
          data: {
            ...user,
            comments: { create: [] },
            deviceList: { create: [] },
          },
        })
        if (sendSoapRequest && FromAsp !== true) {
          await insertUserSoap({ input: user })
        }
        return true
      } catch {
        return false
      }
    }),
  updateUser: method
    .input(userSchema.merge(z.object({ FromAsp: z.boolean().optional() })))
    .mutation(async ({ ctx, input }) => {
      try {
        const { FromAsp, ...user } = input
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
        await ctx.prisma.user.update({
          where: { email: input.email },
          data: {
            ...user,
          },
        })
        if (sendSoapRequest && FromAsp !== true) {
          await updateUserSoap({ input: user })
        }
        return true
      } catch {
        return false
      }
    }),
  deleteUser: method
    .input(z.object({ email: z.string(), FromAsp: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.user.delete({
          where: { email: input.email },
        })
        // const query = `SELECT id FROM auth.users WHERE email = '${input.email}';`
        // const userId = await ctx.prisma.$queryRawUnsafe(query)
        // if (typeof userId === 'string') {
        //   await ctx.supabase.auth.admin.deleteUser(userId)
        // }
        if (sendSoapRequest && input.FromAsp !== true) {
          await deleteUserSoap({ email: input.email })
        }
        return true
      } catch {
        return false
      }
    }),
  getUserColumns: method.query(() => {
    return Prisma.dmmf.datamodel.models.find((model) => model.name === 'User')
  }),
  getTablesColumns: method.query(() => {
    return Prisma.dmmf.datamodel.models
  }),
  getTableData: method
    .input(z.object({ tableName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const query = `SELECT * FROM \"${input.tableName}\"`
      return await ctx.prisma.$queryRawUnsafe(query)
    }),
  getUsersData: method.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany()
  }),
  sendPriceDropsEmails: method
    .input(z.object({ sendTest: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
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
          if (input.sendTest === true) {
            const resend = new Resend(emailProvider)
            device.price = 600
            await resend.emails
              .send({
                from: websiteEmail,
                to: user.email,
                subject: `${device.name} Price Drop`,
                react: PriceDropEmail({
                  name: user.name,
                  newPrice: 400,
                  device: device,
                  precentage: calculatePercentageDiff(device.price, 400),
                }),
              })
              .then((value) => {
                if (value.id) {
                  return true
                }
              })
          } else {
            if (price && price < device.price) {
              const resend = new Resend(emailProvider)
              await resend.emails
                .send({
                  from: websiteEmail,
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
        }
      })
    }),
  isImageExists: method.input(z.object({ email: z.string() })).mutation(({ input }) => {
    const path = `public/users/${encodeEmail(input.email)}.png`
    return existsSync(path)
  }),
  getCommentEmail: method
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const comment = await ctx.prisma.user.findFirst({
        where: { username: input.username },
      })
      return comment?.email
    }),
  isCommentImageExists: method
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const comment = await ctx.prisma.user.findFirst({
        where: { username: input.username },
      })
      return comment?.email ? existsSync(`public/users/${encodeEmail(comment?.email)}.png`) : false
    }),
  editComment: method
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
  deleteComment: method
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.delete({
        where: { id: input.commentId },
      })
      return comments
    }),
  addComment: method.input(commentSchema).mutation(async ({ ctx, input }) => {
    const { createdAt, message, model, rating, updatedAt, username } = input
    const comment = await ctx.prisma.comment.create({
      data: {
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
  getAllComments: method.input(z.object({ model: z.string() })).query(async ({ ctx, input }) => {
    const comments = await ctx.prisma.comment.findMany({
      where: { model: input.model },
    })
    return comments
  }),
  updateUserDetails: method
    .input(
      z.object({
        property: updateSchema,
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
  getUserDetails: method
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.email === undefined) return null
      const details = await ctx.prisma.user.findFirst({
        where: { email: input.email },
        include: { comments: true },
      })
      return details
    }),
  getUserComments: method
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const details = await ctx.prisma.user.findFirst({
        where: { email: input.email },
        select: {},
      })
      return details
    }),
  getAccessKey: method
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.email === undefined) return 0
      const user = await ctx.prisma.user.findFirst({
        where: { email: input.email },
      })
      return user?.accessKey
    }),
  createUser: method
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.create({
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
    }),
  IsUserExists: method
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        username: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userEmail = await ctx.prisma.user.findFirst({
        where: { email: input.email },
      })
      const usernameUser = await ctx.prisma.user.findFirst({
        where: { username: input?.username },
      })
      return {
        email: !!userEmail,
        username: !!usernameUser && (userEmail ? userEmail.username === input?.username : true),
      }
    }),
})

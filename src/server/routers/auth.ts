import { Prisma, PrismaClient } from '@prisma/client'
import { UpdateSchema, commentSchema, userSchema } from '@/models/schemas'
import {
  backupDatabaseSoap,
  deleteUserSoap,
  insertUserSoap,
  restoreDatabaseSoap,
  updateUserSoap,
} from '@/server/soapFunctions'
import { calculatePercentageDiff, encodeEmail } from '@/utils/utils'
import { databaseEditorPort, sendSoapRequest, websiteEmail } from 'config'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { method, router } from '@/server/trpc'

import PriceDropEmail from '@/components/misc/PriceDropEmail'
import { exec } from 'child_process'
import { fetchCurrentPrice } from '@/server/price'
import { resend } from '@/server/client'
import { z } from 'zod'

export type allDataType = {
  table: string
  data: Record<string, unknown>[]
}[]

type RestoreDatabaseInput = {
  input: {
    data: string
    FromAsp?: boolean | undefined
  }
  prisma: PrismaClient
}

async function restoreDatabase({ input, prisma }: RestoreDatabaseInput) {
  if (input.FromAsp) {
    const jsonData = input.data
    const data: allDataType = JSON.parse(jsonData) as allDataType
    // Start a transaction
    await prisma.$executeRawUnsafe('DELETE FROM "Device";')
    await prisma.$executeRawUnsafe('BEGIN;')
    try {
      for (const { table, data: rows } of data) {
        // Generate DELETE query for the entire table
        const deleteQuery = `DELETE FROM "${table}";`
        await prisma.$executeRawUnsafe(deleteQuery)
        // Generate INSERT query for all rows in the table
        if (!rows[0]) continue
        const columns = Object.keys(rows[0])
          .map((column) => `"${column}"`)
          .join(', ')
        const values = rows
          .map((row) => {
            const rowValues = Object.values(row)
              .map((value) => {
                if (value === null) {
                  return 'NULL'
                } else if (typeof value === 'number') {
                  return value
                } else {
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  return `'${value}'`
                }
              })
              .join(', ')
            return `(${rowValues})`
          })
          .join(', ')
        const insertQuery = `INSERT INTO "${table}" (${columns}) VALUES ${values};`
        await prisma.$executeRawUnsafe(insertQuery)
      }
      // Commit the transaction if all queries are successful
      await prisma.$executeRawUnsafe('COMMIT;')
    } catch (error) {
      // Rollback the transaction if there is an error
      await prisma.$executeRawUnsafe('ROLLBACK;')
      throw error
    }
  }
}

async function backupDatabase({ prisma }: { prisma: PrismaClient }) {
  const allData: allDataType = []
  allData.push({ table: 'Device', data: await prisma.device.findMany() })
  allData.push({
    table: 'BiometricFeature',
    data: await prisma.biometricFeature.findMany(),
  })
  allData.push({ table: 'Camera', data: await prisma.camera.findMany() })
  allData.push({ table: 'CameraType', data: await prisma.cameraType.findMany() })
  allData.push({ table: 'Color', data: await prisma.color.findMany() })
  allData.push({ table: 'Comment', data: await prisma.camera.findMany() })
  allData.push({ table: 'DeviceColor', data: await prisma.deviceColor.findMany() })
  allData.push({ table: 'DeviceConnector', data: await prisma.deviceConnector.findMany() })
  allData.push({ table: 'DeviceType', data: await prisma.deviceType.findMany() })
  allData.push({ table: 'DeviceUser', data: await prisma.deviceUser.findMany() })
  allData.push({ table: 'User', data: await prisma.user.findMany() })
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  await backupDatabaseSoap({ input: allData })
}

export const authRouter = router({
  backupDatabase: method.mutation(async ({ ctx }) => {
    await backupDatabase({ prisma: ctx.prisma })
    return true
  }),
  restoreDatabase: method.mutation(async ({ ctx }) => {
    const response = await restoreDatabaseSoap()
    await restoreDatabase({ input: { data: response, FromAsp: true }, prisma: ctx.prisma })
    return true
  }),
  restoreDatabaseSoap: method
    .input(z.object({ data: z.string(), FromAsp: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      await restoreDatabase({ input, prisma: ctx.prisma })
      return true
    }),
  openDatabaseEditor: method.mutation(async () => {
    try {
      const response = await fetch(`http://localhost:${databaseEditorPort}/`)
      await response.text()
      return false
    } catch {
      exec(
        `npx prisma studio --port ${databaseEditorPort} --browser none --schema=./prisma/schema.prisma`
      )
      return true
    }
  }),
  closeDatabaseEditor: method.mutation(() => {
    try {
      exec(
        `for /f "tokens=5" %a in ('netstat -aon ^| find ":${databaseEditorPort}" ^| find "LISTENING"') do taskkill /f /pid %a`
      )
      return true
    } catch {
      return false
    }
  }),
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
        await ctx.prisma.user.update({
          where: { email: input.email },
          data: {
            ...user,
          },
        })
        if (sendSoapRequest && FromAsp !== true) {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
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
  getTablesProperties: method.query(() => {
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
  sendPriceDropsEmail: method
    .input(z.object({ email: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const email = input.email
      if (!email) return false
      const userDevices = await ctx.prisma.deviceUser.findMany({
        where: { userEmail: input.email },
        include: {
          device: true,
          user: true,
        },
      })
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      userDevices.forEach(async (userDevice) => {
        const price = await fetchCurrentPrice(userDevice.deviceModel)
        if (price && price != userDevice.device.price) {
          await ctx.prisma.device.update({
            where: { model: userDevice.deviceModel },
            data: { price: price },
          })
        }
        if (price && price < userDevice.device.price) {
          await resend.emails
            .send({
              from: websiteEmail,
              to: email,
              subject: `${userDevice.device.name} Price Drop`,
              react: PriceDropEmail({
                name: userDevice.user.name,
                newPrice: price,
                device: userDevice.device,
                precentage: calculatePercentageDiff(userDevice.device.price, price),
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
      })
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
        property: UpdateSchema,
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

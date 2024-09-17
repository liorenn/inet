import {
  GetTablesDataSoap,
  backupDatabaseSoap,
  deleteUserSoap,
  insertUserSoap,
  updateUserSoap
} from '@/server/soapFunctions'
import { Prisma, PrismaClient } from '@prisma/client'
import { UpdateSchema, commentSchema, userSchema } from '@/models/schemas'
import { calculatePercentageDiff, encodeEmail } from '@/utils/utils'
import { hash, verify } from '@node-rs/argon2'
import { method, protectedMethod } from '@/server/trpc'

import PriceDropEmail from '@/components/misc/PriceDropEmail'
import { createTRPCRouter } from '../trpc'
import { exec } from 'child_process'
import { existsSync } from 'fs'
import { fetchCurrentPrice } from '@/server/price'
import { generateIdFromEntropySize } from 'lucia'
import { lucia } from '@/server/auth'
import { resend } from '@/server/client'
import { z } from 'zod'

// The data type for the backupDatabase function
export type allDataType = {
  table: string
  data: Record<string, unknown>[]
}[]

// The input type for the restoreDatabase function
type RestoreDatabaseInput = {
  input: {
    data: string
  }
  prisma: PrismaClient
}

// Function to restore the database data
async function restoreDatabase({ input, prisma }: RestoreDatabaseInput) {
  // If request came from asp soap request
  try {
    const jsonData = input.data // Get the json data from the input
    const data: allDataType = JSON.parse(jsonData) as allDataType // Parse the json data to allDataType type
    // Delete all rows from the Device table because other tables rely on the device table
    await prisma.$executeRawUnsafe('DELETE FROM "Device";')
    // For each table in the data
    for (const { table, data: tableData } of data) {
      const deleteQuery = `DELETE FROM "${table}";` // Generate delete query for the entire table
      await prisma.$executeRawUnsafe(deleteQuery) // Execute the delete query
      if (!tableData[0]) continue // If table has no data dont proceed to to insert query
      const columns = Object.keys(tableData[0]) // Get the columns of the table
        .map((column) => `"${column}"`) // Put it in quotes for the query
        .join(', ') // Join the columns with commas
      const values = tableData
        // For each row in the table
        .map((row) => {
          const rowValues = Object.values(row) // Get the row values
            .map((value) => {
              // If value is null
              if (value === null) {
                return 'NULL' // Return null in sql format
              } // If value is number
              else if (typeof value === 'number') {
                return value // Return value in sql format
              } // If value is string or other data type
              else {
                return `'${value as string}'` // Return value in sql format
              }
            })
            .join(', ') // Join the values with commas
          return `(${rowValues})` // Return value in sql format
        })
        .join(', ') // Join the values with commas
      const insertQuery = `INSERT INTO "${table}" (${columns}) VALUES ${values};` // Create insert query
      await prisma.$executeRawUnsafe(insertQuery) // Execute the insert query
    }

    return true
  } catch {
    return false
  }
}

// Function to backup the database data
async function backupDatabase({ prisma }: { prisma: PrismaClient }) {
  const allData: allDataType = [] // Initialize all data array
  // Add all tables and their data to the database
  allData.push({ table: 'Device', data: await prisma.device.findMany() })
  allData.push({
    table: 'BiometricFeature',
    data: await prisma.biometricFeature.findMany()
  })
  allData.push({ table: 'Camera', data: await prisma.camera.findMany() })
  allData.push({ table: 'CameraType', data: await prisma.cameraType.findMany() })
  allData.push({ table: 'Color', data: await prisma.color.findMany() })
  allData.push({ table: 'DeviceColor', data: await prisma.deviceColor.findMany() })
  allData.push({ table: 'DeviceConnector', data: await prisma.deviceConnector.findMany() })
  allData.push({ table: 'DeviceType', data: await prisma.deviceType.findMany() })
  allData.push({ table: 'User', data: await prisma.user.findMany() })
  allData.push({ table: 'DeviceUser', data: await prisma.deviceUser.findMany() })
  allData.push({ table: 'Comment', data: await prisma.comment.findMany() })
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' // Allow soap calls to succeed
  await backupDatabaseSoap({ input: allData }) // Send the soap request with all of the tables data
}

// Create a auth router
export const authRouter = createTRPCRouter({
  getUser: method.query(({ ctx }) => {
    return ctx.user
  }),
  signUp: method.input(userSchema.omit({ accessKey: true })).mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({ where: { email: input.email } })
    if (user) return { error: true, message: 'Email already exists', user: null }

    const passwordHash = await hash(input.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    })

    const userId = generateIdFromEntropySize(10)
    await ctx.db.user.create({
      data: {
        ...input,
        id: userId,
        accessKey: 1,
        password: passwordHash
      }
    })

    const session = await lucia.createSession(userId, {})
    ctx.res.appendHeader('Set-Cookie', lucia.createSessionCookie(session.id).serialize())
    return { error: false, message: 'User Signed Up Successfully', user: ctx.user }
  }),
  signIn: method
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({ where: { email: input.email } })
      if (!user) return { error: true, message: 'Incorrect Email or Password', user: null }
      const validPassword = verify(user.password, input.password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
      })
      if (!validPassword) return { error: true, message: 'Incorrect Email or Password' }
      const session = await lucia.createSession(user.id, {})
      ctx.res.appendHeader('Set-Cookie', lucia.createSessionCookie(session.id).serialize())
      return { error: false, message: 'User Signed In Successfully', user: ctx.user }
    }),
  signOut: protectedMethod.mutation(async ({ ctx }) => {
    if (!ctx.user || !ctx.session) return { error: true, message: 'User Not Found' }
    await lucia.invalidateSession(ctx.session.id)
    ctx.res.setHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize())
    return { error: false, message: 'User Signed Out Successfully' }
  }),
  // Function to backup the database
  backupDatabase: method.mutation(async ({ ctx }) => {
    await backupDatabase({ prisma: ctx.db }) // Backup the database
    return true // Return true to indicate operation success
  }),
  // Function to restore the database
  restoreDatabase: method.mutation(async ({ ctx }) => {
    const response = await GetTablesDataSoap() // Send the soap request
    await restoreDatabase({ input: { data: response }, prisma: ctx.db }) // Restore the database
    return true
  }),
  // Function to send a soap request to restore the database
  restoreDatabaseSoap: method
    .input(z.object({ data: z.string(), FromAsp: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      const result = await restoreDatabase({ input, prisma: ctx.db }) // Restore the database
      return result
    }),
  // Function to open the database editor
  openDatabaseEditor: method
    .input(
      z
        .object({
          databaseEditorPort: z.number()
        })
        .default({ databaseEditorPort: 3000 })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(`http://localhost:${input.databaseEditorPort}/`) // Send request to database editor if it exists
        await response.text() // Convert response
        return false // Database editor exists so return false
      } catch {
        exec(
          `npx prisma studio --port ${input.databaseEditorPort} --browser none --schema=./prisma/schema.prisma`
        ) // Open database editor by running the command in the terminal
        return true // Database editor does not exist so return true
      }
    }),
  // Function to close the database editor
  closeDatabaseEditor: method
    .input(
      z
        .object({
          databaseEditorPort: z.number()
        })
        .default({ databaseEditorPort: 3000 })
    )
    .mutation(({ input }) => {
      try {
        exec(
          `for /f "tokens=5" %a in ('netstat -aon ^| find ":${input.databaseEditorPort}" ^| find "LISTENING"') do taskkill /f /pid %a`
        ) // Close database editor by running the command in the terminal
        return true // Database editor exists so return true
      } catch {
        return false // Database editor does not exist so return false
      }
    }),
  // Function to insert a user
  insertUser: method
    .input(
      userSchema.merge(
        z.object({ FromAsp: z.boolean().optional(), sendSoapRequest: z.boolean().default(false) })
      )
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = generateIdFromEntropySize(10)
        const { FromAsp, ...user } = input // Destructure the input
        await ctx.db.user.create({
          data: {
            id: userId,
            ...user,
            comments: { create: [] },
            deviceList: { create: [] }
          }
        }) // Create the user
        // Send the soap request if sendSoapRequest config is true and request is not from asp
        if (input.sendSoapRequest && FromAsp !== true) {
          await insertUserSoap({ input: user }) // Send the soap request
        }
        return true // Return true to indicate operation success
      } catch {
        return false // Return false to indicate operation failure
      }
    }),
  // Function to update a user
  updateUser: method
    .input(
      userSchema.merge(
        z.object({ FromAsp: z.boolean().optional(), sendSoapRequest: z.boolean().default(false) })
      )
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { FromAsp, ...user } = input // Destructure the input
        await ctx.db.user.update({
          where: { email: input.email },
          data: {
            ...user
          }
        }) // Update the user
        // Send the soap request if sendSoapRequest config is true and request is not from asp
        if (input.sendSoapRequest && FromAsp !== true) {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' // Allow soap calls to succeed
          await updateUserSoap({ input: user }) // Send the soap request
        }
        return true // Return true to indicate operation success
      } catch {
        return false // Return false to indicate operation failure
      }
    }),
  // Function to delete a user
  deleteUser: method
    .input(
      z.object({
        email: z.string(),
        FromAsp: z.boolean().optional(),
        sendSoapRequest: z.boolean().default(false)
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.user.delete({
          where: { email: input.email }
        }) // Delete the user
        // Send the soap request if sendSoapRequest config is true and request is not from asp
        if (input.sendSoapRequest && input.FromAsp !== true) {
          await deleteUserSoap({ email: input.email }) // Send the soap request
        }
        return true // Return true to indicate operation success
      } catch {
        return false // Return false to indicate operation failure
      }
    }),
  // Get all user tables properties
  getUserProperties: method.query(() => {
    return Prisma.dmmf.datamodel.models.find((model) => model.name === 'User') // Get user table columns
  }),
  // Function to get all tables properties
  getTablesProperties: method.query(() => {
    return Prisma.dmmf.datamodel.models // Get tables properties from prisma client
  }),
  // Function to get all data from a table
  getTableData: method
    .input(z.object({ tableName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const selectQuery = `SELECT * FROM \"${input.tableName}\"` // Build a select query
      return await ctx.db.$queryRawUnsafe(selectQuery) // Send the query to the database
    }),
  // Function to get all users data
  getUsersData: method.query(async ({ ctx }) => {
    return await ctx.db.user.findMany() // Get all users from the database
  }),
  // Function to Send price drops email to a user if the price of saved devices is lower than the price before
  sendPriceDropsEmail: method
    .input(
      z.object({
        email: z.string().optional(),
        websiteEmail: z.string().default('onboarding@resend.dev')
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email // Get the email from the input
      if (!email) return false // If no email is provided return false
      const userDevices = await ctx.db.deviceUser.findMany({
        where: { userEmail: input.email },
        include: {
          device: true,
          user: true
        }
      }) // Get all devices of a user
      userDevices.forEach(async (userDevice) => {
        let price = 0
        try {
          const currentPrice = await fetchCurrentPrice(userDevice.deviceModel) // Fetch the current price of the device
          price = currentPrice
        } catch {}
        // If device has a price and it is not the same price as before
        if (price && price != userDevice.device.price) {
          await ctx.db.device.update({
            where: { model: userDevice.deviceModel },
            data: { price: price }
          })
        }
        // If device has a price and it is lower than the price before
        if (price && price < userDevice.device.price) {
          await resend.emails
            .send({
              from: input.websiteEmail,
              to: email,
              subject: `${userDevice.device.name} Price Drop`,
              react: PriceDropEmail({
                name: userDevice.user.name,
                newPrice: price,
                device: userDevice.device,
                percentage: calculatePercentageDiff(userDevice.device.price, price) // Calculate the percentage of the price drop
              })
            })
            .then((value) => {
              // If email was sent and response has an id
              if (value.id) {
                return true // Return true to indicate operation success
              }
            })
        } else {
          return false // Return false to indicate operation failure
        }
      })
    }),
  // Function to send price drops emails to a all users if the price of saved devices is lower than the price before
  sendPriceDropsEmails: method
    .input(
      z.object({
        sendTest: z.boolean().optional(),
        websiteEmail: z.string().default('onboarding@resend.dev')
      })
    )
    .mutation(async ({ ctx, input }) => {
      const devicesUsers = await ctx.db.deviceUser.findMany() // Get all devices of a user
      devicesUsers.map(async (deviceUser) => {
        const device = await ctx.db.device.findFirst({
          where: { model: deviceUser.deviceModel }
        }) // Get all devices of a user
        const user = await ctx.db.user.findFirst({
          where: { email: deviceUser.userEmail },
          select: { name: true, email: true }
        }) // Get all devices of a user
        // If user and device exist
        if (user && device && (device.type === 'iphone' || device.type === 'ipad')) {
          let price = 0
          try {
            const currentPrice = await fetchCurrentPrice(device.model) // Fetch the current price of the device
            price = currentPrice
          } catch {}
          // If device has a price and it is not the same price as before
          if (price && price != device.price) {
            await ctx.db.device.update({
              where: { model: device.model },
              data: { price: price }
            }) // Update the price
          }
          //
          if (input.sendTest === true) {
            device.price = 600 // Set a fake price
            await resend.emails
              .send({
                from: input.websiteEmail,
                to: user.email,
                subject: `${device.name} Price Drop`,
                react: PriceDropEmail({
                  name: user.name,
                  newPrice: 400,
                  device: device,
                  percentage: calculatePercentageDiff(device.price, 400) // Calculate the percentage of a fake price drop
                })
              })
              .then((value) => {
                // If email was sent and response has an id
                if (value.id) {
                  return true // Return true to indicate operation success
                }
              })
          } else {
            // If device has a price and it is lower than the price before
            if (price && price < device.price) {
              await resend.emails
                .send({
                  from: input.websiteEmail,
                  to: user.email,
                  subject: `${device.name} Price Drop`,
                  react: PriceDropEmail({
                    name: user.name,
                    newPrice: price,
                    device: device,
                    percentage: calculatePercentageDiff(device.price, price) // Calculate the percentage of the price drop
                  })
                })
                .then((value) => {
                  if (value.id) {
                    return true // Return true to indicate operation success
                  }
                })
            } else {
              return false // Return false to indicate operation failure
            }
          }
        }
      })
    }),
  // Function to check if an image exists
  isImageExists: method.input(z.object({ email: z.string() })).mutation(({ input }) => {
    const path = `public/users/${encodeEmail(input.email)}.png` // The path to the image
    return existsSync(path) // Return if the image exists
  }),
  // Function to get the email of a comment
  getCommentEmail: method
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const comment = await ctx.db.user.findFirst({
        where: { username: input.username }
      }) // Get the comment whose username is the input
      return comment?.email // Return the email of the comment
    }),
  // Function to check if a comment image exists
  isCommentImageExists: method
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const comment = await ctx.db.user.findFirst({
        where: { username: input.username }
      }) // Get the comment whose username is the input
      // If comment exists return if the image exists
      return comment?.email ? existsSync(`public/users/${encodeEmail(comment?.email)}.png`) : false
    }),
  // Function to edit a comment
  editComment: method
    .input(
      z.object({
        commentId: z.number(),
        message: z.string(),
        rating: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comments = await ctx.db.comment.update({
        where: { id: input.commentId },
        data: {
          message: input.message,
          rating: input.rating
        }
      }) // Update the comment whose id is the input
      return comments // Return the updated comments
    }),
  // Function to delete a comment
  deleteComment: method
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const comments = await ctx.db.comment.delete({
        where: { id: input.commentId }
      }) // Delete the comment whose id is the input
      return comments // Return the deleted comments
    }),
  // Function to create a comment
  addComment: method.input(commentSchema).mutation(async ({ ctx, input }) => {
    const { createdAt, message, model, rating, updatedAt, username } = input // Destructure the input
    const comment = await ctx.db.comment.create({
      data: {
        message,
        rating,
        updatedAt,
        createdAt,
        model,
        username
      }
    }) // Create a new comment
    return comment // Return the comment
  }),
  // Function to get all comments
  getAllComments: method.input(z.object({ model: z.string() })).query(async ({ ctx, input }) => {
    const comments = await ctx.db.comment.findMany({
      where: { model: input.model }
    }) // Get all comments for the model
    return comments // Return the comments
  }),
  // Function to get a user
  updateUserDetails: method
    .input(
      z.object({
        property: UpdateSchema,
        email: z.string(),
        value: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const update = { [input.property]: input.value }
      const details = await ctx.db.user.update({
        where: { email: input.email },
        data: update
      })
      return details
    }),
  // Function to get a user
  getAccessKey: method
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.email === undefined) return 0 // If no email is provided return zero
      const user = await ctx.db.user.findFirst({
        where: { email: input.email }
      }) // Get the user whose email matches the input
      return user?.accessKey // Return the access key of the user
    }),
  // Function to create a user
  createUser: method
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        username: z.string(),
        password: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = generateIdFromEntropySize(10)
      return await ctx.db.user.create({
        data: {
          id: userId,
          email: input.email,
          name: input.name,
          phone: input.phone,
          password: input.password,
          username: input.username,
          comments: { create: [] },
          deviceList: { create: [] }
        }
      })
    }),
  // Function to get a user
  IsSignUpUserExists: method
    .input(
      z.object({
        email: z.string(),
        username: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userEmail = await ctx.db.user.findFirst({
        where: { email: input.email }
      }) // Get the user whose email matches the input
      const usernameUser = await ctx.db.user.findFirst({
        where: { username: input?.username }
      }) // Get the user whose username matches the input
      return {
        email: !!userEmail,
        username: !!usernameUser && (userEmail ? userEmail.username === input?.username : true)
      }
    })
})

import {
  GetTablesDataSoap,
  backupDatabaseSoap,
  deleteUserSoap,
  insertUserSoap,
  updateUserSoap,
} from '@/server/soapFunctions'
import { Prisma, PrismaClient } from '@prisma/client'
import { UpdateSchema, commentSchema, userSchema } from '@/models/schemas'
import { calculatePercentageDiff, encodeEmail } from '@/utils/utils'
import { databaseEditorPort, sendSoapRequest, websiteEmail } from 'config'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { method, router } from '@/server/trpc'

import PriceDropEmail from '@/components/misc/PriceDropEmail'
import { exec } from 'child_process'
import { fetchCurrentPrice } from '@/server/price'
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
    data: await prisma.biometricFeature.findMany(),
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
export const authRouter = router({
  // Function to backup the database
  backupDatabase: method.mutation(async ({ ctx }) => {
    await backupDatabase({ prisma: ctx.prisma }) // Backup the database
    return true // Return true to indicate operation success
  }),
  // Function to restore the database
  restoreDatabase: method.mutation(async ({ ctx }) => {
    const response = await GetTablesDataSoap() // Send the soap request
    await restoreDatabase({ input: { data: response }, prisma: ctx.prisma }) // Restore the database
    return true
  }),
  // Function to send a soap request to restore the database
  restoreDatabaseSoap: method
    .input(z.object({ data: z.string(), FromAsp: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      const result = await restoreDatabase({ input, prisma: ctx.prisma }) // Restore the database
      return result
    }),
  // Function to open the database editor
  openDatabaseEditor: method.mutation(async () => {
    try {
      const response = await fetch(`http://localhost:${databaseEditorPort}/`) // Send request to database editor if it exists
      await response.text() // Convert response
      return false // Database editor exists so return false
    } catch {
      exec(
        `npx prisma studio --port ${databaseEditorPort} --browser none --schema=./prisma/schema.prisma`
      ) // Open database editor by running the command in the terminal
      return true // Database editor does not exist so return true
    }
  }),
  // Function to close the database editor
  closeDatabaseEditor: method.mutation(() => {
    try {
      exec(
        `for /f "tokens=5" %a in ('netstat -aon ^| find ":${databaseEditorPort}" ^| find "LISTENING"') do taskkill /f /pid %a`
      ) // Close database editor by running the command in the terminal
      return true // Database editor exists so return true
    } catch {
      return false // Database editor does not exist so return false
    }
  }),
  // Function to get the website configurations
  getConfigs: method.query(() => {
    const filePath = 'config.ts' // Path to the config file
    const fileContents = readFileSync(filePath, 'utf8') // Read the contents of the file
    return fileContents // Return the contents of the file
  }),
  // Function to save the website configurations
  saveConfigs: method.input(z.object({ configs: z.string() })).mutation(({ input }) => {
    const filePath = 'config.ts' // Path to the config file
    writeFileSync(filePath, input.configs) // Write the contents of the configs to the file
  }),
  // Function to insert a user
  insertUser: method
    .input(userSchema.merge(z.object({ FromAsp: z.boolean().optional() })))
    .mutation(async ({ ctx, input }) => {
      try {
        const { FromAsp, ...user } = input // Destructure the input
        await ctx.prisma.user.create({
          data: {
            ...user,
            comments: { create: [] },
            deviceList: { create: [] },
          },
        }) // Create the user
        // Send the soap request if sendSoapRequest config is true and request is not from asp
        if (sendSoapRequest && FromAsp !== true) {
          await insertUserSoap({ input: user }) // Send the soap request
        }
        return true // Return true to indicate operation success
      } catch {
        return false // Return false to indicate operation failure
      }
    }),
  // Function to update a user
  updateUser: method
    .input(userSchema.merge(z.object({ FromAsp: z.boolean().optional() })))
    .mutation(async ({ ctx, input }) => {
      try {
        const { FromAsp, ...user } = input // Destructure the input
        await ctx.prisma.user.update({
          where: { email: input.email },
          data: {
            ...user,
          },
        }) // Update the user
        // Send the soap request if sendSoapRequest config is true and request is not from asp
        if (sendSoapRequest && FromAsp !== true) {
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
    .input(z.object({ email: z.string(), FromAsp: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.user.delete({
          where: { email: input.email },
        }) // Delete the user
        // Send the soap request if sendSoapRequest config is true and request is not from asp
        if (sendSoapRequest && input.FromAsp !== true) {
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
      return await ctx.prisma.$queryRawUnsafe(selectQuery) // Send the query to the database
    }),
  // Function to get all users data
  getUsersData: method.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany() // Get all users from the database
  }),
  // Function to Send price drops email to a user if the price of saved devices is lower than the price before
  sendPriceDropsEmail: method
    .input(z.object({ email: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const email = input.email // Get the email from the input
      if (!email) return false // If no email is provided return false
      const userDevices = await ctx.prisma.deviceUser.findMany({
        where: { userEmail: input.email },
        include: {
          device: true,
          user: true,
        },
      }) // Get all devices of a user
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      userDevices.forEach(async (userDevice) => {
        let price = 0
        try {
          const currentPrice = await fetchCurrentPrice(userDevice.deviceModel) // Fetch the current price of the device
          price = currentPrice
        } catch {}
        // If device has a price and it is not the same price as before
        if (price && price != userDevice.device.price) {
          await ctx.prisma.device.update({
            where: { model: userDevice.deviceModel },
            data: { price: price },
          })
        }
        // If device has a price and it is lower than the price before
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
                percentage: calculatePercentageDiff(userDevice.device.price, price), // Calculate the percentage of the price drop
              }),
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
    .input(z.object({ sendTest: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      const devicesUsers = await ctx.prisma.deviceUser.findMany() // Get all devices of a user
      devicesUsers.map(async (deviceUser) => {
        const device = await ctx.prisma.device.findFirst({
          where: { model: deviceUser.deviceModel },
        }) // Get all devices of a user
        const user = await ctx.prisma.user.findFirst({
          where: { email: deviceUser.userEmail },
          select: { name: true, email: true },
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
            await ctx.prisma.device.update({
              where: { model: device.model },
              data: { price: price },
            }) // Update the price
          }
          //
          if (input.sendTest === true) {
            device.price = 600 // Set a fake price
            await resend.emails
              .send({
                from: websiteEmail,
                to: user.email,
                subject: `${device.name} Price Drop`,
                react: PriceDropEmail({
                  name: user.name,
                  newPrice: 400,
                  device: device,
                  percentage: calculatePercentageDiff(device.price, 400), // Calculate the percentage of a fake price drop
                }),
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
                  from: websiteEmail,
                  to: user.email,
                  subject: `${device.name} Price Drop`,
                  react: PriceDropEmail({
                    name: user.name,
                    newPrice: price,
                    device: device,
                    percentage: calculatePercentageDiff(device.price, price), // Calculate the percentage of the price drop
                  }),
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
      const comment = await ctx.prisma.user.findFirst({
        where: { username: input.username },
      }) // Get the comment whose username is the input
      return comment?.email // Return the email of the comment
    }),
  // Function to check if a comment image exists
  isCommentImageExists: method
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const comment = await ctx.prisma.user.findFirst({
        where: { username: input.username },
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
      }) // Update the comment whose id is the input
      return comments // Return the updated comments
    }),
  // Function to delete a comment
  deleteComment: method
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.delete({
        where: { id: input.commentId },
      }) // Delete the comment whose id is the input
      return comments // Return the deleted comments
    }),
  // Function to create a comment
  addComment: method.input(commentSchema).mutation(async ({ ctx, input }) => {
    const { createdAt, message, model, rating, updatedAt, username } = input // Destructure the input
    const comment = await ctx.prisma.comment.create({
      data: {
        message,
        rating,
        updatedAt,
        createdAt,
        model,
        username,
      },
    }) // Create a new comment
    return comment // Return the comment
  }),
  // Function to get all comments
  getAllComments: method.input(z.object({ model: z.string() })).query(async ({ ctx, input }) => {
    const comments = await ctx.prisma.comment.findMany({
      where: { model: input.model },
    }) // Get all comments for the model
    return comments // Return the comments
  }),
  // Function to get a user
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
  // Function to get a user
  getUser: method
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.email === undefined) return null
      const details = await ctx.prisma.user.findFirst({
        where: { email: input.email },
        include: { comments: true },
      })
      return details
    }),
  // Function to get a user
  getAccessKey: method
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.email === undefined) return 0 // If no email is provided return zero
      const user = await ctx.prisma.user.findFirst({
        where: { email: input.email },
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
  // Function to get a user
  IsSignUpUserExists: method
    .input(
      z.object({
        email: z.string(),
        username: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userEmail = await ctx.prisma.user.findFirst({
        where: { email: input.email },
      }) // Get the user whose email matches the input
      const usernameUser = await ctx.prisma.user.findFirst({
        where: { username: input?.username },
      }) // Get the user whose username matches the input
      return {
        email: !!userEmail,
        username: !!usernameUser && (userEmail ? userEmail.username === input?.username : true),
      }
    }),
  IsSignInUserExists: method
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { email: input.email, password: input.password },
      }) // Get the user whose email matches the input
      return user ? true : false
    }),
})
